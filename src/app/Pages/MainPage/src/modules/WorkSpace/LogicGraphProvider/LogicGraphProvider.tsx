import { createContext, useCallback, useContext, useState } from "react";
import { LogicGraphNodesProp, LogicGraphProviderInterface } from "./LogicGraphProviderInterface";

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
    const [Nodes,setNodes] = useState<LogicGraphProviderInterface["Nodes"]>([]);
    const [Edges,setEdges] = useState<LogicGraphProviderInterface["Edges"]>([]);

    // 定义操作函数
    // 添加节点
    const addNode = useCallback((node:LogicGraphNodesProp) => {
        if (Nodes.length == 0){
            node.ID = 1;
        }
        setNodes(prevNodes => [...prevNodes,node]);
        console.log('现有节点:', Nodes);
    },[]);

    // 删除节点
    function removeNode(nodeID: number){
        setNodes(prevNodes => prevNodes.filter(node => node.ID !== nodeID));
    }

    // 更新节点
    function updateNode(nodeID: number, updates: Partial<LogicGraphNodesProp>){
        let newNodes = Nodes.map(node =>
            node.ID === nodeID ? { ...node, ...updates } : node);
        setNodes(newNodes);
    }

    // 定义边的操作函数
    // 添加边
    function addEdge(edge: LogicGraphProviderInterface["Edges"][number]){
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

    const contextValue = {
        Nodes:Nodes,
        Edges:Edges,
        Actions: {
            addNode: addNode,
            removeNode: removeNode,
            updateNode: updateNode,
            addEdge: addEdge,
            removeEdge: removeEdge,
            updateEdge: updateEdge
        }
    }

    return (
        <logicGraphContext.Provider value={contextValue}>
            {children}
        </logicGraphContext.Provider>
    )
}