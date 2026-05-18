/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useReducedMotion } from 'motion/react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type RefObject,
} from 'react';

/** Imperative controls + root element used for chapter crossfade opacity. */
export type ChapterVideoSlotApi = {
  readonly root: HTMLElement | null;
  play: () => void;
  pause: () => void;
};

/** Blend overlap as a fraction of clip length (smooth loop handoff vs hard cut). */
const LOOP_BLEND_RATIO = 0.14;
const LOOP_BLEND_CAP_SEC = 1.05;
const LOOP_BLEND_FLOOR_SEC = 0.38;

type CrossfadeLoopChapterProps = {
  src: string;
  preload: 'auto' | 'metadata';
  videoClassName: string;
  /** Until scroll weights run, keeps chapter stacking consistent with layered videos. */
  initialBackdropOpacity: number;
};

const CrossfadeLoopVideoChapter = forwardRef<ChapterVideoSlotApi | null, CrossfadeLoopChapterProps>(
  function CrossfadeLoopVideoChapter(
    { src, preload, videoClassName, initialBackdropOpacity },
    forwardedRef
  ) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const aRef = useRef<HTMLVideoElement>(null);
    const bRef = useRef<HTMLVideoElement>(null);

    /** 0 → primary is `a`, 1 → primary is `b` */
    const primaryIx = useRef<0 | 1>(0);
    const blending = useRef(false);
    const rafId = useRef<number | undefined>(undefined);

    const stopRaf = useCallback(() => {
      if (rafId.current != null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = undefined;
      }
    }, []);

    const tick = useCallback(() => {
      rafId.current = undefined;

      const a = aRef.current;
      const b = bRef.current;
      if (!a || !b) {
        return;
      }

      const idle = a.paused && b.paused && !blending.current;
      if (idle) {
        return;
      }

      const primary = primaryIx.current === 0 ? a : b;
      const secondary = primaryIx.current === 0 ? b : a;
      const d = primary.duration;

      if (!Number.isFinite(d) || d <= 0.1) {
        if (!a.paused || !b.paused || blending.current) {
          rafId.current = window.requestAnimationFrame(tick);
        }
        return;
      }

      const blendSec = Math.min(
        LOOP_BLEND_CAP_SEC,
        Math.max(LOOP_BLEND_FLOOR_SEC, d * LOOP_BLEND_RATIO)
      );
      const blendStart = d - blendSec;
      const tPrimary = primary.currentTime;

      if (!blending.current && tPrimary >= blendStart - 0.02) {
        blending.current = true;
        secondary.currentTime = 0;
        secondary.style.opacity = '0';
        void secondary.play().catch(() => {});
      }

      if (blending.current) {
        let u = (tPrimary - blendStart) / blendSec;
        if (!Number.isFinite(u)) {
          u = 1;
        }
        u = clamp01(u);
        const w = smoothEase(u);
        primary.style.opacity = String(1 - w);
        secondary.style.opacity = String(w);

        if (u >= 0.999 || primary.ended) {
          primary.pause();
          primary.currentTime = 0;
          primary.style.opacity = '0';
          secondary.style.opacity = '1';
          primaryIx.current = primaryIx.current === 0 ? 1 : 0;
          blending.current = false;
        }
      } else {
        primary.style.opacity = '1';
        secondary.style.opacity = '0';
      }

      if (!a.paused || !b.paused || blending.current) {
        rafId.current = window.requestAnimationFrame(tick);
      }
    }, []);

    const startRaf = useCallback(() => {
      if (rafId.current == null) {
        rafId.current = window.requestAnimationFrame(tick);
      }
    }, [tick]);

    useImperativeHandle(
      forwardedRef,
      () => ({
        get root() {
          return wrapperRef.current;
        },
        play: () => {
          const main = primaryIx.current === 0 ? aRef.current : bRef.current;
          const other = primaryIx.current === 0 ? bRef.current : aRef.current;
          if (main && !blending.current) {
            main.style.opacity = '1';
          }
          if (other && !blending.current) {
            other.style.opacity = '0';
            other.pause();
            other.currentTime = 0;
          }
          void main?.play().catch(() => {});
          startRaf();
        },
        pause: () => {
          stopRaf();
          blending.current = false;
          aRef.current?.pause();
          bRef.current?.pause();
        },
      }),
      [startRaf, stopRaf, tick]
    );

    useEffect(() => {
      return () => {
        stopRaf();
      };
    }, [stopRaf]);

    return (
      <div
        ref={wrapperRef}
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: initialBackdropOpacity,
          transition: 'none',
        }}
      >
        <video
          ref={aRef}
          src={src}
          className={videoClassName}
          autoPlay
          muted
          playsInline
          preload={preload}
          onPlaying={startRaf}
          style={{ opacity: 1, transition: 'none' }}
        />
        <video
          ref={bRef}
          src={src}
          className={videoClassName}
          muted
          playsInline
          preload="metadata"
          onPlaying={startRaf}
          style={{ opacity: 0, transition: 'none' }}
        />
      </div>
    );
  }
);

