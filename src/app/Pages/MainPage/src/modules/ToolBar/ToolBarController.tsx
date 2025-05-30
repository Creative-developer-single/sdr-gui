import { ModulesEditorActions, ModulesEditorProviderInterface } from "../ModulesEditor/ModulesEditorProviderInterface";
import { WebControllerInterface } from "../WebBridge/WebControllerInterface";
import { LogicGraphProviderInterface } from "../WorkSpace/LogicGraphProvider/LogicGraphProviderInterface";

interface CollectiveContext {
    ModulesEditor: ModulesEditorProviderInterface,
    LogicGraph: LogicGraphProviderInterface,
    WebController: WebControllerInterface
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
        height: 500
    };

    actions.openEditorGUI(preLoadData);
    console.log(`打开模块浏览器，类型: ${preloadType}`);
}

function ToolBarSimulationManager( item,context:CollectiveContext ){
    switch(item.id){
        case "VerifyGraph":
            context.WebController.Actions.RPCModifyLogicGrapWithoutReply(context.LogicGraph.Actions.getLogicGraphData());
            break;
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