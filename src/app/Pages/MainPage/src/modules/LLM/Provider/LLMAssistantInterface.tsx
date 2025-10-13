export interface LLMGUIProps{
    id: number;
    isOpen: boolean;
    pos:{
        x: number;
        y: number;
    }
    width: number;
    height: number;
    title: string;
}

export interface LLMActions{
    OpenLLMGUI: () => void;
    UpdateLLMGUIStatus: (guiProps: LLMGUIProps) => void;
    RemoveLLMGUI: (id: number) => void;
}

export interface LLMProviderInterface{
    GUIProps: LLMGUIProps;
    Actions: LLMActions;
}