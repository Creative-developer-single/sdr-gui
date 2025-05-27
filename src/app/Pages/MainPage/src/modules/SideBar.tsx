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

export default Sidebar;