import { useEffect, useRef, useState } from "react";

type ScrollDirection = "horizontal" | "vertical";

export function useScroll(direction: ScrollDirection = "vertical"): {
  scrollRef: React.RefObject<HTMLDivElement>;
  isScrolled: boolean;
} {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollValue =
          direction === "horizontal"
            ? scrollRef.current.scrollLeft
            : scrollRef.current.scrollTop;
        setIsScrolled(scrollValue > 0);
      }
    };

    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      }
    };
  }, [direction]);

  return {
    scrollRef: scrollRef as React.RefObject<HTMLDivElement>,
    isScrolled,
  };
}
