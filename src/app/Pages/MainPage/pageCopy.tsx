// App.js
import React, { useState } from 'react';
import './src/css/index.css'; // 确保引入了 Tailwind CSS

// --- 数据配置 (与原版JS相同) ---
const menuItemsConfig = [
    { id: 'file', label: '文件' },
    { id: 'start', label: '开始' },
    { id: 'build', label: '建设' },
    { id: 'simulate', label: '仿真' },
    { id: 'hardware', label: '硬件' },
    { id: 'help', label: '帮助' },
];

const toolbarsConfig = {
    file: [
        { id: 'newProject', label: '新建工程', icon: '➕', action: () => console.log('新建工程 Clicked') },
        { id: 'openProject', label: '打开工程', icon: '📂', action: () => console.log('打开工程 Clicked') },
        { id: 'saveProject', label: '保存工程', icon: '💾', action: () => console.log('保存工程 Clicked') },
    ],
    start: [
        { id: 'analogMode', label: '模拟模式', icon: '〰️', action: () => console.log('模拟模式 Clicked') },
        { id: 'digitalMode', label: '数字模式', icon: '🔢', action: () => console.log('数字模式 Clicked') },
        { id: 'validateFlow', label: '验证流图', icon: '✔️', action: () => console.log('验证流图 Clicked') },
        { id: 'startSim', label: '开始仿真', icon: '▶️', action: () => console.log('开始仿真 Clicked') },
        { id: 'genReport', label: '生成报告', icon: '📄', action: () => console.log('生成报告 Clicked') },
        { id: 'exportData', label: '导出数据', icon: '📤', action: () => console.log('导出数据 Clicked') },
    ],
    build: [
        { id: 'addBlock', label: '添加模块', icon: '🧱', action: () => console.log('添加模块 Clicked') },
        { id: 'connectBlocks', label: '连接模块', icon: '🔗', action: () => console.log('连接模块 Clicked') },
    ],
    simulate: [
        { id: 'runSim', label: '运行仿真', icon: '🚀', action: () => console.log('运行仿真 Clicked') },
        { id: 'stopSim', label: '停止仿真', icon: '🛑', action: () => console.log('停止仿真 Clicked') },
        { id: 'simSettings', label: '仿真设置', icon: '⚙️', action: () => console.log('仿真设置 Clicked') },
    ],
    hardware: [
        { id: 'detectHw', label: '检测硬件', icon: '📡', action: () => console.log('检测硬件 Clicked') },
        { id: 'hwConfig', label: '硬件配置', icon: '🛠️', action: () => console.log('硬件配置 Clicked') },
    ],
    help: [
        { id: 'viewHelp', label: '查看帮助', icon: '❓', action: () => console.log('查看帮助 Clicked') },
        { id: 'aboutApp', label: '关于应用', icon: 'ℹ️', action: () => console.log('关于应用 Clicked') },
    ],
};

// --- CSS 样式 (可以放在 index.css 或 App.css) ---
/*
body {
    font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    overscroll-behavior: none;
}
.toolbar-icon-text {
    font-size: 24px;
    line-height: 1;
    margin-bottom: 2px;
}
.sidebar-icon {
    margin-right: 8px;
    display: inline-block;
    width: 16px;
    text-align: center;
}
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}
::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
}
*/

// --- React 组件 ---

// ## 菜单栏组件 (MenuBar)
function MenuBar({ items, activeItem, onItemClick }) {
    return (
        <nav className="bg-gray-200 px-2 py-1 border-b border-gray-300 shadow-sm flex-shrink-0">
            <ul className="flex space-x-1">
                {items.map(item => (
                    <li
                        key={item.id}
                        className={`px-3 py-1 text-xs cursor-pointer rounded-sm hover:bg-gray-300 ${
                            item.id === activeItem ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'
                        }`}
                        onClick={() => onItemClick(item.id, item.label)}
                    >
                        {item.label}
                    </li>
                ))}
            </ul>
        </nav>
    );
}

// ## 工具栏组件 (Toolbar)
function Toolbar({ config, activeMenuId, menuItems }) {
    const currentToolbarItems = config[activeMenuId] || [];
    const activeMenuLabel = menuItems.find(m => m.id === activeMenuId)?.label || activeMenuId;

    return (
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 shadow-sm flex items-center space-x-2 flex-wrap flex-shrink-0 min-h-[60px]">
            {currentToolbarItems.length === 0 ? (
                <p className="text-xs text-gray-500 italic">
                    “{activeMenuLabel}”菜单下暂无工具项。
                </p>
            ) : (
                currentToolbarItems.map(item => (
                    <button
                        key={item.id}
                        className="flex flex-col items-center justify-center p-1.5 rounded-md hover:bg-gray-200 active:bg-gray-300 min-w-[70px]"
                        title={item.label}
                        onClick={item.action}
                    >
                        <span className="toolbar-icon-text text-gray-600">{item.icon}</span>
                        <span className="text-xs text-gray-700 mt-0.5">{item.label}</span>
                    </button>
                ))
            )}
        </div>
    );
}

// ## 侧边栏组件 (Sidebar)
function Sidebar() {
    return (
        <aside className="w-60 bg-gray-50 border-r border-gray-300 p-3 space-y-3 flex-shrink-0 overflow-y-auto">
            <h2 className="text-sm font-semibold text-gray-700 border-b pb-1 mb-2">工程概览</h2>
            <ul className="text-xs space-y-1 text-gray-600">
                <li>
                    <span className="sidebar-icon">📁</span> 项目 Alpha
                    <ul className="pl-4 mt-1 space-y-0.5">
                        <li><span className="sidebar-icon">📄</span> 信号流图_1.sfg</li>
                        <li><span className="sidebar-icon">📄</span> 信号流图_2.sfg</li>
                    </ul>
                </li>
                <li className="mt-1">
                    <span className="sidebar-icon">📁</span> 项目 Beta
                    <ul className="pl-4 mt-1 space-y-0.5">
                        <li><span className="sidebar-icon">📄</span> 系统配置.json</li>
                    </ul>
                </li>
                <li className="mt-1"><span className="sidebar-icon">⚙️</span> 全局设置</li>
            </ul>
            <div className="pt-2 mt-2 border-t text-xs text-gray-500">
                <p>此侧边栏用于项目文件和视图导航。</p>
            </div>
        </aside>
    );
}

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
    


    return (
        <div className="bg-gray-100 h-screen flex flex-col overflow-hidden">
            <MenuBar items={menuItemsConfig} activeItem={activeMenuId} onItemClick={handleMenuItemClick} />
            <Toolbar config={toolbarsConfig} activeMenuId={activeMenuId} menuItems={menuItemsConfig} />
            <div className="flex flex-grow overflow-hidden">
                <Sidebar />
                <Workspace />
            </div>
        </div>
    );
}

export default App;