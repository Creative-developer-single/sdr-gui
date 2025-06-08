/*
    说明：本文件定义了目前版本下的模块列表清单，供模块管理器调用
*/

import { ArithmeticModules } from "./Group/Arithmetic/ArithmeticModules"
import { ReceiveSourceModules } from "./Group/ReceiveSource/ReceiveSourceModules"
import { SendSourceModules } from "./Group/SendSource/SendSourceModules"
import { DataBufferModules } from "./Group/Others/DataBuffer/DataBufferModules"
import { VisualModules } from "./Group/Visual/VisualModules"
import { FIRModules } from "./Group/FIR/FIRModules"
import { RFModules } from "./Group/RF/RFModules"
import { ConverterModules } from "./Group/Converter/ConverterModules"
import { ShapeFilterModules } from "./Group/ShapeFilter/ShapeFilterModules"
import { AFCModules } from "./Group/AFC/AFCModules"
import { OthersModules } from "./Group/Others/OthersModules"

//分类 -> 模块名
export const ModulesList = [
    { GroupName: 'SendSource',Modules: SendSourceModules.Modules},
    { GroupName: 'ReceiveSource',Modules: ReceiveSourceModules.Modules},
    { GroupName: 'Arithmetic', Modules: ArithmeticModules.Modules},
    { GroupName: 'Others', Modules: OthersModules.Modules},
    { GroupName: 'Visual',Modules:VisualModules.Modules},
    { GroupName: 'FIR',Modules:FIRModules.Modules},
    { GroupName: 'RF',Modules:RFModules.Modules}, // 射频模块目前没有
    { GroupName: 'ShapeFilter',Modules:ShapeFilterModules.Modules},
    { GroupName: 'Converter',Modules:ConverterModules.Modules},
    { GroupName: 'AFC',Modules:AFCModules.Modules}

]
export const ModulesListAlias = {
    Default:{
        Name:'默认',
        default:{
            default:'默认',
        }
    },
    Fixed:{
        // 固定属性
        ProcessMode:'处理模式',
        BlockLength:'块长度',
        InputCount:'输入端口数量',
        OutputCount:'输出端口数量',
        ComponentType:'组件类型',
        ComponentID:'组件ID'
    },
    Global:{
        // 全局属性
        SampleRate:'采样率'
    },
    Arithmetic:{
        Name:'运算器',
        BasicALU:{
            Name:'基础运算单元',
            OperationMode:'运算模式'
        },
        Calculus:{
            Name:'微积分运算单元',
            OperationMode:'运算模式'
        },
        NonLinear:{
            Name:'非线性运算单元',
            OperationMode:'运算模式'
        },
        GainBlock:{
            Name:'增益块',
            GainFactor:'增益因子'
        }
    },
    SendSource:{
        Name:'发送源',
        SignalGenerator:{
            Name:'多波形发生器',
            signalType:'信号类型',
            frequency:'频率',
            amplitude:'幅度',
            blockPhase:'相位'
        },
        RandomGenerator:{
            Name:'随机噪声发生器',
            NoisePower:'噪声功率',
            NoiseType:'噪声类型'
        },
        RandomNumGenerator:{
            Name:'随机数发生器',
            Rb:'比特速率',
        }
    },
    ReceiveSource:{
        Name:'接收源',
        randomReceiver:{
            Name:'随机接收器',
            mode:'模式'
        }
    },
    FIR:{
        Name:'FIR滤波器',
        FIRLowPass:{
            Name:'FIR低通滤波器',
            CutOffFrequency:'截止频率',
            WindowLength:'窗口长度',
            WindowType:'窗口类型'
        },
        FIRHighPass:{
            Name:'FIR高通滤波器',
            CutOffFrequency:'截止频率',
            WindowLength:'窗口长度',
            WindowType:'窗口类型'
        },
        FIRBandPass:{
            Name:'FIR带通滤波器',
            LowCutOffFrequency:'低截止频率',
            HighCutOffFrequency:'高截止频率',
            WindowLength:'窗口长度',
            WindowType:'窗口类型'
        },
        FIRBandStop:{
            Name:'FIR带阻滤波器',
            LowCutOffFrequency:'低截止频率',
            HighCutOffFrequency:'高截止频率',
            WindowLength:'窗口长度',
            WindowType:'窗口类型'
        }
    },
    RF:{
        Name:'射频模块',
        RPLL:{
            Name:'射频锁相环',
            CenterFrequency:'中心频率',
            DesiredLockedFrequency:'期望锁定频率'
        }
    },
    ShapeFilter:{
        Name:'成形滤波器',
        RRCFilter:{
            Name:'根升余弦滤波器',
            Rs:'符号率',
            Span:'滤波器宽度',
            Alpha:'滚降系数',
            Mode:'模式'
        },
        RectFilter:{
            Name:'矩形滤波器',
            Rs:'符号率',
            Span:'滤波器宽度'
        }
    },
    AFC:{
        Name:'自动频率控制',
        AGC:{
            Name:'自动增益控制器',
            TargetLevel:'目标增益水平',
            Step:'步长',
            WindowLength:'窗口长度'
        }
    },
    Converter:{
        Name:'转换器',
        DataConverter:{
            Name:'数据转换器',
            ConvertType:'转换类型',
        },
        DataAllocator:{
            Name:'数据分配器',
        },
        DataCombiner:{
            Name:'数据合并器',
        }
    },
    Others:{
        Name:'其他模块',
        SinglePortBuffer:{
            Name:'单端口数据缓冲区',
            bufferLength:'缓冲区长度'
        },
        Resample:{
            Name:'重采样模块',
            SourceSampleRate:'源采样率',
            TargetSampleRate:'目标采样率'
        }
    },
    Visual:{
        Name:'可视化模块',
        Oscilloscope:{
            Name:'示波器',
            bufferLength:'缓冲区长度',
            DataType:'数据类型'
        },
        SpectrumAnalyzer:{
            Name:'频谱分析仪',
            bufferLength:'FFT点数',
            SpectrumType:'频谱类型'
        },
        ConstellationDiagram:{
            Name:'星座图',
            bufferLength:'缓冲区长度'
        }
    },
}
