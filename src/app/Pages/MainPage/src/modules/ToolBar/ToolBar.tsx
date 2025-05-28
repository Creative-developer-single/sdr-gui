import {menuItemsConfig} from '../Menu';
import { useModulesEditor } from '../ModulesEditor/ModulesEditorProvider';
import { useLogicGraph } from '../WorkSpace/LogicGraphProvider/LogicGraphProvider';
import { toolbarsConfig } from '././ToolBarSelection';
import { ToolBarController } from './ToolBarController';



function ToolBar ({activeMenuId}){
    return (
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 shadow-sm flex items-center space-x-2 flex-wrap flex-shrink-0 min-h-[60px]">
            <span className="toolbar-icon-text text-gray-600">{}</span>
        </div>
    )
}


// ## 工具栏组件 (Toolbar)
function Toolbar({ activeMenuId ,onStart }) {

    const currentToolbarItems = toolbarsConfig[activeMenuId] || [];
    const activeMenuLabel = menuItemsConfig.find(m => m.id === activeMenuId)?.label || activeMenuId;
    
    const { modulesData,actions } = useModulesEditor();
    const { Nodes,Actions} = useLogicGraph();

    function createTestWindow(){
        actions.openEditorGUI(
            {
                windowId:0,
                windowMode:'ModulesBrouser',
                type:'Default',
                width:800,
                height:500
            }
        )
    }

    function createTestNode(){
        Actions.addNode(
            {
                ID: Math.max(...Nodes.map(n => n.ID)) + 1,
                Pos: { X: 100, Y: 100 },
                BlockLength: 100,
                InputCount:1,
                OutputCount:1,
                guiProps: {
                    IconSrc: '/imgs/alu.png',
                    Title: '测试节点',
                    Type:'测试类型',
                },
                ComponentSetting:{
                    mode:'default',
                    trigger:'false',
                    frequency:1000,
                    phase:0
                },
                ComponentType: 'default.defaultModule',
            }
        )


    }

    function ToolBarItem( { item } ){
        
        return (
            <div className='flex flex-col bg-gray-100 border-b border-gray-300 min-h-[60px]'>
                <div className='flex flex-row items-center bg-gray-100'>
                    {
                        item.item.length === 0 ? (
                            <p className="text-xs text-gray-500 italic">
                                “{activeMenuLabel}”菜单下暂无工具项。
                            </p>
                        ) : (
                            item.item.map(item => (
                                <button
                                    key={item.id}
                                    className='flex flex-col items-center justify-center px-2 rounded-md hover:bg-gray-200 active:bg-gray-300 min-w-[70px]'
                                    title={item.label}
                                    onClick={()=>{item.action;
                                        //onStart();
                                        console.log('打开窗口');
                                        //createTestWindow();
                                        ToolBarController(activeMenuId,item,actions);
                                    }}
                                >
                                    <img src={item.iconSrc} width='40px' height='40px' className='align-middle w-5px h-5px'></img>
                                    <label className='text-black text-xs mt-1'>{item.label}</label>
                                </button>
                            ))
                        )
                    }
                </div>
                <div className='text-gray-300 text-xs text-center'>{item.label}</div>
            </div>
        )
    }

    return (
        <div className='bg-gray-100 px-3 py-2 border-b border-gray-300 shadow-sm flex flex-row items-center min-h-[60px]'>
            {
                currentToolbarItems.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">
                        “{activeMenuLabel}”菜单下暂无工具项。
                    </p>
                ) : (
                    currentToolbarItems.map(item =>(
                        <ToolBarItem key={item.id} item={item}></ToolBarItem>
                    ))
                )
            }
        </div>
    )

}

export default Toolbar;