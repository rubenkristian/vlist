import { CSSProperties, useEffect, useRef, useState } from "react";
import { buffer } from "stream/consumers";

interface VirtualScrollProps<T> {
  isWindow?: boolean;
  itemHeight: number;
  items: T[];
  windowHeight?: number;
  windowWidth?: number;
  buffer?: number;
  renderItems: (data: T, index: number) => React.ReactElement;
}

export function VirtualScroll<T>(props: VirtualScrollProps<T>): React.ReactElement {
  const {
    isWindow,
    itemHeight,
    items,
    windowHeight,
    windowWidth,
    buffer,
    renderItems
  } = props;

  const containerElem = useRef<HTMLDivElement>(null);

  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [windowH, setWindowH] = useState<number>(windowHeight ?? 0);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(0);
  const [visibleItem, setVisibleItem] = useState<T[]>([]);

  useEffect(() => {
    if (isWindow) {
      // console.log(scrollPosition);
      window.scrollTo(0, scrollPosition);
    } else if (isWindow && containerElem.current) {
      containerElem.current.scrollTop = scrollPosition;
    }
  
    const startIndex = Math.floor(scrollPosition / itemHeight);
    const endIndex = Math.min(
      Math.ceil((scrollPosition + (windowH ?? 0)) / itemHeight),
      items.length
    );
    // console.log("index window", startIndex, endIndex);
    setStartIndex((startIndex - (buffer ?? 0)) > 0 ? (startIndex - (buffer ?? 0)) : 0);
    setEndIndex((endIndex + (buffer ?? 0)) < items.length ? (endIndex + (buffer ?? 0)) : (items.length));
  }, [scrollPosition, windowH]);

  useEffect(() => {
    // console.log("index", startIndex, endIndex);
    const visibleItems = items.slice(startIndex, endIndex);
    setVisibleItem(visibleItems);
  }, [startIndex, endIndex]);

  useEffect(() => {
    
    const handleScroll = () => {
      if (isWindow) {
        setScrollPosition(window.scrollY);
      } else {
        console.log("scroll", containerElem?.current?.scrollTop ?? 0);
        setScrollPosition(containerElem?.current?.scrollTop ?? 0);
      }
    }

    const handleResize = () => {
      setWindowH(window.innerHeight);
    }

    if (isWindow) {
      setWindowH(window.innerHeight);
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);
    } else {
      containerElem?.current?.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (isWindow) {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      } else {
        containerElem?.current?.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const styleContainer: CSSProperties | undefined  = !isWindow ? {overflowY: 'scroll', height: windowHeight, width: windowWidth} : undefined;

  useEffect(() => {
    console.log("Window Height", windowH);
  }, [windowH]);

  return (
    <div
      style={styleContainer}
      ref={containerElem}
    >
      <div style={{height: items.length * itemHeight, position: 'relative'}}>
        {
          visibleItem.map((item, index) => {
            return (
              <div key={startIndex + index} style={{position: 'absolute', top: ((startIndex + index) * itemHeight)}}>
                {renderItems(item, startIndex + index)}
              </div>
            )
          })
        }
      </div>
    </div>
  );
}