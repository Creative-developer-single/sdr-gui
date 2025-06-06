import { SimulationProps } from "../../../Simulation/SimulationInterface";
import { WebSocketInterface } from "../../WebSocket/WebSocketInterface";
import { RPCFrameInterface } from "../WebControllerInterface";

/*
 * 处理RPC控制仿真状态
 * status: running | paused | stopped
*/
export async function RPCModifySimultionStatus( status,webSocketContext:WebSocketInterface ){
    const newRPCFrame:RPCFrameInterface = {
        RPCFrame: {
            TargetModule: "Simulation",
            Command: "RPCModifySimulationStatus",
            Args: { Status: status },
            return: "Null"
        }
    }

    try{
        const reply = await webSocketContext.Actions.SendCommandWithReply(newRPCFrame);
        console.log("Send a RPC");
        return reply.Data;
    } catch (error) {
        console.error("RPCModifySimultionStatus Error:", error);
        throw error; // 重新抛出错误以便上层处理
    }
    
}

/*
 * 处理RPC仿真参数更新
 * props: SimulationProps
*/
export async function RPCSetSimulationParameter( props:SimulationProps,webSocketContext:WebSocketInterface ){
    const newFrame:RPCFrameInterface = {
        RPCFrame: {
            TargetModule: "Simulation",
            Command: "RPCSetSimulationParameter",
            Args: props,
            return: "Null"
        }
    }

    try{
        const reply = await webSocketContext.Actions.SendCommandWithReply(newFrame);
        return reply.Data;
    } catch (error) {
        console.error("RPCSetSimulationParameter Error:", error);
        throw error; // 重新抛出错误以便上层处理
    }
    

}