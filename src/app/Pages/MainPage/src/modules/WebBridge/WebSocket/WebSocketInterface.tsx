import { MutableRefObject, RefObject } from "react";

export interface WebSocketActions {
    //useRef创建的对象，其类型怎么表示？
    SendCommandWithReply:(command: any) => Promise<any>;
    SendCommandWithoutReply:(command: any) => void;
}

export interface WebSocketInterface{
    Status: string;
    Actions:WebSocketActions;
}