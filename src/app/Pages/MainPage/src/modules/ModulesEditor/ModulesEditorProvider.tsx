import { createContext, useCallback, useContext, useState } from "react";
import { ModulesList } from "../ModulesLib/ModulesList";
import { ModulesData, ModulesDataProps, ModulesEditorProviderInterface } from "./ModulesEditorProviderInterface";
import { UpdateStatusInterface } from "../FloatWindow/FloatWindowPropInterface";

export interface PreloadData {
    windowId: number;
    windowMode: string;
    type: string;
    width: number;
    height: number;
    ModulesData?: ModulesDataProps;
    bindNodeID: number;
}

const modulesEditorContext = createContext<ModulesEditorProviderInterface | null>(null);

export const useModulesEditor = () => {
    const context = useContext(modulesEditorContext);
    if (!context) {
        throw new Error("useModulesEditor must be used within a ModulesEditorProvider");
    }
    return context;
};

export function ModulesEditorProvider({ children }) {
    const [modulesData, setModulesData] = useState<ModulesData[]>([
        {
            GuiProps: {
                id: 0,
                isOpen: false,
                posX: 0,
                posY: 0,
                width: 400,
                height: 300,
                mode: 'ModulesBrouser',
            },
            ModulesData: {
                Id: 0,
                Type: 'default',
                Name: 'defaultModule',
                Description: '这是一个默认模块',
                Properties: {
                    Fixed: {
                        ProcessMode: 'block',
                        BlockLength: 1024,
                        InputCount: 1,
                        OutputCount: 1,
                        ComponentType: "default.defaultModule",
                        ComponentID: 'default0'
                    },
                    Global: {
                        SampleRate: 10000,
                    },
                    Local: {
                        ComponentID: 'default0',
                        mode: 'default'
                    }
                }
            }
        }
    ]);

    const openEditorGUI = useCallback((preLoadData: PreloadData) => {
        const windowId = preLoadData.windowId;
        const windowMode = preLoadData.windowMode;
        const preloadType = preLoadData.type;
        const preloadWidth = preLoadData.width;
        const preloadHeight = preLoadData.height;

        if (windowId === 0) {
            if (windowMode === 'ModulesBrouser') {
                const moduleGroup = ModulesList.find(group => group.GroupName === preloadType);
                const fallbackGroup = ModulesList[0];
                const fallbackModule = fallbackGroup?.Modules[0];

                const moduleInfo = (moduleGroup && moduleGroup.Modules.length > 0)
                    ? moduleGroup.Modules[0]
                    : fallbackModule;

                if (moduleInfo) {
                    const newWindow = {
                        GuiProps: {
                            id: Math.max(...modulesData.map(item => item.GuiProps.id)) + 1,
                            isOpen: true,
                            posX: 100,
                            posY: 100,
                            width: preloadWidth,
                            height: preloadHeight,
                            mode: windowMode,
                        },
                        ModulesData: {
                            Id: preLoadData.bindNodeID || 0,
                            Type: preloadType,
                            Name: moduleInfo.Name,
                            Description: moduleInfo.Description,
                            Properties: moduleInfo.Properties
                        }
                    };
                    console.log("PreloadData: ", preLoadData);
                    console.log("新建窗口数据：", newWindow);
                    setModulesData(prevState => [...prevState, newWindow]);
                } else {
                    console.warn("未能找到任何模块组或模块，ModulesList 可能为空。");
                }
            } else {
                const newWindow: ModulesData = {
                    GuiProps: {
                        id: Math.max(...modulesData.map(item => item.GuiProps.id)) + 1,
                        isOpen: true,
                        posX: 300 + 100 * Math.random(),
                        posY: 300 + 100 * Math.random(),
                        width: preloadWidth,
                        height: preloadHeight,
                        mode: 'ModulesEditor',
                    },
                    ModulesData: {
                        Id: preLoadData.bindNodeID || 0,
                        Type: preloadType,
                        Name: preLoadData.ModulesData?.Name || '未命名模块',
                        Description: preLoadData.ModulesData?.Description || '这是一个新建模块',
                        Properties: {
                            Fixed: {
                                ProcessMode: 'block',
                                BlockLength: 1024,
                                InputCount: 1,
                                OutputCount: 1,
                                ComponentType: `${preloadType}.${preLoadData.ModulesData?.Name || 'defaultModule'}`,
                                ComponentID: `default${Math.floor(Math.random() * 1000)}`
                            },
                            Global: preLoadData.ModulesData?.Properties?.Global || { SampleRate: 10000 },
                            Local: preLoadData.ModulesData?.Properties?.Local || { mode: 'default' }
                        }
                    }
                };
                console.log("新建窗口数据：", newWindow);
                setModulesData(prevState => [...prevState, newWindow]);
            }
        } else {
            const window = modulesData.find(window => window.GuiProps.id === windowId);
            if (window) {
                setModulesData(prevState => {
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
    }, [modulesData]);

    const updateGUIStatus = useCallback((windowStatus: UpdateStatusInterface) => {
        setModulesData(prevState => {
            const updatedWindows = prevState.map(window => {
                if (window.GuiProps.id === windowStatus.id) {
                    return { ...window, GuiProps: { ...window.GuiProps, ...windowStatus } };
                }
                return window;
            });
            return updatedWindows;
        });
    }, []);

    const removeGUI = useCallback((windowId: number) => {
        setModulesData(prevState => {
            return prevState.filter(window => window.GuiProps.id !== windowId);
        });
    }, []);

    const contextValue = {
        modulesData,
        actions: {
            setModulesData,
            openEditorGUI,
            updateGUIStatus,
            removeGUI
        }
    };

    return (
        <modulesEditorContext.Provider value={contextValue}>
            {children}
        </modulesEditorContext.Provider>
    );
}
