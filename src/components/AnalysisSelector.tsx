'use client';

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

const ANALYSES: {
  id: AnalysisType;
  name: string;
  description: string;
  icon: string;
  tips: string[];
}[] = [
  {
    id: 'financial_summary',
    name: '📊 Hızlı Finansal Özet',
    description: 'Finansal tabloyu yapıştırınca yönetici özeti ve uyarılar',
    icon: '📊',
    tips: ['Mizan, gelir tablosu veya bilanço yapıştırabilirsiniz', 'Tablonun başlık ve satırları net olsun'],
  },
  {
    id: 'variance_analysis',
    name: '📈 Sapma Analizi',
    description: 'Bütçe ve gerçekleşen rakamlarını karşılaştır',
    icon: '📈',
    tips: ['Bütçe ve fiili rakamlarını satır satır gir', 'Sapmaların nedenlerini belirtirsen daha detaylı analiz yapılır'],
  },
  {
    id: 'cash_flow_tracker',
    name: '💰 Nakit Akışı',
    description: 'Tahsilat-ödeme planlaması ve likidite analizi',
    icon: '💰',
    tips: ['Tarih, açılış bakiyesi ve nakite dair tüm giriş-çıkışları listele', 'SGK, vergi ödeme tarihleri çok önemli'],
  },
  {
    id: 'aging_analysis',
    name: '⏰ Yaşlandırma Analizi',
    description: 'Alacak ve borçları yaşlandırma kova ları halinde göster',
    icon: '⏰',
    tips: ['Fatura tarihi, tutarı ve kalan bakiyesi gerekli', 'Gecikmemiş ödemeler önemli'],
  },
  {
    id: 'profitability_analysis',
    name: '💹 Kârlılık Analizi',
    description: 'Ürün/müşteri/segment bazında kâr marjı',
    icon: '💹',
    tips: ['Satış tutarı, maliyet ve kategori bilgileri gir', 'Bölüm bazında karşılaştırma yapılabilir'],
  },
  {
    id: 'expense_analysis',
    name: '📉 Gider Analizi',
    description: 'Giderleri kategoriye göre analiz et, anomali tespit et',
    icon: '📉',
    tips: ['Gider kategorisi ve tutarları gir', 'Aylık/dönemsel trendler görülür'],
  },
  {
    id: 'kdv_analysis',
    name: '🏛️ KDV Analizi',
    description: 'KDV yükü, iade ve nakit etkisi hesapla',
    icon: '🏛️',
    tips: ['Satış KDV\'si ve gider KDV\'sini ayır', 'İade veya devreden KDV varsa belirt'],
  },
  {
    id: 'tax_burden_analysis',
    name: '💼 Vergi Yükü',
    description: 'Kurumlar ve geçici vergi tahmini yap',
    icon: '💼',
    tips: ['Ticari kâr ve KKEG\'yi gir', 'Vergi oranları ve uygulanacak indirimleri belirt'],
  },
  {
    id: 'fx_position_analysis',
    name: '💱 Döviz Pozisyonu',
    description: 'Kur riski ve duyarlılık analizi',
    icon: '💱',
    tips: ['Döviz cinsinden varlik ve yükümlülükleri listele', 'Açık pozisyonu görür, kur duyarlılığını hesaplar'],
  },
  {
    id: 'inflation_accounting',
    name: '📐 Enflasyon Muhasebesi',
    description: 'TFRS 29 / VUK enflasyon düzetme etkisi',
    icon: '📐',
    tips: ['Bilançoyu ve enflasyon oranını gir', 'Parasal kazanç/kayıp ve düzetme etkisini hesaplar'],
  },
];

interface AnalysisSelectorProps {
  selectedAnalysis: AnalysisType | null;
  onSelect: (analysis: AnalysisType) => void;
}

export default function AnalysisSelector({
  selectedAnalysis,
  onSelect,
}: AnalysisSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Analiz Türü Seç</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ANALYSES.map((analysis) => (
          <button
            key={analysis.id}
            onClick={() => onSelect(analysis.id)}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              selectedAnalysis === analysis.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-gray-50 hover:border-blue-300'
            }`}
          >
            <div className="font-semibold text-gray-800">{analysis.name}</div>
            <div className="text-sm text-gray-600 mt-1">{analysis.description}</div>
            {selectedAnalysis === analysis.id && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs font-semibold text-blue-700 mb-1">💡 İpuçları:</p>
                <ul className="text-xs text-blue-600 space-y-1">
                  {analysis.tips.map((tip, idx) => (
                    <li key={idx}>• {tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
