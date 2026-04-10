import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { db } from '@/db';
import { newsletterSubscribers } from '@/db/schema';
import { sendNewsletterConfirmation } from '@/lib/resend';

const schema = z.object({
  email: z.string().email('Gecerli bir e-posta adresi girin'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Gecersiz veri' },
        { status: 400 }
      );
    }
    const email = parsed.data.email.toLowerCase().trim();
    const unsubscribeToken = randomUUID();

    await db
      .insert(newsletterSubscribers)
      .values({ email, unsubscribeToken })
      .onConflictDoNothing({ target: newsletterSubscribers.email });

    const site = process.env.NEXT_PUBLIC_SITE_URL || '';
    const unsubscribeUrl = `${site}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

    try {
      await sendNewsletterConfirmation(email, unsubscribeUrl);
    } catch (e) {
      console.error('[newsletter] email failed', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Bultene basariyla abone oldunuz. Hos geldiniz!',
    });
  } catch (err) {
    console.error('[newsletter/subscribe]', err);
    return NextResponse.json(
      { error: 'Bir hata olustu. Lutfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
