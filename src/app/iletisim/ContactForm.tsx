'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, Send } from 'lucide-react';
import { submitContact } from './actions';

const schema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmali'),
  email: z.string().email('Gecerli bir e-posta girin'),
  subject: z.string().min(3, 'Konu en az 3 karakter olmali'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmali'),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    setStatus('idle');
    setServerMessage('');
    startTransition(async () => {
      const res = await submitContact(values);
      if (res.success) {
        setStatus('success');
        setServerMessage(res.message || 'Mesajiniz iletildi');
        reset();
      } else {
        setStatus('error');
        setServerMessage(res.error || 'Bir hata olustu');
      }
    });
  };

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-black/40 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-amber-400" />
        <h3 className="mb-2 font-[family-name:var(--font-cinzel),Cinzel,serif] text-2xl tracking-wider text-amber-300">
          Mesajiniz Iletildi
        </h3>
        <p className="text-neutral-400">{serverMessage}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-xl border border-amber-500/20 bg-gradient-to-b from-neutral-900/60 to-black/60 p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-amber-300">
            Ad Soyad
          </Label>
          <Input
            id="name"
            {...register('name')}
            disabled={isPending}
            className="border-amber-500/20 bg-black/40 text-neutral-100 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
          />
          {errors.name && (
            <p className="text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-amber-300">
            E-posta
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            disabled={isPending}
            className="border-amber-500/20 bg-black/40 text-neutral-100 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
          />
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-amber-300">
          Konu
        </Label>
        <Input
          id="subject"
          {...register('subject')}
          disabled={isPending}
          className="border-amber-500/20 bg-black/40 text-neutral-100 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
        />
        {errors.subject && (
          <p className="text-sm text-red-400">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-amber-300">
          Mesaj
        </Label>
        <textarea
          id="message"
          rows={6}
          {...register('message')}
          disabled={isPending}
          className="flex w-full rounded-md border border-amber-500/20 bg-black/40 px-3 py-2 text-base text-neutral-100 shadow-sm placeholder:text-neutral-500 focus-visible:border-amber-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.message && (
          <p className="text-sm text-red-400">{errors.message.message}</p>
        )}
      </div>

      {status === 'error' && serverMessage && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {serverMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full bg-gradient-to-b from-amber-400 to-amber-600 font-semibold uppercase tracking-wider text-black hover:from-amber-300 hover:to-amber-500"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gonderiliyor...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Mesaji Gonder
          </>
        )}
      </Button>
    </form>
  );
}
