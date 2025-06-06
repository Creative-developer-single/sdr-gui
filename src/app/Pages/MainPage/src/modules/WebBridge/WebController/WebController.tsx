import { useContext, useState } from "react";
import { convertLogicGraphDataToBackgroundData, LogicGraphDataInterface } from "../../WorkSpace/LogicGraphProvider/LogicGraphProviderInterface";
import { RPCFrameInterface, WebControllerInterface } from "./WebControllerInterface";
import { useWebSocket } from "../WebSocket/WebSocketProvider";
import { createContext } from "react";
import { RPCModifySimultionStatus, RPCSetSimulationParameter } from "./SimulationController/WebSimulationController";
import { DataSyncGetNodesDataProps } from "../../DataSync/Provider/DataSyncInterface";
import { WebSocketInterface } from "../WebSocket/WebSocketInterface";

const WebControllerContext = createContext<WebControllerInterface | null>(null);

export const useWebController = () => {
    const context = useContext(WebControllerContext);
    if (!context) {
        throw new Error("useWebController must be used within a WebControllerProvider");
    }
    return context;
}

export function WebControllerProvider( {children} ){
    // 定义RPC控制帧数组
    const [rpcFrame,setRPCFrame] = useState<RPCFrameInterface | null>(null);

    // 定义RPC调用返回值
    const [rpcReturnValue, setRPCReturnValue] = useState<any>(null);

    // 获取WebSocketContext
    const webSocketContext = useWebSocket();

    // 定义RPC相关函数
    /*
        功能：发送流图构建RPC帧
    */

    function RPCModifyLogicGraphWithoutReply( logicGraph:LogicGraphDataInterface){
        const newRPCFrame:RPCFrameInterface = {
            RPCFrame:{
                TargetModule: "LogicGraph",
                Command: "RPCLoadLogicGraph",
                Args:convertLogicGraphDataToBackgroundData(logicGraph),
                return: "Null"
            }
        }

        console.log("SendString:", JSON.stringify(newRPCFrame));
        
        webSocketContext.Actions.SendCommandWithoutReply(newRPCFrame);
        setRPCFrame(newRPCFrame);
    }

    function RPCModifyLogicGraph( logicGraph:LogicGraphDataInterface ){
        const newRPCFrame:RPCFrameInterface = {
            RPCFrame:{
                TargetModule: "LogicGraph",
                Command: "RPCLoadLogicGraph",
                Args:logicGraph,
                return: "Null"
            }
        }
        
        webSocketContext.Actions.SendCommandWithReply(JSON.stringify(logicGraph)).then(
            (Response => {
                console.log("RPCModifyLogicGraph Response:", Response);
                setRPCReturnValue(Response);
            })
        )
    }

    async function RPCGetNodesData( Nodes:DataSyncGetNodesDataProps){
        const newRPCFrame:RPCFrameInterface = {
            RPCFrame:{
                TargetModule: "LogicGraph",
                Command: "RPCGetNodeAns",
                Args: Nodes,
                return: "BinaryObject"
            }
        }

        console.log("SendString:", JSON.stringify(newRPCFrame));

        const response = await webSocketContext.Actions.SendCommandWithReply(newRPCFrame);
        return response.Data;
    }

    const contextValue:WebControllerInterface = {
        rpcReturnValue: rpcReturnValue,
        Actions: {
            RPCModifyLogicGraph: RPCModifyLogicGraph,
            RPCModifyLogicGrapWithoutReply: RPCModifyLogicGraphWithoutReply,
            RPCModifySimulationStatus:RPCModifySimultionStatus,
            RPCSetSimulationParameter:RPCSetSimulationParameter,
            RPCGetNodesData: RPCGetNodesData
        }
    }

    return (
        <WebControllerContext.Provider value={contextValue}>
            {children}
        </WebControllerContext.Provider>
    )
}