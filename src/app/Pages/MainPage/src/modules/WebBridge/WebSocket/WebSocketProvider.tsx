import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketCtrlReply, WebSocketInterface } from './WebSocketInterface';

const WebSocketContext = createContext<WebSocketInterface | null>(null);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
};

export function WebSocketProvider({ url, children }) {
    const wsRef = useRef<WebSocket | null>(null);
    const idRef = useRef(0);
    const pendingCommands = useRef(new Map());
    const reconnectTimer = useRef<number | null>(null);
    const isManuallyClosed = useRef(false);

    const [status, setStatus] = useState('connecting');

    const connect = useCallback(() => {
        if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
            return;
        }

        console.log("WebSocket connecting to:", url);
        const ws = new WebSocket(url);
        ws.binaryType = 'arraybuffer';
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
            setStatus('online');
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
                reconnectTimer.current = null;
            }
        };

        ws.onclose = () => {
            console.warn("WebSocket closed");
            setStatus('offline');
            // 不 scheduleReconnect，等待 SendCommand 主动触发重连
        };

        ws.onerror = (err) => {
            console.error("WebSocket error", err);
            setStatus('offline');
            ws.close();
        };

        function isEqual(a: Uint8Array, b: Uint8Array) {
            return a.length === b.length && a.every((value, index) => value === b[index]);
        }

        function processMessage(messageBytes) {
            //console.log("Received WebSocket message:", messageBytes);

            if (messageBytes.length < 4) {
                console.warn("Received message too short:", messageBytes);
                return;
            }

            const messagePrefix = messageBytes.slice(0, 4);

            if (isEqual(messagePrefix, new Uint8Array([0x43, 0x54, 0x52, 0x4C]))) { // 'CTRL'
                const jsonString = new TextDecoder().decode(messageBytes.slice(4));
                const parsedMessage = JSON.parse(jsonString);

                const id = parsedMessage.RPCFrame?.FrameID;

                if (!id) {
                    console.warn("Received CTRL message without FrameID:", parsedMessage);
                    return;
                }

                //console.log("Received CTRL message with ID:", id, parsedMessage);

                if (pendingCommands.current.has(id)) {
                    pendingCommands.current.get(id).resolve({
                        ID: id,
                        Data: parsedMessage.RPCFrame.Reply,
                        Type: "CTRL"
                    });
                    pendingCommands.current.delete(id);
                }
                return;

            } else if (isEqual(messagePrefix, new Uint8Array([0x44, 0x41, 0x54, 0x41]))) { // 'DATA'
                const idBytes = messageBytes.slice(4, 8);
                const id = new DataView(idBytes.buffer).getUint32(0, false);

                if (pendingCommands.current.has(id)) {
                    const resolve = pendingCommands.current.get(id).resolve;
                    const data = messageBytes.slice(8);
                    resolve({
                        ID: id,
                        Data: data,
                        Type: "DATA"
                    });
                    pendingCommands.current.delete(id);
                } else {
                    console.warn("Unmatched DATA message with ID:", id);
                }
            }
        }

        ws.onmessage = (event) => {
            try {
                let messageBytes;

                if (typeof event.data === "string") {
                    messageBytes = new TextEncoder().encode(event.data);
                } else if (event.data instanceof ArrayBuffer) {
                    messageBytes = new Uint8Array(event.data);
                } else {
                    console.warn("Unknown WebSocket message type:", typeof event.data, event.data);
                    return;
                }

                processMessage(messageBytes);

            } catch (e) {
                console.error("Failed to parse WebSocket message", e);
            }
        };
    }, [url]);

    useEffect(() => {
        isManuallyClosed.current = false;
        connect();

        return () => {
            isManuallyClosed.current = true;
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
            }
            wsRef.current?.close();
            pendingCommands.current.clear();
        };
    }, [connect]);

    const ensureConnected = useCallback(async () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        console.log("WebSocket not connected, attempting reconnect...");
        connect();

        for (let i = 0; i < 50; i++) { // 最多等待 5 秒
            await new Promise(resolve => setTimeout(resolve, 100));
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                console.log("WebSocket reconnected successfully.");
                return;
            }
        }

        throw new Error("WebSocket reconnect failed, cannot send command.");
    }, [connect]);

    const SendCommandWithReply = useCallback(async (command) => {
        await ensureConnected();

        function getNextId() {
            idRef.current = (Math.random() * 4294967290) % 0xFFFFFFF;
            return Math.floor(idRef.current);
        }

        const id = getNextId();
        const message = { command, id };

        return new Promise((resolve, reject) => {
            pendingCommands.current.set(id, { resolve, reject });

            const prefix = new TextEncoder().encode("CTRL");
            const payload = new TextEncoder().encode(JSON.stringify(message));

            const fullMessage = new Uint8Array(prefix.length + payload.length);
            fullMessage.set(prefix, 0);
            fullMessage.set(payload, prefix.length);

            wsRef.current?.send(fullMessage.buffer);

            setTimeout(() => {
                if (pendingCommands.current.has(id)) {
                    pendingCommands.current.delete(id);
                    reject(new Error("WebSocket response timeout"));
                }
            }, 5000);
        });
    }, [ensureConnected]);

    const SendCommandWithoutReply = useCallback(async (command) => {
        await ensureConnected();

        const message = { command, id: -1 };

        const prefix = new TextEncoder().encode("CTRL");
        const payload = new TextEncoder().encode(JSON.stringify(message));

        const fullMessage = new Uint8Array(prefix.length + payload.length);
        fullMessage.set(prefix, 0);
        fullMessage.set(payload, prefix.length);

        wsRef.current?.send(fullMessage.buffer);
    }, [ensureConnected]);

    const contextValue: WebSocketInterface = {
        Status: status,
        Actions: {
            SendCommandWithReply,
            SendCommandWithoutReply
        }
    };

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
}
