import { CollectiveContext } from "../../../ToolBar/Controller/ToolBarController";
import { ToolBarSelectionItem } from "../../../ToolBar/ToolBarSelection";

function LLMOpenLLMGUI(context:CollectiveContext){
    context.LLMContext.Actions.OpenLLMGUI();
    console.log("打开LLM GUI");
}

export function MainLLMController(item:ToolBarSelectionItem,context:CollectiveContext){
    switch(item.id){
        case "aiCorrect":
            break;
        case "aiFinish":
            break;
        case "aiAssistant":
            // 打开AI助手GUI
            LLMOpenLLMGUI(context);
            break;
        default:
            console.warn(`未处理的AI助手项: ${item.id}`);
            break;
    }
}