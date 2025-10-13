import FloatWindow from "../FloatWindow/FloatWindow";
import { useModulesEditor } from "./ModulesEditorProvider";
import { ModulesData, ModulesEditorActions } from "./ModulesEditorProviderInterface";
import {UpdateStatusInterface } from "../FloatWindow/FloatWindowPropInterface";
import ModuleEditorGUIMain from "./ModuleEditorGUIMain";
import SelectedModuleEditorGUIMain from "./SelectedModuleEditorGUI";

function ModuleBrouserEditor(){
    const { modulesData, actions } = useModulesEditor();
    const windows = modulesData.filter(window => window.GuiProps.mode === 'ModulesBrouser');
    //console.log("window:", modulesData);
   
    return (
        <div>
            {windows.map((window) => (
                <ModuleBrouserEditorItem key={window.GuiProps.id} item={window} actions={actions}/>
            ))
            }
        </div>
   )
}

export function ModulesEditor(){
    const { modulesData, actions } = useModulesEditor();
    const windows = modulesData.filter(window => window.GuiProps.mode === 'ModulesEditor');
    //console.log("window:", modulesData);

    return (
        <div>
            {windows.map((window) => (
                <ModulesEditorItem key={window.GuiProps.id} item={window} actions={actions}/>
            ))
            }
        </div>
    )
}

function ModulesEditorItem( { item, actions } : { item: ModulesData, actions: ModulesEditorActions }) {
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
        icon: '🚀',
        id:item.GuiProps.id,
        title:'模块浏览器',
        isOpen:item.GuiProps.isOpen,
        posX:item.GuiProps.posX,
        posY:item.GuiProps.posY,
        width:item.GuiProps.width,
        height:item.GuiProps.height,
        onUpdateStatus: onUpdateStatus,
        onGUIDestroy: onGUIDestroy,
    }

    return (
        <FloatWindow data={windowData}>
            <SelectedModuleEditorGUIMain windowId={windowData.id}></SelectedModuleEditorGUIMain>
        </FloatWindow>
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
        icon:'🚀',
        id:item.GuiProps.id,
        title:'模块浏览器',
        isOpen:item.GuiProps.isOpen,
        posX:item.GuiProps.posX,
        posY:item.GuiProps.posY,
        width:item.GuiProps.width,
        height:item.GuiProps.height,
        onUpdateStatus: onUpdateStatus,
        onGUIDestroy: onGUIDestroy,
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