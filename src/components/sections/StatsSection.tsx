'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface Stat {
  value: number
  suffix: string
  label: string
}

const STATS: Stat[] = [
  { value: 100, suffix: '+', label: 'Mitoloji' },
  { value: 200, suffix: '+', label: 'Tarih' },
  { value: 300, suffix: '+', label: 'Gerçek' },
  { value: 10, suffix: 'K+', label: 'İzleyici' },
]

function Counter({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    const duration = 1800
    const start = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target])

  return (
    <span>
      {value}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      aria-labelledby="rakamlar-heading"
      className="relative w-full overflow-hidden bg-[#0a0705] py-24 text-[#f5efe0] sm:py-32"
    >
      {/* Starfield background */}
      <div aria-hidden="true" className="bg-starfield absolute inset-0 opacity-60" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(10,7,5,0.6)_70%,_#0a0705_100%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d4a857]">
            Rakamlarla
          </p>
          <h2
            id="rakamlar-heading"
            className="font-display text-4xl font-bold tracking-wide sm:text-5xl"
          >
            Kadim Gizem
          </h2>
          <div
            aria-hidden="true"
            className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-[#d4a857] to-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-10 sm:gap-6 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-center text-center"
            >
              <div className="font-display text-5xl font-bold tracking-tight text-[#d4a857] text-shadow-gold sm:text-6xl md:text-7xl">
                <Counter target={stat.value} suffix={stat.suffix} active={inView} />
              </div>
              <div
                aria-hidden="true"
                className="my-4 h-px w-12 bg-[#d4a857]/40"
              />
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-[#c9bfa8] sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
