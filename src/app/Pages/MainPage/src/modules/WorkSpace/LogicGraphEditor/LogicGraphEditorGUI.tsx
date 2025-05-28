import { useRef, useState, useEffect } from 'react';
import '../../../css/index.css';

export function LogicGraphGUI({ isOpen } : { isOpen: boolean }) {
    return (
        <div className='w-full flex-grow'>
            { isOpen ? (
                <LogicGraphEditorGUIMain />
            ) :(
                <main className="flex-grow h-full p-4 bg-white overflow-auto">
                    <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                        <p className="text-gray-400 text-lg">主工作区 (信号流图编辑器)</p>
                    </div>
                </main>
                
            )}
        </div>
    )
}

export function LogicGraphEditorGUIMain() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetStartRef = useRef({ x: 0, y: 0 });

  const ZOOM_STEP = 0.1;
  const ZOOM_MIN = 0.2;
  const ZOOM_MAX = 4;

  // === 缩放时根据鼠标位置补偿偏移 ===
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    const newScale = Math.min(Math.max(scale + delta, ZOOM_MIN), ZOOM_MAX);
    const scaleFactor = newScale / scale;

    const newOffset = {
      x: mouseX - (mouseX - offset.x) * scaleFactor,
      y: mouseY - (mouseY - offset.y) * scaleFactor,
    };

    setScale(newScale);
    setOffset(newOffset);
  };

  // === 拖动逻辑 ===
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    offsetStartRef.current = { ...offset };
    document.body.classList.add('user-select-none');
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setOffset({
      x: offsetStartRef.current.x + dx,
      y: offsetStartRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.body.classList.remove('user-select-none');
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [offset]);

  return (
    <main
      className="relative flex-grow p-4 bg-white overflow-hidden h-full"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
    >
      {/* 网格背景 + 画布 */}
      <div
        className="canvas-grid absolute z-0 w-[5000px] h-[5000px] bg-gray-100"
        ref={canvasRef}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
      </div>
    </main>
  );
}
