import { CollectiveContext } from "../ToolBarController";

function OpenProjectFile( filename:string,context:CollectiveContext){
     // 1️⃣ 动态创建 input 元素
     const input = document.createElement('input');
     input.type = 'file';
     input.accept = '.json';
 
     // 2️⃣ 绑定 onchange 事件
     input.onchange = (event) => {
         const file = (event.target as HTMLInputElement).files?.[0];
         if (!file) {
             return;
         }
 
         const reader = new FileReader();
         reader.onload = (e) => {
             try {
                 const text = e.target?.result as string;
                 const projectData = JSON.parse(text);
                 console.log("导入的项目数据:", projectData);
 
                 // 调用你的 importProject 逻辑
                 context.ProjectManager.Actions.importProject(projectData);
                 console.log("项目导入成功");
 
             } catch (error) {
                 console.error("导入项目失败，文件格式错误:", error);
             }
         };
 
         reader.readAsText(file);
     };
 
     // 3️⃣ 触发 input click
     input.click();
}

export function ToolBarFileManager( item,context:CollectiveContext )
{
    switch(item.id){
        case "NewProject":
            context.LogicGraph.Actions.openLogicGraph();
            break;
        case "OpenProject":
            OpenProjectFile(item.label, context);
            break;
        case "SaveProject":
            context.ProjectManager.Actions.exportProject(item.label);
            break;
        default:
            console.warn(`未处理的文件管理器项: ${item.id}`);
            break;
    }
    // 这里可以添加文件管理器的逻辑
}