// 仿真状态
export interface SimulationState{
    State:string //running,paused,stopped
    Time:number; //当前仿真时间
}

// 仿真参数
export interface SimulationProps{
    SimulationMode:string;
    SimulationTime:number;
    SimulationTimeStep:number;
    SimulationPerFrameTime:number;
    SimulationSampleRate:number;
}

// 仿真验证结果
export interface SimulationVerifyResult{
    IsValid:boolean; // 是否验证通过
    Info:string[]; // 验证信息数组
}

// 仿真GUI属性
export interface SimulationGUIProps{
    Id:number;
    IsOpen:boolean; // 窗口是否打开
    Mode:string; // 窗口模式，例如 'Simulation' 或 'ModulesEditor'
    Pos:{
        X:number; // 窗口位置X
        Y:number; // 窗口位置Y
    }
    Width:number; // 窗口宽度
    Height:number; // 窗口高度
    Title:string; // 窗口标题
}

export interface SimulationStatusGUIProps{
    IsOpen: boolean; // 窗口是否打开
}

// 仿真接口
export interface SimulationActions{
    // 仿真状态类
    StartSimulation: () => void; // 启动仿真
    PauseSimulation: () => void; // 暂停仿真
    StopSimulation: () => void; // 停止仿真

    // 仿真准备类
    VerifySimulation: () => void; // 验证仿真参数
    UpdateSimulationSettings: (props: SimulationProps) => void; // 更新仿真参数

    // 仿真GUI类
    OpenSimulationSettingsGUI: () => void; // 打开仿真设置GUI
    UpdateSimulationSettingsGUIStatus: (data: SimulationGUIProps) => void;
    DestroySimulationSettingsGUI: (id: number) => void; // 销毁仿真设置GUI
}

// 仿真Provider接口
export interface SimulationProviderInterface{
    SimulationState: SimulationState; // 仿真状态
    SimulationProps: SimulationProps; // 仿真参数
    SimulationVerifyResult: SimulationVerifyResult; // 仿真验证结果
    SimulationGUIProps: SimulationGUIProps[]; // 仿真GUI属性
    Actions: SimulationActions; // 仿真操作类
}