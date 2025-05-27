import { useEffect, useState } from "react";
import FloatWindow from "../FloatWindow/FloatWindow";
import { useModulesEditor } from "./ModulesEditorProvider";
import { ModulesData, ModulesEditorActions, ModulesEditorProviderInterface } from "./ModulesEditorProviderInterface";
import { FloatWindowPropInterface, UpdateStatusInterface } from "../FloatWindow/FloatWindowPropInterface";
import ModuleEditorGUIMain from "./ModuleEditorGUIMain";

function ModuleBrouserEditor(){
    const { modulesData, actions } = useModulesEditor();
    const windows = modulesData.filter(window => window.guiProps.mode === 'ModulesBrouser');
    console.log("window:", modulesData);
   
    return (
        <div>
            {windows.map((window) => (
                <ModuleBrouserEditorItem key={window.guiProps.id} item={window} actions={actions}/>
            ))
            }
        </div>
   )
}

function ModuleBrouserEditorItem( { item,actions } : { item:ModulesData , actions:ModulesEditorActions}){

    // 处理窗口状态更新
    function onUpdateStatus(data: UpdateStatusInterface) {
        console.log('窗口状态更新：', data);
        actions.updateGUIStatus(data);
    }

    function onGUIDestroy(windowId: number) {
        console.log('窗口销毁：', windowId);
        actions.removeGUI(windowId);
    }

    const windowData = {
        icon:'😊',
        id:item.guiProps.id,
        title:'模块浏览器',
        isOpen:item.guiProps.isOpen,
        posX:item.guiProps.posX,
        posY:item.guiProps.posY,
        width:item.guiProps.width,
        height:item.guiProps.height,
        onUpdateStatus: onUpdateStatus,
        onGUIDestroy: onGUIDestroy,
    }

    // 打开窗口
    function onStart(){
        let windowDataNew = windowData;
        windowDataNew.isOpen = true;
        onUpdateStatus(windowDataNew);
    }

    // 关闭窗口
    function onClose(){
        let windowDataNew = windowData;
        windowDataNew.isOpen = false;
        console.log('窗口关闭：', windowData);
        onUpdateStatus(windowData);
    }

    /*
    return (
        <FloatWindow data={windowData}>
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-bold">{windowData.title}</h2>
                <p>这是一个模块浏览器窗口。</p>
                <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">关闭</button>
            </div>
        </FloatWindow>
    );*/

    return (
        <FloatWindow data={windowData}>
            <ModuleEditorGUIMain windowId={windowData.id}></ModuleEditorGUIMain>
        </FloatWindow>
    )
}

export default ModuleBrouserEditor;