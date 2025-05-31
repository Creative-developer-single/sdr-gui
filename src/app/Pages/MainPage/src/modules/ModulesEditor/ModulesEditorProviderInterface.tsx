import { UpdateStatusInterface } from "../FloatWindow/FloatWindowPropInterface"

interface ModulesDynamicProps{
    [key : string] : any
}

interface ModulesEditorGUIProps{
    id:number,
    isOpen:boolean,
    posX:number,
    posY:number,
    width:number,
    height:number,
    mode:string
}

export interface ModulesDataProps{
    Type:string,
    Name:string,
    Description:string,
    Properties:{
        Fixed:{
            ProcessMode:string,
            BlockLength:number,
            InputCount:number,
            OutputCount:number,
            ComponentType:string,
            ComponentID:string
        },
        Global?:ModulesDynamicProps,
        Local?:ModulesDynamicProps
    }
}

export interface ModulesData{
    GuiProps:ModulesEditorGUIProps,
    ModulesData:ModulesDataProps
}

export interface ModulesEditorActions{
    openEditorGUI:(preLoadData:any) => void,
    updateGUIStatus:(windowStatus : UpdateStatusInterface) => void,
    removeGUI:(id:number) => void,
}

export interface ModulesEditorProviderInterface{
    modulesData:ModulesData[],
    actions:ModulesEditorActions,
}