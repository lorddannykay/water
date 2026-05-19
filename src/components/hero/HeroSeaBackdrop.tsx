import { useEffect, useRef } from 'react';
import {
  HERO_SEA_THEME,
  SEA_FRAGMENT_SHADER,
  SEA_VERTEX_SHADER,
} from './seaShaders';
import { getSeaMaxDpr, getSeaRenderScale, prefersLowPowerSea } from './seaPerformance';

type HeroSeaBackdropProps = {
  reducedMotion?: boolean | null;
};

type SeaTheme = {
  seaBase: [number, number, number];
  seaHighlight: [number, number, number];
  skyTint: [number, number, number];
  horizonBias: number;
};

function readThemeFromCss(): SeaTheme {
  if (typeof document === 'undefined') {
    return {
      seaBase: [...HERO_SEA_THEME.seaBase],
      seaHighlight: [...HERO_SEA_THEME.seaHighlight],
      skyTint: [...HERO_SEA_THEME.skyTint],
      horizonBias: HERO_SEA_THEME.horizonBias,
    };
  }

  const style = getComputedStyle(document.documentElement);

  const parse = (name: string, fallback: readonly [number, number, number]) => {
    const raw = style.getPropertyValue(name).trim();
    if (!raw) return [...fallback] as [number, number, number];
    const hex = raw.startsWith('#') ? raw.slice(1) : raw;
    if (hex.length !== 6) return [...fallback] as [number, number, number];
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    return [r, g, b] as [number, number, number];
  };

  const ink = parse('--color-ink', [0.12, 0.18, 0.15] as const);
  return {
    seaBase: [ink[0] * 0.35, ink[1] * 0.4, ink[2] * 0.38] as [number, number, number],
    seaHighlight: parse('--color-accent', HERO_SEA_THEME.seaHighlight),
    skyTint: parse('--color-bg', HERO_SEA_THEME.skyTint),
    horizonBias: HERO_SEA_THEME.horizonBias,
  };
}

export function HeroSeaBackdrop({ reducedMotion = false }: HeroSeaBackdropProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const failedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const host = canvasHostRef.current;
    if (!container || !host || failedRef.current) return;

    let disposed = false;
    let rafId = 0;
    let visible = true;
    let tabActive = true;

    const boot = async () => {
      const {
        Clock,
        Mesh,
        OrthographicCamera,
        PlaneGeometry,
        Scene,
        ShaderMaterial,
        Vector2,
        Vector3,
        WebGLRenderer,
      } = await import('three');

      if (disposed || failedRef.current) return;

      const theme = readThemeFromCss();
      const lowPower = prefersLowPowerSea();
      const animate = reducedMotion !== true && !lowPower;

      let renderer: InstanceType<typeof WebGLRenderer> | null = null;

      try {
        renderer = new WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: lowPower ? 'low-power' : 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, getSeaMaxDpr()));
      } catch {
        failedRef.current = true;
        host.classList.add('hero-sea-backdrop--fallback');
        return;
      }

      const scene = new Scene();
      const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const uniforms = {
        iGlobalTime: { value: 0.1 },
        iResolution: { value: new Vector2(1, 1) },
        uSeaBase: { value: new Vector3(...theme.seaBase) },
        uSeaHighlight: { value: new Vector3(...theme.seaHighlight) },
        uSkyTint: { value: new Vector3(...theme.skyTint) },
        uHorizonBias: { value: theme.horizonBias },
        uMouse: { value: new Vector2(0, 0) },
      };

      const mouseTarget = new Vector2(0, 0);
      const mouseSmooth = new Vector2(0, 0);
      const mouseFollowSpeed = 2.8;
      const enableMouse =
        animate && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      const setMouseFromEvent = (clientX: number, clientY: number) => {
        const rect = container.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) return;
        const x = (clientX - rect.left) / rect.width;
        const y = (clientY - rect.top) / rect.height;
        if (x < 0 || x > 1 || y < 0 || y > 1) return;
        mouseTarget.set(x * 2 - 1, -(y * 2 - 1));
      };

      const onPointerMove = (e: PointerEvent) => {
        setMouseFromEvent(e.clientX, e.clientY);
      };

      const onPointerLeave = () => {
        mouseTarget.set(0, 0);
      };

      const sectionEl = container.closest('#home');
      if (enableMouse && sectionEl) {
        sectionEl.addEventListener('pointermove', onPointerMove);
        sectionEl.addEventListener('pointerleave', onPointerLeave);
      }

      const material = new ShaderMaterial({
        uniforms,
        vertexShader: SEA_VERTEX_SHADER,
        fragmentShader: SEA_FRAGMENT_SHADER,
      });

      const mesh = new Mesh(new PlaneGeometry(2, 2), material);
      scene.add(mesh);

      renderer.domElement.className = 'hero-sea-backdrop__canvas';
      host.appendChild(renderer.domElement);

      const clock = new Clock();

      const resize = () => {
        if (!renderer || disposed) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w < 1 || h < 1) return;

        const scale = getSeaRenderScale();
        const bufferW = Math.max(1, Math.floor(w * scale));
        const bufferH = Math.max(1, Math.floor(h * scale));

        renderer.setSize(bufferW, bufferH, false);
        uniforms.iResolution.value.set(w, h);
      };

      const renderFrame = () => {
        if (!renderer || disposed) return;
        const dt = clock.getDelta();
        if (animate && visible && tabActive) {
          uniforms.iGlobalTime.value += dt;
        }
        if (enableMouse) {
          const blend = 1 - Math.exp(-mouseFollowSpeed * dt);
          mouseSmooth.lerp(mouseTarget, blend);
          uniforms.uMouse.value.copy(mouseSmooth);
        }
        renderer.render(scene, camera);
      };

      const stopLoop = () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      };

      const startLoop = () => {
        stopLoop();
        if (!animate || disposed) return;

        const tick = () => {
          if (disposed) return;
          if (visible && tabActive) {
            renderFrame();
            rafId = requestAnimationFrame(tick);
          } else {
            rafId = 0;
          }
        };

        clock.getDelta();
        rafId = requestAnimationFrame(tick);
      };

      resize();
      const resizeObserver = new ResizeObserver(() => {
        resize();
        if (visible && tabActive && animate) renderFrame();
      });
      resizeObserver.observe(container);

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          visible = (entry?.intersectionRatio ?? 0) > 0;
          if (visible && tabActive && animate) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { rootMargin: '80px 0px', threshold: 0 }
      );
      intersectionObserver.observe(container);

      const onVisibility = () => {
        tabActive = !document.hidden;
        if (tabActive && visible && animate) {
          startLoop();
        } else {
          stopLoop();
        }
      };
      document.addEventListener('visibilitychange', onVisibility);

      if (animate) {
        clock.start();
        startLoop();
      } else {
        renderFrame();
      }

      return () => {
        disposed = true;
        stopLoop();
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        if (enableMouse && sectionEl) {
          sectionEl.removeEventListener('pointermove', onPointerMove);
          sectionEl.removeEventListener('pointerleave', onPointerLeave);
        }
        material.dispose();
        mesh.geometry.dispose();
        renderer?.dispose();
        if (renderer?.domElement.parentElement === host) {
          host.removeChild(renderer.domElement);
        }
      };
    };

    let teardown: (() => void) | undefined;
    void boot().then((cleanup) => {
      teardown = cleanup;
    });

    return () => {
      disposed = true;
      teardown?.();
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="hero-sea-backdrop" aria-hidden>
      <div ref={canvasHostRef} className="hero-sea-backdrop__host" />
    </div>
  );
}
