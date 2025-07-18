"use client"

import createGlobe, { type COBEOptions } from "cobe"
import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "../../lib/utils"



const createGlobeConfig = (isDark: boolean): COBEOptions => {
  const markers = [
    { location: [14.5995, 120.9842] as [number, number], size: 0.03 },
    { location: [19.076, 72.8777] as [number, number], size: 0.1 },
    { location: [23.8103, 90.4125] as [number, number], size: 0.05 },
    { location: [30.0444, 31.2357] as [number, number], size: 0.07 },
    { location: [39.9042, 116.4074] as [number, number], size: 0.08 },
    { location: [-23.5505, -46.6333] as [number, number], size: 0.1 },
    { location: [19.4326, -99.1332] as [number, number], size: 0.1 },
    { location: [40.7128, -74.006] as [number, number], size: 0.1 },
    { location: [34.6937, 135.5022] as [number, number], size: 0.05 },
    { location: [41.0082, 28.9784] as [number, number], size: 0.06 },
  ];

  if (isDark) {
    // Dark mode configuration
    return {
      width: 800,
      height: 800,
      onRender: () => {},
      devicePixelRatio: 2,
      phi: 0,
      theta: 0.3,
      dark: 1, // Dark globe background
      diffuse: 0.3,
      mapSamples: 16000,
      mapBrightness: 0.2, // Darker map for dark mode
      baseColor: [0.06, 0.07, 0.09], // Dark background
      markerColor: [0.23, 0.51, 0.96], // Blue markers
      glowColor: [0.18, 0.20, 0.25], // Subtle dark glow
      markers,
    };
  } else {
    // Light mode configuration
    return {
      width: 800,
      height: 800,
      onRender: () => {},
      devicePixelRatio: 2,
      phi: 0,
      theta: 0.3,
      dark: 0, // Light globe background
      diffuse: 0.8,
      mapSamples: 16000,
      mapBrightness: 0.6, // Brighter map for light mode
      baseColor: [0.95, 0.95, 0.97], // Light background
      markerColor: [0.15, 0.35, 0.85], // Darker blue markers for contrast
      glowColor: [0.9, 0.9, 0.95], // Subtle light glow
      markers,
    };
  }
}

export function Globe({
  className,
  config,
}: {
  className?: string
  config?: COBEOptions
}) {
  let phi = 0
  let width = 1800 // Default width (tripled)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef(null)
  const pointerInteractionMovement = useRef(0)
  const [r, setR] = useState(0)
  const [canvasWidth, setCanvasWidth] = useState(1800)
  const [globeConfig, setGlobeConfig] = useState<COBEOptions>(() => {
    if (config) return config;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return createGlobeConfig(isDark);
  })

  // Update globe config when theme changes
  useEffect(() => {
    const updateConfig = () => {
      if (config) {
        setGlobeConfig(config);
        return;
      }
      
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newConfig = createGlobeConfig(isDark);
      setGlobeConfig(newConfig);
    }

    // Listen for theme changes via data-theme attribute
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          updateConfig();
        }
      });
    });

    // Observe theme changes on document element
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    // Initial update
    updateConfig();

    return () => {
      observer.disconnect();
    }
  }, [config])

  const updatePointerInteraction = (value: any) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: any) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      setR(delta / 200)
    }
  }

  const onRender = useCallback(
    (state: Record<string, any>) => {
      if (!pointerInteracting.current) phi += 0.005
      state.phi = phi + r
      state.width = width * 2
      state.height = width * 2
    },
    [r],
  )

  const onResize = () => {
    if (canvasRef.current) {
      const newWidth = canvasRef.current.offsetWidth || 1800
      width = newWidth
      setCanvasWidth(newWidth)

    }
  }

  useEffect(() => {
    // Set initial width before creating globe
    if (canvasRef.current) {
      const newWidth = canvasRef.current.offsetWidth || 1800;
      width = newWidth;
      setCanvasWidth(newWidth);

    }
    
    window.addEventListener("resize", onResize)
    onResize()

    if (!canvasRef.current) {
      return
    }

    try {
      const globe = createGlobe(canvasRef.current, {
        ...globeConfig,
        width: width * 2,
        height: width * 2,
        onRender,
      })

      setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.style.opacity = "1"
        }
      }, 100)
      
      return () => {
        globe.destroy()
      }
    } catch (error) {
      console.error('Error creating globe:', error)
    }

    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [globeConfig])

    return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full",
        className,
      )}
      
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]",
        )}
        ref={canvasRef}
        width={canvasWidth * 2}
        height={canvasWidth * 2}

        onPointerDown={(e) =>
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current,
          )
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
} 