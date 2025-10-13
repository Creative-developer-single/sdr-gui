import { CollectiveContext } from "../ToolBarController";

export function ToolBarOpenLLMGUI(context:CollectiveContext){
    // 获取LLM Context
    const llmContext = context.LLMContext;

    // 打开LLM GUI
    llmContext.Actions.OpenLLMGUI();
    console.log("打开LLM GUI");
}