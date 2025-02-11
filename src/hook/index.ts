import isArrayLikeObject from 'lodash-es/isArrayLikeObject';
import isObjectLike from 'lodash-es/isObjectLike';
import throttle from 'lodash-es/throttle';

import { useRef, useState } from 'react';

// 创建一个节流版本的 forceUpdate 函数
export function createThrottledProxy<T extends object>(
    target: T,
    onUpdate: () => void,
    delay: number = 16, // 默认约 60fps
    path: string[] = [],
    device = 0
): T {
    const throttledUpdate = throttle(() => {
        onUpdate();
    }, delay, { leading: true, trailing: true });
    if (target && isObjectLike(target) && device===0) {
        for (const key in target) {
            const value = target[key];
            if (value && isObjectLike(value)) {
                target[key] = createThrottledProxy( 
                    value,
                    throttledUpdate,
                    delay,
                    [...path, key],
                    ++device
                );
            }
        }
    }
    return new Proxy(target, {
        get(target, property: string | symbol) {
            const value = Reflect.get(target, property);
            // 处理函数绑定
            if (typeof value === 'function') {
                return function (...args: any[]) {
                    const result = value.apply(target, args);
                    return result;
                };
            }
            // 处理对象和数组
            if (value && isObjectLike(value)) {
                return createThrottledProxy(
                    value,
                    throttledUpdate,
                    delay,
                    [...path, property.toString()],
                    ++device,
                );
            }
            return value;
        },

        set(target, property, value) {
            const result = Reflect.set(target, property, value);
            throttledUpdate(); // 使用节流版本的更新
            return result;
        },

        deleteProperty(target, property) {
            const result = Reflect.deleteProperty(target, property);
            throttledUpdate(); // 使用节流版本的更新
            return result;
        }
    });
}
export function useThrottledProxyRef<T extends any>(
    initialValue: T,
    delay: number = 16
) {
    const [_, forceUpdate] = useState({});
    const ref = useRef<T>(initialValue);
    const proxyRef = useRef<T | null>(null);
    if (!proxyRef.current) {
        // 初始化时创建代理
        if (!isObjectLike(initialValue)) {
            let value = initialValue;
            proxyRef.current = initialValue;
            Object.defineProperty(proxyRef, 'current', {
                get() {
                    return value;
                },
                set(newValue) {
                    value = newValue;
                    forceUpdate({});
                }
            });
        } else {
            let proxy = createThrottledProxy(
                initialValue as object,
                () => forceUpdate({}),
                delay
            ) as T;
            // 重新定义 proxyRef.current 的 getter 和 setter
            Object.defineProperty(proxyRef, 'current', {
                get() {
                    return proxy;
                },
                set(newValue) {
                    proxy = createThrottledProxy(
                        newValue as object,
                        () => forceUpdate({}),
                        delay
                    ) as T;
                    forceUpdate({});
                    return proxy
                }
            });
        }
    }

    return proxyRef;
}