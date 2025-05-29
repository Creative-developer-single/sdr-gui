'use client';
// App.js
import React, { useState } from 'react';
import './src/css/index.css'; // 确保引入了 Tailwind CSS
import MenuBar from './src/modules/Menu';
import Toolbar from './src/modules/ToolBar/ToolBar';
import Sidebar from './src/modules/SideBar';
import FloatWindow from './src/modules/FloatWindow/FloatWindow';
import { FloatWindowPropInterface,UpdateStatusInterface } from './src/modules/FloatWindow/FloatWindowPropInterface';
import { title } from 'process';
import ModuleBrouserEditor from './src/modules/ModulesEditor/ModuleEditorGUI';
import { ModulesEditorProvider } from './src/modules/ModulesEditor/ModulesEditorProvider';
import { LogicGraphNode } from './src/modules/WorkSpace/LogicGraphEditor/LogicGraphNode/LogicGraphNode';
import { LogicGraphProvider } from './src/modules/WorkSpace/LogicGraphProvider/LogicGraphProvider';
import { LogicGraphNodeTest } from './src/modules/WorkSpace/LogicGraphEditor/LogicGraphNode/LogicGraphNodeTest';
import { LogicGraphGUI } from './src/modules/WorkSpace/LogicGraphEditor/LogicGraphEditorGUI';
import BezierAutoTest from './src/modules/WorkSpace/LogicGraphEditor/LogicGraphEdge/BezierAutoTest';

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
            <LogicGraphProvider>
                <MenuBar activeItem={activeMenuId} onItemClick={handleMenuItemClick} />
                <ModulesEditorProvider>
                    <Toolbar onStart={onStart} activeMenuId={activeMenuId} />
                    <ModuleBrouserEditor></ModuleBrouserEditor>
                </ModulesEditorProvider>
                <div className="flex flex-grow overflow-hidden">
                    <Sidebar />
                    <LogicGraphGUI></LogicGraphGUI>
                </div>
                
            </LogicGraphProvider>
            
        </div>
    );
}


export default App;