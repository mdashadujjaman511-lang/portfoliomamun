import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<"default" | "hover" | "view" | "drag">("default");
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Hide cursor on touch screens entirely
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Detect visual areas requesting a viewpoint click
      if (target.closest('[data-cursor="view"]')) {
        setCursorType("view");
      } else if (target.closest('[data-cursor="drag"]')) {
        setCursorType("drag");
      } else if (
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") ||
        target.closest('[role="button"]')
      ) {
        setCursorType("hover");
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-violet-500/50 pointer-events-none z-50 mix-blend-screen flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: cursorType === "hover" ? 1.5 : cursorType === "view" ? 2.2 : 1,
          backgroundColor: 
            cursorType === "view" 
              ? "rgba(139, 92, 246, 0.25)" 
              : "rgba(14, 116, 144, 0)",
          borderColor: 
            cursorType === "view" 
              ? "rgba(168, 85, 247, 0.8)" 
              : cursorType === "hover" 
                ? "rgba(6, 182, 212, 0.7)" 
                : "rgba(139, 92, 246, 0.4)"
        }}
      >
        {cursorType === "view" && (
          <span className="text-[7px] font-mono font-bold tracking-widest text-white uppercase scale-75">
            View
          </span>
        )}
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-violet-400 rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: cursorType === "hover" ? 0.4 : cursorType === "view" ? 0 : 1,
          backgroundColor: cursorType === "hover" ? "#06b6d4" : "#a855f7"
        }}
      />
    </>
  );
}
