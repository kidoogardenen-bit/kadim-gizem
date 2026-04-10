'use client'

import { motion } from 'framer-motion'

export function Manifesto() {
  return (
    <section
      aria-label="Manifesto"
      className="relative w-full overflow-hidden bg-parchment bg-parchment-texture py-28 sm:py-36"
    >
      {/* Subtle paper grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 h-px w-32 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
          aria-hidden="true"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-5 font-sans text-[10px] font-semibold uppercase tracking-[0.4em] text-gold"
        >
          Manifesto
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl font-bold tracking-wide text-ink sm:text-5xl md:text-6xl"
        >
          Üç Kapı, Sonsuz Bilgi
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 mb-12 h-px w-24 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="space-y-7 font-serif text-xl leading-relaxed text-ink-light text-pretty sm:text-2xl"
        >
          <p>
            <span className="font-display text-3xl font-semibold text-gold-dark">K</span>
            adim Gizem; mitolojinin tozlu sayfaları, tarihin unutulmuş köşeleri ve
            bilimin henüz cevap veremediği gizemler arasında köprüler kuran bir
            keşif merkezidir.
          </p>
          <p>
            Tanrıların hikâyelerinden kayıp uygarlıklara, kutsal sembollerden
            günümüze ulaşan bilgeliklere uzanan bu yolculukta amacımız tek:
            geçmişin sesini özenle dinlemek ve onu bugüne taşımak.
          </p>
          <p className="italic text-gold-dark">
            “Geçmişi unutanlar onu tekrar yaşamaya mahkûmdur — onu hatırlayanlar
            ise yıldızlara yol bulur.”
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Manifesto
