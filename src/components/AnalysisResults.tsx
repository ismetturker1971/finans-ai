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

interface AnalysisResult {
  success: boolean;
  analysisType: AnalysisType;
  skillName: string;
  result: string;
  error?: string;
}

interface AnalysisResultsProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

export default function AnalysisResults({
  result,
  onNewAnalysis,
}: AnalysisResultsProps) {
  if (result.error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
        <h3 className="text-xl font-bold text-red-600 mb-3">❌ Hata</h3>
        <p className="text-gray-700 text-sm mb-4">{result.error}</p>
        <button
          onClick={onNewAnalysis}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
        >
          Yeni Analiz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          {result.skillName}
        </h3>
        <div className="mt-2 pb-4 border-b border-gray-200">
          {result.success ? (
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
              ✅ Tamamlandi
            </span>
          ) : (
            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
              ⚠️ Uyarı
            </span>
          )}
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700">
        {result.result.split('\n').map((paragraph, idx) => {
          if (!paragraph.trim()) return null;
          
          if (paragraph.startsWith('## ')) {
            return (
              <h3 key={idx} className="text-lg font-bold mt-4 mb-2 text-gray-800">
                {paragraph.replace('## ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('# ')) {
            return (
              <h2 key={idx} className="text-xl font-bold mt-4 mb-2 text-gray-800">
                {paragraph.replace('# ', '')}
              </h2>
            );
          }

          if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('•')) {
            return (
              <div key={idx} className="flex gap-2 text-sm mb-1">
                <span className="text-blue-600">•</span>
                <span>{paragraph.replace(/^[-•]\s*/, '')}</span>
              </div>
            );
          }

          if (paragraph.includes('|')) {
            const rows = paragraph.split('\n');
            return (
              <div key={idx} className="overflow-x-auto mb-4">
                <table className="min-w-full border-collapse border border-gray-300 text-xs">
                  <tbody>
                    {rows.map((row, rowIdx) => {
                      if (row.includes('---')) return null;
                      const cells = row.split('|').filter((c) => c.trim());
                      return (
                        <tr
                          key={rowIdx}
                          className={rowIdx === 0 ? 'bg-blue-50' : 'hover:bg-gray-50'}
                        >
                          {cells.map((cell, cellIdx) => (
                            <td
                              key={cellIdx}
                              className="border border-gray-300 px-2 py-1 text-right"
                            >
                              {cell.trim()}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }

          return (
            <p key={idx} className="text-sm mb-3 leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
        <button
          onClick={() => {
            const text = result.result;
            navigator.clipboard.writeText(text).then(() => {
              alert('Sonuçlar kopyalındı');
            });
          }}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors text-sm"
        >
          📋 Sonuçları Kopyala
        </button>
        <button
          onClick={onNewAnalysis}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
        >
          ➡️ Yeni Analiz
        </button>
      </div>
    </div>
  );
}
