import React, { useRef, useEffect } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { ViewModuleDataTemplate } from '../Provider/ViewModuleDataTemplate';

export default function TimeDomainDiagram({
    data,
    sampleRate
}: {
    data: number[],
    sampleRate: number
}) {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const uplotRef = useRef<uPlot | null>(null);

    useEffect(() => {
        if (uplotRef.current) {
            uplotRef.current.destroy();
        }

        // === 自动生成时间坐标 ===
        const x = Array.from({ length: data.length }, (_, i) => i / sampleRate);

        const initialXScale = {
            min: 0,
            max: x[x.length - 1]
        };

        const options: uPlot.Options = {
            width: ViewModuleDataTemplate.ViewModuleGUIProps.width,
            height: ViewModuleDataTemplate.ViewModuleGUIProps.height,
            scales: {
                x: { time: false, min: initialXScale.min, max: initialXScale.max },
                y: { time: false, auto: true }
            },
            axes: [
                {
                    scale: 'x',
                    side: 2,
                    grid: { show: true, stroke: '#444' },
                    ticks: { show: true },
                    stroke: '#222',
                    font: '12px sans-serif',
                    label: 'Time (s)',
                    labelFont: 'bold 14px sans-serif'
                },
                {
                    scale: 'y',
                    side: 3,
                    grid: { show: true, stroke: '#444' },
                    ticks: { show: true },
                    stroke: '#222',
                    font: '12px sans-serif',
                    label: 'Amplitude',
                    labelFont: 'bold 14px sans-serif'
                }
            ],
            series: [
                {},
                {
                    label: "Amplitude",
                    stroke: "#3b82f6",
                    width: 2
                }
            ],
            cursor: {
                drag: {
                    x: false,
                    y: false
                }
            }
        };

        const plotData = [
            new Float64Array(x),
            new Float64Array(data)
        ];

        if (chartRef.current) {
            uplotRef.current = new uPlot(options, plotData, chartRef.current);

            const plotRoot = uplotRef.current.root;

            // === 滚轮缩放 ===
            const handleWheel = (e: WheelEvent) => {
                e.preventDefault();

                const factor = e.deltaY < 0 ? 0.9 : 1.1;

                if (e.ctrlKey) {
                    // Ctrl + 滚轮 —— Y 轴缩放
                    const yStats = (uplotRef.current?.series[1] as any).stats;
                    if (yStats) {
                        const yCenter = (yStats.min + yStats.max) / 2;
                        const yRange = (yStats.max - yStats.min) * factor;
                        const newMin = yCenter - yRange / 2;
                        const newMax = yCenter + yRange / 2;
                        uplotRef.current?.setScale('y', { min: newMin, max: newMax });
                    }
                } else {
                    // 普通滚轮 —— X 轴缩放
                    const xScale = uplotRef.current?.scales.x;
                    if (xScale) {
                        const xCenter = (xScale.min! + xScale.max!) / 2;
                        const xRange = (xScale.max! - xScale.min!) * factor;
                        const newMin = xCenter - xRange / 2;
                        const newMax = xCenter + xRange / 2;
                        uplotRef.current?.setScale('x', { min: newMin, max: newMax });
                    }
                }
            };

            // === 左键拖动平移 ===
            let isDragging = false;
            let dragStartX = 0;
            let initialMin = 0;
            let initialMax = 0;

            const handleMouseDown = (e: MouseEvent) => {
                if (e.button === 0) { // 左键
                    e.preventDefault();
                    isDragging = true;
                    dragStartX = e.clientX;

                    const xScale = uplotRef.current?.scales.x;
                    if (xScale) {
                        initialMin = xScale.min!;
                        initialMax = xScale.max!;
                    }

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                }
            };

            const handleMouseMove = (e: MouseEvent) => {
                if (isDragging) {
                    const deltaPixels = e.clientX - dragStartX;
                    const plotWidth = uplotRef.current?.width ?? 1;
                    const xScale = uplotRef.current?.scales.x;
                    if (xScale) {
                        const scaleRange = initialMax - initialMin;
                        const deltaValue = -deltaPixels / plotWidth * scaleRange;

                        uplotRef.current?.setScale('x', {
                            min: initialMin + deltaValue,
                            max: initialMax + deltaValue
                        });
                    }
                }
            };

            const handleMouseUp = (e: MouseEvent) => {
                if (isDragging && e.button === 0) {
                    isDragging = false;
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                }
            };

            // === 右键复位 ===
            const handleContextMenu = (e: MouseEvent) => {
                e.preventDefault();

                uplotRef.current?.setScale('x', { min: initialXScale.min, max: initialXScale.max });

                const yStats = (uplotRef.current?.series[1] as any).stats;
                if (yStats) {
                    uplotRef.current?.setScale('y', {
                        min: yStats.min,
                        max: yStats.max
                    });
                }
            };

            // === 绑定事件 ===
            plotRoot.addEventListener('wheel', handleWheel, { passive: false });
            plotRoot.addEventListener('mousedown', handleMouseDown);
            plotRoot.addEventListener('contextmenu', handleContextMenu);

            // === 清理事件 ===
            return () => {
                uplotRef.current?.destroy();
                plotRoot.removeEventListener('wheel', handleWheel);
                plotRoot.removeEventListener('mousedown', handleMouseDown);
                plotRoot.removeEventListener('contextmenu', handleContextMenu);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [data, sampleRate]);

    return <div ref={chartRef} />;
}
