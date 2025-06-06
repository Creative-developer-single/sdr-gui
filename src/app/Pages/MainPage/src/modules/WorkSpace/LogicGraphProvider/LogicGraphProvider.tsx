import { createContext, useCallback, useContext, useState } from "react";
import { LogicGraphNodesProp, LogicGraphProviderInterface, VitrualSingleEdgeProp } from "./LogicGraphProviderInterface";

// 创建Context对象
const logicGraphContext = createContext<LogicGraphProviderInterface | null>(null);

// 定义一个自定义Hook，用于在子组件中使用LogicGraphProvider
export const useLogicGraph = () => {
    const context = useContext(logicGraphContext);
    if (!context) {
        throw new Error("useLogicGraph must be used within a LogicGraphProvider");
    }
    return context;
}

export function LogicGraphProvider( {children} ){
    // 定义节点和边状态
    const [EditorProps,setEditorProps] = useState<LogicGraphProviderInterface["Editor"]>({
        isOpen:false
    });
    const [Nodes,setNodes] = useState<LogicGraphProviderInterface["Nodes"]>([]);
    const [VitrualEdges,setVitrualEdges] = useState<LogicGraphProviderInterface["VitrualEdges"]>({
        StartNode: {
            isNodeSet:false,
            NodeID: 0,
            EdgeIndex: 0
        },
        EndNode: {
            isNodeSet:false,
            NodeID: 0,
            EdgeIndex: 0
        },
        Mode:"StartPoint" // 默认模式为起始点
    });
    const [Edges,setEdges] = useState<LogicGraphProviderInterface["Edges"]>([]);

    // 定义操作函数

    // GUI操作
    const openLogicGraph = useCallback(()=>{
        setEditorProps(prevProps => ({ ...prevProps, isOpen: true }));
    },[]);

    

    // 添加节点
    function addNode(node:LogicGraphNodesProp){
        if (Nodes.length == 0){
            node.ID = 1;
        }
        else {
            // 查找当前最大的ID号
            const maxID = Math.max(...Nodes.map(n => n.ID));
            node.ID = maxID + 1;
        }


        // 分配随机位置
        node.GuiProps.Pos = {
            X: Math.random() * 5000, // 假设画布宽度为800
            Y: Math.random() * 5000  // 假设画布高度为600
        };

        
        setNodes(prevNodes => [...prevNodes,node]);
    }

    // 删除节点
    function removeNode(nodeID: number){
        // 为了防止泄露，先删除节点的所有相关边
        Edges.forEach(edge => {
            if (edge.StartNodeID === nodeID || edge.EndNodeID === nodeID) {
                removeEdge(edge.EdgeID);
            }
        });

        setNodes(prevNodes => prevNodes.filter(node => node.ID !== nodeID));
    }

    // 更新节点
    function updateNode(nodeID: number, updates: Partial<LogicGraphNodesProp>){
        const newNodes = Nodes.map(node =>
            node.ID === nodeID ? { ...node, ...updates } : node);
        
        setNodes(prevNodes => prevNodes.map(node =>
            node.ID === nodeID ? { ...node, ...updates } : node
        ));
    }

    // 定义边的操作函数
    // 添加虚拟边
    function addVirtualEdge(mode: string, EdgeProp:VitrualSingleEdgeProp) {
        switch(mode){
            case "StartPoint":
                setVitrualEdges(prevEdges => ({
                    ...prevEdges,
                    StartNode: {
                        isNodeSet: true,
                        NodeID: EdgeProp.NodeID, // 假设PortIndex是节点ID
                        EdgeIndex: EdgeProp.EdgeIndex // 假设EdgeIndex为0
                    },
                    Mode: "StartPoint"
                }));
                break;
            case "TerminalPoint":
                setVitrualEdges(prevEdges => ({
                    ...prevEdges,
                    EndNode: {
                        isNodeSet: true,
                        NodeID: EdgeProp.NodeID, // 假设PortIndex是节点ID
                        EdgeIndex: EdgeProp.EdgeIndex // 假设EdgeIndex为0
                    },
                    Mode: "TerminalPoint"
                }));

                // 如果两个节点都设置了，则添加边
                if (VitrualEdges.StartNode.isNodeSet && VitrualEdges.EndNode.isNodeSet) {
                    const newEdge: LogicGraphProviderInterface["Edges"][number] = {
                        EdgeID:0,
                        StartNodeID: VitrualEdges.StartNode.NodeID,
                        EndNodeID: VitrualEdges.EndNode.NodeID,
                        StartEdgeIndex: VitrualEdges.StartNode.EdgeIndex,
                        EndEdgeIndex: VitrualEdges.EndNode.EdgeIndex
                    }

                    addEdge(newEdge);
                }
                break;
        }
    }

    function clearVirtualEdge() {
        setVitrualEdges({
            StartNode: {
                isNodeSet: false,
                NodeID: 0,
                EdgeIndex: 0
            },
            EndNode: {
                isNodeSet: false,
                NodeID: 0,
                EdgeIndex: 0
            },
            Mode: "StartPoint" // 重置模式为起始点
        });
    }

    // 添加边
    function addEdge(edge: LogicGraphProviderInterface["Edges"][number]){
        // 确保边的ID唯一
        if (Edges.length === 0) {
            edge.EdgeID = 1;
        } else {
            // 查找当前最大的EdgeID号
            const maxEdgeID = Math.max(...Edges.map(e => e.EdgeID));
            edge.EdgeID = maxEdgeID + 1;
        }
        // 添加边到状态
        setEdges(prevEdges => [...prevEdges, edge]);
    }

    // 删除边
    function removeEdge(edgeID: number){
        setEdges(prevEdges => prevEdges.filter(edge => edge.EdgeID !== edgeID));
    }

    // 更新边
    function updateEdge(edgeID: number, updates: Partial<LogicGraphProviderInterface["Edges"][number]>){
        setEdges(prevEdges => 
            prevEdges.map(edge => 
                edge.EdgeID === edgeID ? { ...edge, ...updates } : edge
            )
        );
    }

    // 更新全局参数
    function updateGlobalProps(key:string,value:any){
        const newNodes = Nodes.map(node => {
            return {
                ...node,
                NodesData: {
                    ...node.NodesData,
                    Properties: {
                        ...node.NodesData.Properties,
                        Global: {
                            ...node.NodesData.Properties.Global,
                            SampleRate: value
                        }
                    }
                }
            };
        });
        console.log("更新全局参数", key, value);
        console.log("更新后的节点列表", newNodes);
        setNodes(newNodes);
    }

    // 更新固定参数
    function updateFixedProps(key:string,value:any){
        const newNodes = Nodes.map(node => {
            return {
                ...node,
                NodesData: {
                    ...node.NodesData,
                    Properties: {
                        ...node.NodesData.Properties,
                        Fixed: {
                            ...node.NodesData.Properties.Fixed,
                            [key]: value
                        }
                    }
                }
            };
        });
        setNodes(newNodes);
    }

    function updateNodes(nodes: LogicGraphProviderInterface["Nodes"]){
        setNodes(nodes);
    }

    function getLogicGraphData(){
        return {
            Nodes: Nodes,
            Edges: Edges,
            VitrualEdges: VitrualEdges
        }
    }

    const contextValue = {
        Editor:EditorProps,
        VitrualEdges:VitrualEdges,
        Nodes:Nodes,
        Edges:Edges,
        Actions: {
            openLogicGraph: openLogicGraph,
            addNode: addNode,
            removeNode: removeNode,
            updateNode: updateNode,
            addVirtualEdge: addVirtualEdge,
            clearVirtualEdge: clearVirtualEdge,
            addEdge: addEdge,
            removeEdge: removeEdge,
            updateEdge: updateEdge,
            getLogicGraphData: getLogicGraphData,
            updateGlobalProps: updateGlobalProps,
            updateFixedProps: updateFixedProps,
            updateNodes: updateNodes
        }
    }

    return (
        <logicGraphContext.Provider value={contextValue}>
            {children}
        </logicGraphContext.Provider>
    )
}