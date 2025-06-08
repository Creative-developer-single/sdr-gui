import { nodeServerAppPaths } from "next/dist/build/webpack/plugins/pages-manifest-plugin";
import { useSimulation } from "../../Simulation/SimulationProvider";
import { useViewModule } from "../../ViewModules/Provider/ViewModuleProvider";
import { useWebController } from "../../WebBridge/WebController/WebController";
import { useLogicGraph } from "../../WorkSpace/LogicGraphProvider/LogicGraphProvider";
import { DataSyncGetNodesDataProps, DataSyncProviderInterface } from "./DataSyncInterface";
import { ModulesParseInterface, parseModules } from "../../Tools/DataParse";
import { createContext, useContext, useEffect } from "react";
import { ViewModuleProps } from "../../ViewModules/Provider/ViewModuleInterface";
import { useWebSocket } from "../../WebBridge/WebSocket/WebSocketProvider";

const DataSyncContext = createContext<DataSyncProviderInterface | null>(null);

export const useDataSync = () => {
    const context = useContext(DataSyncContext);
    if (!context) {
        throw new Error("useDataSync must be used within a DataSyncProvider");
    }
    return context;
}

interface DataResponseInterface{
    data:[{
        valueI:number,
        valueQ:number,
    }],
    dataLength:number,
    moduleID:number,
}

export function DataSyncProvider( {children} ){
    // 获取仿真Context
    const simulationContext = useSimulation();

    // 获取WebController Context
    const webControllerContext = useWebController();

    // 获取LogicGraph Context
    const logicGraphContext = useLogicGraph();

    // 获取可视化模块Context
    const visualContext = useViewModule();

    // 获取WebSocket Context
    const webSocketContext = useWebSocket();

    // 获取节点数据
    const ViewModuleNodes = visualContext.ViewModuleData;

    // 时刻同步逻辑图和仿真器
    useEffect(()=>{
        logicGraphContext.Actions.applySimulationPrarms(simulationContext.SimulationProps);
    },[logicGraphContext.Nodes.length, logicGraphContext.Edges.length]);

    // 时刻同步可视化模块和节点
    useEffect(()=>{
        visualContext.Actions.GenerateViewModules();
    },[logicGraphContext.Nodes.length,logicGraphContext.Edges.length]);

    // 时刻与后端同步仿真状态变化
    useEffect(()=>{
        webControllerContext.Actions.RPCModifySimulationStatus(simulationContext.SimulationState.State,webSocketContext);
    },[simulationContext.SimulationState.State]);

    const frameTime = 200; // 每帧时间间隔，单位为毫秒
    // 监听仿真状态变化
    useEffect(()=>{
        // 当仿真状态开始的时候，周期性向后端获取可视化模块数据
        if (simulationContext.SimulationState.State === 'running') {
            const intervalId = setInterval( async () => {
                const response:ModulesParseInterface[] = await getViewModuleData();
                response.forEach((module) =>{
                    // 获取节点ID对应的可视化模块
                    const viewModule = ViewModuleNodes.find(node => node.ViewModuleGUIProps.BindNodeId === module.moduleID);
                    if (viewModule) {
                        // 更新可视化模块数据
                        // 提取valueI和valueQ到两个独立的数组
                        const valueI = module.data.map(item => item.valueI);
                        const valueQ = module.data.map(item => item.valueQ);

                        // 默认提供两个通道，但是可以按照需求使用
                        // 构建更新结构
                        const upData:ViewModuleProps = {
                            ViewModuleGUIProps: viewModule.ViewModuleGUIProps,
                            ViewModuleData: {
                                ActiveChannelNum: viewModule.ViewModuleData.ActiveChannelNum,
                                Data: [valueI, valueQ],
                                DataLength: viewModule.ViewModuleData.DataLength,
                                DataChannels: 2 // 假设有两个通道
                            }
                        }
                        // 调用更新方法
                        visualContext.Actions.UpdateViewModuleData(upData);
                    } else {
                        console.warn(`未找到ID为${module.moduleID}的可视化模块`);
                    }
                })
            }
            , frameTime); // 每秒获取一次数据
            // 清理定时器
            return () => clearInterval(intervalId);
        } else {
            // 如果仿真状态不是运行中，则不需要获取数据
            console.log("仿真状态不是运行中，停止获取数据");
        }
    },[simulationContext.SimulationState.State]);

    // 方法1：获取后端可视化模块数据
    async function getViewModuleData(){
        const nodes = ViewModuleNodes.map((node)=>{
            const nodeData = logicGraphContext.Nodes.find(n => n.ID === node.ViewModuleGUIProps.BindNodeId && n.ID != 0);
            return {
                ID: node.ViewModuleGUIProps.BindNodeId,
                Index: node.ViewModuleData.ActiveChannelNum,
                Length:nodeData?.NodesData.Properties.Local?.bufferLength || 512
            }
        })

        // 如果nodes为空，则直接返回一个空的模块数组
        if (nodes.length === 0) {
            console.warn("DataSyncProvider: getViewModuleData: 没有可视化模块节点，返回空数据");
            return [];
        }

        const testNodes = [{
            ID:4,
            Index:0,
            Length:512
        }];

        const DataSyncData:DataSyncGetNodesDataProps = {
            Nodes: nodes,
        }

        const response = await webControllerContext.Actions.RPCGetNodesData(DataSyncData);
        //console.log("DataSyncProvider: getViewModuleData response:", response);
        const module = parseModules(response);
        
        
        return module;
    }

    const ContextValue:DataSyncProviderInterface = {
        Actions:{
            getNodesData: getViewModuleData
        }
    }

    return (
        <DataSyncContext.Provider value={ContextValue}>
            {children}
        </DataSyncContext.Provider>
    )

}