import { DataSyncProviderInterface } from "../../DataSync/Provider/DataSyncInterface";
import { ModulesEditorActions, ModulesEditorProviderInterface } from "../../ModulesEditor/ModulesEditorProviderInterface";
import { SimulationProviderInterface } from "../../Simulation/SimulationInterface";
import { ViewModuleProviderInterface } from "../../ViewModules/Provider/ViewModuleInterface";
import { WebControllerInterface } from "../../WebBridge/WebController/WebControllerInterface";
import { WebSocketInterface } from "../../WebBridge/WebSocket/WebSocketInterface";
import { LogicGraphProviderInterface } from "../../WorkSpace/LogicGraphProvider/LogicGraphProviderInterface";
import { ToolBarModifySimulationStatus, ToolBarOpenSimulationSettingsGUI } from "./Simulation/ToolBarSimulationController";

export interface CollectiveContext {
    ModulesEditor: ModulesEditorProviderInterface,
    LogicGraph: LogicGraphProviderInterface,
    Simulation: SimulationProviderInterface,
    WebController: WebControllerInterface,
    DataSyncContext:DataSyncProviderInterface,
    WebSocketContext:WebSocketInterface,
    ViewModulesContext:ViewModuleProviderInterface
}

function ToolBarFileManager( item,context:CollectiveContext )
{
    switch(item.id){
        case "NewProject":
            context.LogicGraph.Actions.openLogicGraph();
            break;
        default:
            console.warn(`未处理的文件管理器项: ${item.id}`);
            break;
    }
    // 这里可以添加文件管理器的逻辑
}

function ToolBarOpenModulesEditor( preloadType,actions:ModulesEditorActions ){
    const preLoadData = {
        windowId: 0,
        windowMode: 'ModulesBrouser',
        type: preloadType,
        width: 800,
        height: 500,
        bindNodeID: 0,
    };

    actions.openEditorGUI(preLoadData);
    console.log(`打开模块浏览器，类型: ${preloadType}`);
}

function ToolBarSimulationManager( item,context:CollectiveContext ){
    switch(item.id){
        case "VerifyGraph":
            context.WebController.Actions.RPCModifyLogicGrapWithoutReply(context.LogicGraph.Actions.getLogicGraphData());
            context.ViewModulesContext.Actions.GenerateViewModules();
            break;
        case "SimulationSetting":
            ToolBarOpenSimulationSettingsGUI(context);
            break;
        case "runSimulation":
            ToolBarModifySimulationStatus(context);
            break;
        case "generateReport":
            context.DataSyncContext.Actions.getNodesData();
        default:
            console.warn(`未处理的模拟管理器项: ${item.id}`);
            break;
    }
}

export function ToolBarController( itemID,item,SharedContext:CollectiveContext){
    switch (itemID){
        case "file":
            ToolBarFileManager(item,SharedContext);
            break;
        case "start":
            break;
        case "modules":
            // 打开模块浏览器
            console.log("Item: ", item);
            ToolBarOpenModulesEditor(item.id,SharedContext.ModulesEditor.actions);
            break;
        case "simulate":
            ToolBarSimulationManager(item,SharedContext);
            break;
        default:
            console.warn(`未处理的工具栏项: ${itemID}`);
            break;
    }
}