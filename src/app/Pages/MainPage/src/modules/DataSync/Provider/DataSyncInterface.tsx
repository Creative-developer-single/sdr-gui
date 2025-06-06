import { ViewModuleGetNodesDataProps } from "../../ViewModules/Provider/ViewModuleInterface";

interface DataSyncActions{
    // 获取后端数据
    getNodesData: () => Promise<any>;
}

export interface DataSyncGetNodesDataProps{
    Nodes:ViewModuleGetNodesDataProps[];
}

export interface DataSyncProviderInterface {
    Actions: DataSyncActions; // 数据同步操作类
}