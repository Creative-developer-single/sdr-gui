import {menuItemsConfig} from './Menu';
import { useModulesEditor } from './ModulesEditor/ModulesEditorProvider';
import { useLogicGraph } from './WorkSpace/LogicGraphProvider/LogicGraphProvider';


const toolbarsConfig = {
    file: [
        {
            item:[
                { id: 'newProject', label: '新建工程', iconSrc: '../imgs/createProject.png', action: () => console.log('新建工程 Clicked') },
                { id: 'openProject', label: '打开工程', iconSrc: '../imgs/openProject.png', action: () => console.log('打开工程 Clicked') },
                { id: 'saveProject', label: '保存工程', iconSrc: '../imgs/quickSave.png', action: () => console.log('保存工程 Clicked') },
            ],
            id:'fileManagement',
            label:'工程管理',
        }

    ],
    start: [
        {
            item:[
                {id: 'quickSave',label: '快速保存', iconSrc: '../imgs/quickSave.png', action: () => console.log('快速保存 Clicked')},
            ],
            id:'quickTools',
            label:'快捷工具',
        },
        {
            item:[
                { id: 'analogMode', label: '模拟模式', iconSrc: '../imgs/analogMode.png', action: () => console.log('模拟模式 Clicked') },
                { id: 'digitalMode', label: '数字模式', iconSrc: '../imgs/digitalMode.png', action: () => console.log('数字模式 Clicked') },
            ],
            id:'workMode',
            label:'工作模式',
        },
        {
            item:[
                { id: 'validateFlow', label: '验证流图', iconSrc: '../imgs/verify.png', action: () => console.log('验证流图 Clicked') },
                { id: 'startSim', label: '开始仿真', iconSrc: '../imgs/runSimulation.png', action: () => console.log('开始仿真 Clicked') },
            ],
            id:'simulation',
            label:'仿真',
        },
        {
            item:[
                { id: 'connectDevice', label: '连接设备', iconSrc: '../imgs/connectDevice.png', action: () => console.log('检测硬件 Clicked') },
                { id: 'deployDevice', label: '部署', iconSrc: '../imgs/deployDevice.png', action: () => console.log('硬件配置 Clicked') },
            ],
            id:'hardwareManagement',
            label:'硬件管理',
        },
        {
            item:[
                { id:'AIAssistant', label: 'AI助手', iconSrc: '../imgs/aiFinish.png', action: () => console.log('AI助手 Clicked') },
            ],
            id:'AI',
            label:'AI智能体',
        }
    ],
    modules: [
        {
            item:[
                { id: 'sendSource', label:'发射源',iconSrc:'../imgs/sendSource.png',action: ()=> console.log('发射源 Clicked') },
                { id: 'receiveSource', label:'接收源',iconSrc:'../imgs/receiveSource.png',action: ()=> console.log('接收源 Clicked') },
            ],
            id:'source',
            label:'源'
        },
        {
            item:[
                { id: 'basicALU', label:'基础运算',iconSrc:'../imgs/alu.png',action: ()=> console.log('基础运算器 Clicked') },
                { id: 'calculus', label:'微积分',iconSrc:'../imgs/calculus.png',action: ()=> console.log('基础运算器 Clicked') },
                { id: 'nonLinear', label:'非线性',iconSrc:'../imgs/nonLinear.png',action: ()=> console.log('基础运算器 Clicked') },
            ],
            id:'Calculator',
            label:'计算器'
        },
        {
            item:[
                { id: 'freqTrans', label:'频率变换',iconSrc:'../imgs/freqTrans.png',action: ()=> console.log('基础运算器 Clicked') },
                { id: 'pll', label:'反馈环路',iconSrc:'../imgs/pll.png',action: ()=> console.log('基础运算器 Clicked') },
                { id: 'more', label:'更多',iconSrc:'../imgs/more.png',action: ()=> console.log('基础运算器 Clicked') },
            ],
            id:'RF',
            label:'射频'
        },
        {
            item:[
                { id: 'modulator', label:'调制器',iconSrc:'../imgs/modulator.png',action: ()=> console.log('基础运算器 Clicked') },
                { id: 'demodulator', label:'解调器',iconSrc:'../imgs/deModulator.png',action: ()=> console.log('基础运算器 Clicked') },
            ],
            id:'modulator',
            label:'调制解调'
        },
        {
            item:[
                { id: 'more', label:'浏览全部',iconSrc:'../imgs/more.png',action: ()=> console.log('基础运算器 Clicked') },
            ],
            id:'more',
            label:'其他'
        }
    ],
    simulate: [
        {
            item:[ 
                { id: 'analogMode', label:'模拟模式',iconSrc:'../imgs/analogMode.png',action: ()=> console.log('基础运算器 Clicked') },
                { id: 'digitalMode', label:'数字模式',iconSrc:'../imgs/digitalMode.png',action: ()=> console.log('基础运算器 Clicked') },
            ],
            id:'simulationMode',
            label:'仿真模式'
        },
        {
            item:[
                { id: 'verifyGraph', label:'验证流图',iconSrc:'../imgs/verify.png',action: ()=> console.log('基础运算器 Clicked') },
                { id: 'runSimulation', label:'开始仿真',iconSrc:'../imgs/runSimulation.png',action: ()=> console.log('基础运算器 Clicked') },
            ],
            id:'simulation',
            label:'仿真'
        },
        {
            item:[
                { id: 'generateReport', label:'生成报告',iconSrc:'../imgs/generateReport.png',action: ()=> console.log('基础运算器 Clicked') },
                { id: 'exportData', label:'导出数据',iconSrc:'../imgs/exportData.png',action: ()=> console.log('基础运算器 Clicked') },
            ],
            id:'dataGenerate',
            label:'数据生成'
        }
        
    ],
    hardware: [
        {
            item:[
                { id: 'connectDevice', label: '连接设备', iconSrc: '../imgs/connectDevice.png', action: () => console.log('检测硬件 Clicked') },
                { id: 'deployDevice', label: '部署设备', iconSrc: '../imgs/deployDevice.png', action: () => console.log('检测硬件 Clicked') },
            ],
            id:'lifeCycle',
            label:'生命周期'
        },
        {
            item:[
                { id: 'restartDevice', label: '重新启动', iconSrc: '../imgs/restartDevice.png', action: () => console.log('检测硬件 Clicked') },
                { id: 'runDevice', label: '启动设备', iconSrc: '../imgs/runDevice.png', action: () => console.log('检测硬件 Clicked') },
            ],
            id:'onlineControl',
            label:'在线控制'
        }
    ],
    aiAssiant:[
        {
            item:[
                { id: 'aiCorrect', label: 'AI纠错', iconSrc: '../imgs/aiCorrect.png', action: () => console.log('检测硬件 Clicked') },
                { id: 'aiFinish', label: 'AI补全', iconSrc: '../imgs/aiFinish.png', action: () => console.log('检测硬件 Clicked') },
                { id: 'aiAssiant', label: '综合助手', iconSrc: '../imgs/deepseek.png', action: () => console.log('检测硬件 Clicked') },
            ],
            id:'aiAssitant',
            label:'智能体'
        }
    ],
    help: [
        {
            item:[
                { id: 'help', label: '帮助', iconSrc: '../imgs/help.png', action: () => console.log('检测硬件 Clicked') },
            ],
            id:'helpCenter',
            label:'帮助中心'
        }
    ],
};

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
                                        createTestNode();
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

    /*
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
    );*/
}

export default Toolbar;