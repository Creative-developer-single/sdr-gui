import { createContext, useContext, useState } from "react";
import { LLMGUIProps, LLMProviderInterface } from "./LLMAssistantInterface";
import { LLMGUIDataTemplate } from "../Template/LLMDataTemplate";

// 定义Context
const llmAssistantContext = createContext<LLMProviderInterface | null>(null);

export const useLLMAssistant = () => {
    const context = useContext(llmAssistantContext);
    if (!context) {
        throw new Error("useLLMAssistant must be used within a LLMAssistantProvider");
    }
    return context;
}

export function LLMAssistantProvider( { children } ){
    // 定义LLM GUI属性
    const [LLMGUIProps,setLLMGUIProps] = useState<LLMGUIProps | null>(LLMGUIDataTemplate);

    // 定义全局ID计数器
    let globalLLMIdCounter = 1; // 初始值 1，保证不为 0

    // 定义方法
    function OpenLLMGUI(){
        const newGUIProps: LLMGUIProps = {
            id: globalLLMIdCounter++, // 每次调用都会 +1，保证全局唯一且不为0
            isOpen: true,
            pos: {
                x: Math.floor(Math.random() * (window.innerWidth - 400)),
                y: Math.floor(Math.random() * (window.innerHeight - 300))
            },
            width: LLMGUIDataTemplate.width,
            height: LLMGUIDataTemplate.height,
            title: '大模型助手'
        };
        setLLMGUIProps(newGUIProps);
    }

    // 更新LLM GUI状态
    function UpdateLLMGUIStatus(guiProps: LLMGUIProps){
        setLLMGUIProps(prevProps => {
            if (!prevProps) return null;
            return { ...prevProps, ...guiProps };
        });
    }

    // 销毁LLM GUI
    function RemoveLLMGUI(id: number){
        setLLMGUIProps(prevProps => {
            if (!prevProps || prevProps.id !== id) return null;
            return null; // 销毁GUI
        });
    }

    const contextValue:LLMProviderInterface = {
        GUIProps: LLMGUIProps || LLMGUIDataTemplate, // 使用默认模板
        Actions:{
            OpenLLMGUI,
            UpdateLLMGUIStatus,
            RemoveLLMGUI
        }
    };

    return (
        <llmAssistantContext.Provider value={contextValue}>
            {children}
        </llmAssistantContext.Provider>
    );
}