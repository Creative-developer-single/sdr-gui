import FloatWindow from "../../FloatWindow/FloatWindow";
import { UpdateStatusInterface } from "../../FloatWindow/FloatWindowPropInterface";
import { useSimulation } from "../../Simulation/SimulationProvider";
import { useLogicGraph } from "../../WorkSpace/LogicGraphProvider/LogicGraphProvider";
import ConstellationDiagram from "../Components/ConstellationDiagram";
import FrequencySpectrumDiagram from "../Components/FrequencySpectrumDiagram";
import TimeDomainDiagram from "../Components/TimeDomainDiagram";
import { ViewModuleGUIProps, ViewModuleProps } from "../Provider/ViewModuleInterface";
import { useViewModule } from "../Provider/ViewModuleProvider";

export function ViewModulesGUIMain( { ViewModulesItem } : {
    ViewModulesItem: ViewModuleProps
} ){
    // 获取当前可视化模块Context
    const viewModuleContext = useViewModule();

    // 获取仿真器Context
    const simulatorContext = useSimulation();

    // 获取逻辑图Context
    const logicGraphContext = useLogicGraph();

    // 获取目标节点采样率
    const targetNode = logicGraphContext.Nodes.find(item => item.ID === ViewModulesItem.ViewModuleGUIProps.BindNodeId);
    if (!targetNode) {
        console.error("未找到目标节点，无法获取采样率");
        return null;
    }
    const targetSampleRate = targetNode.NodesData.Properties.Global?.SampleRate || simulatorContext.SimulationProps.SimulationSampleRate;

    function onUpdateStatus(data:UpdateStatusInterface){
        const status:ViewModuleGUIProps ={
            id: data.id,
            isOpen: data.isOpen,
            type: ViewModulesItem.ViewModuleGUIProps.type,
            Pos: {
                X: data.posX,
                Y: data.posY
            },
            BindNodeId: ViewModulesItem.ViewModuleGUIProps.BindNodeId,
            width: data.width,
            height: data.height,
            title: ViewModulesItem.ViewModuleGUIProps.title
        }
        viewModuleContext.Actions.UpdateViewModuleGUIStatus(status);
    }

    function onGUIDestroy(id:number){
        viewModuleContext.Actions.CloseViewModuleGUI(id);
    }

    const floatWindowProps = {
        id: ViewModulesItem.ViewModuleGUIProps.id,
        isOpen: ViewModulesItem.ViewModuleGUIProps.isOpen,
        posX: ViewModulesItem.ViewModuleGUIProps.Pos.X,
        posY: ViewModulesItem.ViewModuleGUIProps.Pos.Y,
        width: ViewModulesItem.ViewModuleGUIProps.width,
        height: ViewModulesItem.ViewModuleGUIProps.height + 100,
        title: ViewModulesItem.ViewModuleGUIProps.title,
        icon: '📊', // 窗口图标
        onUpdateStatus: onUpdateStatus,
        onGUIDestroy: onGUIDestroy
    }

    //console.log("当前可视化模块数据:",ViewModulesItem);
    let viewModuleComponent;
    switch(ViewModulesItem.ViewModuleGUIProps.type) {
        case "Oscilloscope":
            viewModuleComponent = (
                <TimeDomainDiagram
                    data = {ViewModulesItem.ViewModuleData.Data[ViewModulesItem.ViewModuleData.ActiveChannelNum]}
                    sampleRate = {targetSampleRate}
                />
            );
            break;
        case "SpectrumAnalyzer":
            viewModuleComponent = (
                <FrequencySpectrumDiagram freqData={ViewModulesItem.ViewModuleData.Data[ViewModulesItem.ViewModuleData.ActiveChannelNum]}
                sampleRate={targetSampleRate}
                ></FrequencySpectrumDiagram>
            )
            break;
        case "ConstellationDiagram":
            viewModuleComponent = (
                <ConstellationDiagram iData={ViewModulesItem.ViewModuleData.Data[0]}
                    qData={ViewModulesItem.ViewModuleData.Data[1]}>
                </ConstellationDiagram>
            )
            break;
        default:
            viewModuleComponent = null;
            break;
    }

    return (
        <FloatWindow data={floatWindowProps}>
            <div className="">
            {viewModuleComponent}
            </div>
        </FloatWindow>
    )
}