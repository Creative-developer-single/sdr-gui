import { ModulesData } from "../ModulesEditor/ModulesEditorProviderInterface";

interface ModulesDataParseInterface {
    valueI: number; // 实部
    valueQ: number; // 虚部
}

export interface ModulesParseInterface{
    moduleID: number; // 模块ID
    dataLength: number; // 数据长度（复数对的数量）
    data: ModulesDataParseInterface[]; // 模块数据，包含复数对
}

interface bufferInterface{
    ID:number,
    Data:Uint8Array,
    Type:String
}

export function parseModules(buffer: Uint8Array) {
    // 用 DataView 读取各种数值
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    let offset = 0;

    // 先读取模块总数
    const moduleLength = view.getInt32(offset, false);  // big-endian
    offset += 4;

    const modules: ModulesParseInterface[] = [];

    for (let i = 0; i < moduleLength; i++) {
        // 读取 moduleID
        const moduleID = view.getInt32(offset, false);
        offset += 4;

        // 读取 moduleDataLength
        const moduleDataLength = view.getInt32(offset, false);
        offset += 4;

        // 读取 moduleData，按照复数交替规则 (每个复数占 16 字节)
        const moduleData: ModulesDataParseInterface[] = [];
        for (let j = 0; j < moduleDataLength; j++) {
            const valueI = view.getFloat64(offset, false);  // real part
            offset += 8;

            const valueQ = view.getFloat64(offset, false);  // imag part
            offset += 8;

            moduleData.push({
                valueI: valueI,
                valueQ: valueQ
            });
        }

        // 保存模块
        modules.push({
            moduleID: moduleID,
            dataLength: moduleDataLength,
            data: moduleData
        });
    }

    return modules;
}
