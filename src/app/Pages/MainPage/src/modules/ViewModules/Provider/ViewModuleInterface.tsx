// 可视化模块的GUI属性
export interface ViewModuleGUIProps{
    id: number; // 窗口ID
    isOpen: boolean; // 窗口是否打开
    type:string;
    Pos:{
        X: number; // 窗口位置X
        Y: number; // 窗口位置Y
    },
    BindNodeId:number;
    width: number; // 窗口宽度
    height: number; // 窗口高度
    title: string; // 窗口标题
}

// 可视化模块的数据属性
export interface ViewModuleDataProps{
    DataLength: number; // 显示一次所需要的数据长度
    DataChannels:number; // 数据通道数
    Data: number[][]; // 数据内容
    ActiveChannelNum:number; // 当前激活的数据通道
}

export interface ViewModuleProps{
    ViewModuleGUIProps: ViewModuleGUIProps; // 可视化模块GUI属性
    ViewModuleData: ViewModuleDataProps; // 可视化模块数据
}

export interface ViewModuleGetNodesDataProps{
    ID:number; // 节点ID
    Index:number; // 节点索引
    Length:number; // 数据长度
}

// 可视化模块的方法
export interface ViewModuleActions{
    // GUI管理类
    OpenViewModuleGUI: (  nodeID ) => void; // 打开可视化模块GUI
    GenerateViewModules: () => void; // 生成可视化模块
    UpdateViewModuleGUIStatus: (data: ViewModuleGUIProps) => void; // 更新可视化模块GUI状态
    CloseViewModuleGUI: (id: number) => void; // 关闭可视化模块GUI
    DestroyViewModuleGUI: (id: number) => void; // 销毁可视化模块GUI

    // 数据更新类
    UpdateViewModuleData: (data: ViewModuleProps) => void; // 更新可视化模块数据
    
}

// 可视化模块Provider接口
export interface ViewModuleProviderInterface{
    ViewModuleData: ViewModuleProps[]; // 可视化模块数据
    Actions: ViewModuleActions; // 可视化模块操作类
}