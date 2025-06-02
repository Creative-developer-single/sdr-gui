import { CollectiveContext } from "../ToolBarController";

export function ToolBarOpenSimulationSettingsGUI( context:CollectiveContext){
    // 获取仿真Context
    const simulationContext = context.Simulation;

    // 打开仿真设置GUI
    simulationContext.Actions.OpenSimulationSettingsGUI();
    console.log("打开仿真设置GUI");
}