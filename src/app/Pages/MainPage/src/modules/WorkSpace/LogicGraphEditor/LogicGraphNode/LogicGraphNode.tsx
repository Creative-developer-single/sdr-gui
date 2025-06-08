import { UpdateStatusInterface } from "../../../FloatWindow/FloatWindowPropInterface";
import { LogicGraphNodesProp, LogicGraphProviderInterface } from "../../LogicGraphProvider/LogicGraphProviderInterface";
import { useLogicGraph } from "../../LogicGraphProvider/LogicGraphProvider";
import { FloatWindowWithoutTitle } from "../../../FloatWindow/FloatWindowWithoutTitle";
import { ModulesList, ModulesListAlias } from "../../../ModulesLib/ModulesList";
import { LogicGraphNodeInputPorts, LogicGraphNodeOutputPorts } from "./LogicGraphNodePorts";
import { ModulesDataProps, ModulesEditorActions } from "../../../ModulesEditor/ModulesEditorProviderInterface";
import { useModulesEditor } from "../../../ModulesEditor/ModulesEditorProvider";
import { useSimulation } from "../../../Simulation/SimulationProvider";
import { useViewModule } from "../../../ViewModules/Provider/ViewModuleProvider";
import { useDataSync } from "../../../DataSync/Provider/DataSyncProvider";

// 该节点仅用于展示，无任何交互逻辑
export function LogicGraphShownNode( { groupName,ModuleName,refModuleData } : {
    groupName:string,
    ModuleName:string,
    refModuleData?:ModulesDataProps
} )
{
    // 从ModulesList中查找组
    const modules = ModulesList.find(group => group.GroupName === groupName);
    const moduleGet = modules?.Modules.find(mod => mod.Name === ModuleName);
    //console.log("模块组:", groupName, "模块名称:", ModuleName, "模块数据:", moduleGet);

    if (!moduleGet){
        return null;
    }

    // 依据Module来构造一个节点
    const nodeData:LogicGraphNodesProp = {
        ID:0,
        GuiProps:{
            IconSrc:'../imgs/alu.png',
            Title:moduleGet.Name,
            Type:modules?.GroupName || '未知组',
            Pos:{
                X:0,
                Y:0
            },
            Ports:{
                InputPort:Array.from({ length: refModuleData?.Properties.Fixed.InputCount || moduleGet.Properties.Fixed.InputCount}, (_, i) => ({PortIndex:i})),
                OutputPort:Array.from({ length: refModuleData?.Properties.Fixed.OutputCount || moduleGet.Properties.Fixed.OutputCount }, (_, i) => ({PortIndex:i}))
            },
        },
        NodesData:refModuleData? refModuleData : moduleGet
    }

    return (
        <div
            onContextMenu={(e) => {e.preventDefault();}}
            className="w-[250px] h-[150px] flex flex-row bg-white  rounded-md shadow-md">
            <LogicGraphNodeInputPorts nodeData={ nodeData } ></LogicGraphNodeInputPorts>
            <div className="w-full h-full flex flex-col pb-3">{/*节点最上层容器*/}
                <div className="flex-initial basis-1/2 flex flex-row items-center pt-4 pl-6">{/*节点名称的容器*/}
                    <img className="w-[50px] h-[50px] bg-gray-100 p-2 mr-5 rounded-md shadow-md" src={ String(nodeData.GuiProps.IconSrc) }></img>
                    <div className="flex flex-col items-center">
                        <h3 className="font-semibold">{ModulesListAlias[nodeData.NodesData.Type][nodeData.NodesData.Name]["Name"]}</h3>
                        <h4 className="font-medium font-serif text-xs">{ModulesListAlias[nodeData.NodesData.Type]["Name"]}</h4>
                    </div>
                </div>
                <div className="flex-initial basis-1/2 flex flex-col bg-gray-200 mx-6 mt-4 px-4 rounded-md shadow-md overflow-auto">
                    {Object.entries(nodeData?.NodesData.Properties.Local || {}).map(([key,value])=> (
                         <div className="font-medium font-serif text-xs my-1" key={key}>{ModulesListAlias[nodeData.NodesData.Type][nodeData.NodesData.Name][key]+": "+value}</div>
                    ))}
                </div>
            </div>
            <LogicGraphNodeOutputPorts nodeData={nodeData}></LogicGraphNodeOutputPorts>
        </div>
    )
}

