import { CollectiveContext } from "../ToolBarController";

export function ToolBarOpenSimulationSettingsGUI( context:CollectiveContext){
    // 获取仿真Context
    const simulationContext = context.Simulation;

    // 打开仿真设置GUI
    simulationContext.Actions.OpenSimulationSettingsGUI();
    console.log("打开仿真设置GUI");
}

export async function ToolBarModifySimulationStatus( context:CollectiveContext){
    // 获取仿真Context
    const simulationContext = context.Simulation;

    // 获取WebController Contexte
    const webControllerContext = context.WebController;

    // 获取WebSocketContext
    const webSocketContext = context.WebSocketContext;

    // 切换仿真状态
    if (simulationContext.SimulationState.State === "running") {
        simulationContext.Actions.StopSimulation();
        //await webControllerContext.Actions.RPCModifySimulationStatus("Stop",webSocketContext);
        console.log("停止仿真");
    } else {
        simulationContext.Actions.StartSimulation();
        //await webControllerContext.Actions.RPCModifySimulationStatus("Start",webSocketContext);
        console.log("开始仿真");
    }
}