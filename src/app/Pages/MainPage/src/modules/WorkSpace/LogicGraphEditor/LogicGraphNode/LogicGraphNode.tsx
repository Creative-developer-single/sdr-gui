import { use, useEffect, useState } from "react";
import { FloatWindowPropInterface, UpdateStatusInterface } from "../../../FloatWindow/FloatWindowPropInterface";
import { LogicGraphNodesProp } from "../../LogicGraphProvider/LogicGraphProviderInterface";
import { useLogicGraph } from "../../LogicGraphProvider/LogicGraphProvider";
import { FloatWindowWithoutTitle } from "../../../FloatWindow/FloatWindowWithoutTitle";
import { ModulesList, ModulesListAlias } from "../../../ModulesLib/ModulesList";
import { LogicGraphNodeInputPorts, LogicGraphNodeOutputPorts } from "./LogicGraphNodePorts";
import { ModulesDataProps } from "../../../ModulesEditor/ModulesEditorProviderInterface";

// 该节点仅用于展示，无任何交互逻辑
export function LogicGraphShownNode( { groupName,ModuleName,refModuleData } : {
    groupName:string,
    ModuleName:string,
    refModuleData?:ModulesDataProps
} )
{
    // 从ModulesList中查找组
    const modules = ModulesList.find(group => group.GroupName === groupName);
    const module = modules?.Modules.find(mod => mod.Name === ModuleName);

    if (!module){
        return null;
    }

    // 依据Module来构造一个节点
    const nodeData:LogicGraphNodesProp = {
        ID:0,
        Pos:{
            X:0,
            Y:0
        },
        guiProps:{
            IconSrc:'../imgs/alu.png',
            Title:module.Name,
            Type:module.Name
        },
        Ports:{
            InputPort:Array.from({ length: refModuleData?.Properties.Fixed.InputCount || module.Properties.Fixed.InputCount}, (_, i) => ({PortIndex:i})),
            OutputPort:Array.from({ length: refModuleData?.Properties.Fixed.OutputCount || module.Properties.Fixed.OutputCount }, (_, i) => ({PortIndex:i}))
        },
        BlockLength:refModuleData?.Properties.Fixed.BlockLength || module.Properties.Fixed.BlockLength,
        InputCount:refModuleData?.Properties.Fixed.InputCount || module.Properties.Fixed.InputCount,
        OutputCount:refModuleData?.Properties.Fixed.OutputCount || module.Properties.Fixed.OutputCount,
        ComponentType: refModuleData?.Properties.Fixed.ComponentType || module.Properties.Fixed.ComponentType,
        ComponentID: refModuleData?.Properties.Fixed.ComponentID || module.Properties.Fixed.ComponentID,
        ComponentSettings: refModuleData?.Properties.Local || module.Properties.Local || {}
    }

    return (
        <div
            onContextMenu={(e) => {e.preventDefault();}}
            className="w-[250px] h-[150px] flex flex-row bg-white  rounded-md shadow-md">
            <LogicGraphNodeInputPorts nodeData={ nodeData } ></LogicGraphNodeInputPorts>
            <div className="w-full h-full flex flex-col pb-3">{/*节点最上层容器*/}
                <div className="flex-initial basis-1/2 flex flex-row items-center pt-4 pl-6">{/*节点名称的容器*/}
                    <img className="w-[50px] h-[50px] bg-gray-100 p-2 mr-5 rounded-md shadow-md" src={ String(nodeData.guiProps.IconSrc) }></img>
                    <div className="flex flex-col items-center">
                        <h3 className="font-semibold">{nodeData?.guiProps.Title}</h3>
                        <h4 className="font-medium font-serif text-xs">{nodeData?.guiProps.Type}</h4>
                    </div>
                </div>
                <div className="flex-initial basis-1/2 flex flex-col bg-gray-200 mx-6 mt-4 px-4 rounded-md shadow-md overflow-auto">
                    {Object.entries(nodeData?.ComponentSettings || {}).map(([key,value])=> (
                         <div className="font-medium font-serif text-xs my-1" key={key}>{ModulesListAlias[key]+": "+value}</div>
                    ))}
                </div>
            </div>
            <LogicGraphNodeOutputPorts nodeData={nodeData}></LogicGraphNodeOutputPorts>
        </div>
    )
}

export function LogicGraphNode( { nodeID } ){
    const { Nodes,Actions } = useLogicGraph();

    // 查找节点数据
    const nodeData = Nodes.find(node => node.ID === nodeID);
    
    const windowData = {
        id: nodeData?.ID || 0,
        icon: '🧩',
        title: '逻辑图节点',
        isOpen: nodeData ? true : false,
        width: 250,
        height: 150,
        posX: nodeData?.Pos.X || 0,
        posY: nodeData?.Pos.Y || 0,
        onUpdateStatus: onUpdateStatus,
        onGUIDestroy: (id) => console.log('销毁窗口:', id)
    }

    const nodeGUI = {
        title:nodeData?.guiProps.Title || '未命名节点',
        iconSrc: nodeData?.guiProps.IconSrc || 'default-icon.png',
    }

    function onUpdateStatus(data: UpdateStatusInterface)
    {
        Actions.updateNode(nodeID,{
            Pos:{
                X:data.posX,
                Y:data.posY
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

    return (
        <div>
            <FloatWindowWithoutTitle WindowInitialData={windowData} onUpdateStatus={onUpdateStatus} isRelative={true}>
                <div
                    onContextMenu={(e) => {e.preventDefault();}} onMouseDown={DeleteNodeByMouseDown} 
                    className="w-full h-full flex flex-row absolute bg-white">
                    <LogicGraphNodeInputPorts nodeData={ nodeData } ></LogicGraphNodeInputPorts>
                    <div className="w-full h-full flex flex-col pb-3">{/*节点最上层容器*/}
                        <div className="flex-initial basis-1/2 flex flex-row items-center pt-4 pl-6">{/*节点名称的容器*/}
                            <img className="w-[50px] h-[50px] bg-gray-100 p-2 mr-5 rounded-md shadow-md" src={ String(nodeGUI.iconSrc) }></img>
                            <div className="flex flex-col items-center">
                                <h3 className="font-semibold">{nodeData?.guiProps.Title}</h3>
                                <h4 className="font-medium font-serif text-xs">{nodeData?.guiProps.Type}</h4>
                            </div>
                        </div>
                        <div className="flex-initial basis-1/2 flex flex-col bg-gray-200 mx-6 mt-4 px-4 rounded-md shadow-md overflow-auto">
                            {Object.entries(nodeData?.ComponentSettings || {}).map(([key,value])=> (
                                <div className="font-medium font-serif text-xs my-1" key={key}>{ModulesListAlias[key]+": "+value}</div>
                            ))}
                        </div>
                    </div>
                    <LogicGraphNodeOutputPorts nodeData={nodeData}></LogicGraphNodeOutputPorts>
                </div>
            </FloatWindowWithoutTitle>
        </div>
        
    )

}