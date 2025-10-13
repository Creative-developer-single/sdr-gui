import { createContext, useCallback, useContext } from "react";
import { MainControllerInterface } from "./MainControllerInterface";
import { useModulesEditor } from "../ModulesEditor/ModulesEditorProvider";
import { useLogicGraph } from "../WorkSpace/LogicGraphProvider/LogicGraphProvider";
import { useWebController } from "../WebBridge/WebController/WebController";
import { useSimulation } from "../Simulation/SimulationProvider";
import { useDataSync } from "../DataSync/Provider/DataSyncProvider";
import { useProjectManager } from "../WorkSpace/ProjectManager/Provider/ProjectManagerProvider";
import { useLLMAssistant } from "../LLM/Provider/LLMAssistantProvider";
import { ToolBarSelectionItem } from "../ToolBar/ToolBarSelection";
import MainFileController from "./Controller/File/MainFileController";
import { CollectiveContext } from "../ToolBar/Controller/ToolBarController";
import { MainModulesController } from "./Controller/Modules/MainModulesController";
import { MainSimulationController } from "./Controller/Simulation/MainSimulationController";
import { MainLLMController } from "./Controller/LLM/MainLLMController";

// 创建主控制器上下文
const mainControllerContext = createContext<MainControllerInterface|null>(null);

export function useMainController() {
    const context = useContext(mainControllerContext);
    if (!context) {
        throw new Error("useMainController must be used within a MainControllerProvider");
    }
    return context;
}

// 创建主控制器提供者组件
export default function MainControllerProvider({children}:{children: React.ReactNode}) {

    // 获取ModulesEditor上下文
    const ModulesEditorContext = useModulesEditor();
    
    // 获取LogicGraph上下文
    const LogicGraphContext = useLogicGraph();

    // 获取WebController上下文
    const WebControllerContext = useWebController();

    // 获取Simulation上下文
    const SimulationContext = useSimulation();

    // 获取ProjectManager上下文
    const ProjectManagerContext = useProjectManager();

    // 获取LLM上下文
    const LLMContext = useLLMAssistant();

    const context:CollectiveContext = {
        ModulesEditor: ModulesEditorContext,
        LogicGraph: LogicGraphContext,
        WebController: WebControllerContext,
        Simulation: SimulationContext,
        ProjectManager: ProjectManagerContext,
        LLMContext: LLMContext
    }

    /*
    主控制器的操作函数
    */
    // 主要操作函数
    const MainActionsController = useCallback((itemID:string,item:ToolBarSelectionItem)=>{
        switch(itemID){
            case "file":
                MainFileController(item,context);
                break;
            case "start":
                // 这里可以添加启动相关的逻辑
                console.log("启动操作");
                break;
            case "modules":
                MainModulesController(item,context);
                break;
            case "simulate":
                MainSimulationController(item,context);
                break;
            case "aiAssistant":
                MainLLMController(item,context);
                break;
            default:
                console.warn(`未处理的主控制器项: ${itemID}`);
                break;
        }
    },[context])

    const contextValue:MainControllerInterface = {
        Actions:{
            MainActionsController: MainActionsController
        }
    }

    return (
        <mainControllerContext.Provider value={contextValue}>
            {children}
        </mainControllerContext.Provider>
    );
}
