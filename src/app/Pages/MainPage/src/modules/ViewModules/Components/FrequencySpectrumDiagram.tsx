import React, { useRef, useEffect } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { ViewModuleDataTemplate } from '../Provider/ViewModuleDataTemplate';

export default function FrequencySpectrumDiagram({
    freqData,
    sampleRate
}: {
    freqData: number[],
    sampleRate: number
}) {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const uplotRef = useRef<uPlot | null>(null);

    useEffect(() => {
        if (uplotRef.current) {
            uplotRef.current.destroy();
        }

        const fftLength = freqData.length;
        const df = sampleRate / fftLength;
        const halfLength = Math.floor(fftLength / 2);
        const freqBins = Array.from({ length: fftLength }, (_, i) => (i - halfLength) * df);

        const initialXScale = {
            min: freqBins[0],
            max: freqBins[freqBins.length - 1]
        };

        const initialYAuto = true; // Y 轴初始保持 auto，后面平移不改 auto，缩放才改

        const options: uPlot.Options = {
            width: ViewModuleDataTemplate.ViewModuleGUIProps.width,
            height: ViewModuleDataTemplate.ViewModuleGUIProps.height,
            scales: {
                x: {
                    time: false,
                    min: initialXScale.min,
                    max: initialXScale.max
                },
                y: {
                    time: false,
                    auto: initialYAuto
                }
            },
            axes: [
                {
                    scale: 'x',
                    side: 2,
                    grid: { show: true, stroke: '#444' },
                    ticks: { show: true },
                    stroke: '#222',
                    font: '12px sans-serif',
                    label: 'Frequency (Hz)',
                    labelFont: 'bold 14px sans-serif',
                    values: (u, ticks) => ticks.map(val => `${(val / 1000).toFixed(1)} kHz`)
                },
                {
                    scale: 'y',
                    side: 3,
                    grid: { show: true, stroke: '#444' },
                    ticks: { show: true },
                    stroke: '#222',
                    font: '12px sans-serif',
                    label: 'Magnitude (dB)',
                    labelFont: 'bold 14px sans-serif'
                }
            ],
            series: [
                {},
                {
                    label: "Spectrum",
                    stroke: "#f59e0b",
                    width: 2
                }
            ],
            cursor: {
                drag: {
                    x: false, // 禁用内置拖动，改为自定义拖动
                    y: false
                }
            }
        };

        const data = [
            new Float64Array(freqBins),
            new Float64Array(freqData)
        ];

        if (chartRef.current) {
            uplotRef.current = new uPlot(options, data, chartRef.current);

            const plotRoot = uplotRef.current.root;

            // === 滚轮缩放 ===
            const handleWheel = (e: WheelEvent) => {
                e.preventDefault();

                const factor = e.deltaY < 0 ? 0.9 : 1.1;

                if (e.ctrlKey) {
                    // Ctrl + 滚轮 ——> Y 缩放
                    const yScale = uplotRef.current?.scales.y;
                    if (yScale && !yScale.auto) {
                        const yCenter = (yScale.min! + yScale.max!) / 2;
                        const yRange = (yScale.max! - yScale.min!) * factor;
                        const newMin = yCenter - yRange / 2;
                        const newMax = yCenter + yRange / 2;
                        uplotRef.current?.setScale('y', { min: newMin, max: newMax });
                    } else if (yScale && yScale.auto) {
                        // 先解除 auto，再缩放
                        const yStats = (uplotRef.current?.series[1] as any).stats;
                        if (yStats) {
                            uplotRef.current?.setScale('y', {
                                min: yStats.min,
                                max: yStats.max
                            });
                        }

                        const yCenter = (yStats.min + yStats.max) / 2;
                        const yRange = (yStats.max - yStats.min) * factor;
                        const newMin = yCenter - yRange / 2;
                        const newMax = yCenter + yRange / 2;
                        uplotRef.current?.setScale('y', { min: newMin, max: newMax });
                    }
                } else {
                    // 普通滚轮 ——> X 缩放
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

            // === 鼠标左键拖动平移 ===
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
                e.preventDefault(); // 禁用默认右键菜单
            
                uplotRef.current?.setScale('x', { min: initialXScale.min, max: initialXScale.max });
            
                const yStats = (uplotRef.current?.series[1] as any).stats;
                if (yStats) {
                    uplotRef.current?.setScale('y', {
                    min: yStats.min,
                    max: yStats.max
                    });
}

            };
            

            // === 添加事件监听 ===
            plotRoot.addEventListener('wheel', handleWheel, { passive: false });
            plotRoot.addEventListener('mousedown', handleMouseDown);
            plotRoot.addEventListener('contextmenu', handleContextMenu);

            // === 清理 ===
            return () => {
                uplotRef.current?.destroy();
                plotRoot.removeEventListener('wheel', handleWheel);
                plotRoot.removeEventListener('mousedown', handleMouseDown);
                plotRoot.removeEventListener('contextmenu', handleContextMenu);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }

    }, [freqData, sampleRate]);

    return <div ref={chartRef} />;
}
