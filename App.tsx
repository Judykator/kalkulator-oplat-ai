import React, { useState, useEffect, useMemo } from 'react';
import { calculateCivilFee } from './utils/feeCalculator';
import { CaseType, ProcedureType, CalculationResult } from './types';
import { getLegalContext } from './services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const App: React.FC = () => {
  const [wps, setWps] = useState<number>(5000);
  const [caseType, setCaseType] = useState<CaseType>(CaseType.CIVIL_GENERAL);
  const [procedure, setProcedure] = useState<ProcedureType>(ProcedureType.STANDARD);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const res = calculateCivilFee(wps, procedure, caseType);
    setResult(res);
  }, [wps, caseType, procedure]);

  const handleAiConsultation = async () => {
    if (!result) return;
    setLoadingAi(true);
    const explanation = await getLegalContext(wps, caseType, result.fee);
    setAiExplanation(explanation || '');
    setLoadingAi(false);
  };

  const isWpsNeeded = useMemo(() => {
    const fixedOnly = [
      CaseType.DIVORCE, CaseType.SEPARATION, CaseType.PROTECTION_PERSONAL_RIGHTS, 
      CaseType.EVICTION_RESIDENTIAL, CaseType.POSSESSION_DISTURBANCE, 
      CaseType.MARRIAGE_PERMISSION, CaseType.ESTATE_DIVISION_JOINT, 
      CaseType.ESTATE_DIVISION_JOINT_AGREED, CaseType.REAL_ESTATE_ZASIEDZENIE, 
      CaseType.CO_OWNERSHIP_DISSOLUTION, CaseType.CO_OWNERSHIP_DISSOLUTION_AGREED,
      CaseType.LAND_REGISTER_OWNERSHIP, CaseType.LAND_REGISTER_MORTGAGE,
      CaseType.INHERITANCE_STATEMENT, CaseType.INHERITANCE_DIVISION,
      CaseType.INHERITANCE_DIVISION_AGREED, CaseType.KRS_REGISTRATION, 
      CaseType.KRS_CHANGE, CaseType.COMPANY_DISSOLUTION, CaseType.BANKING_CONSUMER
    ];
    return !fixedOnly.includes(caseType);
  }, [caseType]);

  const chartData = useMemo(() => {
    if (!isWpsNeeded) return [];
    const points = [];
    const step = wps > 50000 ? 5000 : 1000;
    const maxVal = Math.max(wps * 1.5, 30000);
    for (let i = 0; i <= maxVal; i += step) {
      const res = calculateCivilFee(i, procedure, caseType);
      points.push({ wps: i, fee: res.fee });
    }
    const currentRes = calculateCivilFee(wps, procedure, caseType);
    points.push({ wps: wps, fee: currentRes.fee });
    return points.sort((a, b) => a.wps - b.wps);
  }, [wps, procedure, caseType, isWpsNeeded]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <header className="bg-slate-900 text-white py-10 px-4 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <i className="fas fa-balance-scale text-9xl"></i>
        </div>
        <div className="max-w-5xl mx-auto flex items-center gap-6 relative z-10">
          <div className="bg-amber-500 p-4 rounded-2xl shadow-lg transform rotate-3">
            <i className="fas fa-gavel text-3xl"></i>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">LexFee Poland</h1>
            <p className="text-slate-400 font-medium">Kalkulator kosztów sądowych – edycja profesjonalna 2026</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-1 space-y-6">
          <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-3 text-slate-800">
              <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs italic">1</span>
              Konfiguracja sprawy
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Rodzaj roszczenia / wniosku</label>
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value as CaseType)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium transition-all"
                >
                  <optgroup label="Sprawy o zapłatę / majątkowe">
                    <option value={CaseType.CIVIL_GENERAL}>Sprawa cywilna ogólna (5% WPS)</option>
                    <option value={CaseType.BANKING_CONSUMER}>Sprawa przeciwko bankowi (tylko Konsument)</option>
                    <option value={CaseType.PAULIAN_ACTION}>Skarga pauliańska</option>
                  </optgroup>
                  <optgroup label="Sprawy rodzinne">
                    <option value={CaseType.DIVORCE}>Rozwód / Separacja</option>
                    <option value={CaseType.ESTATE_DIVISION_JOINT}>Podział majątku wspólnego (sporny)</option>
                    <option value={CaseType.ESTATE_DIVISION_JOINT_AGREED}>Podział majątku wspólnego (zgodny)</option>
                  </optgroup>
                  <optgroup label="Nieruchomości">
                    <option value={CaseType.REAL_ESTATE_ZASIEDZENIE}>Zasiedzenie (stwierdzenie)</option>
                    <option value={CaseType.CO_OWNERSHIP_DISSOLUTION}>Zniesienie współwłasności (sporne)</option>
                    <option value={CaseType.CO_OWNERSHIP_DISSOLUTION_AGREED}>Zniesienie współwłasności (zgodne)</option>
                    <option value={CaseType.EVICTION_RESIDENTIAL}>Eksmisja z lokalu</option>
                  </optgroup>
                  <optgroup label="Spadki">
                    <option value={CaseType.INHERITANCE_STATEMENT}>Stwierdzenie nabycia spadku</option>
                    <option value={CaseType.INHERITANCE_DIVISION}>Dział spadku (sporny)</option>
                    <option value={CaseType.INHERITANCE_DIVISION_AGREED}>Dział spadku (zgodny projekt)</option>
                  </optgroup>
                </select>
              </div>

              {isWpsNeeded && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Wartość przedmiotu sporu (WPS)</label>
                  <div className="relative group">
                    <input
                      type="number"
                      value={wps}
                      onChange={(e) => setWps(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-lg font-black transition-all"
                    />
                    <span className="absolute right-4 top-3.5 text-slate-300 font-bold">PLN</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tryb postępowania</label>
                <select
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value as ProcedureType)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium transition-all"
                >
                  <option value={ProcedureType.STANDARD}>Zwykły pozew / wniosek</option>
                  <option value={ProcedureType.WRIT_PROCEEDINGS}>Postępowanie nakazowe (1/4)</option>
                  <option value={ProcedureType.ORDER_PAYMENT_ELECTRONIC}>EPU (1.25% WPS)</option>
                  <option value={ProcedureType.APPEAL}>Apelacja</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-7 rounded-3xl shadow-lg text-white">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <i className="fas fa-brain"></i>
              Analiza AI
            </h3>
            <button
              onClick={handleAiConsultation}
              disabled={loadingAi}
              className="w-full bg-white text-amber-600 font-black py-3 px-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {loadingAi ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-magic"></i>}
              Generuj uzasadnienie
            </button>
          </div>
        </section>

        <section className="lg:col-span-2 space-y-6">
          {result && (
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Należna opłata sądowa</h4>
                  <div className="text-7xl font-black text-slate-900 leading-none">
                    {result.fee.toLocaleString('pl-PL')}
                    <span className="text-xl font-bold text-slate-300 ml-3">PLN</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <p className="text-[10px] text-slate-400 mt-2 text-right">Podstawa: {result.legalBasis}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 border-l-4 border-l-amber-500">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Opis mechanizmu</h5>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.description}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 border-l-4 border-l-slate-800">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Wskazówki procesowe</h5>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li>Opłatę uiszcza się przy wnoszeniu pisma</li>
                    <li>Brak opłaty = wezwanie do uzupełnienia (7 dni)</li>
                    <li>Możliwe zwolnienie na wniosek (formularz PP)</li>
                  </ul>
                </div>
              </div>

              {isWpsNeeded && chartData.length > 0 && (
                <div className="h-72 w-full">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Analiza skali opłat</h5>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="wps" tickFormatter={(v) => `${v/1000}k`} />
                      <YAxis />
                      <Tooltip />
                      <ReferenceLine x={wps} stroke="#f59e0b" strokeDasharray="3 3" />
                      <Line type="stepAfter" dataKey="fee" stroke="#0f172a" strokeWidth={4} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {aiExplanation && (
            <div className="bg-slate-900 text-slate-200 p-10 rounded-3xl shadow-2xl border border-slate-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-900">
                  <i className="fas fa-robot text-2xl"></i>
                </div>
                <h3 className="text-xl font-black text-white">Raport Prawny AI</h3>
              </div>
              <div className="prose prose-invert prose-amber max-w-none text-slate-300 whitespace-pre-wrap text-sm">
                {aiExplanation}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
