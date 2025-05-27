
interface LogicGraphDynamicProps{
    [key: string]: any;
}

export interface LogicGraphBackgroundProps{
    
}

export interface LogicGraphNodesProp{
    ID: number;
    Pos:{
        X:number;
        Y:number;
    };
    guiProps:{
        IconSrc:String;
        Title:String;
        Type:String;
    };
    BlockLength:number;
    InputCount:number;
    OutputCount:number;
    ComponentType:string;
    ComponentSetting?: LogicGraphDynamicProps;
}   

export interface LogicGraphEdgesProp{
    EdgeID: number;
    StartNodeID:number;
    EndNodeID:number;
    StartEdgeIndex:number;
    EndEdgeIndex:number;
}

interface LogicGraphActions{
    addNode: (node: LogicGraphNodesProp) => void;
    removeNode: (nodeID: number) => void;
    updateNode: (nodeID: number, updates: Partial<LogicGraphNodesProp>) => void;
    addEdge: (edge: LogicGraphEdgesProp) => void;
    removeEdge: (edgeID: number) => void;
    updateEdge: (edgeID: number, updates: Partial<LogicGraphEdgesProp>) => void;
}

export interface LogicGraphProviderInterface {
    Nodes: LogicGraphNodesProp[];
    Edges: LogicGraphEdgesProp[];
    Actions: LogicGraphActions;
}