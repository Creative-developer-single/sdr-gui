import { useViewModule } from "../Provider/ViewModuleProvider";
import { ViewModulesGUIMain } from "./ViewModulesGUIMain";

export function ViewModulesGUI(){
    // 获取当前的可视化模块Context
    const viewModuleContext = useViewModule();

    // 获取当前可视化模块数据
    const viewModuleData = viewModuleContext.ViewModuleData;

    return (
        <div>
            {viewModuleData.map((item, index) => {
                if(item.ViewModuleGUIProps.id === 0 || !item.ViewModuleGUIProps.isOpen){
                    // 如果窗口ID为0或窗口未打开，则不渲染该组件
                    return null;
                }
                return (
                    <ViewModulesGUIMain key={item.ViewModuleGUIProps.id} ViewModulesItem={item}></ViewModulesGUIMain>
                );
            })}
        </div>
    );
}
