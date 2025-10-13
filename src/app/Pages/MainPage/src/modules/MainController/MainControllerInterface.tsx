import { CollectiveContext } from "../ToolBar/Controller/ToolBarController";
import { ToolBarSelectionItem } from "../ToolBar/ToolBarSelection";

export interface MainControllerActions{
    MainActionsController: (itemID:string,item:ToolBarSelectionItem) => void;
}

export interface MainControllerInterface{
    Actions:MainControllerActions;
}