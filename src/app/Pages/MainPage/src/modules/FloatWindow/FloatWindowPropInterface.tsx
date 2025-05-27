
export interface UpdateStatusInterface{
    id: number;
    isOpen: boolean;
    width: number;
    height: number;
    posX: number;
    posY: number;
}

export interface FloatWindowProp{
    id: number;
    isOpen: boolean;
    width: number;
    height: number;
    posX: number;
    posY: number;
}

export interface FloatWindowPropInterface {
    //props
    id: number;
    icon: string;
    title: string;
    isOpen: boolean;
    width: number;
    height: number;
    posX: number;
    posY: number;

    onUpdateStatus: (data:UpdateStatusInterface) => void;
    onGUIDestroy: (id:number) => void;
}