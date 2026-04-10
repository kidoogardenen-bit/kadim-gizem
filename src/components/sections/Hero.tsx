'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { BlackHoleScene } from '@/components/3d/BlackHoleScene'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section
      aria-label="Giriş"
      className="relative isolate flex h-screen min-h-[720px] w-full items-center justify-center overflow-hidden bg-[#0a0705] text-[#f5efe0]"
    >
      {/* 3D background */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="h-full w-full bg-gradient-to-b from-[#0a0705] via-[#15100b] to-[#0a0705]" />
          }
        >
          <BlackHoleScene className="h-full w-full" />
        </Suspense>
      </div>

      {/* Vignette + readability overlay */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(10,7,5,0.55)_55%,_rgba(10,7,5,0.92)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/3 bg-gradient-to-t from-[#0a0705] to-transparent" />

      {/* Foreground content */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 font-sans text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d4a857] sm:text-xs"
        >
          Mitoloji <span className="mx-2 opacity-50">•</span> Tarih{' '}
          <span className="mx-2 opacity-50">•</span> Gizli Gerçekler
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(3rem,11vw,9rem)] font-bold leading-[0.95] tracking-[0.04em] text-[#f5efe0] text-shadow-gold"
        >
          KADİM GİZEM
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="my-8 h-px w-40 origin-center bg-gradient-to-r from-transparent via-[#d4a857] to-transparent"
          aria-hidden="true"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-xl italic text-[#c9bfa8] sm:text-2xl md:text-3xl"
        >
          Unutulmuş bilgelerin izinde…
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:gap-5"
        >
          <Link
            href="#kategoriler"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'group relative h-12 min-w-[180px] overflow-hidden rounded-full bg-[#d4a857] px-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#0a0705] shadow-[0_0_40px_-8px_rgba(212,168,87,0.6)] transition-all duration-500 hover:bg-[#e8c478] hover:shadow-[0_0_60px_-4px_rgba(212,168,87,0.8)]'
            )}
          >
            Keşfet
          </Link>
          <Link
            href="/hakkinda"
            className={cn(
              buttonVariants({ size: 'lg', variant: 'ghost' }),
              'h-12 min-w-[180px] rounded-full border border-[#d4a857]/30 bg-transparent px-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#f5efe0] transition-all duration-500 hover:border-[#d4a857]/70 hover:bg-[#d4a857]/10 hover:text-[#f5efe0]'
            )}
          >
            Hakkımızda
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-[#d4a857]/70"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.3em]">
            Aşağı Kaydır
          </span>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