export function LogicGraphNode( { nodeID } ){
    const { Nodes,Actions } = useLogicGraph();
    const { modulesData,actions} = useModulesEditor();
    const { SimulationState } = useSimulation();
    const viewModulesContext = useViewModule();
    const DataSyncContext = useDataSync();

    // 查找节点数据
    const nodeData = Nodes.find(node => node.ID === nodeID);
    //console.log("当前节点:",nodeData);
    
    const windowData = {
        id: nodeData?.ID || 0,
        icon: '🧩',
        title: '逻辑图节点',
        isOpen: nodeData ? true : false,
        width: 250,
        height: 150,
        posX: nodeData?.GuiProps.Pos.X || 0,
        posY: nodeData?.GuiProps.Pos.Y || 0,
        onUpdateStatus: onUpdateStatus,
        onGUIDestroy: (id) => console.log('销毁窗口:', id)
    }

    const nodeGUI = {
        title:nodeData?.GuiProps.Title || '未命名节点',
        iconSrc: nodeData?.GuiProps.IconSrc || 'default-icon.png',
    }

    function onUpdateStatus(data: UpdateStatusInterface)
    {
        Actions.updateNode(nodeID,{
            GuiProps:{
                Title: nodeData?.GuiProps.Title || '未命名节点',
                IconSrc: nodeData?.GuiProps.IconSrc || 'default-icon.png',
                Type: nodeData?.GuiProps.Type || '未知类型',
                Pos:{
                    X: data.posX || nodeData?.GuiProps.Pos.X || 0,
                    Y: data.posY || nodeData?.GuiProps.Pos.Y || 0
                },
                Ports:nodeData?.GuiProps.Ports || {
                    InputPort:[],
                    OutputPort:[]
                }
            }
        });
    }

    function DeleteNodeByMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>){
        if(e.button === 2){
            e.preventDefault();
            e.stopPropagation();
            Actions.removeNode(nodeID);
        }
    }

    function OpenEidtorGUI( actions:ModulesEditorActions)
    {
        console.log("打开模块编辑器，节点数据：", nodeData?.NodesData);
        actions.openEditorGUI({
            windowId:0,
            windowMode:'ModulesEditor',
            type:nodeData?.NodesData.Type || 'Default',
            width:600,
            height:500,
            ModulesData:nodeData?.NodesData,
            bindNodeID: nodeData?.ID || 0
        });
    }

    return (
        <div>
            <FloatWindowWithoutTitle WindowInitialData={windowData} onUpdateStatus={onUpdateStatus} isRelative={true}>
                <div
                    onContextMenu={(e) => {e.stopPropagation(); e.preventDefault();}} onMouseDown={DeleteNodeByMouseDown} onDoubleClick={async (e) =>{
                        if(SimulationState.State == "running"){
                            viewModulesContext.Actions.OpenViewModuleGUI(nodeData?.ID);
                            //await DataSyncContext.Actions.getNodesData();
                        }else if(SimulationState.State == "stopped"){
                            // 打开模块编辑器
                            OpenEidtorGUI(actions);
                        }
                        
                        
                    }}
                    className="w-full h-full flex flex-row absolute bg-white">
                    <LogicGraphNodeInputPorts nodeData={ nodeData } ></LogicGraphNodeInputPorts>
                    <div className="w-full h-full flex flex-col pb-3">{/*节点最上层容器*/}
                        <div className="flex-initial basis-1/2 flex flex-row items-center pt-4 pl-6">{/*节点名称的容器*/}
                            <img className="w-[50px] h-[50px] bg-gray-100 p-2 mr-5 rounded-md shadow-md" src={ String(nodeGUI.iconSrc) }></img>
                            <div className="flex flex-col items-center">
                            <h3 className="font-semibold">{ModulesListAlias[nodeData?.NodesData.Type || "Default"][nodeData?.NodesData.Name || "default"]["Name"]}</h3>
                            <h4 className="font-medium font-serif text-xs">{ModulesListAlias[nodeData?.NodesData.Type || "Default"]["Name"]}</h4>
                            </div>
                        </div>
                        <div className="flex-initial basis-1/2 flex flex-col bg-gray-200 mx-6 mt-4 px-4 rounded-md shadow-md overflow-auto">
                            {Object.entries(nodeData?.NodesData.Properties.Local || {}).map(([key,value])=> (
                                <div className="font-medium font-serif text-xs my-1" key={key}>{ModulesListAlias[nodeData?.NodesData.Type || "Default"][nodeData?.NodesData.Name || "default"][key]+": "+value}</div>
                            ))}
                        </div>
                    </div>
                    <LogicGraphNodeOutputPorts nodeData={nodeData}></LogicGraphNodeOutputPorts>
                </div>
            </FloatWindowWithoutTitle>
        </div>
        
    )

}