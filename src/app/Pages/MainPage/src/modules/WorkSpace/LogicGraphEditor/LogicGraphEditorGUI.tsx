import { useRef, useState, useEffect } from 'react';
import '../../../css/index.css';
import { LogicGraphNodeList } from './LogicGraphNode/LogicGraphNodeList';
import { useLogicGraph } from '../LogicGraphProvider/LogicGraphProvider';
import GnuRadioBezier from './LogicGraphEdge/GnuRadioBezier';
import MultiBezierRenderer from './LogicGraphEdge/BezierLine/MultiBezierLine';
import { LogicGraphNodesProp } from '../LogicGraphProvider/LogicGraphProviderInterface';

export function LogicGraphGUI() {
    const isOpen = useLogicGraph().Editor.isOpen;

    return (
        <div className='flex-grow'>
            { isOpen ? (
              <div className='w-full h-full'>
                <LogicGraphEditorGUIMain>
                  <LogicGraphNodeList></LogicGraphNodeList>
                </LogicGraphEditorGUIMain>
              </div>
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

export function LogicGraphEditorGUIMain({ children }) {
  const { Actions } = useLogicGraph();

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetStartRef = useRef({ x: 0, y: 0 });

  const ZOOM_STEP = 0.1;
  const ZOOM_MIN = 0.2;
  const ZOOM_MAX = 4;

  // ✅ 替代 React 的 onWheel：使用原生事件监听
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rect = container.getBoundingClientRect();
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

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [scale, offset]);

  // 拖动逻辑
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    offsetStartRef.current = { ...offset };
    document.body.classList.add('user-select-none');

    // 当点击画布时，取消边绘制
    Actions.clearVirtualEdge();
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

  function calCulatePortPos(nodeData:LogicGraphNodesProp,portIndex,mode){
    switch(mode){
      case "TerminalPoint":
        // 计算起始端口位置
        // 起始端口位于左侧，长12px，宽12px，靠近左侧，高度按照端口数量平分
        const portPerInterval = 150 / (nodeData.InputCount+1);
        return {
          x: nodeData.Pos.X + 12,
          y: nodeData.Pos.Y + portPerInterval * (portIndex + 1)
        } 
      case "StartPoint":
        // 计算终止端口位置
        // 终止端口位于右侧，长12px，宽12px，靠近右侧，高度按照端口数量平分
        const portPerIntervalEnd = 150 / (nodeData.OutputCount+1);
        return {
          x: nodeData.Pos.X + 250 - 12,
          y: nodeData.Pos.Y + portPerIntervalEnd * (portIndex + 1)
        }
    }
  }

  // 获取节点和边信息，用于渲染
  const { Nodes, Edges } = useLogicGraph();

  interface EdgePoint{
    x: number;
    y: number;
  }

  const start: EdgePoint[] = [];
  const end: EdgePoint[] = [];

  // 遍历边，其中边的坐标可以通过节点的Pos计算得到
  Edges.map((edge) => {
    const startNode = Nodes.find(node => node.ID === edge.StartNodeID);
    const endNode = Nodes.find(node => node.ID === edge.EndNodeID);

    if (startNode && endNode){
      // 边的起点落在起始节点的端口位置
      // 计算NodeIndex对应的端口坐标
      const startPortPos = calCulatePortPos(startNode, edge.StartEdgeIndex, "StartPoint");
      // 边的终点落在终止节点的端口位置
      const endPortPos = calCulatePortPos(endNode, edge.EndEdgeIndex, "TerminalPoint");

      if (startPortPos && endPortPos) {
        start.push(startPortPos);
        end.push(endPortPos);
      }
    }
  })


  return (
    <main
      ref={containerRef}
      className="relative flex-grow p-4 bg-white overflow-hidden h-full"
      onMouseDown={handleMouseDown}
    >
      <div
        className="canvas-grid absolute z-0 w-[5000px] h-[5000px] bg-gray-100"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: 'top left',
        }}
      > 
        <MultiBezierRenderer start={start} end={end}></MultiBezierRenderer>
        {children}
      </div>
    </main>
  );
}
