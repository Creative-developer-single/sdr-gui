
export const menuItemsConfig = [
    { id: 'file', label: '文件' },
    { id: 'start', label: '开始' },
    { id: 'modules', label: '模块' },
    { id: 'simulate', label: '仿真' },
    { id: 'hardware', label: '硬件' },
    { id: 'help', label: '帮助' },
];

// ## 菜单栏组件 (MenuBar)
function MenuBar({ activeItem, onItemClick }) {
    return (
        <nav className="bg-gray-200 px-2 py-1 border-b border-gray-300 shadow-sm flex-shrink-0">
            <ul className="flex space-x-1">
                {menuItemsConfig.map(item => (
                    <li
                        key={item.id}
                        className={`px-3 py-1 text-xs cursor-pointer rounded-none hover:bg-gray-300 ${
                            item.id === activeItem ? 'bg-blue-500 text-white hover:bg-blue-500' : 'text-gray-700'
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

export default MenuBar;