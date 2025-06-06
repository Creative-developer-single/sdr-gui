import React from "react";
import { useSimulation } from "../SimulationProvider";
import { useLogicGraph } from "../../WorkSpace/LogicGraphProvider/LogicGraphProvider";

// 仿真状态指示栏组件
export default function SimulationStatusBar() {
    // 获取仿真上下文
    const simulationContext = useSimulation();

    // 获取逻辑流图上下文
    const logcGraphContext = useLogicGraph();

    // 逻辑流图是否打开
    const isOpen = logcGraphContext.Editor.isOpen;
    
    // 获取仿真状态
    const isRunning = simulationContext.SimulationState.State === 'running';
   
    // 获取仿真模式和时间
    const mode = simulationContext.SimulationProps.SimulationMode;
    const time = simulationContext.SimulationState.Time;
    

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-gray-300 shadow-lg rounded-lg w-64 p-4 text-gray-800">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-semibold">仿真状态</h3>
                <div className={`text-sm px-2 py-1 rounded ${isRunning ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {isRunning ? "进行中" : "已停止"}
                </div>
            </div>

            <div className="text-sm mb-1">
                <span className="font-medium">仿真模式：</span> {mode}
            </div>
            <div className="text-sm">
                <span className="font-medium">仿真时间：</span> {time}s
            </div>
        </div>
    );
}
