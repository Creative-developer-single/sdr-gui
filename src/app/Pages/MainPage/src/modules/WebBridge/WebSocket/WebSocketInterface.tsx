import { MutableRefObject, RefObject } from "react";

export interface WebSocketCtrlReply{
    RPCFrame:{
        FrameID: number; // RPC帧ID
        ReplyType: string; // 回复类型，例如 "Success" 或 "Error"
        Reply: any; // 回复内容，可以是任意类型
    }
}

export interface WebSocketActions {
    //useRef创建的对象，其类型怎么表示？
    SendCommandWithReply:(command: any) => Promise<any>;
    SendCommandWithoutReply:(command: any) => void;
}

export interface WebSocketInterface{
    Status: string;
    Actions:WebSocketActions;
}