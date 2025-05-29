import { use, useEffect, useState } from "react";
import { FloatWindowPropInterface, UpdateStatusInterface } from "../../../FloatWindow/FloatWindowPropInterface";
import { LogicGraphNodesProp } from "../../LogicGraphProvider/LogicGraphProviderInterface";
import { useLogicGraph } from "../../LogicGraphProvider/LogicGraphProvider";
import { FloatWindowWithoutTitle } from "../../../FloatWindow/FloatWindowWithoutTitle";
import { ModulesListAlias } from "../../../ModulesLib/ModulesList";
import { LogicGraphNodeInputPorts, LogicGraphNodeOutputPorts } from "./LogicGraphNodePorts";

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
                            {Object.entries(nodeData?.ComponentSetting || {}).map(([key,value])=> (
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