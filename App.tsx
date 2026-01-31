import React, { useState, useEffect, useMemo } from 'react';
import { calculateCivilFee } from './utils/feeCalculator';
import { CaseType, ProcedureType, CalculationResult } from './types';
import { getLegalContext } from './services/geminiService';

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
      CaseType.NON_ADVERSARIAL_GENERAL, CaseType.DIVORCE, CaseType.SEPARATION, 
      CaseType.PROTECTION_PERSONAL_RIGHTS, CaseType.EVICTION_RESIDENTIAL, 
      CaseType.POSSESSION_DISTURBANCE, CaseType.ESTATE_DIVISION_JOINT, 
      CaseType.ESTATE_DIVISION_JOINT_AGREED, CaseType.REAL_ESTATE_ZASIEDZENIE, 
      CaseType.CO_OWNERSHIP_DISSOLUTION, CaseType.CO_OWNERSHIP_DISSOLUTION_AGREED,
      CaseType.INHERITANCE_STATEMENT, CaseType.INHERITANCE_DIVISION,
      CaseType.INHERITANCE_DIVISION_AGREED, CaseType.BAILIFF_COMPLAINT,
      CaseType.EASEMENT_ROAD_NECESSITY, CaseType.EASEMENT_TRANSMISSION,
      CaseType.MATRIMONIAL_PROPERTY_DISSOLUTION
    ];
    return !fixedOnly.includes(caseType);
  }, [caseType]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <header className="bg-slate-900 text-white py-10 px-4 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center gap-6">
          <div className="bg-amber-500 p-4 rounded-2xl shadow-lg transform rotate-3">
            <i className="fas fa-gavel text-3xl"></i>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">LexFee Poland</h1>
            <p className="text-slate-400 font-medium">Kalkulator ustawowy – edycja profesjonalna 2026</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <section className="lg:col-span-1 space-y-6">
          <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-6 italic text-slate-700">Parametry sprawy</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Rodzaj i tryb sprawy</label>
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value as CaseType)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold transition-all focus:ring-2 focus:ring-amber-500"
                >
                  <optgroup label="Postępowanie procesowe (Majątkowe)">
                    <option value={CaseType.CIVIL_GENERAL}>Zapłata / Inna majątkowa (Art. 13)</option>
                    <option value={CaseType.BANKING_CONSUMER}>Przeciwko bankowi (Konsument)</option>
                    <option value={CaseType.CONCILIATION_PROPOSAL}>Zawezwanie do próby ugodowej</option>
                  </optgroup>
                  <optgroup label="Postępowanie nieprocesowe">
                    <option value={CaseType.NON_ADVERSARIAL_GENERAL}>Inna sprawa nieprocesowa (100 zł)</option>
                    <option value={CaseType.REAL_ESTATE_ZASIEDZENIE}>Zasiedzenie (2000 zł)</option>
                    <option value={CaseType.EASEMENT_ROAD_NECESSITY}>Droga konieczna (200 zł)</option>
                    <option value={CaseType.CO_OWNERSHIP_DISSOLUTION}>Zniesienie współwłasności (sporne)</option>
                    <option value={CaseType.CO_OWNERSHIP_DISSOLUTION_AGREED}>Zniesienie współwłasności (zgodne)</option>
                    <option value={CaseType.ESTATE_DIVISION_JOINT}>Podział majątku wspólnego (sporny)</option>
                    <option value={CaseType.ESTATE_DIVISION_JOINT_AGREED}>Podział majątku wspólnego (zgodny)</option>
                    <option value={CaseType.INHERITANCE_DIVISION}>Dział spadku (sporny)</option>
                    <option value={CaseType.INHERITANCE_DIVISION_AGREED}>Dział spadku (zgodny)</option>
                    <option value={CaseType.INHERITANCE_STATEMENT}>Nabycie spadku (100 zł)</option>
                  </optgroup>
                  <optgroup label="Pozostałe (Pozwy)">
                    <option value={CaseType.DIVORCE}>Rozwód / Separacja</option>
                    <option value={CaseType.MATRIMONIAL_PROPERTY_DISSOLUTION}>Rozdzielność majątkowa</option>
                    <option value={CaseType.PROTECTION_PERSONAL_RIGHTS}>Ochrona dóbr osobistych</option>
                    <option value={CaseType.ALIMONY}>Alimenty</option>
                    <option value={CaseType.EVICTION_RESIDENTIAL}>Eksmisja</option>
                    <option value={CaseType.BAILIFF_COMPLAINT}>Skarga na komornika</option>
                  </optgroup>
                </select>
              </div>

              {isWpsNeeded && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">WPS (zł)</label>
                  <input
                    type="number"
                    value={wps}
                    onChange={(e) => setWps(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-black"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Specyfika pisma</label>
                <select
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value as ProcedureType)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold transition-all focus:ring-2 focus:ring-amber-500"
                >
                  <option value={ProcedureType.STANDARD}>Zwykły pozew / wniosek</option>
                  <option value={ProcedureType.WRIT_PROCEEDINGS}>Postępowanie nakazowe (1/4 opłaty)</option>
                  <option value={ProcedureType.ORDER_PAYMENT_ELECTRONIC}>EPU (1/4 opłaty)</option>
                  <option value={ProcedureType.APPEAL}>Apelacja</option>
                </select>
              </div>
            </div>
          </div>
          <button onClick={handleAiConsultation} disabled={loadingAi} className="w-full bg-amber-500 text-white font-black py-4 rounded-xl shadow-lg hover:bg-amber-600 transition-all active:scale-95">
            {loadingAi ? "Analizowanie danych..." : "Generuj raport AI"}
          </button>
        </section>

        <section className="lg:col-span-2 space-y-6">
          {result && (
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
              <h4 className="text-xs font-black text-slate-400 uppercase mb-2 tracking-[0.2em]">Wyliczona opłata sądowa</h4>
              <div className="text-7xl font-black text-slate-900 mb-8">
                {result.fee.toLocaleString('pl-PL')} <span className="text-xl text-slate-300 font-bold ml-2">PLN</span>
              </div>
              <div className="p-7 bg-slate-50 rounded-2xl border-l-4 border-amber-500 shadow-inner">
                <p className="text-sm font-bold text-slate-700 leading-relaxed">{result.description}</p>
                <p className="text-xs text-slate-400 mt-3 font-mono">Podstawa prawna: {result.legalBasis}</p>
              </div>
            </div>
          )}
          {aiExplanation && (
            <div className="bg-slate-900 text-slate-200 p-10 rounded-3xl shadow-2xl border border-slate-800">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <i className="fas fa-robot text-amber-500"></i> Komentarz Prawny AI
              </h3>
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium text-slate-300">{aiExplanation}</div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
