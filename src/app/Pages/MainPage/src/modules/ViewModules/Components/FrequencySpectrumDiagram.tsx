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

        // === 根据 sampleRate 和数据长度计算 freqBins ===
        const fftLength = freqData.length; // FFT长度
        const freqBins = Array.from({ length: fftLength }, (_, i) => i * sampleRate / fftLength);

        const options: uPlot.Options = {
            width: ViewModuleDataTemplate.ViewModuleGUIProps.width,
            height: ViewModuleDataTemplate.ViewModuleGUIProps.height,
            scales: {
                x: { time: false, min: freqBins[0], max: freqBins[freqBins.length - 1] },
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
                    label: 'Frequency (Hz)'
                },
                {
                    scale: 'y',
                    side: 3,
                    grid: { show: true },
                    ticks: { show: true },
                    stroke: '#f9fafb',
                    font: '12px sans-serif',
                    label: 'Magnitude (dB)'
                }
            ],
            series: [
                {}, // x
                {
                    label: "Spectrum",
                    stroke: "#f59e0b",
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

        const data = [
            new Float64Array(freqBins),
            new Float64Array(freqData)
        ];

        if (chartRef.current) {
            uplotRef.current = new uPlot(options, data, chartRef.current);
        }

        return () => uplotRef.current?.destroy();
    }, [freqData, sampleRate]); // 监听 freqData 和 sampleRate 变化

    return <div ref={chartRef} />;
}
