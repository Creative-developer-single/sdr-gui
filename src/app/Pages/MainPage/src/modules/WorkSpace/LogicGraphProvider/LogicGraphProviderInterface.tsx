import { ModulesDataProps } from "../../ModulesEditor/ModulesEditorProviderInterface";

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


/*
 * 逻辑流图节点数据结构定义域
*/
// 定义逻辑流图节点端口
export interface LogicGraphNodePortProps{
    PortIndex:number;
}

// 定义逻辑流图节点属性
export interface LogicGraphNodesProp{
    ID: number;
    GuiProps:{
        IconSrc:string;
        Title:string;
        Type:string;
        Pos:{
            X:number;
            Y:number;
        };
        Ports:{
            InputPort:LogicGraphNodePortProps[];
            OutputPort:LogicGraphNodePortProps[];
        };
    };
    NodesData:ModulesDataProps;
}   


/*
 * 逻辑流图边数据结构定义域
*/
// 定义逻辑流图边属性
export interface LogicGraphEdgesProp{
    EdgeID: number;
    StartNodeID:number;
    EndNodeID:number;
    StartEdgeIndex:number;
    EndEdgeIndex:number;
}


/*
 * 逻辑流图操作接口定义域
*/
// 定义逻辑流图操作接口
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
    getLogicGraphData: () => LogicGraphDataInterface;
}

// 编辑器控制属性接口
interface EditorProps{
    isOpen: boolean;
}

/*
 * 逻辑流图数据接口定义域
 * 只用于前端内部数据通信
*/
export interface LogicGraphDataInterface {
    Nodes: LogicGraphNodesProp[];
    Edges: LogicGraphEdgesProp[];
    VitrualEdges: VitrualEdgeProp;
}


/*
 * 逻辑流图提供者接口定义域
 * 用于前端组件之间的数据传递
*/
export interface LogicGraphProviderInterface {
    Editor:EditorProps;
    VitrualEdges:VitrualEdgeProp;
    Nodes: LogicGraphNodesProp[];
    Edges: LogicGraphEdgesProp[];
    Actions: LogicGraphActions;
}