const FALLBACK_STILL = '/assets/webbg.png';

/** Scene order: highland → plains → coast */
export const CHAPTER_VIDEO_FILES = ['scene 1 bg.mp4', 'scene2 g.mp4', 'scene 3 bg.mp4'] as const;

export function videoSrc(filename: string) {
  return `/assets/videbg/${encodeURIComponent(filename)}`;
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function smoothEase(t: number) {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

type ChapterRefsTriple = readonly [
  RefObject<HTMLElement | null>,
  RefObject<HTMLElement | null>,
  RefObject<HTMLElement | null>,
];

function weightsForFocus(focusDocY: number, b12: number, b23: number, blend: number) {
  const t12 = smoothEase((focusDocY - (b12 - blend)) / (2 * blend));
  const t23 = smoothEase((focusDocY - (b23 - blend)) / (2 * blend));
  return [1 - t12, t12 * (1 - t23), t23] as const;
}

export function ScrollDrivenVideoBackdrop({ chapterRefs }: { chapterRefs: ChapterRefsTriple }) {
  const reduceMotion = useReducedMotion();

  const slot0 = useRef<ChapterVideoSlotApi | null>(null);
  const slot1 = useRef<ChapterVideoSlotApi | null>(null);
  const slot2 = useRef<ChapterVideoSlotApi | null>(null);
  const scheduled = useRef<number | undefined>(undefined);

  const pumpPlayback = useCallback((w: readonly [number, number, number]) => {
    ;[slot0.current, slot1.current, slot2.current].forEach((api, i) => {
      if (!api) {
        return;
      }
      if (w[i] < 0.035) {
        api.pause();
        return;
      }
      api.play();
    });
  }, []);

  const updateWeights = useCallback(() => {
    const els = chapterRefs.map((r) => r.current).filter(Boolean) as HTMLElement[];
    if (els.length !== 3) {
      return;
    }

    const y = window.scrollY;
    const vh = window.innerHeight;

    /** Viewport "reading line": crossfade feels tied to narrative flow */
    const focusDocY = y + vh * 0.36;

    const rects = els.map((el) => el.getBoundingClientRect());
    const tops = rects.map((r) => r.top + y);
    const bottoms = rects.map((r) => r.bottom + y);

    const b12 = (bottoms[0] + tops[1]) / 2;
    const b23 = (bottoms[1] + tops[2]) / 2;

    const blend = Math.max(300, vh * 0.4);

    const w = weightsForFocus(focusDocY, b12, b23, blend);

    ;[slot0.current, slot1.current, slot2.current].forEach((api, i) => {
      const root = api?.root;
      if (root) {
        root.style.opacity = String(w[i]);
      }
    });
    pumpPlayback(w);
  }, [chapterRefs, pumpPlayback]);

  const scheduleUpdate = useCallback(() => {
    if (scheduled.current != null) {
      cancelAnimationFrame(scheduled.current);
    }
    scheduled.current = window.requestAnimationFrame(() => {
      scheduled.current = undefined;
      updateWeights();
    });
  }, [updateWeights]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    scheduleUpdate();

    const obsEls = () => chapterRefs.map((r) => r.current).filter(Boolean) as HTMLElement[];

    const ro = new ResizeObserver(() => scheduleUpdate());
    obsEls().forEach((el) => ro.observe(el));

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (scheduled.current != null) {
        cancelAnimationFrame(scheduled.current);
      }
    };
  }, [chapterRefs, reduceMotion, scheduleUpdate]);

  useEffect(() => {
    if (!reduceMotion) {
      queueMicrotask(scheduleUpdate);
    }
  }, [reduceMotion, scheduleUpdate]);

  if (reduceMotion) {
    return (
      <div className="scroll-video-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg" aria-hidden>
        <img
          src={FALLBACK_STILL}
          alt=""
          width={1600}
          height={4800}
          decoding="async"
          loading="eager"
          draggable={false}
          className="scroll-video-backdrop__media video-chapter__static-bg absolute left-1/2 top-1/2 select-none"
        />
        <div className="absolute inset-0 bg-[#050505]/42" />
      </div>
    );
  }

  return (
    <div className="scroll-video-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg" aria-hidden>
      {([0, 1, 2] as const).map((i) => (
        <CrossfadeLoopVideoChapter
          key={CHAPTER_VIDEO_FILES[i]}
          ref={i === 0 ? slot0 : i === 1 ? slot1 : slot2}
          src={videoSrc(CHAPTER_VIDEO_FILES[i])}
          preload={i === 0 ? 'auto' : 'metadata'}
          videoClassName="scroll-video-backdrop__video river-journey__video"
          initialBackdropOpacity={i === 0 ? 1 : 0}
        />
      ))}
      <div className="absolute inset-0 bg-[#050505]/38" />
    </div>
  );
}
