import { useEffect, useState, useRef, RefObject } from 'react';

/**
 * 使用IntersectionObserver监测元素可见性的自定义Hook
 * @param options IntersectionObserver的配置选项
 * @returns 返回一个ref和元素是否可见的状态
 */
export function useIntersectionObserver<T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: [0.1, 0.2, 0.3, 0.4, 0.5] }
): [RefObject<T>, boolean, number] {
  const elementRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
      setIntersectionRatio(entry.intersectionRatio);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [options]);

  return [elementRef, isVisible, intersectionRatio];
}

/**
 * 使用URL哈希值的自定义Hook
 * @param initialHash 初始哈希值
 * @returns 当前哈希值和设置哈希值的函数
 */
export function useHashValue(initialHash: string = ''): [string, (hash: string) => void] {
  const [hash, setHash] = useState(() => {
    // 如果在浏览器环境，从URL获取初始哈希值
    if (typeof window !== 'undefined') {
      return window.location.hash.replace('#', '') || initialHash;
    }
    return initialHash;
  });

  const updateHash = (newHash: string) => {
    if (typeof window !== 'undefined') {
      // 更新URL哈希值但不触发页面滚动
      window.history.pushState(null, '', `#${newHash}`);
      setHash(newHash);
    }
  };

  // 监听哈希值变化
  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      setHash(newHash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return [hash, updateHash];
}