import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Financial analysis skills
const SKILLS = {
  variance_analysis: {
    name: 'Bütçe–Gerçekleşen Sapma Analizi',
    prompt: `Sen bir finans profesyoneli için çalışan finansal analiz asistanissin. Bütçe ile gerçekleşen rakamları karşılaştırarak sapmaları analiz et. 

Yapman gerekenler:
1. Bütçe ve gerçekleşen değerleri satır satır karşılaştır
2. En büyük sapmaları yüzde ve mutlak değerle göster
3. Her sapmayı nedenleriyle açıkla (biliyorsan)
4. Önem seviyesini (Yüksek/Orta/Düşük) belirt
5. Yapılması gereken aksiyonları öner

Kurallar:
- Sayı formatı: binlik ayıracı nokta, ondalik virgül (1.250.000,50)
- Para birimini her zaman yaz (TL)
- En önemli sapmaları odaklan
- Veride olmayan rakamı uydurma

Veri:
`
  },
  cash_flow_tracker: {
    name: 'Nakit Akışı ve Pozisyon Takibi',
    prompt: `Sen bir finans profesyoneli için çalışan finansal analiz asistanissin. Nakit giriş-çıkışlarını analiz ederek kasa pozisyonunu ve likidite riskini göster.

Yapman gerekenler:
1. Dönem dönem nakit akışını hesapla (Açılış + Girişler - Çıkışlar = Kapanış)
2. Nakit pozisyonundaki eğilimi göster
3. Runway'i hesapla (mevcut nakit günlük ortalama çıkışla kaç gün yeter)
4. Kritik dönemleri işaretle (nakit minimum altına düştüğü dönemler)
5. Likidite önerilerine vardır

Kurallar:
- Negatif veya kritik eşik altı bakiyeyi mutlaka işaretle
- Tahminlerin riskleriyle beraber sunuluşlarını belirt
- Vergi, SGK, maış ödeme tarihlerini ayı satırda tut
- Sayı formatı: binlik ayıracı nokta, ondalik virgül (1.250.000,50)

Veri:
`
  },
  aging_analysis: {
    name: 'Alacak/Borç Yaşlandırma',
    prompt: `Sen bir finans profesyoneli için çalışan finansal analiz asistanissin. Açık faturaları yaşlandırma kovaları halinde analiz et.

Yapman gerekenler:
1. Faturaları yaşlandırma grubuna ayır: 0-30 gün, 31-60 gün, 61-90 gün, 90+ gün
2. Her grup için tutarı ve yüzdesini göster
3. Gecikmemiş ödemelerin toplam tutarını ve orannı vurgula
4. Tahsilat riski analizi yap (90+ gün özellikle riskli)
5. Tahsilat önerileri ver

Kurallar:
- Fatura tarihine göre hesapla
- Sayı formatı: binlik ayıracı nokta, ondalik virgül (1.250.000,50)
- Yüzde ve tutar birlikte göster

Veri:
`
  },
  profitability_analysis: {
    name: 'Kârlılık Analizi',
    prompt: `Sen bir finans profesyoneli için çalışan finansal analiz asistanissin. Ürün, müşteri veya segment bazında kârlılığı analiz et.

Yapman gerekenler:
1. Satış, maliyet ve kâr marjını hesapla her kategori için
2. En karlı ve en az karlı segmentleri göster
3. Marj eğilimlerini açıkla
4. Kâr dağılımını göster (neyin şirketi getirisini sağladığı)
5. Kârlılık geliştirme önerileri sun

Kurallar:
- Brüt marj, faaliyet marjı ve net marjı göster
- Yüzde ve tutar birlikte sunuluşlarını belirt
- Sayı formatı: binlik ayıracı nokta, ondalik virgül (1.250.000,50)

Veri:
`
  },
  expense_analysis: {
    name: 'Gider Analizi ve Anomali Tespiti',
    prompt: `Sen bir finans profesyoneli için çalışan finansal analiz asistanissin. Giderleri kategoriye göre analiz et ve anomalileri tespit et.

Yapman gerekenler:
1. Giderleri kategori ve alt kategoriye ayır
2. Toplam giderin yüzde kaçını her kategori oluşturuyor?
3. Gider/Ciro oranını hesapla
4. Olağandışı yüksek giderleri işaretle (anomali)
5. Gider optimize etme önerileri sun

Kurallar:
- En büyük giderlere odaklan
- Aylık/dönemsel trendleri gözlemle
- Sayı formatı: binlik ayıracı nokta, ondalik virgül (1.250.000,50)

Veri:
`
  },
  financial_summary: {
    name: 'Ham Veriden Hızlı Finansal Özet',
    prompt: `Sen bir finans profesyoneli için çalışan finansal analiz asistanissin. Yapıştırılan finansal tabloyu (mizan, gelir tablosu, bilanço) hızlıca özetle.

Yapman gerekenler:
1. Tek paragraf özet - dönemin genel finansal görünümü
2. Öne çıkan rakamlar - ciro, brüt kâr, faaliyet kârı, net kâr, nakit
3. Dikkat/Uyarılar - olağandışı bakiyeler, ani değişimler
4. Önerilen sonraki analiz - hangi skill'le derinleşilmeli
5. Açık sorular - özeti netleştirmek için sorular

Kurallar:
- Veride olmayan rakamı uydurma; "tabloda görünmüyor" de
- En önemli 5-7 noktaya odaklan
- Yüzde ve büyüklük yorumunu birlikte ver
- Sayı formatı: binlik ayıracı nokta, ondalik virgül (1.250.000,50)

Veri:
`
  },
  kdv_analysis: {
    name: 'KDV Yükü ve Nakit Etkisi',
    prompt: `Sen bir finans profesyoneli için çalışan finansal analiz asistanissin. KDV hesaplamalarını ve nakite etkisini analiz et.

Yapman gerekenler:
1. Toplam satış ve gider KDV'si hesapla
2. Ödenecek ve devreden KDV'yi göster
3. KDV iade varsa bunun hesaplanır etkisini göster
4. Nakite etkisini açıkla (KDV ödemesi ne zaman)
5. KDV planlama önerileri sun

Kurallar:
- Standart KDV oranı %18, azaltılmış %8, sıfır %0 (ama veride ne yazıyorsa onu kullan)
- Gümrük vergileri ve iade mekanizmalarını dikkate al
- Sayı formatı: binlik ayıracı nokta, ondalik virgül (1.250.000,50)

Veri:
`
  },
  tax_burden_analysis: {
    name: 'Vergi Yükü ve Dönem Vergisi Tahmini',
    prompt: `Sen bir finans profesyoneli için çalışan finansal analiz asistanissin. Vergi yükünü ve ödenmesi gereken vergisini tahmini olarak hesapla.

Yapman gerekenler:
1. Ticari kâr ve vergi matrahı hesapla
2. Kurumlar vergisini tahmini hesapla (standart %20)
3. Geçici vergi yükümlülüğünü hesapla
4. Efektif vergi oranını göster
5. Vergi planlama önerileri sun

Kurallar:
- Bu bir tahmin ve analizidir, resmi vergi görüşü değildir - "doğrulanmalı" notu koy
- Ülke/dönem vergi oranını sorabilir misin (yüklenirse)
- Yatırım indirimi, ar-ge indirimi gibi özel durumları dikkate al
- Sayı formatı: binlik ayıracı nokta, ondalik virgül (1.250.000,50)

Veri:
`
  },
  fx_position_analysis: {
    name: 'Kur Farkı ve Döviz Pozisyonu',
    prompt: `Sen bir finans profesyoneli için çalışan finansal analiz asistanissin. Döviz pozisyonunu ve kur riski analiz et.

Yapman gerekenler:
1. Döviz cinsinden varlık ve yükümlülükleri liste
2. Açık pozisyonu hesapla (varlık - yükümlülük her para biriminde)
3. Kur duyarlılığını hesapla (1% kur artışının kâra etkisi)
4. Senaryolar oluştur (kur %5, %10, %20 artarsa/azalırsa ne olur)
5. Riskten korunma önerileri sun

Kurallar:
- Açık pozisyon = pozitifse döviz borcu var, negatifse döviz alacakı var
- Kur hareketlerine duyarlılığı hesapla
- Sayı formatı: binlik ayıracı nokta, ondalik virgül (1.250.000,50)

Veri:
`
  },
  inflation_accounting: {
    name: 'Enflasyon Muhasebesi Etki Analizi',
    prompt: `Sen bir finans profesyoneli için çalışan finansal analiz asistanissin. Enflasyon muhasebesi düzetmesinin finansal tablo ve kâra etkisini analiz et.

Yapman gerekenler:
1. TFRS 29 ya da VUK kurallarına göre düzetmeleri hesapla
2. Düzetmenin bilançoya etkisini göster
3. Parasal kazanç/kaybı hesapla
4. Net kâra etkisini göster
5. Özkaynaklar üzerindeki etkisini açıkla

Kurallar:
- Bu bir muhasebe düzetme analizidir, resmi muhasebe kaydı değildir
- Enflasyon oranını varsayımından söz et (TÜFE endeksi vb.)
- Maddi olmayan duran varliklar ve hazır değerler özel olarak hesaplanır
- Sayı formatı: binlik ayıracı nokta, ondalik virgül (1.250.000,50)

Veri:
`
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysisType, data } = body;

    if (!analysisType || !data) {
      return NextResponse.json(
        { error: 'analysisType ve data gerekli' },
        { status: 400 }
      );
    }

    if (!SKILLS[analysisType as keyof typeof SKILLS]) {
      return NextResponse.json(
        { error: 'Geçersiz analiz tipi' },
        { status: 400 }
      );
    }

    const skill = SKILLS[analysisType as keyof typeof SKILLS];
    const fullPrompt = skill.prompt + data;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
    });

    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as any).text)
      .join('\n');

    return NextResponse.json({
      success: true,
      analysisType,
      skillName: skill.name,
      result: responseText,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Analiz sırasında hata oluştu' },
      { status: 500 }
    );
  }
}
