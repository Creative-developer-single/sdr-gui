interface LogicGraphDynamicProps{
    [key: string]: any;
}

// 后端节点属性
export interface LogicGraphNodeBackgroundProps{
    ID:number;
    // 未来加入Name属性
    Pos:{
        X:number;
        Y:number;
    };
    BlockLength:number;
    InputCount:number;
    OutputCount:number;
    ComponentType:string;
    ComponentID:string;
    ComponentSettings?: LogicGraphDynamicProps;
}

// 后端边属性
export interface LogicGraphEdgeBackgroundProps{
    EdgeID: number;
    StartNodeID:number;
    EndNodeID:number;
    StartEdgeIndex:number;
    EndEdgeIndex:number;
}

/*
    * LogicGraphBackgroundPropsInterface
    * 
    * 后端的数据结构接口定义
    * 仅用于后端数据传输
*/
export interface LogicGraphBackgroundPropsInterface{
    Nodes: LogicGraphNodeBackgroundProps[];
    Edges: LogicGraphEdgeBackgroundProps[];
}