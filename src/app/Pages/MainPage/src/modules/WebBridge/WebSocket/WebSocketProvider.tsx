import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketInterface } from './WebSocketInterface';

const WebSocketContext = createContext<WebSocketInterface | null>(null);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
}

export function WebSocketProvider({ url, children }) {
  const wsRef = useRef<WebSocket | null>(null);
  const idRef = useRef(0);
  const pendingCommands = useRef(new Map());
  const reconnectTimer = useRef<number | null>(null); // 自动重连定时器
  const isManuallyClosed = useRef(false); // 是否是手动关闭（避免 unmount 后继续重连）

  const [status, setStatus] = useState('connecting');

  const connect = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      // 已经有连接，不重复连接
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

    const scheduleReconnect = () => {
      if (isManuallyClosed.current) {
        console.log("WebSocket manually closed, skip auto-reconnect");
        return;
      }
      if (!reconnectTimer.current) {
        console.log("WebSocket disconnected, attempting to reconnect in 3 seconds...");
        reconnectTimer.current = window.setTimeout(() => {
          connect();
        }, 3000); // 3秒后尝试重连
      }
    };

    ws.onclose = () => {
      console.warn("WebSocket closed");
      setStatus('offline');
      scheduleReconnect();
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
      setStatus('offline');
      ws.close(); // 触发 onclose，避免僵尸连接
    };

    function isEqual(a: Uint8Array, b: Uint8Array) {
      return a.length === b.length && a.every((value, index) => value === b[index]);
    }

    ws.onmessage = (event) => {
      try {
        const message = event.data;
        const messageBytes = new Uint8Array(message);

        if (messageBytes.length < 4) {
          console.warn("Received message too short:", message);
          return;
        } else {
          const messagePrefix = messageBytes.slice(0, 4);

          if (isEqual(messagePrefix, new Uint8Array([0x43, 0x54, 0x52, 0x4C]))) {
            const jsonString = new TextDecoder().decode(messageBytes.slice(4));
            const parsedMessage = JSON.parse(jsonString);

            const id = parsedMessage.id;
            if (id && pendingCommands.current.has(id)) {
              pendingCommands.current.get(id).resolve({
                ID: id,
                Data: parsedMessage.data,
                Type: "CTRL"
              });
              pendingCommands.current.delete(id);
            }
            return;
          } else if (isEqual(messagePrefix, new Uint8Array([0x44, 0x41, 0x54, 0x41]))) {
            const idBytes = messageBytes.slice(4, 8);
            const id = new DataView(idBytes.buffer).getUint32(0, false);

            if (id && pendingCommands.current.has(id)) {
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

  const SendCommandWithReply = useCallback((command) => {
    function getNextId() {
      idRef.current = (Math.random() * 4294967290) % 0xFFFFFFFF;
      return Math.floor(idRef.current);
    }

    const id = getNextId();
    const message = { command, id };

    return new Promise((resolve, reject) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        return reject(new Error("WebSocket not connected"));
      }

      pendingCommands.current.set(id, { resolve, reject });
      wsRef.current.send("CTRL" + JSON.stringify(message));

      setTimeout(() => {
        if (pendingCommands.current.has(id)) {
          pendingCommands.current.delete(id);
          reject(new Error("WebSocket response timeout"));
        }
      }, 5000);
    });
  }, []);

  const SendCommandWithoutReply = useCallback((command) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }
    const message = { command, id: -1 }; // -1表示不需要回复

    // 包装成二进制帧
    const prefix = new TextEncoder().encode("CTRL");
    const payload = new TextEncoder().encode(JSON.stringify(message));

    const fullMessage = new Uint8Array(prefix.length + payload.length);
    fullMessage.set(prefix, 0);
    fullMessage.set(payload, prefix.length);

    wsRef.current.send(fullMessage.buffer);
  }, []);

  const contextValue: WebSocketInterface = {
    Status: status,
    Actions: {
      SendCommandWithReply: SendCommandWithReply,
      SendCommandWithoutReply: SendCommandWithoutReply
    }
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
}
