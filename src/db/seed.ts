import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { categories, users, tags, posts } from './schema';

const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log('Seeding database...');

  const insertedCategories = await db
    .insert(categories)
    .values([
      {
        slug: 'mitoloji',
        name: 'Mitoloji',
        nameEn: 'Mythology',
        description: 'Antik medeniyetlerin efsaneleri ve tanrilari',
        color: '#92400e',
        icon: 'ZAP',
        youtubeChannel: 'Unutulmus Bilgeler',
        order: 1,
      },
      {
        slug: 'tarih',
        name: 'Tarih',
        nameEn: 'History',
        description: 'Unutulmus caglarin derinliklerinden hikayeler',
        color: '#44403c',
        icon: 'SCROLL',
        youtubeChannel: 'Unutulan Caglar',
        order: 2,
      },
      {
        slug: 'gercekler',
        name: 'Gercekler',
        nameEn: 'Dark Facts',
        description: 'Karanlik gercekler ve bilinmeyen olaylar',
        color: '#7f1d1d',
        icon: 'FIRE',
        youtubeChannel: 'DarkFacts',
        order: 3,
      },
    ])
    .onConflictDoNothing()
    .returning();

  console.log('categories inserted:', insertedCategories.length);

  const insertedUsers = await db
    .insert(users)
    .values([
      {
        name: 'Furkan Duman',
        email: 'furkanndumann1@gmail.com',
        role: 'admin',
        bio: 'Kadim Gizem kurucusu',
      },
    ])
    .onConflictDoNothing()
    .returning();

  console.log('users inserted:', insertedUsers.length);

  const tagData = [
    { slug: 'antik', name: 'Antik' },
    { slug: 'mitoloji', name: 'Mitoloji' },
    { slug: 'yunan', name: 'Yunan' },
    { slug: 'misir', name: 'Misir' },
    { slug: 'roma', name: 'Roma' },
    { slug: 'mistik', name: 'Mistik' },
    { slug: 'gizem', name: 'Gizem' },
    { slug: 'tarih', name: 'Tarih' },
    { slug: 'bilim', name: 'Bilim' },
  ];

  const insertedTags = await db
    .insert(tags)
    .values(tagData)
    .onConflictDoNothing()
    .returning();

  console.log('tags inserted:', insertedTags.length);

  const allCats = await db.select().from(categories);
  const catMap: Record<string, number> = {};
  for (const c of allCats) catMap[c.slug] = c.id;

  const allUsers = await db.select().from(users);
  const admin = allUsers.find((u) => u.email === 'furkanndumann1@gmail.com');
  const adminId = admin?.id;

  const postZeus = [
    '# Zeus ve Olimpos Tanrilari',
    '',
    'Antik Yunan mitolojisinin kalbinde **Olimpos Dagi** yatar. Bu kutsal zirvede on iki buyuk tanri yasardi.',
    '',
    '## Zeus un Yukselisi',
    '',
    'Kronos un oglu Zeus, babasini devirerek tanrilarin krali oldu.',
    '',
    '## Olimpos Panteonu',
    '',
    '- **Hera**: Evliligin tanricasi',
    '- **Poseidon**: Denizlerin efendisi',
    '- **Athena**: Bilgeligin tanricasi',
    '- **Apollon**: Isigin ve muzigin tanrisi',
  ].join('\n');

  const postIsk = [
    '# Iskenderiye Kutuphanesi',
    '',
    '**Antik dunyanin sekizinci harikasi** olarak anilan Iskenderiye Kutuphanesi, bilinen tum bilgiyi bir cati altinda toplama hayalinin urunuydu.',
    '',
    '## Kurulus',
    '',
    'MO 3. yuzyilda Ptolemaios hanedani tarafindan kuruldu.',
    '',
    '## Yikilis',
    '',
    'Yanginlar ve savaslar sonucu bu bilgi hazinesi kayboldu.',
  ].join('\n');

  const postBeyin = [
    '# Beynin Karanlik Tarafi',
    '',
    'Insan beyni, evrende bilinen en karmasik yapidir.',
    '',
    '## Bilinmeyen Bolgeler',
    '',
    'Beynin sadece %10 unu kullandigimiz efsanesi yanlistir.',
    '',
    '## Ruyalar ve Bilinc',
    '',
    'Neden ruya goruruz? Bilinc nedir?',
  ].join('\n');

  const insertedPosts = await db
    .insert(posts)
    .values([
      {
        slug: 'zeus-ve-olimpos-tanrilari',
        title: 'Zeus ve Olimpos Tanrilari: Yildirimin Efendisi',
        excerpt: 'Yunan mitolojisinin en guclu tanrisi Zeus ve Olimpos panteonunun hikayesi.',
        content: postZeus,
        categoryId: catMap['mitoloji'],
        authorId: adminId,
        status: 'published',
        featured: true,
        readingTime: 4,
        publishedAt: new Date(),
      },
      {
        slug: 'kayip-kutuphane-iskenderiye',
        title: 'Kayip Kutuphane: Iskenderiye nin Sirlari',
        excerpt: 'Antik dunyanin en buyuk bilgi hazinesi nasil yok oldu?',
        content: postIsk,
        categoryId: catMap['tarih'],
        authorId: adminId,
        status: 'published',
        featured: true,
        readingTime: 3,
        publishedAt: new Date(),
      },
      {
        slug: 'insan-beyninin-karanlik-sirri',
        title: 'Insan Beyninin Karanlik Sirri',
        excerpt: 'Bilim insanlarinin bile aciklayamadigi beyin gizemleri.',
        content: postBeyin,
        categoryId: catMap['gercekler'],
        authorId: adminId,
        status: 'published',
        featured: false,
        readingTime: 2,
        publishedAt: new Date(),
      },
    ])
    .onConflictDoNothing()
    .returning();

  console.log('posts inserted:', insertedPosts.length);
  console.log('Seed complete!');
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
