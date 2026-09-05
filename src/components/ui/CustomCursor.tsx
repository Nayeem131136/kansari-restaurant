import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

type Ripple = { id: number; x: number; y: number };

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const isVisibleRef = useRef(false);
  const rippleIdRef = useRef(0);

  // Inner dot tracks the raw cursor position with zero lag.
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Outer ring trails behind with a soft spring for an editorial,
  // premium feel rather than a single flat circle.
  const ringSpring = { damping: 24, stiffness: 220, mass: 0.5 };
  const ringX = useSpring(dotX, ringSpring);
  const ringY = useSpring(dotY, ringSpring);

  useEffect(() => {
    // Check if device supports fine pointer (mouse)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    document.body.classList.add('custom-cursor-active');

    const updatePosition = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if hovering over clickable elements
      const isClickable = target.closest('a, button, input, textarea, select, [role="button"], label');
      setIsPointer(!!isClickable);

      // Check if hovering over gallery items
      const isGallery = target.closest('[data-cursor="view"]');
      setIsView(!!isGallery);
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    // A brief expanding brass-ring "strike" ripple on every click — like
    // tapping a kansha bowl and watching the ring resonate outward.
    const handleClick = (e: MouseEvent) => {
      const id = ++rippleIdRef.current;
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 550);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('click', handleClick);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('custom-cursor-active');
    };
    // Intentionally run once — updatePosition/handlers close over refs, not
    // state, so they never go stale and the listeners never need rebinding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  // Ring size per state — the SVG rim pattern below scales with this.
  const ringSize = isView ? 84 : isPointer ? 52 : 38;
  const ringColor = isView ? '#F7F2EA' : isPointer ? '#E8A874' : 'rgba(247,242,234,0.6)';
  // Rotation quickens near clickable elements — a small reactive detail
  // that makes the cursor feel alive rather than a static decoration.
  const rotationDuration = isView ? 6 : isPointer ? 8 : 14;

  // Alternating long/short notches around the rim, mimicking the uneven,
  // hand-hammered engraving pattern of a real brass kansha thali rather
  // than a perfectly uniform machine-made ring.
  const notchCount = isView ? 24 : isPointer ? 18 : 14;

  return (
    <>
      {/* Click ripple — a brass ring "struck" outward from the click point */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border mix-blend-difference"
            style={{
              left: r.x,
              top: r.y,
              translateX: '-50%',
              translateY: '-50%',
              borderColor: '#E8A874',
            }}
            initial={{ width: 10, height: 10, opacity: 0.9, borderWidth: 2 }}
            animate={{ width: 64, height: 64, opacity: 0, borderWidth: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </AnimatePresence>

      {/* Outer trailing ring — styled like the engraved rim of a brass
          "kansha" thali: a slender ring with small radial notches ticking
          around the edge, slowly rotating. This ties the cursor visually
          to the restaurant's brass-and-craft identity instead of using a
          generic plain circle. */}
      <motion.div
        id="custom-cursor-ring"
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: rotationDuration, repeat: Infinity, ease: 'linear' }}
        >
          {/* Base rim circle */}
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={ringColor}
            strokeWidth={isView ? 1.4 : 1}
            style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
          />
          {/* Engraved notch marks around the rim — alternating long/short
              lengths for a hand-hammered, artisanal feel */}
          {Array.from({ length: notchCount }).map((_, i) => {
            const angle = (i / notchCount) * 360;
            const isLong = i % 2 === 0;
            return (
              <line
                key={i}
                x1="50"
                y1="3"
                x2="50"
                y2={isLong ? 11 : 7.5}
                stroke={ringColor}
                strokeWidth={isLong ? 1.5 : 1}
                transform={`rotate(${angle} 50 50)`}
                style={{ transition: 'stroke 0.3s ease' }}
              />
            );
          })}
        </motion.svg>

        {isView && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="text-[8px] font-sans font-semibold text-ivory tracking-[0.2em] select-none">
              VIEW
            </span>
          </div>
        )}
      </motion.div>

      {/* Inner solid dot — brand terracotta with a warm, gently breathing
          candlelight/diya glow, zero-lag positioning */}
      <motion.div
        id="custom-cursor-dot"
        className={cn(
          "fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-terracotta mix-blend-difference"
        )}
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isView || isPointer ? 0 : 7,
          height: isView || isPointer ? 0 : 7,
          opacity: isVisible ? 1 : 0,
          boxShadow: [
            '0 0 6px 1.5px rgba(232,168,116,0.45)',
            '0 0 10px 3px rgba(232,168,116,0.7)',
            '0 0 6px 1.5px rgba(232,168,116,0.45)',
          ],
        }}
        transition={{
          width: { duration: 0.2, ease: 'easeOut' },
          height: { duration: 0.2, ease: 'easeOut' },
          opacity: { duration: 0.2, ease: 'easeOut' },
          boxShadow: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    </>
  );
}
