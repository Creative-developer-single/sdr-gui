import { SimulationProps } from "../SimulationInterface"

export const SimulationSettingsTemplate:SimulationProps = {
    SimulationMode:"Static",
    SimulationTime:5,
    SimulationTimeStep:0.1,
    SimulationSampleRate:5000,
    SimulationPerFrameTime:0.1

}

export const SimulationBasicSettingsListAlias = {
    SimulationMode:"仿真模式",
    SimulationTime:"仿真时间(s)",
    SimulationTimeStep:"仿真时间步长(s)",
    SimulationSampleRate:"仿真采样率(Hz)",
    SimulationPerFrameTime:"每帧长度(s)"
}