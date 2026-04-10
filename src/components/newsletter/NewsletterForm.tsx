'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, CheckCircle2 } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Gecerli bir e-posta adresi girin'),
});

type FormValues = z.infer<typeof schema>;

interface NewsletterFormProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function NewsletterForm({
  variant = 'default',
  className = '',
}: NewsletterFormProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setStatus('idle');
    setMessage('');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Bir hata olustu');
        return;
      }
      setStatus('success');
      setMessage(data.message || 'Basariyla abone oldunuz');
      reset();
    } catch {
      setStatus('error');
      setMessage('Baglanti hatasi. Tekrar deneyin.');
    }
  };

  if (status === 'success') {
    return (
      <div
        className={`flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-amber-200 ${className}`}
      >
        <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-400" />
        <p className="text-sm">{message}</p>
      </div>
    );
  }

  const isCompact = variant === 'compact';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex w-full flex-col gap-3 ${isCompact ? 'sm:flex-row' : 'sm:flex-row'} ${className}`}
    >
      <div className="relative flex-1">
        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500/60" />
        <Input
          type="email"
          placeholder="E-posta adresiniz"
          className="h-12 border-amber-500/20 bg-black/40 pl-10 text-base text-neutral-100 placeholder:text-neutral-500 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
          {...register('email')}
          disabled={isSubmitting}
          aria-invalid={!!errors.email}
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 bg-gradient-to-b from-amber-400 to-amber-600 px-6 font-semibold uppercase tracking-wider text-black hover:from-amber-300 hover:to-amber-500"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Abone Ol'
        )}
      </Button>
      {errors.email && (
        <p className="w-full text-sm text-red-400 sm:basis-full">
          {errors.email.message}
        </p>
      )}
      {status === 'error' && message && (
        <p className="w-full text-sm text-red-400 sm:basis-full">{message}</p>
      )}
    </form>
  );
}
