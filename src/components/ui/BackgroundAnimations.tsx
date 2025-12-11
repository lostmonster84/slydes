'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

// ============================================
// GRADIENT BLOBS - Slow floating color shapes
// ============================================
export function AnimatedGradientBlobs({ children }: { children?: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Blob 1 - Top right, blue */}
      <motion.div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-leader-blue/15 blur-[100px]"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Blob 2 - Bottom left, cyan */}
      <motion.div
        className="absolute -bottom-48 -left-32 w-[600px] h-[600px] rounded-full bg-cyan-400/10 blur-[120px]"
        animate={{
          x: [0, -30, 40, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Blob 3 - Center, purple hint */}
      <motion.div
        className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-purple-400/8 blur-[100px]"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -30, 40, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ============================================
// PARTICLE FIELD - Floating dots
// ============================================
export function AnimatedParticleField({ children, count = 25 }: { children?: ReactNode; count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }))

  return (
    <div className="relative overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-leader-blue/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ============================================
// RADAR PULSE - Rings emanating from center
// ============================================
export function AnimatedRadarPulse({ children }: { children?: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute border border-leader-blue/10 rounded-full"
            style={{
              width: 200 + i * 150,
              height: 200 + i * 150,
            }}
            animate={{
              scale: [1, 2.5],
              opacity: [0.3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ============================================
// NOISE TEXTURE - Animated film grain
// ============================================
export function AnimatedNoiseTexture({ children, opacity = 0.03 }: { children?: ReactNode; opacity?: number }) {
  return (
    <div className="relative">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: opacity * 0.5,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        animate={{
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ============================================
// LIGHT RAYS - Diagonal beams
// ============================================
export function AnimatedLightRays({ children }: { children?: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Ray 1 */}
      <motion.div
        className="absolute -top-1/2 left-1/4 w-[2px] h-[200%] bg-gradient-to-b from-transparent via-leader-blue/20 to-transparent"
        style={{ transform: 'rotate(25deg)' }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          x: [-50, 50, -50],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Ray 2 */}
      <motion.div
        className="absolute -top-1/2 left-1/2 w-[3px] h-[200%] bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent"
        style={{ transform: 'rotate(20deg)' }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          x: [30, -30, 30],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      {/* Ray 3 */}
      <motion.div
        className="absolute -top-1/2 right-1/4 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-leader-blue/15 to-transparent"
        style={{ transform: 'rotate(30deg)' }}
        animate={{
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ============================================
// AURORA - Northern lights effect
// ============================================
export function AnimatedAurora({ children }: { children?: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="absolute -top-1/2 left-0 right-0 h-full"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(37, 99, 235, 0.1) 30%, rgba(6, 182, 212, 0.08) 50%, rgba(139, 92, 246, 0.05) 70%, transparent 100%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [-100, 100, -100],
          skewX: [-5, 5, -5],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -top-1/4 left-1/4 right-0 h-3/4"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(6, 182, 212, 0.08) 40%, rgba(37, 99, 235, 0.06) 60%, transparent 100%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [50, -50, 50],
          skewX: [3, -3, 3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ============================================
// MESH GRADIENT - Complex static gradient
// ============================================
export function MeshGradient({ children }: { children?: ReactNode }) {
  return (
    <div className="relative">
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(at 20% 20%, rgba(37, 99, 235, 0.15) 0%, transparent 50%),
            radial-gradient(at 80% 30%, rgba(6, 182, 212, 0.12) 0%, transparent 40%),
            radial-gradient(at 40% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
            radial-gradient(at 90% 90%, rgba(37, 99, 235, 0.1) 0%, transparent 40%),
            linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(248, 250, 252, 0.5) 100%)
          `,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ============================================
// GLOW SPOTLIGHT - Focused glow effect
// ============================================
export function AnimatedSpotlight({ children, position = 'right' }: { children?: ReactNode; position?: 'left' | 'right' | 'center' }) {
  const positionStyles = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  }

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className={`absolute top-1/2 -translate-y-1/2 ${positionStyles[position]} w-[600px] h-[600px]`}
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(37, 99, 235, 0.1) 30%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ============================================
// WAVE LINES - Flowing sine waves
// ============================================
export function AnimatedWaveLines({ children }: { children?: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d="M0,50 Q25,30 50,50 T100,50 T150,50 T200,50"
            fill="none"
            stroke="rgba(37, 99, 235, 0.1)"
            strokeWidth="1"
            style={{
              transform: `translateY(${30 + i * 20}%)`,
            }}
            animate={{
              d: [
                "M0,50 Q25,30 50,50 T100,50 T150,50 T200,50",
                "M0,50 Q25,70 50,50 T100,50 T150,50 T200,50",
                "M0,50 Q25,30 50,50 T100,50 T150,50 T200,50",
              ],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ============================================
// GRID FADE - Animated grid with fade
// ============================================
export function AnimatedGridFade({ children }: { children?: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(37, 99, 235, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ============================================
// COMBINED - Best of all worlds
// ============================================
export function AnimatedHeroBackground({ children }: { children?: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Mesh gradient base */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(at 80% 20%, rgba(37, 99, 235, 0.12) 0%, transparent 50%),
            radial-gradient(at 20% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)
          `,
        }}
      />
      
      {/* Animated blob */}
      <motion.div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-leader-blue/10 blur-[100px]"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative z-10">{children}</div>
    </div>
  )
}
