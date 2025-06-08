import { SimulationData, SimulationProps } from "../../../Simulation/SimulationInterface";
import { LogicGraphDataInterface, LogicGraphProviderInterface } from "../../LogicGraphProvider/LogicGraphProviderInterface";

export interface ProjectData{
    LogicGraph:LogicGraphDataInterface;
    Simulation:SimulationData;
}

export interface ProjectManagerActions{
    importProject:(projectData:ProjectData) => void;
    exportProject:(fileName:string) => void;
}

export interface ProjectManagerInterface {
    Actions: ProjectManagerActions;
}