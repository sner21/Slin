import React, { useEffect, useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';

export interface DialogProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  handleDialogClick: (id: string) => void;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
  zIndex?: number;
}

const MOVE_STEP = 20; // 每次移动的像素

const Dialog: React.FC<DialogProps & { isActive?: boolean }> = ({
  id,
  title,
  children,
  onClose,
  initialPosition,
  initialSize = { width: 400, height: 300 },
  minWidth = 200,
  minHeight = 150,
  zIndex = 1000,
  handleDialogClick,
  isActive = false,
}) => {
  const [position, setPosition] = useState(initialPosition || {
    x: Math.max(0, (window.innerWidth / 2 - initialSize.width / 2)),
    y: Math.max(0, (window.innerHeight / 2 - initialSize.height / 2))
  });
  const [size, setSize] = useState(initialSize);

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setPosition(pos => ({
        x: Math.min(pos.x, window.innerWidth - size.width),
        y: Math.min(pos.y, window.innerHeight - size.height)
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size]);

  // 键盘方向键移动窗口
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      console.log(123)
      if (!isActive) return;
      let { x, y } = position;
      let moved = false;
      if (e.key === 'ArrowLeft') {
        console.log(12323)
        x = Math.max(0, x - MOVE_STEP);
        moved = true;
      } else if (e.key === 'ArrowRight') {
        x = Math.min(window.innerWidth - size.width, x + MOVE_STEP);
        moved = true;
      } else if (e.key === 'ArrowUp') {
        y = Math.max(0, y - MOVE_STEP);
        moved = true;
      } else if (e.key === 'ArrowDown') {
        y = Math.min(window.innerHeight - size.height, y + MOVE_STEP);
        moved = true;
      }
      if (moved) {
        setPosition({ x, y });
        e.preventDefault();
      }
    },
    [isActive, position, size]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Rnd
      onClick={() => handleDialogClick(id)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(0 0 0 / 0.9)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '6px',
        zIndex,
        transform: 'translate(0, 0)'
      }}
      position={position}
      size={size}
      minWidth={minWidth}
      minHeight={minHeight}
      bounds="window"
      dragHandleClassName="dialog-handle"
      onDrag={(e, d) => {
        setPosition({ x: d.x, y: d.y });
      }}
      enableUserSelectHack={false}
      onDragStop={(e, d) => {
        setPosition({ x: d.x, y: d.y });
      }}
      onResize={(e, direction, ref, delta, position) => {
        setSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height)
        });
        setPosition(position);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height)
        });
        setPosition(position);
      }}
    >
      <div
        className="dialog-handle select-none flex items-center justify-between p-3 border-b cursor-move bg-black rounded-t-lg"
      >
        <b className="text-md font-medium">{title}</b>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </Rnd>
  );
};

export default Dialog; 