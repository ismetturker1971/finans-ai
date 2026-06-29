'use client';

import { useState } from 'react';

type AnalysisType = 
  | 'variance_analysis'
  | 'cash_flow_tracker'
  | 'aging_analysis'
  | 'profitability_analysis'
  | 'expense_analysis'
  | 'financial_summary'
  | 'kdv_analysis'
  | 'tax_burden_analysis'
  | 'fx_position_analysis'
  | 'inflation_accounting';

interface AnalysisFormProps {
  selectedAnalysis: AnalysisType;
  onSubmit: (data: string) => void;
  isLoading: boolean;
}

export default function AnalysisForm({
  selectedAnalysis,
  onSubmit,
  isLoading,
}: AnalysisFormProps) {
  const [data, setData] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  const placeholders: Record<AnalysisType, string> = {
    variance_analysis: `Bütçe ve Gerçekleşen rakamlarını yapıştırın:

Örnek format:
Kalem                  | Bütçe      | Gerçekleşen
Satış Hasılatı        | 5.000.000  | 5.200.000
İndirim               | (250.000)  | (180.000)
Net Satış             | 4.750.000  | 5.020.000
Maliyeti              | (2.375.000)| (2.610.000)
Brüt Kâr              | 2.375.000  | 2.410.000`,

    cash_flow_tracker: `Nakit akışını yapıştırın:

Örnek format:
Dönem      | Açılış   | Tahsilat   | Ödeme    | Açıklama
1. Hafta   | 500.000  | 300.000    | 200.000  | Normal tahsilat
2. Hafta   | 600.000  | 250.000    | 450.000  | Maaş + Fatura ödemesi`,

    aging_analysis: `Açık faturaları yapıştırın:

Örnek format:
Müşteri    | Fatura Tarihi | Tutar      | Açık Bakiye
Şirket A   | 2024-04-15    | 50.000     | 50.000
Şirket B   | 2024-05-01    | 100.000    | 100.000
Şirket C   | 2024-06-10    | 75.000     | 75.000`,

    profitability_analysis: `Ürün/müşteri/segment verilerini yapıştırın:

Örnek format:
Kategori   | Satış      | Maliyet    | Satış Miktarı
Ürün A     | 2.000.000  | 1.000.000  | 1.000
Ürün B     | 1.500.000  | 900.000    | 500
Ürün C     | 1.000.000  | 800.000    | 200`,

    expense_analysis: `Gider verilerini yapıştırın:

Örnek format:
Gider Kategorisi   | Tutarı    | Dönem
Maaşlar            | 1.200.000 | Aylık
Kira               | 100.000   | Aylık
Malzeme            | 250.000   | Aylık
Pazarlama          | 150.000   | Aylık`,

    financial_summary: `Finansal tabloyu yapıştırın:

Bün halinde mizan, gelir tablosu veya bilanço 
metni/tablosu yapıştırabilirsiniz. CSV, Excel 
veya metinsel tablo formatında olabilir.

Örnek:
Kalem                        | 2024-12 | 2024-11
Hazır Değerler              | 500.000 | 450.000
Ticari Alacaklar            | 1.500.000| 1.400.000
Satış Hasılatı              | 3.500.000| 3.200.000`,

    kdv_analysis: `KDV hesaplamalarını yapıştırın:

Örnek format:
Kalem                  | Tutarı     | KDV Oranı
Yurt içi satış         | 10.000.000 | %18
Yurt dışı satış (0%)   | 2.000.000  | %0
Satın alınan mal       | 5.000.000  | %18`,

    tax_burden_analysis: `Vergi hesaplaması için verileri yapıştırın:

Örnek format:
Ticari Kâr:     5.000.000 TL
KKEG:           200.000 TL (kurumlar vergisinden indirim)
Ar-Ge Harcaması: 300.000 TL
Geçici Vergi Dönem: 3. Dönem
Kurumlar Vergi Oranı: %20`,

    fx_position_analysis: `Döviz pozisyonunu yapıştırın:

Örnek format:
Para Birimi | Varlık    | Yükümlülük | Açık Pozisyon
USD         | 500.000   | 300.000    | 200.000
EUR         | 100.000   | 200.000    | (100.000)
GBP         | 50.000    | 0          | 50.000

Mevcut Kur: USD/TL = 32.5, EUR/TL = 35.0`,

    inflation_accounting: `Enflasyon düzetmesi için verileri yapıştırın:

Örnek format:
Bilançodaki Kalemler (31.12.2024):
Hazır Değerler (Parasal): 1.000.000 TL
Stoklar (Duran varlik): 5.000.000 TL
Maliyet tarihi: 30.06.2024
Enflasyon Oranı (6 ay): %8
Düzetme Tarihi: 31.12.2024`,
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Veri Girin</h2>
      
      <div className="mb-4">
        <label htmlFor="data" className="block text-sm font-semibold text-gray-700 mb-2">
          Finansal Veri
        </label>
        <textarea
          id="data"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder={placeholders[selectedAnalysis]}
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading || !data.trim()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          {isLoading ? '🔄 Analiz Yapılıyor...' : '✨ Analiz Et'}
        </button>
        <button
          type="button"
          onClick={() => setData('')}
          className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors"
        >
          Temizle
        </button>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        💡 <strong>İpucu:</strong> Verilerinizi copy-paste yapabilirsiniz. Excel, CSV, metinsel tablo vb. 
        tüm formatlar kabul edilir. Veriler API çağrılarında kısa süre işlenir ve çıktılar kaydedilmez.
      </p>
    </form>
  );
}
