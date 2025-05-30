/*
    说明：本文件定义了目前版本下的模块列表清单，供模块管理器调用
*/

import { ArithmeticModules } from "./Group/Arithmetic/ArithmeticModules"
import { DefaultModules } from "./Group/Default/DefaultModules"
import { ReceiveSourceModules } from "./Group/ReceiveSource/ReceiveSourceModules"
import { SendSourceModules } from "./Group/SendSource/SendSourceModules"
import { DataBufferModules } from "./Group/Others/DataBuffer/DataBuffers"

//分类 -> 模块名
export const ModulesList = [
    { GroupName: 'Default', Modules: DefaultModules.Modules},
    { GroupName: 'SendSource',Modules: SendSourceModules.Modules},
    { GroupName: 'ReceiveSource',Modules: ReceiveSourceModules.Modules},
    { GroupName: 'Arithmetic', Modules: ArithmeticModules.Modules},
    { GroupName: 'DataBuffer', Modules: DataBufferModules.Modules},
]
export const ModulesListAlias = {
    // 固定属性
    ProcessMode:'处理模式',
    BlockLength:'块长度',
    InputCount:'输入端口数量',
    OutputCount:'输出端口数量',
    ComponentType:'组件类型',

    // 全局属性
    SampleRate:'采样率',

    // 本地属性
    ComponentID:'组件ID',
    mode:'模式',

    trigger:'触发',
    signalType:'信号类型',
    frequency:'频率',
    amplitude:'幅度',
    blockPhase:'相位',

    bufferLength:'缓冲区长度',
}
