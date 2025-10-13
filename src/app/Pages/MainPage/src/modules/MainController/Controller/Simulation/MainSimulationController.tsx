import { CollectiveContext } from "../../../ToolBar/Controller/ToolBarController";
import { ToolBarSelectionItem } from "../../../ToolBar/ToolBarSelection";

async function SimulationVerifyLogicGraph(context:CollectiveContext){
    const logicGraphData = context.LogicGraph.Actions.getLogicGraphData();
    await context.WebController.Actions.RPCModifyLogicGraph(logicGraphData);
}

function SimulationOpenSettingsGUI(context:CollectiveContext){
    context.Simulation.Actions.OpenSimulationSettingsGUI();
    console.log("打开仿真设置GUI");
}

function SimulationModifySimulationStatus(context:CollectiveContext){
    const simulationContext = context.Simulation;

    if (simulationContext.SimulationState.State === "running") {
        simulationContext.Actions.StopSimulation();
        console.log("停止仿真");
    } else {
        simulationContext.Actions.StartSimulation();
        console.log("开始仿真");
    }
}

export function MainSimulationController(item:ToolBarSelectionItem,context:CollectiveContext){
    switch(item.id){
        case "VerifyGraph":
            SimulationVerifyLogicGraph(context);
            break;
        case "SimulationSetting":
            SimulationOpenSettingsGUI(context);
            break;
        case "runSimulation":
            SimulationVerifyLogicGraph(context);
            SimulationModifySimulationStatus(context);
            break;
        case "genearteReport":
            // 生成报告逻辑
            console.log("生成报告");
            break;
        default:
            console.warn(`未处理的仿真管理器项: ${item.id}`);
            break;
    }
}