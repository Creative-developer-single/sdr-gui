import { DataSyncGetNodesDataProps } from "../../DataSync/Provider/DataSyncInterface";
import { LogicGraphDataInterface } from "../../WorkSpace/LogicGraphProvider/LogicGraphProviderInterface";
import { WebSocketInterface } from "../WebSocket/WebSocketInterface";

interface DynamicProps{
    [key: string]: any;
}

interface RPCFrameItemInterface{
    TargetModule: string;
    Command:string;
    Args:DynamicProps;
    return:string; // 返回值类型
}

interface RPCActionsInterface{
    RPCModifyLogicGraph( logicGraph: LogicGraphDataInterface ): Promise<any>;
    RPCModifyLogicGrapWithoutReply( logicGraph: LogicGraphDataInterface ): void;
    RPCModifySimulationStatus( status: string,webSocketContext:WebSocketInterface ): Promise<any>;
    RPCSetSimulationParameter( props: DynamicProps, webSocketContext: WebSocketInterface ): Promise<any>;
    RPCGetNodesData( Nodes: DataSyncGetNodesDataProps ): Promise<any>;
}

export interface RPCFrameInterface{
    RPCFrame:RPCFrameItemInterface
}



export interface WebControllerInterface{
    rpcReturnValue: string | null;
    Actions:RPCActionsInterface;
}