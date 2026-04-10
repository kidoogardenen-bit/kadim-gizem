import type { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { BookOpen, Scroll, Microscope, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hakkimizda | Kadim Gizem',
  description:
    'Kadim Gizem; mitoloji, tarih ve sorgulanmayi bekleyen gerceklerin bulustugu bir arastirma ve anlati platformudur. Manifestomuzu ve yolculugumuzu kesfedin.',
  openGraph: {
    title: 'Hakkimizda | Kadim Gizem',
    description:
      'Mitoloji, tarih ve gerceklerin golgelerinde bir yolculuk. Manifestomuz ve misyonumuz.',
    type: 'website',
  },
};

export default function HakkindaPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-neutral-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-amber-500/10 py-24 sm:py-32">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-amber-500/80">
            Kadim Gizem
          </p>
          <h1
            className="font-[family-name:var(--font-cinzel),Cinzel,serif] text-5xl font-bold tracking-wider text-amber-400 sm:text-6xl lg:text-7xl"
            style={{ textShadow: '0 0 40px rgba(212,175,55,0.3)' }}
          >
            Hakkimizda
          </h1>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          <p className="mx-auto mt-6 max-w-2xl text-lg italic text-neutral-400">
            &ldquo;Unutulmus olan, kaybedilmis degildir; yalnizca yeniden
            hatirlanmayi bekler.&rdquo;
          </p>
        </div>
      </section>

      {/* Manifesto */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="mb-10 text-center font-[family-name:var(--font-cinzel),Cinzel,serif] text-3xl tracking-wider text-amber-400 sm:text-4xl">
          Manifesto
        </h2>
        <div className="prose prose-invert prose-lg max-w-none prose-p:text-neutral-300 prose-p:leading-relaxed">
          <p>
            Kadim Gizem, insanligin kolektif bellegine acilan bir kapidir.
            Binlerce yil once anlatilan efsaneler, tapinak duvarlarina kazinmis
            hiyeroglifler, atesin etrafinda fisildanan masallar&mdash; tum
            bunlar yalnizca gecmisin suslemeleri degil, bugunu anlamak icin
            bize birakilmis anahtarlardir.
          </p>
          <p>
            Biz, tarihin resmi anlatilarinin otesine gecmeye cesaret eden,
            mitolojinin sembolik dilini cozmek icin dikkatle dinleyen ve bilim
            ile mucizeler arasindaki o ince cizgide yurumeye cabalayan bir
            toplulugu temsil ediyoruz. Amacimiz komplo teorileri uretmek
            degil; sorgulamak, karsilastirmak ve okuyucunun kendi sonucuna
            varmasi icin kaynaklari serip yaymaktir.
          </p>
          <p>
            Her yazimiz, hem bir arastirmaci titizligi hem de bir anlaticinin
            sicakligi tasir. Cunku inaniyoruz ki, kuru veriler ruhu
            aydinlatmaz; bir hikayenin icine gizlenmis hakikat ise nesiller
            boyunca yasayabilir. Gilgamis&rsquo;tan Osiris&rsquo;e,
            Ulubey&rsquo;in yer alti gecitlerinden Nazca cizgilerine kadar
            her sembol, bize atalarinin nasil dusundugunu anlatir.
          </p>
          <p>
            Kadim Gizem bir arsiv, bir kutuphane, bir salon sohbetidir. Burada
            sorular yanitlardan daha degerlidir. Burada bir iddia &ldquo;kabul
            edilmis&rdquo; oldugu icin dogru sayilmaz; sorgulanir, tartilir ve
            gerekirse yeniden yazilir.
          </p>
          <p>
            Eger bu yolculuk sana da aitse, hos geldin. Mesale senin elinde.
          </p>
        </div>
      </section>

      {/* Three Paths */}
      <section className="border-y border-amber-500/10 bg-black/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center font-[family-name:var(--font-cinzel),Cinzel,serif] text-3xl tracking-wider text-amber-400 sm:text-4xl">
            Uc Yol, Tek Hedef
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-neutral-400">
            Her biri bagimsiz, her biri birbirine bagli uc anlati ekseninde
            ilerliyoruz.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="group border-amber-500/20 bg-gradient-to-b from-neutral-900/80 to-black/80 transition-all hover:border-amber-500/50 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)]">
              <CardHeader>
                <BookOpen className="mb-3 h-8 w-8 text-amber-400" />
                <CardTitle className="font-[family-name:var(--font-cinzel),Cinzel,serif] text-xl tracking-wider text-amber-300">
                  Mitoloji
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400">
                  Tanrilarin, canavarlarin ve kahramanlarin dunyasi. Mezopotamya
                  tabletlerinden Iskandinav sagalarina, Turk-Altay
                  destanlarindan Misir&rsquo;in gizem kultlerine uzanan sembolik
                  bir yolculuk. Her efsanenin altinda bir gercek, her gercegin
                  icinde bir efsane yatar.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-amber-500/20 bg-gradient-to-b from-neutral-900/80 to-black/80 transition-all hover:border-amber-500/50 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)]">
              <CardHeader>
                <Scroll className="mb-3 h-8 w-8 text-amber-400" />
                <CardTitle className="font-[family-name:var(--font-cinzel),Cinzel,serif] text-xl tracking-wider text-amber-300">
                  Tarih
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400">
                  Resmi anlatilarda silinmis, koseye atilmis ya da unutulmus
                  olaylar. Kaybolmis medeniyetler, susturulan bilgeler, kayip
                  kutuphaneler ve imparatorluklarin golgesinde kalmis kucuk ama
                  donum noktasi olmus anlar. Tarih, galiplerin kitabi olmak
                  zorunda degildir.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-amber-500/20 bg-gradient-to-b from-neutral-900/80 to-black/80 transition-all hover:border-amber-500/50 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)]">
              <CardHeader>
                <Microscope className="mb-3 h-8 w-8 text-amber-400" />
                <CardTitle className="font-[family-name:var(--font-cinzel),Cinzel,serif] text-xl tracking-wider text-amber-300">
                  Gercekler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400">
                  Bilim, arkeoloji ve modern arastirmalarin isiginda sorgulanan
                  iddialar. Efsanelere tutunan ama kanitlara da saygi gosteren
                  bir yaklasim. Gizemleri cozmek bazen daha buyuk gizemleri
                  dogurur&mdash; biz bu paradokstan kacinmiyoruz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="mb-8 text-center font-[family-name:var(--font-cinzel),Cinzel,serif] text-3xl tracking-wider text-amber-400 sm:text-4xl">
          Misyonumuz
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-neutral-300">
          <p>
            Kadim Gizem&rsquo;in misyonu, unutulmus olani gun yuzune cikarmak,
            bilineni farkli bir isikta yeniden sunmak ve okurlarina
            sorgulayabilecekleri bir zemin hazirlamaktir.
          </p>
          <p>
            Bir hikayeyi anlatmanin en guclu yolu, onu hem akilla hem kalple
            dinleyebilmektir. Biz, ozenli bir arastirma ile edebi bir
            anlatimin ancak birlikte anlamli olabilecegine inaniyoruz. Her
            makalede kaynaklara saygi, karsi goruslere acik olma ve okuyucunun
            zekasina guven prensiplerimizin temelini olusturur.
          </p>
        </div>
      </section>

      {/* Content production */}
      <section className="border-y border-amber-500/10 bg-black/40 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-6 flex items-center justify-center gap-3">
            <Sparkles className="h-6 w-6 text-amber-400" />
            <h2 className="font-[family-name:var(--font-cinzel),Cinzel,serif] text-2xl tracking-wider text-amber-400 sm:text-3xl">
              Icerik Uretimi
            </h2>
          </div>
          <div className="space-y-5 text-neutral-300">
            <p>
              Kadim Gizem icerikleri; insan arastirmacilarin, editorlerin ve
              yapay zeka destekli arac setlerinin is birligiyle uretilir.
              Seffaf olmayi onemseriz: Yapay zeka bizim icin bir arastirma
              hizlandiricisi, bir tasarim yardimcisi ve bir uretim destegidir;
              ancak hicbir zaman insan editoriyel denetiminin yerine gecmez.
            </p>
            <p>
              Her yazi yayinlanmadan once bir editor tarafindan okunur, iddia
              edilen bilgiler kaynaklariyla karsilastirilir ve gerektiginde
              yeniden yazilir. Bulduklarimizi sizinle paylasirken hatalarimizi
              da kabul etmeye ve duzeltmeye hazir oldugumuzu bilmenizi isteriz.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h2 className="mb-4 font-[family-name:var(--font-cinzel),Cinzel,serif] text-3xl tracking-wider text-amber-400 sm:text-4xl">
          Bize Katil
        </h2>
        <p className="mb-8 text-neutral-400">
          Yeni yazilardan ve ozel iceriklerden haberdar olmak icin bultenimize
          abone ol.
        </p>
        <NewsletterForm />
      </section>
    </div>
  );
}
