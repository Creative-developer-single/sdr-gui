'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import '../../css/modules/FloatWindow/FloatWindow.css'; // 确保引入了 FloatWindow 的 CSS
import { FloatWindowPropInterface } from './FloatWindowPropInterface';

function FloatWindow({ 
    data,
    children 
} : {
    data : FloatWindowPropInterface,
    children : React.ReactNode
}) {
    const { id,icon, title, isOpen, width, height, posX, posY, onUpdateStatus,onGUIDestroy} = data;
    const [position,setPosition] = useState( { x: posX, y: posY });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 });

    const windowRef = useRef<HTMLDivElement>(null);

    // Listen to the mouse down event
    const handleMouseDown = useCallback((e) =>{
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

    //Listen to the mouse move event
    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;
        if (!windowRef.current) return;

        const newPosX = e.clientX - dragStartOffset.x;
        const newPosY = e.clientY - dragStartOffset.y;

        setPosition({ x: newPosX, y: newPosY });
    }, [isDragging, dragStartOffset,position.x, position.y]);

    // Listen to the mouse up event
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);

        // 移除 user-select-none 类
        document.body.classList.remove('user-select-none');

    },[]);

    useEffect(()=>{
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
    },[isDragging,handleMouseMove,handleMouseUp]);

    if(!isOpen) {
        return null;
    }
    
    return (
        // create the float window container
        <div 
            ref={windowRef}
            className="z-9999 fixed overflow-hidden m-h-[200px] m-w-[400px] h-full bg-blue-950 border border-gray-300 shadow-lg rounded-md"
            style={{
                width: `${width}px`,
                height: `${height}px`,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            >
            <div className='py-1 flex flex-row m-h-[50px] items-center text-center place-content-between' onMouseDown={handleMouseDown}>
                <span className='p-0 flex bg-blue-950 rounded-full'>{ icon }</span>
                <label className='text-sm text-white text-center self-center'>{ title }</label>
                <button className='w-6 h-6 mr-2 text-white bg-blue-950 hover:bg-red-500 active:bg-red-600 rounded-full' onClick={()=>{
                    onGUIDestroy(id)}}>X</button>
            </div>
            <div className='flex flex-col h-full w-full m-h-[200px] m-w-[400px] bg-white border border-gray-300 shadow-lg'>
                { children }
            </div>
        </div>
    )
}

export default FloatWindow;