import { useModulesEditor } from "./ModulesEditorProvider";
import { ModulesList,ModulesListAlias } from "../ModulesLib/ModulesList";
import '../../css/index.css';
import { useEffect, useState } from "react";
import { ModulesData,ModulesDataProps } from "./ModulesEditorProviderInterface";
import { useLogicGraph } from "../WorkSpace/LogicGraphProvider/LogicGraphProvider";
import { LogicGraphNodesProp } from "../WorkSpace/LogicGraphProvider/LogicGraphProviderInterface";
import { LogicGraphShownNode } from "../WorkSpace/LogicGraphEditor/LogicGraphNode/LogicGraphNode";

function ModuleEditorGUIMain( { windowId } ){
    // 获取模块编辑器的上下文
    const { modulesData,actions } = useModulesEditor();

    //
    const LogicGraphContext = useLogicGraph();
    const LogicNodes = LogicGraphContext.Nodes;
    const LogicGraphActions = LogicGraphContext.Actions;

    // 获取当前窗口数据
    const windowData = modulesData.find(window => window.guiProps.id === windowId);

    // 分类和模块名称
    const [activeType, setActiveType] = useState(windowData?.InfoData.Type || ''); // 当前选中的分类类型
    const [activeName, setActiveName] = useState(windowData?.InfoData.Name || ''); // 当前选中的分类类型

    // 定义当前选定的模块信息结构
    const [currentModule,setCurrentModuleData] = useState<ModulesDataProps>(ModulesList[0].Modules[0]);


    // 检查是否存在
    function getAllProperties(module){
        // 如果模块存在，那么获取所有属性
        if (module){
            const getAllProperties = {
                Fixed: Object.entries(module.Properties.Fixed),
                Global: Object.entries(module.Properties.Global || {}),
                Local: Object.entries(module.Properties.Local || {})
            }
            return getAllProperties;
        }
        return null;
    }

    function getFixedProperties(module){
        // 如果模块存在，那么获取Fixed属性
        if (module){
            console.log("获取到的模块属性：", Object.entries(module.Properties.Fixed));
            Object.entries(module.Properties.Fixed).forEach(([key, value]) => {
                console.log(`属性 ${key} 的值是：`, ModulesListAlias[key]);
            });
            return Object.entries(module.Properties.Fixed);
        }
    }

    function getModulePropsByName(moduleName){
        //获取目标模块
        const group = ModulesList.find(group => group.GroupName === activeType);
        const module = group?.Modules.find(mod => mod.Name === moduleName);

        // 如果模块存在，那么获取属性
        if (module){
            return module;
        }else{
            console.error(`模块 ${moduleName} 不存在于分类 ${activeType} 中`);
            return null;
        }
    }

    function handleModuleClick(type,params){
        if( type === "ModuleType"){
            setActiveType(params);
            
            // 默认选中该分类下的第一个模块
            const firstModule = ModulesList.find(group => group.GroupName === params)?.Modules[0];
            if (firstModule) {
                setActiveName(firstModule.Name);
                // 更新当前模块数据
                setCurrentModuleData(firstModule);
            }
        }else if( type === "ModuleName"){
            setActiveName(params);
            // 更新当前模块数据
            const moduleProps = getModulePropsByName(params);
            if (moduleProps) {
                setCurrentModuleData(moduleProps);
            }
        }

    }

    return (
        <div className="flex flex-row bg-slate-100 w-full h-full pb-10">
            <div className="flex flex-col basis-2/5 h-full items-center space-between">
            <div className="h-2/5 flex-initial w-full px-2 border-gray-600 rounded-md p-2">
            <div className="flex flex-col flex-initial  h-full w-full px-2 shadow-lg bg-slate-50 border-gray-600 rounded-md">
                <div className="text-blue-950 text-left font-semibold border-b border-gray-400 ml-2 mr-2 py-2">模块分类</div>
                <div className="flex flex-col overflow-y-auto">
                    {
                        ModulesList.map(group => (
                           <ul
                                key={group.GroupName}
                                className={` 
                                            flex-grow
                                          border-gray-300 
                                            rounded-sm
                                            font-semibold
                                            shadow-md
                                            px-2
                                            py-1
                                            mx-2
                                            my-1
                                            ${group.GroupName === activeType ? 'bg-sky-600 text-white' : 'bg-white text-blue-950 hover:bg-sky-50'
                                            }`}
                                            onClick={() => handleModuleClick("ModuleType", group.GroupName)}
                            >
                                {group.GroupName}
                            </ul>
                        ))
                    }
                </div>
            </div>
            </div>
            <div className="h-3/5 flex-initial w-full px-2 border-gray-600 rounded-md">
            <div className="px-2 flex flex-col flex-initial h-full w-full shadow-lg bg-slate-50 border-gray-600 rounded-md">
                    <div className="text-blue-950 text-left font-semibold border-b border-gray-400 ml-2 mr-2 py-2">模块列表</div>
                    <div className="mt-2 w-full h-full flex flex-col overflow-auto">
                        {
                            ModulesList.map(group => (
                                group.GroupName === activeType && group.Modules.map(module => (
                                    <div
                                        key={module.Name}
                                        className={` border-gray-300 
                                                    rounded-sm
                                                    min-w-0
                                                    font-semibold
                                                    shadow-md
                                                    px-2
                                                    py-1.5
                                                    mx-2
                                                    my-1
                                                    ${module.Name === activeName ? 'bg-sky-600 text-white' : 'bg-white text-blue-950 hover:bg-sky-50'
                                                    }`}
                                        onClick={() => handleModuleClick("ModuleName", module.Name)}
                                    >
                                        {module.Name}
                                    </div>
                                ))
                            ))
                        }
                    </div>
                </div>
                </div>
        </div>
        {/* 现在开始构建右侧界面：
            组件1：模块预览图
            组件2：模块参数配置列表
         */}
        <div className="basis-3/5 h-full flex flex-col bg-slate-100">
            {/*组件1：构建模块预览系统*/}
            <div className="h-3/5 w-full flex-initial p-2">
                <div className="h-full w-full flex flex-col bg-slate-50 rounded-md shadow-lg">
                    <h3 className="font-semibold border-b-1 border-gray-400 py-2 mx-2">模块预览图</h3>
                    <div className="flex flex-col bg-slate-100 items-center px-8 py-8 overflow-auto">
                    <LogicGraphShownNode groupName={activeType} ModuleName={activeName} refModuleData={currentModule}></LogicGraphShownNode>
                    </div>
                </div>
            </div>
            {/*组件2：构建模块参数配置列表*/}
            <div className="h-2/5 w-full flex-initial p-2">
                <div className="h-full w-full flex flex-col space-between bg-slate-50 rounded-md shadow-lg overflow-auto">
                    <h3 className="font-semibold border-b-1 border-gray-400 py-2 mx-2">参数配置</h3>
                    <div id="fixedParameterContainer" className="flex flex-col w-full">
                        <h3 className="text-sm font-semibold py-2 mx-2">固定参数</h3>
                        {/*现在开始生成固定参数列表*/}
                        <div className="w-full flex flex-row flex-wrap">
                            {
                                getAllProperties(currentModule)?.Fixed?.map(([key, value]) => (
                                    <form key={key} className="flex flex-col w-1/2 p-2 rounded-md bg-white border-gray-300">
                                        <label className="font-medium text-sm text-black">{ModulesListAlias[key]}</label>
                                        <input id={key} className="px-1 py-1 text-xs text-gray-600 border-gray-300 rounded-md shadow-md" type="text" value={String(value)} onChange={(e)=>{
                                            const newValue = e.target.value;
                                            setCurrentModuleData((prevModule) => ({
                                                ...prevModule,
                                                Properties: {
                                                    ...prevModule.Properties,
                                                    Fixed: {
                                                        ...prevModule.Properties.Fixed,
                                                        [key]: newValue,
                                                    },
                                                },
                                            }));
                                        }}></input>
                                    </form>
                                ))
                            
                            }
                        </div>
                        {/* 现在开始生成全局参数列表 */}
                        <h3 className="text-sm font-semibold py-2 mx-2">全局参数</h3>
                        <div className="w-full flex flex-row flex-wrap">
                            {
                                getAllProperties(currentModule)?.Global?.map(([key, value]) => (
                                    <form key={key} className="flex flex-col w-1/2 p-2 rounded-md bg-white border-gray-300">
                                        <label className="font-medium text-sm text-black">{ModulesListAlias[key]}</label>
                                        <input id={key} className="px-1 py-1 text-xs text-gray-600 border-gray-300 rounded-md shadow-md" type="text" value={String(value)} onChange={(e)=>{
                                            const newValue = e.target.value;
                                            setCurrentModuleData((prevModule) => ({
                                                ...prevModule,
                                                Properties: {
                                                    ...prevModule.Properties,
                                                    Global: {
                                                        ...prevModule.Properties.Global,
                                                        [key]: newValue,
                                                    },
                                                },
                                            }));
                                        }}></input>
                                    </form>
                                ))
                            }
                        </div>
                        {/* 现在开始生成本地参数列表 */}
                        <h3 className="text-sm font-semibold py-2 mx-2">本地参数</h3>
                        <div className="w-full flex flex-row flex-wrap">
                            {
                                getAllProperties(currentModule)?.Local?.map(([key, value]) => (
                                    <form key={key} className="flex flex-col w-1/2 p-2 rounded-md bg-white border-gray-300">
                                        <label className="font-medium text-sm text-black">{ModulesListAlias[key]}</label>
                                        <input id={key} className="px-1 py-1 text-xs text-gray-600 border-gray-300 rounded-md shadow-md" type="text" value={String(value)} onChange={(e)=>{
                                            const newValue = e.target.value;
                                            setCurrentModuleData((prevModule) => ({
                                                ...prevModule,
                                                Properties: {
                                                    ...prevModule.Properties,
                                                    Local: {
                                                        ...prevModule.Properties.Local,
                                                        [key]: newValue,
                                                    },
                                                },
                                            }));
                                        }}></input>
                                    </form>
                                ))
                            }
                        </div>
                    </div>
                    <div className="flex w-full flex-row justify-between px-30 mt-5 mb-5">
                        <button className="bg-red-500 border-gray-400 rounded-md shadow-md font-semibold text-white 
                        hover:bg-red-600 active:bg-red-800 mx-2 px-4 py-1" onClick={()=>{actions.removeGUI(windowId)}}>放弃</button>
                        <button className="bg-sky-600 border-gray-400 rounded-md shadow-md font-semibold text-white 
                        hover:bg-sky-700 active:bg-sky-800 mx-2 px-4 py-1" onClick={()=>{
                            console.log("当前模块数据：", currentModule);
                            // 依据端口数量生成端口数组
                            const InputPorts = Array.from({ length: currentModule.Properties.Fixed.InputCount }, (_, i) => ({PortIndex:i}));
                            const OutputPorts = Array.from({ length: currentModule.Properties.Fixed.OutputCount }, (_, i) => ({PortIndex:i}));

                            const newNode:LogicGraphNodesProp = {
                                ID:0,
                                Pos:{
                                    X:0,
                                    Y:0
                                },
                                guiProps:{
                                    IconSrc:'../imgs/alu.png',
                                    Title:currentModule.Name,
                                    Type:currentModule.Name
                                },
                                Ports:{
                                    InputPort: InputPorts,
                                    OutputPort: OutputPorts
                                },
                                BlockLength:currentModule.Properties.Fixed.BlockLength,
                                InputCount:currentModule.Properties.Fixed.InputCount,
                                OutputCount:currentModule.Properties.Fixed.OutputCount,
                                ComponentType:currentModule.Properties.Fixed.ComponentType,
                                ComponentID:currentModule.Properties.Fixed.ComponentID,
                                ComponentSettings:{
                                    ...currentModule.Properties.Local
                                }
                            }
                            LogicGraphActions.addNode(newNode);
                        }}>应用配置</button>
                </div>
                </div>
                
            </div>
        </div>
        </div>
        
    )
}

export default ModuleEditorGUIMain;