import React, { useRef, useEffect } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';

export default function TimeDomainDiagram({ data, sampleRate }: { data: number[], sampleRate: number }) {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const uplotRef = useRef<uPlot | null>(null);

    useEffect(() => {
        if (uplotRef.current) {
            uplotRef.current.destroy();
        }

        // === 自动生成时间坐标 ===
        const x = Array.from({ length: data.length }, (_, i) => i / sampleRate);

        const options: uPlot.Options = {
            width: 500,
            height: 500,
            scales: {
                x: { time: false, min: 0, max: x[x.length - 1] },
                y: { time: false }
            },
            axes: [
                {
                    scale: 'x',
                    side: 2,
                    grid: { show: true },
                    ticks: { show: true },
                    stroke: '#f9fafb',
                    font: '12px sans-serif',
                    label: 'Time (s)'
                },
                {
                    scale: 'y',
                    side: 3,
                    grid: { show: true },
                    ticks: { show: true },
                    stroke: '#f9fafb',
                    font: '12px sans-serif',
                    label: 'Amplitude'
                }
            ],
            series: [
                {}, // x
                {
                    label: "Amplitude",
                    stroke: "#3b82f6",
                    width: 2
                }
            ],
            cursor: {
                drag: {
                    x: true,
                    y: true
                }
            }
        };

        const plotData = [
            new Float64Array(x),
            new Float64Array(data)
        ];

        if (chartRef.current) {
            uplotRef.current = new uPlot(options, plotData, chartRef.current);
        }

        return () => uplotRef.current?.destroy();
    }, [data, sampleRate]); // 监听 data 和 sampleRate 改变时更新

    return <div ref={chartRef} />;
}
