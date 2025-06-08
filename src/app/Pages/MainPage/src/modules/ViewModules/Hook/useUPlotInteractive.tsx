import { useEffect } from 'react';
import uPlot from 'uplot';

export function useUPlotInteractive(
    uplotRef: React.MutableRefObject<uPlot | null>,
    initialXScale: { min: number, max: number }
) {
    useEffect(() => {
        const u = uplotRef.current;
        if (!u) return;

        const plotRoot = u.root;

        // === 滚轮缩放 ===
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            const factor = e.deltaY < 0 ? 0.9 : 1.1;

            if (e.ctrlKey) {
                // Y 轴缩放
                const yStats = (u.series[1] as any).stats;
                if (yStats) {
                    const yCenter = (yStats.min + yStats.max) / 2;
                    const yRange = (yStats.max - yStats.min) * factor;
                    const newMin = yCenter - yRange / 2;
                    const newMax = yCenter + yRange / 2;
                    u.setScale('y', { min: newMin, max: newMax });
                }
            } else {
                // X 轴缩放
                const xScale = u.scales.x;
                const xCenter = (xScale.min! + xScale.max!) / 2;
                const xRange = (xScale.max! - xScale.min!) * factor;
                const newMin = xCenter - xRange / 2;
                const newMax = xCenter + xRange / 2;
                u.setScale('x', { min: newMin, max: newMax });
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

                const xScale = u.scales.x;
                initialMin = xScale.min!;
                initialMax = xScale.max!;

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const deltaPixels = e.clientX - dragStartX;
                const plotWidth = u.width ?? 1;
                const scaleRange = initialMax - initialMin;
                const deltaValue = -deltaPixels / plotWidth * scaleRange;

                u.setScale('x', {
                    min: initialMin + deltaValue,
                    max: initialMax + deltaValue
                });
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

            u.setScale('x', { min: initialXScale.min, max: initialXScale.max });

            const yStats = (u.series[1] as any).stats;
            if (yStats) {
                u.setScale('y', {
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
            plotRoot.removeEventListener('wheel', handleWheel);
            plotRoot.removeEventListener('mousedown', handleMouseDown);
            plotRoot.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [uplotRef, initialXScale]);
}
