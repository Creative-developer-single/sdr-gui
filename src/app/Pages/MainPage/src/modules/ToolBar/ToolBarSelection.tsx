export const toolbarsConfig = {
    file: [
        {
            item:[
                { id: 'NewProject', label: '新建工程', iconSrc: '../imgs/createProject.png', action: () => console.log('新建工程 Clicked') },
                { id: 'OpenProject', label: '打开工程', iconSrc: '../imgs/openProject.png', action: () => console.log('打开工程 Clicked') },
                { id: 'SaveProject', label: '保存工程', iconSrc: '../imgs/quickSave.png', action: () => console.log('保存工程 Clicked') },
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
                { id: 'SendSource', label:'发射源',iconSrc:'../imgs/sendSource.png',action: ()=> console.log('发射源 Clicked') },
                { id: 'ReceiveSource', label:'接收源',iconSrc:'../imgs/receiveSource.png',action: ()=> console.log('接收源 Clicked') },
            ],
            id:'source',
            label:'源',
            type: 'source'
        },
        {
            item:[
                { id: 'BasicALU', label:'基础运算',iconSrc:'../imgs/alu.png',action: ()=> console.log('基础运算器 Clicked') },
                { id: 'Calculus', label:'微积分',iconSrc:'../imgs/calculus.png',action: ()=> console.log('基础运算器 Clicked') },
                { id: 'NonLinear', label:'非线性',iconSrc:'../imgs/nonLinear.png',action: ()=> console.log('基础运算器 Clicked') },
            ],
            id:'Calculator',
            label:'计算器',
            type:'Arithmetic'
        },
        {
            item:[
                { id: 'freqTrans', label:'频率变换',iconSrc:'../imgs/freqTrans.png',action: ()=> console.log('基础运算器 Clicked') },
                { id: 'pll', label:'反馈环路',iconSrc:'../imgs/pll.png',action: ()=> console.log('基础运算器 Clicked') },
                { id: 'more', label:'更多',iconSrc:'../imgs/more.png',action: ()=> console.log('基础运算器 Clicked') },
            ],
            id:'RF',
            label:'射频',
            type:'RF'
        },
        {
            item:[
                { id: 'modulator', label:'调制器',iconSrc:'../imgs/modulator.png',action: ()=> console.log('基础运算器 Clicked') },
                { id: 'demodulator', label:'解调器',iconSrc:'../imgs/deModulator.png',action: ()=> console.log('基础运算器 Clicked') },
            ],
            id:'modulator',
            label:'调制解调',
            type:'Modulation'
        },
        {
            item:[
                { id: 'more', label:'浏览全部',iconSrc:'../imgs/more.png',action: ()=> console.log('基础运算器 Clicked') },
            ],
            id:'more',
            label:'其他',
            type:'More'
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