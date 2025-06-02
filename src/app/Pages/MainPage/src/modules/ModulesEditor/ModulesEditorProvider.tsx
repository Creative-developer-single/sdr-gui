import { createContext, useCallback, useContext, useState } from "react";
import { ModulesList } from "../ModulesLib/ModulesList";
import { ModulesData, ModulesDataProps, ModulesEditorProviderInterface } from "./ModulesEditorProviderInterface";
import { UpdateStatusInterface } from "../FloatWindow/FloatWindowPropInterface";

//Context for ModulesEditor
const modulesEditorContext = createContext<ModulesEditorProviderInterface | null>(null);

//Define a hook for subModules
export const useModulesEditor = () => {
    const context = useContext(modulesEditorContext);
    if (!context) {
        throw new Error("useModulesEditor must be used within a ModulesEditorProvider");
    }
    return context;
}

export function ModulesEditorProvider({ children }) {
    const [modulesData, setModulesData] = useState<ModulesData[]>([
        {
            GuiProps:{
                id:0,
                isOpen:false,
                posX:0,
                posY:0,
                width:400,
                height:300,
                mode:'ModulesBrouser',
            },
            ModulesData:{
                Type:'default',
                Name:'defaultModule',
                Description:'这是一个默认模块',
                Properties:{
                    Fixed:{
                        ProcessMode:'block',
                        BlockLength:1024,
                        InputCount:1,
                        OutputCount:1,
                        ComponentType:"default.defaultModule",
                        ComponentID:'default0'
                    },
                    Global:{
                        SampleRate:10000,
                    },
                    Local:{
                        ComponentID:'default0',
                        mode:'default'
                    }
                }
            }
        }],
    );

    /*
    function createNewWindow(){
        const newWindow = {
            GuiProps:{
                id: Math.max(...modulesData.map(item => item.GuiProps.id)) + 1,
                isOpen: false,
                posX: 0,
                posY: 0,
                width: 400,
                height: 300,
                mode: 'ModulesBrouser',
            },
            InfoData: {
                type: 'default',
                name: 'defaultModule',
                description: '这是一个默认模块',
                properties: {
                    fixed: {
                        processMode: 'block',
                        blockLength: 1024,
                        ComponentID: 'default0',
                    },
                    global: {
                        sampleRate: 10000,
                    },
                    local: {
                        mode: 'default'
                    }
                }
            }
        };
        return newWindow;
    }*/

    interface PreloadData{
        windowId: number; // 窗口ID，0表示新建窗口
        windowMode: string; // 窗口模式，例如 'ModulesBrouser' 或 'ModulesEditor'
        type: string; // 预加载的类型，例如模块组名称
        width: number; // 窗口宽度
        height: number; // 窗口高度
        ModulesData?: ModulesDataProps
    }

    const openEditorGUI = useCallback((preLoadData:PreloadData)  => {
        //获取当前窗口请求id，若为0，则视为新建窗口，合法窗口id为1-n
        const windowId = preLoadData.windowId;
        const windowMode = preLoadData.windowMode;
        const preloadType = preLoadData.type;
        const preloadWidth = preLoadData.width;
        const preloadHeight = preLoadData.height;
        
        //检查id，并新建窗口或已有窗口
        if (windowId == 0){
            //假设为模块浏览器，那么数据可以从const数组中检索
            //检查提供的分类，将会自动提取const数组中对应分类的第一个元素
            if (windowMode === 'ModulesBrouser'){
                //查找类别匹配的组
                const moduleGroup = ModulesList.find(group => group.GroupName === preloadType);

                //如果找到匹配的组，获取第一个模块
                if (moduleGroup && moduleGroup.Modules.length > 0) {
                    const moduleInfo = moduleGroup.Modules[0];
                    const newWindow = {
                        GuiProps:{
                        id: Math.max(...modulesData.map(item => item.GuiProps.id)) + 1,
                        isOpen: true,
                        posX: 100,
                        posY: 100,
                        width: preloadWidth,
                        height: preloadHeight,
                        mode: windowMode,
                        },
                        ModulesData: {
                            Type: preloadType,
                            Name: moduleInfo.Name,
                            Description: moduleInfo.Description,
                            Properties: moduleInfo.Properties
                        }
                    };
                    //添加新窗口
                    setModulesData((prevState) => {
                        return [...prevState, newWindow];
                    });
                }else{
                    console.error(`未找到匹配的模块组: ${preloadType}`);
                }
            }else{
                // 如果不是模块浏览器，则为模块编辑器
                //如果没有找到模块，则使用默认模块
                const newWindow:ModulesData = {
                    GuiProps:{
                        id: Math.max(...modulesData.map(item => item.GuiProps.id)) + 1,
                        isOpen: true,
                        posX: 300+ 100*Math.random(),
                        posY: 300+ 100*Math.random(),
                        width: preloadWidth,
                        height: preloadHeight,
                        mode: 'ModulesEditor',
                    },
                    ModulesData:preLoadData.ModulesData? preLoadData.ModulesData : ModulesList[0].Modules[0]
                }
                console.log("新建窗口数据：", newWindow);
                //添加新窗口
                setModulesData((prevState) => {
                    return [...prevState, newWindow];
                }
                );
            }
        }else{
            //如果窗口id不为0，则视为已有窗口，直接打开
            //通过id查找窗口
            const window = modulesData.find(window => window.GuiProps.id === windowId);
            if (window) {
                //如果找到窗口，则打开
                setModulesData((prevState) => {
                    const updatedWindows = prevState.map(win => {
                        if (win.GuiProps.id === windowId) {
                            return { ...win, isOpen: true };
                        }
                        return win;
                    });
                    return updatedWindows;
                });
            }
        }
    },[modulesData]);

    const updateGUIStatus = useCallback((windowStatus : UpdateStatusInterface) => {
        setModulesData((prevState) => {
            const updatedWindows = prevState.map(window => {
                if (window.GuiProps.id === windowStatus.id) {
                    return { ...window, GuiProps: { ...window.GuiProps, ...windowStatus } };
                }
                return window;
            });
            return updatedWindows;
        });
    },[])

    const removeGUI = useCallback((windowId : number) => {
        setModulesData((prevState) => {
            const updatedWindows = prevState.filter(window => window.GuiProps.id !== windowId);
            return updatedWindows;
        });
    },[])

    const contextValue = {
        modulesData,
        actions:{
            setModulesData,
            openEditorGUI,
            updateGUIStatus,
            removeGUI
        }
    }

    return (
        <modulesEditorContext.Provider value={contextValue}>
            {children}
        </modulesEditorContext.Provider>
    )
}