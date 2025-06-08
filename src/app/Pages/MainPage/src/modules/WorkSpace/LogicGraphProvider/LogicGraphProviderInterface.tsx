import { ModulesDataProps } from "../../ModulesEditor/ModulesEditorProviderInterface";
import { SimulationProps } from "../../Simulation/SimulationInterface";
import { LogicGraphBackgroundPropsInterface } from "./LogicGraphBackgroundInterface";

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
    updateGlobalProps: (key:string,value:any) => void;
    updateFixedProps: (key:string,value:any) => void;
    updateNodes:(nodes: LogicGraphNodesProp[]) => void;
    getLogicGraphData: () => LogicGraphDataInterface;

    // 与其他模块同步
    applySimulationPrarms(params: SimulationProps): void;

    // 输入输出类
    importLogicGraphData(data:LogicGraphDataInterface): void;
    exportLogicGraphData: () => LogicGraphDataInterface;
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


/*
 * 工具函数
 * 用于实现前后端数据格式转换
*/
export function convertLogicGraphDataToBackgroundData(data: LogicGraphDataInterface){
    // 转换节点数据
    const nodes = data.Nodes.map(node => ({
        ID: node.ID,
        Pos: node.GuiProps.Pos,
        BlockLength: node.NodesData.Properties.Fixed.BlockLength,
        InputCount: node.NodesData.Properties.Fixed.InputCount,
        OutputCount: node.NodesData.Properties.Fixed.OutputCount,
        ComponentType: node.NodesData.Properties.Fixed.ComponentType,
        ComponentID: node.NodesData.Properties.Fixed.ComponentID,
        ComponentSettings: {...node.NodesData.Properties.Global, ...node.NodesData.Properties.Local }
    }));

    // 转换边数据
    const edges = data.Edges.map(edge => ({
        EdgeID: edge.EdgeID,
        StartNodeID: edge.StartNodeID,
        EndNodeID: edge.EndNodeID,
        StartEdgeIndex: edge.StartEdgeIndex,
        EndEdgeIndex: edge.EndEdgeIndex
    }));

    return {
        Nodes: nodes,
        Edges: edges
    };
}

/*
 * 将后端数据转换为前端逻辑流图数据格式
 * 主要用于将后端传输的数据转换为前端可用的格式
*/

export function convertBackgroundDataToLogicGraphData(data: LogicGraphBackgroundPropsInterface): LogicGraphDataInterface {
    // 转换节点数据
    const nodes: LogicGraphNodesProp[] = data.Nodes.map(node => ({
        ID: node.ID,
        GuiProps: {
            IconSrc: "", // 未来可以根据ComponentID映射到图标
            Title: node.ComponentID, // 未来可以根据ComponentID映射到标题
            Type: node.ComponentType,
            Pos: node.Pos,
            Ports: {
                InputPort: Array.from({ length: node.InputCount }, (_, i) => ({ PortIndex: i })),
                OutputPort: Array.from({ length: node.OutputCount }, (_, i) => ({ PortIndex: i }))
            }
        },
        NodesData: {
            Id: node.ID,
            Type: node.ComponentType,
            Name: node.ComponentID,
            Description: "", // 未来可以根据ComponentID映射到描述
            Properties: {
                Fixed: {
                    ProcessMode: "Default", // 默认处理模式
                    BlockLength: node.BlockLength,
                    InputCount: node.InputCount,
                    OutputCount: node.OutputCount,
                    ComponentType: node.ComponentType,
                    ComponentID: node.ComponentID
                },
                Global: node.ComponentSettings?.SampleRate || {},
                Local: Object.fromEntries(
                    Object.entries(node.ComponentSettings || {}).filter(([key]) => key !== 'SampleRate')
                ) as LogicGraphDynamicProps // 过滤掉SampleRate，保留其他动态属性
            }
        }
    }));

    // 转换边数据
    const edges = data.Edges.map(edge => ({
        EdgeID: edge.EdgeID,
        StartNodeID: edge.StartNodeID,
        EndNodeID: edge.EndNodeID,
        StartEdgeIndex: edge.StartEdgeIndex,
        EndEdgeIndex: edge.EndEdgeIndex
    }));

    return {
        Nodes: nodes,
        Edges: edges,
        VitrualEdges:{
            StartNode:{
                isNodeSet:false,
                NodeID:-1,
                EdgeIndex:-1
            },
            EndNode:{
                isNodeSet:false,
                NodeID:-1,
                EdgeIndex:-1
            },
            Mode:"StartPoint"
        }
    };
}