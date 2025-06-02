import React, { useState, useEffect } from 'react';
import ConstellationDiagram from './TestForScattering';

interface IQDataPoint {
    i: number;
    q: number;
}

export default function TestConstellation() {
    const [iqData, setIqData] = useState<IQDataPoint[] | null>([]);

    useEffect(() => {
        // 生成 IQ 数据，示例 QPSK 星座点 + 噪声
        const generateIQData = () => {
            const constellationPoints = [
                { i: 1, q: 1 },
                { i: -1, q: 1 },
                { i: -1, q: -1 },
                { i: 1, q: -1 }
            ];
            const data:IQDataPoint[] = [];
            for (let i = 0; i < 500; i++) {
                const point = constellationPoints[Math.floor(Math.random() * constellationPoints.length)];
                const noiseLevel = 0.1;
                data.push({
                    i: point.i + (Math.random() - 0.5) * noiseLevel,
                    q: point.q + (Math.random() - 0.5) * noiseLevel
                });
            }
            return data;
        };

        // 生成一次数据
        setIqData(generateIQData());
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
            <h1 className="text-2xl mb-4">Test: Constellation Diagram</h1>
            <ConstellationDiagram iqData={iqData} />
        </div>
    );
}
