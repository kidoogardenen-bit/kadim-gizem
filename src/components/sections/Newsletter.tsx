'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Mail, Check, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    // UI-only: simulate
    await new Promise((r) => setTimeout(r, 900))
    setStatus('success')
    setEmail('')
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <section
      aria-labelledby="bulten-heading"
      className="relative w-full overflow-hidden py-28 sm:py-36"
    >
      {/* Layered gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(135deg,_#0f0b08_0%,_#1a1410_40%,_#3a2f24_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,168,87,0.18)_0%,_transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(139,30,45,0.15)_0%,_transparent_60%)]"
      />
      <div aria-hidden="true" className="bg-starfield absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-3xl px-6 text-center text-[#f5efe0]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#d4a857]/40 bg-[#d4a857]/10 backdrop-blur-sm"
        >
          <Mail className="h-7 w-7 text-[#d4a857]" aria-hidden="true" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d4a857]"
        >
          Bülten
        </motion.p>

        <motion.h2
          id="bulten-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl font-bold tracking-wide text-balance sm:text-5xl md:text-6xl"
        >
          Keşfetmeye hazır mısın?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mx-auto mt-6 max-w-xl font-serif text-lg italic text-[#c9bfa8] text-pretty sm:text-xl"
        >
          Ücretsiz haftalık bülten — antik bilgelerden seçmeler, kayıp
          hikâyeler ve sana özel arşiv notları.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={handleSubmit}
          className="mx-auto mt-12 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
          aria-label="Bültene abone ol"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            E-posta adresin
          </label>
          <Input
            id="newsletter-email"
            type="email"
            required
            placeholder="seninadres@ornek.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="h-12 flex-1 rounded-full border-[#d4a857]/30 bg-[#0f0b08]/60 px-6 font-sans text-sm text-[#f5efe0] placeholder:text-[#a89680] backdrop-blur-md focus-visible:border-[#d4a857] focus-visible:ring-[#d4a857]/30"
          />
          <Button
            type="submit"
            size="lg"
            disabled={status === 'loading' || status === 'success'}
            className="h-12 rounded-full bg-[#d4a857] px-8 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-[#0a0705] shadow-[0_0_30px_-8px_rgba(212,168,87,0.6)] transition-all duration-500 hover:bg-[#e8c478] hover:shadow-[0_0_50px_-4px_rgba(212,168,87,0.8)] disabled:opacity-80"
          >
            {status === 'loading' && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {status === 'success' && (
              <Check className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {status === 'success' ? 'Katıldın' : 'Abone Ol'}
          </Button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-5 font-sans text-xs text-[#a89680]"
        >
          Spam yok. Dilediğin an çıkabilirsin.
        </motion.p>
      </div>
    </section>
  )
}

export default Newsletter
