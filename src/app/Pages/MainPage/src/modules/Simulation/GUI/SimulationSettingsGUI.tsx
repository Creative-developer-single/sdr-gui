import FloatWindow from "../../FloatWindow/FloatWindow";
import { FloatWindowProp, FloatWindowPropInterface } from "../../FloatWindow/FloatWindowPropInterface";
import { useWebController } from "../../WebBridge/WebController/WebController";
import { useWebSocket } from "../../WebBridge/WebSocket/WebSocketProvider";
import { useLogicGraph } from "../../WorkSpace/LogicGraphProvider/LogicGraphProvider";
import { SimulationBasicSettingsListAlias } from "../SettingsDict/SimulationBasicSettingsList";
import { SimulationGUIProps, SimulationProps } from "../SimulationInterface";
import { useSimulation } from "../SimulationProvider";

export function SimulationSettingsGUI(){
    // 获取仿真Context
    const simulationContext = useSimulation();

    // 获取节点Context
    const LogicGraphContext = useLogicGraph();

    return (
        simulationContext.SimulationGUIProps.map((item)=>{
            if (item.Mode === 'Simulation') {
                return <SimulationSettingsGUIMain key={item.Id} window={item} />
            }
            return null;
        })
    )
}

export function SimulationSettingsGUIMain( { window } : {
    window: SimulationGUIProps | null;
} ){
    // 获取仿真Context
    const simulationContext = useSimulation();

    // 获取WebControllerContext
    const webController = useWebController();

    // 获取WebSocketContext
    const WebSocketContext = useWebSocket();

    // 获取LogicGraphContext
    const LogicGraphContext = useLogicGraph();

    if (!window) {
        console.warn("SimulationSettingsGUIMain: window is null or undefined");
        return null; // 或者返回一个默认的占位符组件
    }

    // 创建窗口固有属性
    // 声明窗口更新函数
    const onUpdateStatus = (data:FloatWindowProp) => {
        const status:SimulationGUIProps = {
            Id: data.id,
            IsOpen: data.isOpen,
            Mode: 'Simulation',
            Pos: {
                X: data.posX,
                Y: data.posY
            },
            Width: data.width,
            Height: data.height,
            Title: '仿真设置'
        }
    } 

    // 声明窗口销毁函数
    const onGUIDestroy = (id:number) => {
        simulationContext.Actions.DestroySimulationSettingsGUI(id);
    }

    // 获取所有仿真属性
    function getSimulationProps(props:SimulationProps){
        if (props){
            return Object.entries(props);
        }
    }

    // 适配FloatWindow的接口
    const floatWindowProps: FloatWindowPropInterface = {
        id: window.Id, // 这里可以设置一个唯一的ID
        icon: '🛠️', // 窗口图标
        title: '仿真设置',
        isOpen: true,
        width: window.Width, // 窗口宽度
        height: window.Height, // 窗口高度
        posX: window.Pos.X, // 初始位置X
        posY: window.Pos.Y, // 初始位置Y
        onUpdateStatus: onUpdateStatus,
        onGUIDestroy: onGUIDestroy
    }

    return (
        <FloatWindow data={floatWindowProps}>
            <div className="flex flex-row w-full h-full bg-slate-100 pb-10">
                <div className="flex flex-col basis-2/5 h-full items-center space-between">
                    <div className="h-full flex-initial w-full px-2 border-gray-600 rounded-md p-2">
                        <div className="flex flex-col flex-initial  h-full w-full px-2 shadow-lg bg-slate-50 border-gray-600 rounded-md">
                            <div className="text-blue-950 text-left font-semibold border-b border-gray-400 ml-2 mr-2 py-2">仿真设置</div>
                            <ul className="rounded-sm font-semibold px-2 py-1 mx-2 my-2 bg-sky-600 text-white">
                                基础设置
                            </ul>
                        </div>
                    </div>
                   
                </div>
                { /* 开始生成基础设置的设置列表 */ }
                    <div className="h-full w-full flex-initial p-2">
                        <div className="h-full w-full flex flex-col bg-slate-50 rounded-md shadow-lg overflow-auto">
                            <h3 className="font-semibold border-b-1 border-gray-400 py-2 mx-2">基础仿真设置</h3>
                                <div id="fixedParameterContainer" className="flex flex-col w-full h-full place-content-between">
                                    <div className="flex flex-col w-full">
                                        {getSimulationProps(simulationContext.SimulationProps)?.map(([key, value]) => (
                                            <form key={key} className="flex flex-col w-1/2 p-2 rounded-md bg-white border-gray-300">
                                                <label className="font-medium text-sm text-black">{SimulationBasicSettingsListAlias[key]}</label>
                                                    <input id={key} className="px-1 py-1 text-xs text-gray-600 border-gray-300 rounded-md shadow-md" type="text" value={String(value)} onChange={(e)=>{
                                                        // 更新仿真属性
                                                        simulationContext.Actions.UpdateSimulationSettings({
                                                            ...simulationContext.SimulationProps,
                                                            [key]: e.target.value
                                                        });
                                                    }}></input>
                                            </form>
                                        ))}
                                    </div>
                                    <div className="flex flex-row place-content-between px-20 mb-5">
                                        <button className="bg-red-500 border-gray-400 rounded-md shadow-md font-semibold text-white 
                                                   hover:bg-red-600 active:bg-red-800 mx-2 px-4 py-1" onClick={()=>{simulationContext.Actions.DestroySimulationSettingsGUI(window.Id)}}>放弃</button>
                                        <button className="bg-blue-500 border-gray-400 rounded-md shadow-md font-semibold text-white
                                                    hover:bg-blue-600 active:bg-blue-800 mx-2 px-4 py-1" onClick={()=>{
                                                        // 同步更新
                                                        webController.Actions.RPCSetSimulationParameter(simulationContext.SimulationProps, WebSocketContext);
                                                        simulationContext.Actions.DestroySimulationSettingsGUI(window.Id);

                                                        // 更新全局和固定参数
                                                        const newNodes = LogicGraphContext.Nodes.map(node => {
                                                            return {
                                                                ...node,
                                                                NodesData: {
                                                                    ...node.NodesData,
                                                                    Properties: {
                                                                        ...node.NodesData.Properties,
                                                                        Global: {
                                                                            ...node.NodesData.Properties.Global,
                                                                            SampleRate: simulationContext.SimulationProps.SimulationSampleRate
                                                                        },
                                                                        Fixed: {
                                                                            ...node.NodesData.Properties.Fixed,
                                                                            BlockLength: Math.floor(simulationContext.SimulationProps.SimulationSampleRate * simulationContext.SimulationProps.SimulationPerFrameTime)
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        });
                                                        LogicGraphContext.Actions.updateNodes(newNodes);
                                                    }}>应用设置</button>
                                        </div>
                                    </div>
                                
                            </div>
                    </div>
        </div>
        </FloatWindow>
    )
}