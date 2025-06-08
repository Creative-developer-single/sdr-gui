import { ViewModuleProps } from "./ViewModuleInterface";

export const ViewModuleDataTemplate: ViewModuleProps = {
    ViewModuleGUIProps:{
        id: 0, // 窗口ID
        isOpen: false, // 窗口是否打开
        type: "Oscilloscope",// 窗口类型
        Pos: {
            X: 300, // 窗口位置X
            Y: 300 // 窗口位置Y
        },
        BindNodeId: 0, // 绑定的节点ID
        width: 400, // 窗口宽度
        height: 200, // 窗口高度
        title: '可视化模块' // 窗口标题
    },
    ViewModuleData:{
        DataLength: 0, // 显示一次所需要的数据长度
        DataChannels: 0, // 数据通道数
        Data: [], // 数据内容
        ActiveChannelNum: 0 // 当前激活的数据通道
    }
}

interface ViewModuleTypeComponentDictsInterface{
    [key:string]:{
        DataLength:number; // 显示一次所需要的数据长度
        DataChannels:number; // 数据通道数
        Data: number[][]; // 数据内容
        ActiveChannelNum:number; // 当前激活的数据通道
    }
}

export const ViewModuleTypeComponentDicts:ViewModuleTypeComponentDictsInterface = {
    Oscilloscope:{
        DataLength:1024,
        DataChannels:1,
        Data: [],
        ActiveChannelNum:0
    },
    SpectrumAnalyzer:{
        DataLength:1024,
        DataChannels:1,
        Data: [],
        ActiveChannelNum:0
    },
    ConstellationDiagram:{
        DataLength:1024,
        DataChannels:2,
        Data: [],
        ActiveChannelNum:0
    }
}