import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import './v.css'
import { throttle } from 'lodash-es';
interface Position {
    index: number;
    top: number;
    height: number;
    bottom: number;
    id: string | number;
}

interface VListProps {
    data: any[];
    height?: string | number;
    estimatedItemHeight?: number;
    bufferSize?: number;
    rowKey?: string;
    children: (props: { at: any }) => React.ReactNode;
    gap?: number
}

const VList: React.FC<VListProps> = ({
    data,
    height = '800px',
    estimatedItemHeight = 50,
    bufferSize = 5,
    rowKey = 'id',
    children,
    gap = 5000
}) => {
    const listRef = useRef<HTMLDivElement>(null);
    const positionsRef = useRef<Position[]>([]);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(0);
    const [startOffset, setStartOffset] = useState(0);
    const heightMap = useRef(new Map<string | number, number>());
    const updateTimerRef = useRef<number | null>(null);
    const [version, setVersion] = useState(0);

    // 批量更新处理
    const batchUpdate = useCallback(() => {
        if (updateTimerRef.current) {
            cancelAnimationFrame(updateTimerRef.current);
        }

        updateTimerRef.current = window.requestAnimationFrame(() => {
            setVersion(v => v + 1);
            updateTimerRef.current = null;
        });
    }, []);

    // 当数据变化时重新初始化
    useEffect(() => {
        throttle(initPositions, gap)();
        throttle(handleScroll, gap)();
    }, [data, data.at(0)?.id]);

    // 初始化位置信息
    const initPositions = useCallback(() => {
        positionsRef.current = data.map((item, index) => ({
            index,
            top: index * estimatedItemHeight,
            height: item.height || estimatedItemHeight,
            bottom: (index + 1) * estimatedItemHeight,
            id: item[rowKey]
        }));
        batchUpdate();
    }, [data, estimatedItemHeight, rowKey, batchUpdate]);

    // 更新位置信息
    const updatePositions = useCallback(() => {
        let currentTop = 0;
        positionsRef.current = positionsRef.current.map((item) => {
            const height = heightMap.current.get(data[item.index]?.[rowKey]) || estimatedItemHeight;
            const position = {
                index: item.index,
                top: currentTop,
                height,
                bottom: currentTop + height,
                id: data[item.index]?.[rowKey]
            };
            currentTop += height;
            return position;
        });
        batchUpdate();
    }, [data, estimatedItemHeight, rowKey, batchUpdate]);

    // 二分查找
    const binarySearch = useCallback((scrollTop: number): number => {
        let low = 0;
        let high = data.length - 1;

        while (low <= high) {
            const mid = low + Math.floor((high - low) / 2);
            const midPosition = positionsRef.current[mid]?.bottom || mid * estimatedItemHeight;

            if (midPosition === scrollTop) {
                return mid;
            } else if (midPosition < scrollTop) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return low;
    }, [data.length, estimatedItemHeight]);

    // 获取可视区域高度
    const getVisibleHeight = useCallback(() => {
        return listRef.current?.clientHeight || 500;
    }, []);

    // 处理滚动 - 移除 startIndex 依赖
    const handleScroll = useCallback(() => {
        if (!listRef.current) return;
        const scrollTop = listRef.current.scrollTop;
        const currentStartIndex = binarySearch(scrollTop);
        const visibleCount = Math.ceil(getVisibleHeight() / estimatedItemHeight);

        const newStartIndex = Math.max(0, currentStartIndex - bufferSize);
        const newEndIndex = Math.min(
            data.length,
            currentStartIndex + visibleCount + bufferSize
        );

        setStartIndex(newStartIndex);
        setEndIndex(newEndIndex);
        setStartOffset(newStartIndex * estimatedItemHeight);
    }, [binarySearch, bufferSize, data, estimatedItemHeight, getVisibleHeight]);

    // 计算总高度
    const calculateTotalHeight = useCallback(() => {
        let total = 0;
        for (let i = 0; i < data.length; i++) {
            const height = heightMap.current.get(data[i]?.[rowKey]) || estimatedItemHeight;
            total += height;
        }
        return total;
    }, [data, estimatedItemHeight, rowKey]);

    // 计算总高度 - 使用 calculateTotalHeight
    const totalHeight = useMemo(() => {
        return calculateTotalHeight();
    }, [data.length]);

    // 可见数据 - 添加 version 依赖
    const visibleData = useMemo(() => {
        return data.slice(startIndex, endIndex);
    }, [data, startIndex, endIndex, version]);

    // 监听滚动容器尺寸变化
    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            handleScroll();
            batchUpdate();
        });

        if (listRef.current) {
            resizeObserver.observe(listRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [handleScroll, batchUpdate]);

    // 监听数据变化，更新位置信息和高度
    useEffect(() => {
        heightMap.current.clear();
        initPositions();
        handleScroll();
        batchUpdate();
    }, [data, estimatedItemHeight, initPositions, handleScroll]);

    // 处理元素高度变化
    const handleItemResize = useCallback((item: any, el: HTMLElement | null) => {
        if (el && item[rowKey]) {
            const height = el.offsetHeight;
            const oldHeight = heightMap.current.get(item[rowKey]);

            if (oldHeight !== height) {
                heightMap.current.set(item[rowKey], height);
                // 使用防抖更新
                if (updateTimerRef.current) {
                    cancelAnimationFrame(updateTimerRef.current);
                }
                updateTimerRef.current = requestAnimationFrame(() => {
                    updatePositions();
                    updateTimerRef.current = null;
                });
            }
        }
    }, [rowKey, updatePositions]);

    // 清理
    useEffect(() => {
        return () => {
            if (updateTimerRef.current) {
                cancelAnimationFrame(updateTimerRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={listRef}
            onScroll={handleScroll}
            className="relative overflow-auto touch-pan-y w-full"
            style={{
                height: typeof height === 'number' ? `${height}px` : height,
            }}
        >
            <div
                className="absolute left-0 top-0 right-0 -z-1"
                style={{ height: `${totalHeight}px` }}
            />

            <div
                className="absolute left-0 right-0 top-0"
                style={{ transform: `translateY(${startOffset}px)`, paddingBottom: "40px" }}
            >
                {visibleData.map((item,index) => (
                    <div
                        key={index}
                        className="w-full indent-0"
                        ref={(el) => handleItemResize(item, el)}
                    >
                        {children({ at: item })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VList;