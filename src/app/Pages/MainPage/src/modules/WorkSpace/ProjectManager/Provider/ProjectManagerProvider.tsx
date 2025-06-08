import { createContext, useContext } from "react";
import { ProjectData, ProjectManagerActions, ProjectManagerInterface } from "./ProjectManagerInterface";
import { useLogicGraph } from "../../LogicGraphProvider/LogicGraphProvider";
import { useSimulation } from "../../../Simulation/SimulationProvider";

const projectManagerContext = createContext<ProjectManagerInterface | null>(null);

export const useProjectManager = () => {
    const context = useContext(projectManagerContext);
    if (!context) {
        throw new Error("useProjectManager must be used within a ProjectManagerProvider");
    }
    return context;
}

export function ProjectManagerProvider( {children}  ) {
    // 获取Context
    const LogicGraphContext = useLogicGraph();
    const SimulationContext = useSimulation();

    function importProject(projectData:ProjectData){
        LogicGraphContext.Actions.importLogicGraphData(projectData.LogicGraph);
        SimulationContext.Actions.importSimulation(projectData.Simulation);
    }

    function exportProject(fileName: string) {
        try {
            const projectData: ProjectData = {
                LogicGraph: LogicGraphContext.Actions.exportLogicGraphData(),
                Simulation: SimulationContext.Actions.exportSimulation(),
            };
    
            const jsonString = JSON.stringify(projectData, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
    
            const a = document.createElement("a");
            const safeFileName = (fileName && fileName.trim()) ? fileName.trim() : "project.json";
            a.href = url;
            a.download = safeFileName;
    
            document.body.appendChild(a);
            a.click();
    
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
    
        } catch (error) {
            console.error("导出项目失败:", error);
            // 这里你可以加 UI 反馈，例如 toast.error("导出失败")
        }
    }

    const Actions:ProjectManagerActions = {
        importProject,
        exportProject
    }
    
    const contextValue: ProjectManagerInterface = {
        Actions
    };

    return (
        <projectManagerContext.Provider value={contextValue}>
            {children}
        </projectManagerContext.Provider>
    );
}