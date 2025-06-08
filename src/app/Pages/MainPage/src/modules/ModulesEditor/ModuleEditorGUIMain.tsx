import { useModulesEditor } from "./ModulesEditorProvider";
import { ModulesList, ModulesListAlias } from "../ModulesLib/ModulesList";
import '../../css/index.css';
import { useState } from "react";
import { ModulesDataProps } from "./ModulesEditorProviderInterface";
import { useLogicGraph } from "../WorkSpace/LogicGraphProvider/LogicGraphProvider";
import { LogicGraphNodesProp } from "../WorkSpace/LogicGraphProvider/LogicGraphProviderInterface";
import { LogicGraphShownNode } from "../WorkSpace/LogicGraphEditor/LogicGraphNode/LogicGraphNode";
import { smartParse } from "../Tools/SmartParse";

function ModuleEditorGUIMain({ windowId }) {
    const { modulesData, actions } = useModulesEditor();
    const LogicGraphContext = useLogicGraph();
    const LogicNodes = LogicGraphContext.Nodes;
    const LogicGraphActions = LogicGraphContext.Actions;

    const windowData = modulesData.find(window => window.GuiProps.id === windowId);

    const [activeType, setActiveType] = useState(windowData?.ModulesData.Type || '');
    const [activeName, setActiveName] = useState(windowData?.ModulesData.Name || '');

    const [currentModule, setCurrentModuleData] = useState<ModulesDataProps>(windowData?.ModulesData || ModulesList[0].Modules[0]);

    // 额外增加一个 state 用于保存输入框文本值
    const [parameterInputValues, setParameterInputValues] = useState(() => {
        const initialValues = {};
        const props = getAllProperties(windowData?.ModulesData || ModulesList[0].Modules[0]);
        if (props) {
            props.Fixed?.forEach(([key, value]) => { initialValues[key] = String(value); });
            props.Global?.forEach(([key, value]) => { initialValues[key] = String(value); });
            props.Local?.forEach(([key, value]) => { initialValues[key] = String(value); });
        }
        return initialValues;
    });

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

    function getModulePropsByName(moduleName) {
        const group = ModulesList.find(group => group.GroupName === activeType);
        const moduleGet = group?.Modules.find(mod => mod.Name === moduleName);

        if (moduleGet) {
            return moduleGet;
        } else {
            console.error(`模块 ${moduleName} 不存在于分类 ${activeType} 中`);
            return null;
        }
    }

    function handleModuleClick(type, params) {
        if (type === "ModuleType") {
            setActiveType(params);

            const firstModule = ModulesList.find(group => group.GroupName === params)?.Modules[0];
            if (firstModule) {
                setActiveName(firstModule.Name);
                setCurrentModuleData(firstModule);

                // 同步更新输入框映射
                const props = getAllProperties(firstModule);
                const initialValues = {};
                if (props) {
                    props.Fixed?.forEach(([key, value]) => { initialValues[key] = String(value); });
                    props.Global?.forEach(([key, value]) => { initialValues[key] = String(value); });
                    props.Local?.forEach(([key, value]) => { initialValues[key] = String(value); });
                }
                setParameterInputValues(initialValues);
            }
        } else if (type === "ModuleName") {
            setActiveName(params);

            const moduleProps = getModulePropsByName(params);
            if (moduleProps) {
                setCurrentModuleData(moduleProps);

                // 同步更新输入框映射
                const props = getAllProperties(moduleProps);
                const initialValues = {};
                if (props) {
                    props.Fixed?.forEach(([key, value]) => { initialValues[key] = String(value); });
                    props.Global?.forEach(([key, value]) => { initialValues[key] = String(value); });
                    props.Local?.forEach(([key, value]) => { initialValues[key] = String(value); });
                }
                setParameterInputValues(initialValues);
            }
        }
    }

    return (
        <div className="flex flex-row bg-slate-100 w-full h-full pb-10">
            {/* 左侧分类 + 模块列表 */}
            <div className="flex flex-col basis-2/5 h-full items-center space-between">
                {/* 分类 */}
                <div className="h-2/5 flex-initial w-full px-2 border-gray-600 rounded-md p-2">
                    <div className="flex flex-col flex-initial h-full w-full px-2 shadow-lg bg-slate-50 border-gray-600 rounded-md">
                        <div className="text-blue-950 text-left font-semibold border-b border-gray-400 ml-2 mr-2 py-2">模块分类</div>
                        <div className="flex flex-col overflow-y-auto">
                            {ModulesList.map(group => (
                                <ul
                                    key={group.GroupName}
                                    className={`flex-grow border-gray-300 rounded-sm font-semibold shadow-md px-2 py-1 mx-2 my-1 ${group.GroupName === activeType ? 'bg-sky-600 text-white' : 'bg-white text-blue-950 hover:bg-sky-50'}`}
                                    onClick={() => handleModuleClick("ModuleType", group.GroupName)}
                                >
                                    {ModulesListAlias[group.GroupName]["Name"]}
                                </ul>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 模块列表 */}
                <div className="h-3/5 flex-initial w-full px-2 border-gray-600 rounded-md">
                    <div className="px-2 flex flex-col flex-initial h-full w-full shadow-lg bg-slate-50 border-gray-600 rounded-md">
                        <div className="text-blue-950 text-left font-semibold border-b border-gray-400 ml-2 mr-2 py-2">模块列表</div>
                        <div className="mt-2 w-full h-full flex flex-col overflow-auto">
                            {ModulesList.map(group => (
                                group.GroupName === activeType && group.Modules.map(module => (
                                    <div
                                        key={module.Name}
                                        className={`border-gray-300 rounded-sm min-w-0 font-semibold shadow-md px-2 py-1.5 mx-2 my-1 ${module.Name === activeName ? 'bg-sky-600 text-white' : 'bg-white text-blue-950 hover:bg-sky-50'}`}
                                        onClick={() => handleModuleClick("ModuleName", module.Name)}
                                    >
                                        {ModulesListAlias[activeType][module.Name]["Name"]}
                                    </div>
                                ))
                            ))}
                        </div>
                    </div>
                </div>
            </div>

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
                                        ID: 0,
                                        GuiProps: {
                                            IconSrc: '../imgs/alu.png',
                                            Title: currentModule.Name,
                                            Type: currentModule.Type,
                                            Pos: { X: 0, Y: 0 },
                                            Ports: { InputPort: InputPorts, OutputPort: OutputPorts }
                                        },
                                        NodesData: {
                                            Id: currentModule.Id,
                                            Type: currentModule.Type,
                                            Name: currentModule.Name,
                                            Description: currentModule.Description,
                                            Properties: newProperties
                                        }
                                    };

                                    LogicGraphActions.addNode(newNode);
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

export default ModuleEditorGUIMain;
