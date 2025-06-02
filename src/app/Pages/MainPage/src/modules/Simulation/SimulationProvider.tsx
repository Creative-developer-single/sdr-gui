import { createContext, useCallback, useContext, useState } from "react";
import { SimulationActions, SimulationGUIProps, SimulationProps, SimulationProviderInterface, SimulationState, SimulationVerifyResult } from "./SimulationInterface";

const SimulationContext = createContext<SimulationProviderInterface | null>(null);

export const useSimulation = () => {
    const context = useContext(SimulationContext);
    if (!context) {
        throw new Error("useSimulation must be used within a SimulationProvider");
    }
    return context;
}

export function SimulationProvider( {children} ){
    // 优先加载仿真属性，若没有则使用默认值
    const defaultSimulationProps: SimulationProps = {
        SimulationMode: 'default', // 默认仿真模式
        SimulationTime: 5, // 默认仿真时间(s)
        SimulationTimeStep: 0.001 // 默认仿真时间步长(s)
    }

    // 默认仿真状态
    const defaultSimulationState: SimulationState = {
        State: 'stopped', // 默认状态为停止
        Time: 0 // 初始时间为0
    }

    // 定义仿真系统所用参数
    const [simulationState, setSimulationState] = useState<SimulationState>(defaultSimulationState);
    const [simulationProps, setSimulationProps] = useState<SimulationProps>(defaultSimulationProps);
    const [simulationVerifyResult, setSimulationVerifyResult] = useState<SimulationVerifyResult>();
    const [simulationGUIProps, setSimulationGUIProps] = useState<SimulationProviderInterface['SimulationGUIProps']>([]);

    // 定义仿真操作函数
    // 打开仿真设置GUI
    const openSimulationSettingsGUI = useCallback(() => {
        const newGUIProps:SimulationGUIProps = {
            Id: Math.max(...simulationGUIProps.map(item => item.Id), 0) + 1,
            IsOpen: true,
            Mode: 'Simulation',
            Pos:{
                // 视野范围内随机生成
                X: Math.floor(Math.random() * (window.innerWidth - 400)),
                Y: Math.floor(Math.random() * (window.innerHeight - 300))
            },
            Width: 800,
            Height: 500,
            Title: '仿真设置'
        }
        console.log("OpenSimulationSettingsGUI:", newGUIProps);
        setSimulationGUIProps(prevProps => [...prevProps, newGUIProps]);
    },[])

    // 更新仿真GUI状态
    const updateSimulationSettingsGUIStatus = useCallback((data:SimulationGUIProps) => {
        setSimulationGUIProps(prevProps => {
            return prevProps.map(item => {
                if (item.Id === data.Id) {
                    return { ...item, IsOpen: data.IsOpen, Pos: data.Pos, Width: data.Width, Height: data.Height };
                }
                return item;
            });
        });
    }, []);

    // 销毁仿真GUI
    const DestroySimulationSettingsGUI = useCallback((id: number) => {
        setSimulationGUIProps(prevProps => prevProps.filter(item => item.Id !== id));
        console.log("DestroySimulationSettingsGUI:", id);
    }, []);

    // 更新仿真参数
    const UpdateSimulationSettings = useCallback((props: SimulationProps) => {
        setSimulationProps(prevProps => ({
            ...prevProps,
            ...props
        }));
        console.log("UpdateSimulationSettings:", props);
    }, []);

    // 仿真状态
    const StartSimulation = useCallback(() =>{

    },[]);

    // 暂停仿真
    const PauseSimulation = useCallback(() =>{
    },[]);

    // 停止仿真
    const StopSimulation = useCallback(() =>{

    },[]);

    // 验证仿真参数
    const VerifySimulation = useCallback(() => {
    }, []);

    const Actions:SimulationActions = {
        OpenSimulationSettingsGUI: openSimulationSettingsGUI,
        UpdateSimulationSettingsGUIStatus: updateSimulationSettingsGUIStatus,
        DestroySimulationSettingsGUI: DestroySimulationSettingsGUI,
        StartSimulation: StartSimulation,
        PauseSimulation: PauseSimulation,
        StopSimulation: StopSimulation,
        UpdateSimulationSettings: UpdateSimulationSettings,

        VerifySimulation: VerifySimulation
    }

    const contextValue:SimulationProviderInterface = {
        SimulationState: simulationState,
        SimulationProps: simulationProps,
        SimulationVerifyResult: simulationVerifyResult || { IsValid: true, Info: [] },
        SimulationGUIProps: simulationGUIProps,
        Actions: Actions
    }

    return (
        <SimulationContext.Provider value={contextValue}>
            {children}
        </SimulationContext.Provider>)
}