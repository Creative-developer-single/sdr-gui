import React, { useRef, useEffect } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { ViewModuleDataTemplate } from '../Provider/ViewModuleDataTemplate';
import { useUPlotInteractive } from '../Hook/useUPlotInteractive'; // 引入 Hook！

export default function ConstellationDiagram({ iData, qData }: { iData: number[], qData: number[] }) {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const uplotRef = useRef<uPlot | null>(null);

    useEffect(() => {
        if (uplotRef.current) {
            uplotRef.current.destroy();
        }

        const x = iData;
        const y = qData;

        // === 自动计算 x/y 范围 ===
        const minX = Math.min(...iData);
        const maxX = Math.max(...iData);
        const minY = Math.min(...qData);
        const maxY = Math.max(...qData);

        const padding = 0.1; // 防止点贴边
        const xMin = minX - padding;
        const xMax = maxX + padding;
        const yMin = minY - padding;
        const yMax = maxY + padding;

        const options: uPlot.Options = {
            width: ViewModuleDataTemplate.ViewModuleGUIProps.width,
            height: ViewModuleDataTemplate.ViewModuleGUIProps.height,
            scales: {
                x: { time: false, min: xMin, max: xMax },
                y: { time: false, min: yMin, max: yMax }
            },
            axes: [
                {
                    scale: 'x',
                    side: 2, // bottom
                    grid: { show: true, stroke: '#444' },
                    ticks: { show: true },
                    stroke: '#222',
                    font: '12px sans-serif',
                    label: 'In-Phase',
                    labelFont: 'bold 14px sans-serif'
                },
                {
                    scale: 'y',
                    side: 3, // left
                    grid: { show: true, stroke: '#444' },
                    ticks: { show: true },
                    stroke: '#222',
                    font: '12px sans-serif',
                    label: 'Quadrature',
                    labelFont: 'bold 14px sans-serif'
                },
                {
                    scale: 'x',
                    side: 0, // top
                    grid: { show: true, stroke: '#444' },
                    ticks: { show: true },
                    stroke: '#222',
                    font: '12px sans-serif'
                },
                {
                    scale: 'y',
                    side: 1, // right
                    grid: { show: true, stroke: '#444' },
                    ticks: { show: true },
                    stroke: '#222',
                    font: '12px sans-serif'
                }
            ],
            series: [
                {}, // x axis placeholder
                {
                    label: "IQ",
                    stroke: "transparent", // 不连线
                    points: {
                        show: true,
                        size: 5,
                        stroke: "#10b981", // 点边框
                        fill: "#10b981"    // 点填充
                    }
                }
            ],
            cursor: {
                drag: {
                    x: false,
                    y: false
                },
                focus: { prox: 16 }
            }
        };

        const data = [
            new Float64Array(x),
            new Float64Array(y)
        ];

        if (chartRef.current) {
            uplotRef.current = new uPlot(options, data, chartRef.current);
        }

        return () => uplotRef.current?.destroy();
    }, [iData, qData]);

    // === 使用 Hook 加交互！ ===
    const xScaleForHook = {
        min: Math.min(...iData) - 0.1,
        max: Math.max(...iData) + 0.1
    };
    useUPlotInteractive(uplotRef, xScaleForHook);

    return <div ref={chartRef} />;
}
