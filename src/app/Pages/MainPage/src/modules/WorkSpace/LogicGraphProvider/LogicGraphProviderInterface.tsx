
interface LogicGraphDynamicProps{
    [key: string]: any;
}

export interface VitrualSingleEdgeProp{
    NodeID: number;
    EdgeIndex: number;
    Mode: string; // "StartPoint" | "TerminalPoint"
}

export interface VitrualEdgeProp{
    StartNode:{
        isNodeSet:boolean;
        NodeID:number;
        EdgeIndex:number;
    }
    EndNode:{
        isNodeSet:boolean;
        NodeID:number;
        EdgeIndex:number;
    };
    Mode: string; // "StartPoint" | "TerminalPoint"
}

export interface LogicGraphNodePortProps{
    PortIndex:number;
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
    Ports:{
        InputPort:LogicGraphNodePortProps[];
        OutputPort:LogicGraphNodePortProps[];
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
    openLogicGraph: () => void;
    addNode: (node: LogicGraphNodesProp) => void;
    removeNode: (nodeID: number) => void;
    updateNode: (nodeID: number, updates: Partial<LogicGraphNodesProp>) => void;
    addVirtualEdge: (mode:string,PortProp:VitrualSingleEdgeProp) => void;
    clearVirtualEdge: () => void;
    addEdge: (edge: LogicGraphEdgesProp) => void;
    removeEdge: (edgeID: number) => void;
    updateEdge: (edgeID: number, updates: Partial<LogicGraphEdgesProp>) => void;
}

interface EditorProps{
    isOpen: boolean;
}

export interface LogicGraphProviderInterface {
    Editor:EditorProps;
    VitrualEdges:VitrualEdgeProp;
    Nodes: LogicGraphNodesProp[];
    Edges: LogicGraphEdgesProp[];
    Actions: LogicGraphActions;
}