'use client';

import { useState } from 'react';
import AnalysisForm from '@/components/AnalysisForm';
import AnalysisResults from '@/components/AnalysisResults';
import AnalysisSelector from '@/components/AnalysisSelector';

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

interface AnalysisResult {
  success: boolean;
  analysisType: AnalysisType;
  skillName: string;
  result: string;
  error?: string;
}

export default function Home() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (data: string) => {
    if (!selectedAnalysis || !data.trim()) {
      alert('Lütfen analiz türü seçin ve veri girin');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisType: selectedAnalysis,
          data: data,
        }),
      });

      const json = await response.json();
      setResult(json);
    } catch (error) {
      setResult({
        success: false,
        analysisType: selectedAnalysis,
        skillName: '',
        result: '',
        error: 'Bağlantı hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Finans AI</h1>
          <p className="text-lg text-gray-600">
            Türkçe Finansal Analiz Platformu
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Claude AI kullanarak profesyonel finansal analiz yapın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Analysis Selector & Form */}
          <div className="lg:col-span-2 space-y-6">
            <AnalysisSelector
              selectedAnalysis={selectedAnalysis}
              onSelect={setSelectedAnalysis}
            />

            {selectedAnalysis && (
              <AnalysisForm
                onSubmit={handleAnalyze}
                isLoading={isLoading}
                selectedAnalysis={selectedAnalysis}
              />
            )}
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-1">
            {result && (
              <AnalysisResults
                result={result}
                onNewAnalysis={() => {
                  setResult(null);
                  setSelectedAnalysis(null);
                }}
              />
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-md text-sm text-gray-600">
          <p className="font-semibold text-gray-800 mb-2">ℹ️ Dikkat:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Sunulan analizler yönetim seviyesi kararları desteklemek için hazırlanmıştır</li>
            <li>Resmi beyan, e-defter veya yasal mali tablo yerine geçmez</li>
            <li>Vergi, KDV, enflasyon konularında resmi kayıtlar için mali müşavire danışınız</li>
            <li>API anahtarını güvenli bir ortamda saklayın</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
