import { useModulesEditor } from "./ModulesEditorProvider";
import { ModulesList, ModulesListAlias } from "../ModulesLib/ModulesList";
import "../../css/index.css";
import { useState, useEffect } from "react";
import { ModulesDataProps } from "./ModulesEditorProviderInterface";
import { useLogicGraph } from "../WorkSpace/LogicGraphProvider/LogicGraphProvider";
import { LogicGraphNodesProp } from "../WorkSpace/LogicGraphProvider/LogicGraphProviderInterface";
import { LogicGraphShownNode } from "../WorkSpace/LogicGraphEditor/LogicGraphNode/LogicGraphNode";
import { smartParse } from "../Tools/SmartParse";

function SelectedModuleEditorGUIMain({ windowId, currentNode }: { windowId: number; currentNode?: LogicGraphNodesProp }) {
    const { modulesData, actions } = useModulesEditor();
    const LogicGraphContext = useLogicGraph();
    const LogicNodes = LogicGraphContext.Nodes;
    const LogicGraphActions = LogicGraphContext.Actions;

    const windowData = modulesData.find(window => window.GuiProps.id === windowId);
    const currentBindData = LogicNodes.find(node => node.ID === windowData?.ModulesData.Id);

    const [activeType, setActiveType] = useState(windowData?.ModulesData.Type || '');
    const [activeName, setActiveName] = useState(windowData?.ModulesData.Name || '');
    const [currentModule, setCurrentModuleData] = useState<ModulesDataProps>(currentBindData?.NodesData || ModulesList[0].Modules[0]);

    const [parameterInputValues, setParameterInputValues] = useState(() => {
        const initialValues = {};
        const props = getAllProperties(currentModule);
        if (props) {
            props.Fixed?.forEach(([key, value]) => { initialValues[key] = String(value); });
            props.Global?.forEach(([key, value]) => { initialValues[key] = String(value); });
            props.Local?.forEach(([key, value]) => { initialValues[key] = String(value); });
        }
        return initialValues;
    });

    useEffect(() => {
        const props = getAllProperties(currentModule);
        const initialValues = {};
        if (props) {
            props.Fixed?.forEach(([key, value]) => { initialValues[key] = String(value); });
            props.Global?.forEach(([key, value]) => { initialValues[key] = String(value); });
            props.Local?.forEach(([key, value]) => { initialValues[key] = String(value); });
        }
        setParameterInputValues(initialValues);
    }, [currentModule]);

    function getAllProperties(module) {
        if (module) {
            return {
                Fixed: Object.entries(module.Properties.Fixed),
                Global: Object.entries(module.Properties.Global || {}),
                Local: Object.entries(module.Properties.Local || {})
            };
        }
        return null;
    }

    return (
        <div className="flex flex-row bg-slate-100 w-full h-full pb-10">
            {/* 右侧：模块预览 + 参数配置 */}
            <div className="basis-3/5 h-full flex flex-col bg-slate-100">
                {/* 模块预览 */}
                <div className="h-3/5 w-full flex-initial p-2">
                    <div className="h-full w-full flex flex-col bg-slate-50 rounded-md shadow-lg">
                        <h3 className="font-semibold border-b-1 border-gray-400 py-2 mx-2">模块预览图</h3>
                        <div className="flex flex-col bg-slate-100 items-center px-8 py-8 overflow-auto">
                            <LogicGraphShownNode groupName={activeType} ModuleName={activeName} refModuleData={currentModule} />
                        </div>
                    </div>
                </div>

                {/* 参数配置 */}
                <div className="h-2/5 w-full flex-initial p-2">
                    <div className="h-full w-full flex flex-col space-between bg-slate-50 rounded-md shadow-lg overflow-auto">
                        <h3 className="font-semibold border-b-1 border-gray-400 py-2 mx-2">参数配置</h3>
                        <div id="fixedParameterContainer" className="flex flex-col w-full">
                            {/* 固定参数 */}
                            <h3 className="text-sm font-semibold py-2 mx-2">固定参数</h3>
                            <div className="w-full flex flex-row flex-wrap">
                                {getAllProperties(currentModule)?.Fixed?.map(([key, value]) => (
                                    <form key={key} className="flex flex-col w-1/2 p-2 rounded-md bg-white border-gray-300">
                                        <label className="font-medium text-sm text-black">{ModulesListAlias["Fixed"][key]}</label>
                                        <input
                                            id={key}
                                            className="px-1 py-1 text-xs text-gray-600 border-gray-300 rounded-md shadow-md"
                                            type="text"
                                            value={parameterInputValues[key] ?? ''}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                setParameterInputValues(prev => ({
                                                    ...prev,
                                                    [key]: newValue
                                                }));
                                            }}
                                        />
                                    </form>
                                ))}
                            </div>

                            {/* 全局参数 */}
                            <h3 className="text-sm font-semibold py-2 mx-2">全局参数</h3>
                            <div className="w-full flex flex-row flex-wrap">
                                {getAllProperties(currentModule)?.Global?.map(([key, value]) => (
                                    <form key={key} className="flex flex-col w-1/2 p-2 rounded-md bg-white border-gray-300">
                                        <label className="font-medium text-sm text-black">{ModulesListAlias["Global"][key]}</label>
                                        <input
                                            id={key}
                                            className="px-1 py-1 text-xs text-gray-600 border-gray-300 rounded-md shadow-md"
                                            type="text"
                                            value={parameterInputValues[key] ?? ''}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                setParameterInputValues(prev => ({
                                                    ...prev,
                                                    [key]: newValue
                                                }));
                                            }}
                                        />
                                    </form>
                                ))}
                            </div>

                            {/* 本地参数 */}
                            <h3 className="text-sm font-semibold py-2 mx-2">本地参数</h3>
                            <div className="w-full flex flex-row flex-wrap">
                                {getAllProperties(currentModule)?.Local?.map(([key, value]) => (
                                    <form key={key} className="flex flex-col w-1/2 p-2 rounded-md bg-white border-gray-300">
                                        <label className="font-medium text-sm text-black">{ModulesListAlias[currentModule.Type][currentModule.Name][key]}</label>
                                        <input
                                            id={key}
                                            className="px-1 py-1 text-xs text-gray-600 border-gray-300 rounded-md shadow-md"
                                            type="text"
                                            value={parameterInputValues[key] ?? ''}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                setParameterInputValues(prev => ({
                                                    ...prev,
                                                    [key]: newValue
                                                }));
                                            }}
                                        />
                                    </form>
                                ))}
                            </div>
                        </div>

                        {/* 底部按钮 */}
                        <div className="flex w-full flex-row justify-between px-30 mt-5 mb-5">
                            <button
                                className="bg-red-500 border-gray-400 rounded-md shadow-md font-semibold text-white hover:bg-red-600 active:bg-red-800 mx-2 px-4 py-1"
                                onClick={() => { actions.removeGUI(windowId); }}
                            >
                                放弃
                            </button>

                            <button
                                className="bg-sky-600 border-gray-400 rounded-md shadow-md font-semibold text-white hover:bg-sky-700 active:bg-sky-800 mx-2 px-4 py-1"
                                onClick={() => {
                                    const newProperties = {
                                        Fixed: { ...currentModule.Properties.Fixed },
                                        Global: { ...currentModule.Properties.Global },
                                        Local: { ...currentModule.Properties.Local }
                                    };

                                    Object.keys(newProperties.Fixed).forEach(key => {
                                        newProperties.Fixed[key] = smartParse(parameterInputValues[key] ?? '');
                                    });
                                    Object.keys(newProperties.Global).forEach(key => {
                                        newProperties.Global[key] = smartParse(parameterInputValues[key] ?? '');
                                    });
                                    Object.keys(newProperties.Local).forEach(key => {
                                        newProperties.Local[key] = smartParse(parameterInputValues[key] ?? '');
                                    });

                                    const newModuleData = {
                                        ...currentModule,
                                        Properties: newProperties
                                    };
                                    setCurrentModuleData(newModuleData);

                                    const InputPorts = Array.from({ length: newProperties.Fixed.InputCount }, (_, i) => ({ PortIndex: i }));
                                    const OutputPorts = Array.from({ length: newProperties.Fixed.OutputCount }, (_, i) => ({ PortIndex: i }));

                                    const newNode: LogicGraphNodesProp = {
                                        ID: currentBindData?.ID || 0,
                                        GuiProps: {
                                            IconSrc: '../imgs/alu.png',
                                            Title: newModuleData.Type,
                                            Type: newModuleData.Name,
                                            Pos: {
                                                X: currentBindData?.GuiProps.Pos.X || 0,
                                                Y: currentBindData?.GuiProps.Pos.Y || 0
                                            },
                                            Ports: { InputPort: InputPorts, OutputPort: OutputPorts }
                                        },
                                        NodesData: newModuleData
                                    };

                                    LogicGraphActions.updateNode(newNode.ID, newNode);
                                }}
                            >
                                应用配置
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectedModuleEditorGUIMain;
