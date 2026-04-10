import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { newsletterSubscribers } from '@/db/schema';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Token gerekli' }, { status: 400 });
  }
  try {
    const result = await db
      .delete(newsletterSubscribers)
      .where(eq(newsletterSubscribers.unsubscribeToken, token))
      .returning();

    if (result.length === 0) {
      return new NextResponse(
        '<html><body style="background:#0a0a0f;color:#e8e6e3;font-family:Georgia,serif;text-align:center;padding:80px 20px;"><h1 style="color:#d4af37">Gecersiz Baglanti</h1><p>Bu abonelik kaydi bulunamadi.</p></body></html>',
        { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } }
      );
    }

    return new NextResponse(
      '<html><body style="background:#0a0a0f;color:#e8e6e3;font-family:Georgia,serif;text-align:center;padding:80px 20px;"><h1 style="color:#d4af37">Abonelikten Cikildiniz</h1><p>Kadim Gizem bulteninden basariyla ayrildiniz. Sizi tekrar aramizda gormek dileriyle.</p><p><a href="/" style="color:#d4af37">Ana sayfaya don</a></p></body></html>',
      { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } }
    );
  } catch (err) {
    console.error('[newsletter/unsubscribe]', err);
    return NextResponse.json({ error: 'Sunucu hatasi' }, { status: 500 });
  }
}
