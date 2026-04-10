'use server';

import { z } from 'zod';
import { sendContactMessage } from '@/lib/resend';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

type Result = { success: true; message: string } | { success: false; error: string };

export async function submitContact(input: unknown): Promise<Result> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Gecersiz veri',
    };
  }
  try {
    await sendContactMessage(
      parsed.data.name,
      parsed.data.email,
      parsed.data.subject,
      parsed.data.message
    );
    return {
      success: true,
      message: 'Mesajiniz bize ulasti. En kisa surede donus yapacagiz.',
    };
  } catch (err) {
    console.error('[contact] send failed', err);
    return {
      success: false,
      error: 'Mesaj gonderilemedi. Lutfen tekrar deneyin.',
    };
  }
}
