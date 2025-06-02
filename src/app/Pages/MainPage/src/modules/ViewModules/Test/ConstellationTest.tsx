import React, { useState, useEffect } from 'react';
import ConstellationDiagram from './ConstellationDiagram';

interface IQDataPoint {
    i: number;
    q: number;
}

export default function TestConstellationV2() {
    const [iqData, setIqData] = useState<IQDataPoint[]>([]);

    useEffect(() => {
        // 生成 QPSK 星座图数据
        const constellationPoints = [
            { i: 1, q: 1 },
            { i: -1, q: 1 },
            { i: -1, q: -1 },
            { i: 1, q: -1 }
        ];

        const newIqData = Array.from({ length: 1000 }, () => {
            const p = constellationPoints[Math.floor(Math.random() * 4)];
            return {
                i: p.i + (Math.random() - 0.5) * 0.1,
                q: p.q + (Math.random() - 0.5) * 0.1
            };
        });

        setIqData(newIqData);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-2xl mb-4">Test: Constellation Diagram (QPSK)</h1>
            <ConstellationDiagram iqData={iqData} />
        </div>
    );
}
