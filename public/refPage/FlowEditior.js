import React, { useState, useRef, useEffect, useCallback } from 'react';

// 默认节点样式
const defaultNodeStyle = "bg-blue-500 text-white p-4 rounded-lg shadow-md cursor-grab select-none";
const nodeContainerStyle = "absolute"; // 用于节点定位

// 节点组件
const Node = ({ id, x, y, content, onDragStart, isSelected }) => {
  return (
    <div
      id={id}
      className={`${nodeContainerStyle} ${defaultNodeStyle} ${isSelected ? 'ring-2 ring-yellow-400' : ''}`}
      style={{ left: `${x}px`, top: `${y}px`, touchAction: 'none' }} // touchAction: 'none' 改善触摸设备上的拖动体验
      onMouseDown={(e) => onDragStart(e, id)}
      onTouchStart={(e) => onDragStart(e, id)} // 支持触摸设备
    >
      {content}
    </div>
  );
};

// 流图编辑器主组件
const FlowDiagramEditor = () => {
  // 画布的变换状态：缩放比例、X轴平移、Y轴平移
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  // 节点列表及其状态
  const [nodes, setNodes] = useState([
    { id: 'node-1', x: 50, y: 50, content: '节点 1' },
    { id: 'node-2', x: 250, y: 150, content: '节点 2' },
    { id: 'node-3', x: 100, y: 250, content: '这是\n一个\n多行节点' },
  ]);

  // 编辑器容器的引用，用于获取其尺寸和位置
  const editorRef = useRef(null);
  // 是否正在平移画布的状态
  const [isPanning, setIsPanning] = useState(false);
  // 平移开始时的鼠标位置
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // 正在拖动的节点ID及其偏移量
  const [draggingNode, setDraggingNode] = useState(null); // { id: string, offsetX: number, offsetY: number }

  // 处理鼠标滚轮事件，实现缩放
  const handleWheel = useCallback((event) => {
    event.preventDefault();
    const editorRect = editorRef.current.getBoundingClientRect();
    // 鼠标指针相对于编辑器左上角的位置
    const mouseX = event.clientX - editorRect.left;
    const mouseY = event.clientY - editorRect.top;

    // 缩放因子，可以根据需要调整
    const zoomIntensity = 0.1;
    const delta = event.deltaY > 0 ? -zoomIntensity : zoomIntensity; // 滚轮向下deltaY为正，表示缩小

    const newScale = Math.max(0.1, Math.min(scale + delta, 5)); // 限制缩放范围

    // 计算缩放前的鼠标在画布坐标系中的位置
    // (mouseX - translateX) / scale = worldX
    // (mouseY - translateY) / scale = worldY
    const worldX = (mouseX - translateX) / scale;
    const worldY = (mouseY - translateY) / scale;

    // 计算缩放后的新平移量，以保持鼠标指针下的内容不变
    // mouseX = worldX * newScale + newTranslateX  => newTranslateX = mouseX - worldX * newScale
    const newTranslateX = mouseX - worldX * newScale;
    const newTranslateY = mouseY - worldY * newScale;

    setScale(newScale);
    setTranslateX(newTranslateX);
    setTranslateY(newTranslateY);
  }, [scale, translateX, translateY]);

  // 处理鼠标按下事件，开始平移或节点拖动
  const handleMouseDown = useCallback((event) => {
    // 检查点击目标是否为节点本身或其子元素
    const targetIsNode = event.target.closest(`.${nodeContainerStyle.split(' ')[0]}`); // 使用nodeContainerStyle的第一个类名作为选择器
    
    if (targetIsNode) {
      // 如果点击在节点上，则不进行画布平移，而是准备节点拖动
      // 节点拖动逻辑在 Node 组件的 onMouseDown 中处理
      return;
    }

    // 如果点击在画布背景上，则开始平移
    if (event.button === 0) { // 仅响应鼠标左键
      setIsPanning(true);
      setPanStart({ x: event.clientX, y: event.clientY });
      editorRef.current.style.cursor = 'grabbing'; // 改变鼠标样式为抓取
    }
  }, []);


  // 处理鼠标移动事件，执行平移或节点拖动
  const handleMouseMove = useCallback((event) => {
    if (isPanning) {
      const dx = event.clientX - panStart.x;
      const dy = event.clientY - panStart.y;
      setTranslateX(prevTx => prevTx + dx);
      setTranslateY(prevTy => prevTy + dy);
      setPanStart({ x: event.clientX, y: event.clientY });
    } else if (draggingNode) {
      const editorRect = editorRef.current.getBoundingClientRect();
      // 将屏幕坐标转换为画布内坐标
      const mouseXInCanvas = (event.clientX - editorRect.left - translateX) / scale;
      const mouseYInCanvas = (event.clientY - editorRect.top - translateY) / scale;
      
      setNodes(prevNodes =>
        prevNodes.map(node =>
          node.id === draggingNode.id
            ? { ...node, x: mouseXInCanvas - draggingNode.offsetX, y: mouseYInCanvas - draggingNode.offsetY }
            : node
        )
      );
    }
  }, [isPanning, panStart, draggingNode, scale, translateX, translateY]);

  // 处理鼠标松开事件，结束平移或节点拖动
  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      editorRef.current.style.cursor = 'grab'; // 恢复鼠标样式
    }
    if (draggingNode) {
      setDraggingNode(null); // 结束节点拖动
    }
  }, [isPanning, draggingNode]);

  // 处理节点拖动开始
  const handleNodeDragStart = useCallback((event, nodeId) => {
    event.stopPropagation(); // 防止触发画布的 mousedown 事件
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const eventX = event.type.startsWith('touch') ? event.touches[0].clientX : event.clientX;
    const eventY = event.type.startsWith('touch') ? event.touches[0].clientY : event.clientY;
    
    const editorRect = editorRef.current.getBoundingClientRect();
    // 鼠标在画布坐标系中的位置
    const mouseXInCanvas = (eventX - editorRect.left - translateX) / scale;
    const mouseYInCanvas = (eventY - editorRect.top - translateY) / scale;

    // 鼠标在节点内的偏移量
    const offsetX = mouseXInCanvas - node.x;
    const offsetY = mouseYInCanvas - node.y;
    
    setDraggingNode({ id: nodeId, offsetX, offsetY });
  }, [nodes, scale, translateX, translateY]);


  // 添加全局事件监听器，用于在编辑器外部松开鼠标时也能结束平移/拖动
  useEffect(() => {
    const handleGlobalMouseUp = (e) => {
      handleMouseUp(e);
    };
    const handleGlobalMouseMove = (e) => {
      handleMouseMove(e);
    };

    // 对于触摸事件，也需要全局监听
    const handleGlobalTouchEnd = (e) => {
        if (draggingNode) {
            setDraggingNode(null);
        }
        if (isPanning) {
            setIsPanning(false);
            if (editorRef.current) editorRef.current.style.cursor = 'grab';
        }
    };
    const handleGlobalTouchMove = (e) => {
        if (isPanning || draggingNode) {
            const touch = e.touches[0];
            const mockMouseEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => e.preventDefault(), // 传递preventDefault
                // 如果需要，可以添加更多模拟的鼠标事件属性
            };
            handleMouseMove(mockMouseEvent);
        }
    };


    if (isPanning || draggingNode) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false }); // passive: false 允许 preventDefault
      window.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isPanning, draggingNode, handleMouseUp, handleMouseMove]);

  // 添加滚轮事件监听器
  useEffect(() => {
    const editorElement = editorRef.current;
    if (editorElement) {
      editorElement.addEventListener('wheel', handleWheel, { passive: false }); // passive: false 允许 preventDefault
    }
    return () => {
      if (editorElement) {
        editorElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleWheel]);


  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-800 p-4">
      <div className="text-white mb-4 text-lg">流图编辑器示例</div>
      <div className="text-white mb-2 text-sm">
        使用鼠标滚轮缩放，按住鼠标左键在空白处拖拽平移，拖动节点。
      </div>
      <div
        ref={editorRef}
        className="w-full h-[70vh] bg-gray-700 rounded-lg shadow-xl overflow-hidden relative cursor-grab border-2 border-gray-600"
        onMouseDown={handleMouseDown}
        onTouchStart={(e) => { // 触摸开始时，如果是空白区域则准备平移
            const targetIsNode = e.target.closest(`.${nodeContainerStyle.split(' ')[0]}`);
            if (!targetIsNode) {
                setIsPanning(true);
                setPanStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                if (editorRef.current) editorRef.current.style.cursor = 'grabbing';
                e.preventDefault(); // 防止页面滚动等默认行为
            }
        }}
      >
        {/* 可变换的画布内容区域 */}
        <div
          className="transform-origin-top-left" // 设置变换原点为左上角
          style={{
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
            width: '100%', // 确保内部容器也响应变换
            height: '100%',
          }}
        >
          {/* 在这里渲染流图的节点和连接线 */}
          {nodes.map(node => (
            <Node
              key={node.id}
              id={node.id}
              x={node.x}
              y={node.y}
              content={node.content}
              onDragStart={handleNodeDragStart}
              isSelected={draggingNode?.id === node.id}
            />
          ))}
          {/* 示例：一个固定的背景网格，也会随画布变换 */}
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 pointer-events-none">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(200,200,200,0.1)" strokeWidth="0.5"/>
              </pattern>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)"/>
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(200,200,200,0.2)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
      <div className="text-white mt-4 text-sm">
        当前缩放: {scale.toFixed(2)} | X偏移: {translateX.toFixed(0)}px | Y偏移: {translateY.toFixed(0)}px
      </div>
    </div>
  );
};

// 主应用组件
function App() {
  return (
    <div className="App">
      <FlowDiagramEditor />
    </div>
  );
}

export default App;

