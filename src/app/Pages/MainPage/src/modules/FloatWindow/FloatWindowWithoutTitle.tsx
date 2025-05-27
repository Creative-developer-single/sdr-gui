import React, { useCallback, useEffect, useRef, useState } from "react";
import { FloatWindowProp, FloatWindowPropInterface, UpdateStatusInterface } from "./FloatWindowPropInterface";

export function FloatWindowWithoutTitle( {WindowInitialData , onUpdateStatus ,children,isRelative } :
     { WindowInitialData:FloatWindowPropInterface,
       onUpdateStatus:(data:UpdateStatusInterface) => void,
       children:React.ReactNode,
       isRelative:any }  ){

    const [position,setPosition] = useState({ x: WindowInitialData.posX, y: WindowInitialData.posY });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 });

    // 引用拖动元素
    const windowRef = useRef<HTMLDivElement>(null);

    // 监听鼠标按下事件
    const handleMouseDown = useCallback((e)=>{
        if (e.button !== 0) return; // 只处理左键点击
        if (!windowRef.current) return;

        const windowRect = windowRef.current.getBoundingClientRect();
        setIsDragging(true);

        setDragStartOffset({
            x: e.clientX - windowRect.left,
            y: e.clientY - windowRect.top,
        });
        // 添加 user-select-none 类到 body，防止拖拽时选中文本
        document.body.classList.add('user-select-none');
        e.preventDefault();
    },[]);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;
        if (!windowRef.current) return;

        let newPosX = e.clientX - dragStartOffset.x;
        let newPosY = e.clientY - dragStartOffset.y;

        onUpdateStatus({
            id: WindowInitialData.id,
            isOpen: WindowInitialData.isOpen,
            width: WindowInitialData.width,
            height: WindowInitialData.height,
            posX: newPosX,
            posY: newPosY
        })
    },[isDragging, dragStartOffset]);

    // 监听鼠标松开事件
    const handleMouseUp = useCallback((e) => {
        setIsDragging(false);

        // 移除 user-select-none 类
        document.body.classList.remove('user-select-none');
    }, [position.x, position.y]);

    // 添加事件监听器
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.classList.remove('user-select-none');
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    if (!WindowInitialData.isOpen) {
        return null; // 如果窗口未打开，则不渲染任何内容
    }

    return (
        <div
            ref={windowRef}
            className="z-8888 fixed border border-gray-300 shadow-lg rounded-md overflow-hidden"
            style={{
                width: `${WindowInitialData.width}px`,
                height: `${WindowInitialData.height}px`,
                left: `${WindowInitialData.posX}px`,
                top: `${WindowInitialData.posY}px`,
                display: isRelative ? 'absolute' : 'fixed',
            }}
            onMouseDown={handleMouseDown}
        >{ children }</div>
    )
}