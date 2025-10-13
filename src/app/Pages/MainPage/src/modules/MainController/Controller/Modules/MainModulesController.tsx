import { PreloadData } from "../../../ModulesEditor/ModulesEditorProvider";
import { CollectiveContext } from "../../../ToolBar/Controller/ToolBarController";
import { ToolBarSelectionItem } from "../../../ToolBar/ToolBarSelection";

function OpenModulesEditor(ModuleType:string,context:CollectiveContext){
    const ModulesData:PreloadData = {
        windowId:0,
        windowMode:'ModulesBrouser',
        type:ModuleType,
        width:800,
        height:500,
        bindNodeID:0
    }

    context.ModulesEditor.actions.openEditorGUI(ModulesData);
    console.log(`打开模块浏览器，类型: ${ModuleType}`);
}

// 处理模块选单
export function MainModulesController(item:ToolBarSelectionItem,context:CollectiveContext){
    // 提取模块类型
    const ModuleType = item.id;

    // 打开对应模块类型的编辑器
    OpenModulesEditor(ModuleType, context);
}