import {menuItemsConfig} from '../Menu';
import { useModulesEditor } from '../ModulesEditor/ModulesEditorProvider';
import { useSimulation } from '../Simulation/SimulationProvider';
import { useWebController } from '../WebBridge/WebController';
import { useLogicGraph } from '../WorkSpace/LogicGraphProvider/LogicGraphProvider';
import { toolbarsConfig } from '././ToolBarSelection';
import { CollectiveContext, ToolBarController } from './Controller/ToolBarController';



// ## 工具栏组件 (Toolbar)
function Toolbar({ activeMenuId ,onStart }) {

    const currentToolbarItems = toolbarsConfig[activeMenuId] || [];
    const activeMenuLabel = menuItemsConfig.find(m => m.id === activeMenuId)?.label || activeMenuId;
    
    // 获取 ModulesEditor 上下文
    const ModulesEditorContext = useModulesEditor();
    const EditorModulesData = ModulesEditorContext.modulesData || [];
    const EditorActions = ModulesEditorContext.actions || {};

    // 获取 LogicGraph 上下文
    const LogicGraphContext = useLogicGraph();
    const LogicGraphNodes = LogicGraphContext.Nodes || [];
    const LogicGraphActions = LogicGraphContext.Actions || {};

    // 获取 WebController 上下文
    const WebControllerContext = useWebController();
    const WebControllerRPCReturnValue = WebControllerContext.rpcReturnValue;
    const WebControllerActions = WebControllerContext.Actions || {};

    // 获取 Simulation 上下文
    const SimulationContext = useSimulation();
    const SimulationActions = SimulationContext.Actions || {};   

    // 组装上下文对象，便于Controller访问
    const SharedContext:CollectiveContext = {
        ModulesEditor:ModulesEditorContext,
        LogicGraph:LogicGraphContext,
        WebController:WebControllerContext,
        Simulation:SimulationContext
    }

    function createTestWindow(){
        EditorActions.openEditorGUI(
            {
                windowId:0,
                windowMode:'ModulesBrouser',
                type:'Default',
                width:800,
                height:500
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
                                    onClick={()=>{
                                        //onStart();
                                        console.log('打开窗口');
                                        //createTestNode();
                                        ToolBarController(activeMenuId,item,SharedContext);
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