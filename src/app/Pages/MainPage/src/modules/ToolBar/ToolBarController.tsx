import { ModulesEditorActions } from "../ModulesEditor/ModulesEditorProviderInterface";

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

export function ToolBarController( itemID,item,actions:ModulesEditorActions ){
    switch (itemID){
        case "file":
            break;
        case "start":
            break;
        case "modules":
            // 打开模块浏览器
            console.log("Item: ", item);
            ToolBarOpenModulesEditor(item.id,actions);
            break;
        default:
            console.warn(`未处理的工具栏项: ${itemID}`);
            break;
    }
}