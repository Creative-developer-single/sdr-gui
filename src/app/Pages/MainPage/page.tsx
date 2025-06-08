'use client';
// App.js
import React, { useState } from 'react';
import './src/css/index.css'; // 确保引入了 Tailwind CSS
import MenuBar from './src/modules/Menu';
import Toolbar from './src/modules/ToolBar/ToolBar';
import Sidebar from './src/modules/SideBar';
import { UpdateStatusInterface } from './src/modules/FloatWindow/FloatWindowPropInterface';
import ModuleBrouserEditor, { ModulesEditor } from './src/modules/ModulesEditor/ModuleEditorGUI';
import { ModulesEditorProvider } from './src/modules/ModulesEditor/ModulesEditorProvider';
import { LogicGraphProvider } from './src/modules/WorkSpace/LogicGraphProvider/LogicGraphProvider';
import { LogicGraphGUI } from './src/modules/WorkSpace/LogicGraphEditor/LogicGraphEditorGUI';
import { WebSocketProvider } from './src/modules/WebBridge/WebSocket/WebSocketProvider';
import { WebControllerProvider } from './src/modules/WebBridge/WebController/WebController';
import TestConstellation from './src/modules/ViewModules/Test/ScatteringTest';
import TestConstellationV2 from './src/modules/ViewModules/Test/ConstellationTest';
import { SimulationProvider } from './src/modules/Simulation/SimulationProvider';
import { SimulationSettingsGUI } from './src/modules/Simulation/GUI/SimulationSettingsGUI';
import SimulationStatusBar from './src/modules/Simulation/GUI/SimulationStatusBar';
import { ViewModuleProvider } from './src/modules/ViewModules/Provider/ViewModuleProvider';
import { DataSyncProvider } from './src/modules/DataSync/Provider/DataSyncProvider';
import { ViewModulesGUI } from './src/modules/ViewModules/GUI/ViewModulesGUI';
import { ProjectManagerProvider } from './src/modules/WorkSpace/ProjectManager/Provider/ProjectManagerProvider';

// ## 工作区组件 (Workspace)
function Workspace() {
    return (
        <main className="flex-grow p-4 bg-white overflow-auto">
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                <p className="text-gray-400 text-lg">主工作区 (信号流图编辑器)</p>
            </div>
        </main>
    );
}


// ## 主应用组件 (App)
function App() {
    const [activeMenuId, setActiveMenuId] = useState('start'); // 默认激活 'start' 菜单

    const handleMenuItemClick = (id, label) => {
        setActiveMenuId(id);
        console.log(`菜单 "${label}" 已激活`);
    };

    // 将自定义字体和滚动条样式添加到<head>
    // 在 React 中，通常这些全局样式会放在 index.css 或通过 Helmet 等库管理 <head>
    // 这里为了简单起见，使用 useEffect 一次性添加 <style> 标签
    
    function onUpdateStatus(data: UpdateStatusInterface) {
        setUpdateStatusData((prevState) => {
            return { ...prevState, ...data };
        });
    }

    const [isOpen, setIsOpen] = useState(false);
    const [floatWindowUpdateStatusData, setUpdateStatusData] = useState({
        id:0,
        icon:'😊',
        title:'测试窗口',
        isOpen: false,
        width: 400,
        height: 300,
        posX: 200,
        posY: 200,
        onUpdateStatus: onUpdateStatus,
        onDestroy: onClose,
    });

    function onStart(){
        setUpdateStatusData((prevState) => {
            return { ...prevState, isOpen: true };
        });
    }

    function onClose(){
        setIsOpen(false);
    }

    return (
        <div className="bg-gray-100 h-screen flex flex-col overflow-hidden">
            <WebSocketProvider url={"ws://172.27.234.221:9000/"}>
                <WebControllerProvider>
                    <SimulationProvider>
                        <LogicGraphProvider>
                            <ModulesEditorProvider>
                                <ViewModuleProvider>
                                    <DataSyncProvider>
                                        <ProjectManagerProvider>
                                        <MenuBar activeItem={activeMenuId} onItemClick={handleMenuItemClick} />
                                            <Toolbar onStart={onStart} activeMenuId={activeMenuId} />
                                            <ModuleBrouserEditor></ModuleBrouserEditor>
                                            <ModulesEditor></ModulesEditor>
                                            <SimulationSettingsGUI></SimulationSettingsGUI>
                                            <SimulationStatusBar></SimulationStatusBar>
                                        <div className="flex flex-grow overflow-hidden">
                                            <Sidebar />
                                            <LogicGraphGUI></LogicGraphGUI>
                                            <ViewModulesGUI></ViewModulesGUI>
                                            {/*<TestConstellationV2></TestConstellationV2>*/}
                                        </div>
                                        </ProjectManagerProvider>
                                    </DataSyncProvider>
                                </ViewModuleProvider>
                            </ModulesEditorProvider>
                        </LogicGraphProvider>
                    </SimulationProvider>
                </WebControllerProvider>
            </WebSocketProvider>
            
        </div>
    );
}


export default App;