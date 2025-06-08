import React, { useRef, useEffect } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { ViewModuleDataTemplate } from '../Provider/ViewModuleDataTemplate';

export default function ConstellationDiagram({ iData,qData }) {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const uplotRef = useRef<uPlot | null>(null);

    useEffect(() => {
        if (uplotRef.current) {
            uplotRef.current.destroy();
        }

        const x = iData;
        const y = qData;

        const options: uPlot.Options = {
            width: ViewModuleDataTemplate.ViewModuleGUIProps.width,
            height: ViewModuleDataTemplate.ViewModuleGUIProps.height,
            scales: {
                x: { time: false, min: -2, max: 2 },
                y: { time: false, min: -2, max: 2 }
            },
            axes: [
                {
                    scale: 'x',
                    side: 2, // bottom
                    grid: { show: true },
                    ticks: { show: true },
                    stroke: '#f9fafb',
                    font: '12px sans-serif'
                },
                {
                    scale: 'y',
                    side: 3, // left
                    grid: { show: true },
                    ticks: { show: true },
                    stroke: '#f9fafb',
                    font: '12px sans-serif'
                },
                {
                    scale: 'x',
                    side: 0, // top
                    grid: { show: true },
                    ticks: { show: true },
                    stroke: '#f9fafb',
                    font: '12px sans-serif'
                },
                {
                    scale: 'y',
                    side: 1, // right
                    grid: { show: true },
                    ticks: { show: true },
                    stroke: '#f9fafb',
                    font: '12px sans-serif'
                }
            ],
            series: [
                {}, // x axis placeholder
                {
                    label: "IQ",
                    stroke: "transparent",
                    points: {
                        show: true,
                        size: 5,
                        stroke: "#10b981",
                        fill: "#10b981"
                    }
                }
            ],
            cursor: {
                drag: {
                    x: false,
                    y: false
                }, // 禁用拖拽
                focus: { prox: 16 }
            },
            hooks: {
                ready: [
                    (u) => {
                        // 可选：限制缩放缩不出去
                        u.setScale('x', { min: -2, max: 2 });
                        u.setScale('y', { min: -2, max: 2 });
                    }
                ]
            }
        };

        const data = [x, y];

        if (chartRef.current) {
            uplotRef.current = new uPlot(options, data, chartRef.current);
        }

        return () => uplotRef.current?.destroy();
    }, [iData, qData]);

    return <div ref={chartRef} />;
}
