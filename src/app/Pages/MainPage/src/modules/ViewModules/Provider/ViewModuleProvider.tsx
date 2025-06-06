import { useContext, useState } from "react";
import { ViewModuleDataProps, ViewModuleGUIProps, ViewModuleProps, ViewModuleProviderInterface } from "./ViewModuleInterface";
import { createContext } from "react";
import { ViewModuleDataTemplate, ViewModuleTypeComponentDicts } from "./ViewModuleDataTemplate";
import { useLogicGraph } from "../../WorkSpace/LogicGraphProvider/LogicGraphProvider";

const viewModuleContext = createContext<ViewModuleProviderInterface | null>(null);

export const useViewModule = () => {
    const context = useContext(viewModuleContext);
    if (!context) {
        throw new Error("useViewModule must be used within a ViewModuleProvider");
    }
    return context;
}

export function ViewModuleProvider({ children }){
    // 定义可视化模块列表
    const [viewModuleList,setViewModuleList] = useState<ViewModuleProps[] | null>([ViewModuleDataTemplate]);

    // 获取LogicGraph的上下文
    const logicGraphContext = useLogicGraph();

    /*
     * 可视化模块操作类
    */
    // 打开可视化模块GUI
    function OpenViewModuleGUI( nodeID ){
        // 检查是否为可视化模块
        const targetModule = logicGraphContext.Nodes.find(item => item.ID === nodeID);
        console.log("targetModule:", targetModule);
        if (!targetModule){
            return;
        }

        if(targetModule.NodesData.Type != "Visual")
        {
            return;
        }

        // 先检查该可视化模块是否已经有绑定节点
        const existingModule = viewModuleList?.find(item => item.ViewModuleGUIProps.BindNodeId === nodeID);
        if (existingModule) {
            // 如果已经存在，则直接打开
            setViewModuleList(prevList => {
                if (!prevList) return null;
                return prevList.map(item => {
                    if (item.ViewModuleGUIProps.BindNodeId === nodeID) {
                        return { ...item, ViewModuleGUIProps: { ...item.ViewModuleGUIProps, isOpen: true } };
                    }
                    return item;
                });
            });
            console.warn(`可视化模块已打开，ID: ${nodeID}`);
        }
    }
    let globalViewModuleIdCounter = 1;  // 初始值 1，保证不为 0

    function GenerateViewModules() {
        // 获取所有 Type 为 Visual 的节点
        const visualNodes = logicGraphContext.Nodes.filter(node => node.NodesData.Type === "Visual");
    
        if (visualNodes.length === 0) {
            console.warn("没有找到任何可视化节点");
            return;
        }
    
        // 新建空的列表
        let currentViewModuleList: ViewModuleProps[] = [];
    
        console.log("当前可视化模块列表已清空，准备生成新的可视化模块");
    
        visualNodes.forEach(node => {
            // 检查是否已存在
            // 直接用全局递增 ID
            const newGUIProps: ViewModuleGUIProps = {
                id: globalViewModuleIdCounter++,  // 每次调用都会 +1，保证全局唯一且不为0
                isOpen: false,
                Pos: {
                    X: Math.floor(Math.random() * (window.innerWidth - 400)),
                    Y: Math.floor(Math.random() * (window.innerHeight - 300))
                },
                BindNodeId: node.ID,
                type: node.NodesData.Name, // 使用节点名称作为类型
                width: 500,
                height: 500,
                title: '可视化模块'
            };

            const viewModuleData:ViewModuleDataProps ={
                DataChannels:ViewModuleTypeComponentDicts[node.NodesData.Name]?.DataChannels || 1, // 默认通道数为1
                DataLength: node.NodesData.Properties.Local?.bufferLength || ViewModuleTypeComponentDicts[node.NodesData.Name]?.DataLength || 1024, // 默认长度为1024
                Data: Array.from({ length: ViewModuleTypeComponentDicts[node.NodesData.Name]?.DataChannels || 1 }, () => new Array(node.NodesData.Properties.Local?.bufferLength || ViewModuleTypeComponentDicts[node.NodesData.Name]?.DataLength || 1024).fill(0)), // 初始化数据
                ActiveChannelNum: 0 // 默认激活通道为0
            }
    
            const newViewModule: ViewModuleProps = {
                ViewModuleGUIProps: newGUIProps,
                ViewModuleData: viewModuleData
            };
    
            currentViewModuleList.push(newViewModule);
        });
    
        // 更新状态
        setViewModuleList(currentViewModuleList);
    
        console.log("生成可视化模块完成，当前列表：", currentViewModuleList);
    }
    

    // 关闭可视化模块GUI
    function CloseViewModuleGUI( id:number ){
        setViewModuleList(prevList => {
            if (!prevList) return null;
            return prevList.map(item => {
                if (item.ViewModuleGUIProps.id === id) {
                    return { ...item, ViewModuleGUIProps: { ...item.ViewModuleGUIProps, isOpen: false } };
                }
                return item;
            });
        }
        );
        console.log(`关闭可视化模块GUI，ID: ${id}`);
    }

    // 更新可视化模块GUI状态
    function UpdateViewModuleGUIStatus(data: ViewModuleGUIProps){
        setViewModuleList(prevList => {
            if (!prevList) return null;
            return prevList.map(item => {
                if (item.ViewModuleGUIProps.id === data.id) {
                    return { ...item, ViewModuleGUIProps: { ...item.ViewModuleGUIProps, ...data } };
                }
                return item;
            });
        });
    }
    // 销毁可视化模块GUI
    function DestroyViewModuleGUI(id: number){
        setViewModuleList(prevList => {
            if (!prevList) return null;
            return prevList.filter(item => item.ViewModuleGUIProps.id !== id);
        });
    }
    // 更新可视化模块数据
    function UpdateViewModuleData(data: ViewModuleProps){
        setViewModuleList(prevList => {
            if (!prevList) return null;
            return prevList.map(item => {
                if (item.ViewModuleGUIProps.id === data.ViewModuleGUIProps.id) {
                    return { ...item, ViewModuleData: data.ViewModuleData };
                }
                return item;
            });
        }
        );
    }

    const contextValue:ViewModuleProviderInterface = {
        ViewModuleData: viewModuleList || [ViewModuleDataTemplate],
        Actions: {
            OpenViewModuleGUI,
            UpdateViewModuleGUIStatus,
            DestroyViewModuleGUI,
            UpdateViewModuleData,
            GenerateViewModules,
            CloseViewModuleGUI
        }
    }

    return(
        <viewModuleContext.Provider value={contextValue}>
            {children}
        </viewModuleContext.Provider>
    )
}