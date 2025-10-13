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
import { LLMAssistantProvider } from './src/modules/LLM/Provider/LLMAssistantProvider';
import { LLMAssistantGUI } from './src/modules/LLM/GUI/LLMAssistantGUI';
import MainControllerProvider from './src/modules/MainController/MainControllerProvider';

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

const currentMode = "Debug";

// ## 主应用组件 (App)
function App() {
    const [activeMenuId, setActiveMenuId] = useState('start'); // 默认激活 'start' 菜单

    console.log("界面被刷新了，当前激活的菜单ID:", activeMenuId);

    const handleMenuItemClick = (id, label) => {
        setActiveMenuId(id);
        console.log(`菜单 "${label}" 已激活`);
    };

    // ws://localhost:9000/
    // ws://192.168.137.54:9000/
    const defaultURL = "ws://localhost:9000/"; // 默认WebSocket URL
    const testURL = "ws://172.21.233.19:9000/"; // 测试WebSocket URL

    return (
        <div className="bg-gray-100 h-screen flex flex-col overflow-hidden">
            <WebSocketProvider url={currentMode === "Debug" ? testURL : defaultURL}>
                <WebControllerProvider>
                    <SimulationProvider>
                        <LogicGraphProvider>
                            <ModulesEditorProvider>
                                <ViewModuleProvider>
                                    <DataSyncProvider>
                                        <ProjectManagerProvider>
                                                <LLMAssistantProvider>
                                                <MainControllerProvider>
                                                <MenuBar activeItem={activeMenuId} onItemClick={handleMenuItemClick} />
                                                <Toolbar activeMenuId={activeMenuId} />
                                                <ModuleBrouserEditor></ModuleBrouserEditor>
                                                <ModulesEditor></ModulesEditor>
                                                <SimulationSettingsGUI></SimulationSettingsGUI>
                                                <SimulationStatusBar></SimulationStatusBar>
                                                <LLMAssistantGUI></LLMAssistantGUI>
                                            <div className="flex flex-grow overflow-hidden">
                                                <Sidebar />
                                                <LogicGraphGUI></LogicGraphGUI>
                                                <ViewModulesGUI></ViewModulesGUI>
                                                {/*<TestConstellationV2></TestConstellationV2>*/}
                                            </div>
                                            </MainControllerProvider>
                                            </LLMAssistantProvider>
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