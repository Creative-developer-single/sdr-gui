import { LogicGraphDataInterface } from "../WorkSpace/LogicGraphProvider/LogicGraphProviderInterface";

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
    RPCModifyLogicGraph( logicGraph: LogicGraphDataInterface ): void;
    RPCModifyLogicGrapWithoutReply( logicGraph: LogicGraphDataInterface ): void;
}

export interface RPCFrameInterface{
    RPCFrame:RPCFrameItemInterface
}



export interface WebControllerInterface{
    rpcReturnValue: string | null;
    Actions:RPCActionsInterface;
}