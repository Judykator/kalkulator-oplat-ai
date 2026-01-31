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
      CaseType.NON_ADVERSARIAL_GENERAL, CaseType.POSSESSION_DISTURBANCE, 
      CaseType.LEASE_SUCCESSION, CaseType.EUROPEAN_SMALL_CLAIMS, 
      CaseType.EVICTION_RESIDENTIAL, CaseType.REAL_ESTATE_ZASIEDZENIE, 
      CaseType.EASEMENT_PRESCRIPTION, CaseType.PROPERTY_DEMARCATION, 
      CaseType.EASEMENT_ROAD_NECESSITY, CaseType.CO_OWNERSHIP_DISSOLUTION, 
      CaseType.CO_OWNERSHIP_DISSOLUTION_AGREED, CaseType.INHERITANCE_STATEMENT, 
      CaseType.INHERITANCE_PROTECTION, CaseType.INHERITANCE_INVENTORY, 
      CaseType.INHERITANCE_DECLARATION, CaseType.INHERITANCE_DIVISION, 
      CaseType.INHERITANCE_DIVISION_AGREED, CaseType.INHERITANCE_DIVISION_CO_OWNERSHIP, 
      CaseType.DEPOSIT_CASES, CaseType.ENFORCEABILITY_CLAUSE, 
      CaseType.REISSUE_ENFORCEMENT_TITLE, CaseType.BAILIFF_COMPLAINT
    ];
    return !fixedOnly.includes(caseType);
  }, [caseType]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans">
      <header className="bg-slate-900 text-white py-10 px-4 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center gap-6">
          <div className="bg-amber-500 p-4 rounded-2xl shadow-lg">
            <i className="fas fa-balance-scale text-3xl"></i>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">LexFee Poland</h1>
            <p className="text-slate-400 font-medium italic text-sm">Kalkulator Profesjonalny 2026</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <section className="lg:col-span-1 space-y-6">
          <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-6 text-slate-700">Parametry</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rodzaj sprawy</label>
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value as CaseType)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <optgroup label="Proces / Sprawy Majątkowe">
                    <option value={CaseType.CIVIL_GENERAL}>Inna o zapłatę (Art. 13)</option>
                    <option value={CaseType.BANKING_CONSUMER}>Przeciwko bankowi (Konsument)</option>
                    <option value={CaseType.CONCILIATION_PROPOSAL}>Zawezwanie do próby ugodowej</option>
                    <option value={CaseType.EUROPEAN_SMALL_CLAIMS}>Drobne roszczenia (UE) - 100 zł</option>
                  </optgroup>
                  <optgroup label="Nieruchomości / Nieproces">
                    <option value={CaseType.NON_ADVERSARIAL_GENERAL}>Inna nieprocesowa - 100 zł</option>
                    <option value={CaseType.REAL_ESTATE_ZASIEDZENIE}>Zasiedzenie nieruchomości - 2000 zł</option>
                    <option value={CaseType.EASEMENT_PRESCRIPTION}>Zasiedzenie służebności - 200 zł</option>
                    <option value={CaseType.PROPERTY_DEMARCATION}>Rozgraniczenie - 200 zł</option>
                    <option value={CaseType.EASEMENT_ROAD_NECESSITY}>Droga konieczna - 200 zł</option>
                    <option value={CaseType.CO_OWNERSHIP_DISSOLUTION}>Zniesienie współwłasności</option>
                    <option value={CaseType.CO_OWNERSHIP_DISSOLUTION_AGREED}>Zniesienie współwłasności (zgodne)</option>
                  </optgroup>
                  <optgroup label="Posiadanie i Najem">
                    <option value={CaseType.POSSESSION_DISTURBANCE}>Naruszenie posiadania - 200 zł</option>
                    <option value={CaseType.LEASE_SUCCESSION}>Wstąpienie w najem - 200 zł</option>
                    <option value={CaseType.EVICTION_RESIDENTIAL}>Eksmisja - 200 zł</option>
                  </optgroup>
                  <optgroup label="Spadki">
                    <option value={CaseType.INHERITANCE_STATEMENT}>Nabycie spadku - 100 zł</option>
                    <option value={CaseType.INHERITANCE_PROTECTION}>Zabezpieczenie spadku - 100 zł</option>
                    <option value={CaseType.INHERITANCE_INVENTORY}>Spis inwentarza - 100 zł</option>
                    <option value={CaseType.INHERITANCE_DECLARATION}>Oświadczenie spadkowe - 100 zł</option>
                    <option value={CaseType.INHERITANCE_DIVISION}>Dział spadku</option>
                    <option value={CaseType.INHERITANCE_DIVISION_AGREED}>Dział spadku (zgodny)</option>
                    <option value={CaseType.INHERITANCE_DIVISION_CO_OWNERSHIP}>Dział spadku + Współwłasność - 1000 zł</option>
                  </optgroup>
                  <optgroup label="Egzekucja / Pozostałe">
                    <option value={CaseType.ENFORCEABILITY_CLAUSE}>Klauzula wykonalności - 50 zł</option>
                    <option value={CaseType.REISSUE_ENFORCEMENT_TITLE}>Ponowne wydanie tytułu - 50 zł</option>
                    <option value={CaseType.BAILIFF_COMPLAINT}>Skarga na komornika - 50 zł</option>
                    <option value={CaseType.DEPOSIT_CASES}>Sprawy depozytowe - 100 zł</option>
                  </optgroup>
                </select>
              </div>

              {isWpsNeeded && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">WPS (zł / gr)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={wps}
                    onChange={(e) => setWps(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-black focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Rodzaj pisma</label>
                <select
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value as ProcedureType)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                >
                  <option value={ProcedureType.STANDARD}>Pozew / Wniosek</option>
                  <option value={ProcedureType.WRIT_PROCEEDINGS}>Nakazowe (1/4 opłaty)</option>
                  <option value={ProcedureType.ORDER_PAYMENT_ELECTRONIC}>EPU (1/4 opłaty)</option>
                  <option value={ProcedureType.APPEAL}>Apelacja</option>
                </select>
              </div>
            </div>
          </div>
          <button onClick={handleAiConsultation} disabled={loadingAi} className="w-full bg-amber-500 text-white font-black py-4 rounded-xl shadow-lg hover:bg-amber-600 active:scale-95 transition-all uppercase tracking-tighter">
            {loadingAi ? "Analizowanie..." : "Generuj raport AI"}
          </button>
        </section>

        <section className="lg:col-span-2 space-y-6">
          {result && (
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 animate-in fade-in duration-500">
              <h4 className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Należność sądowa</h4>
              <div className="text-7xl font-black text-slate-900 mb-8 tracking-tighter">
                {result.fee.toLocaleString('pl-PL')} <span className="text-xl text-slate-300 ml-2">PLN</span>
              </div>
              <div className="p-7 bg-slate-50 rounded-2xl border-l-4 border-amber-500 shadow-inner">
                <p className="text-sm font-bold text-slate-700 mb-2 leading-relaxed">{result.description}</p>
                <p className="text-xs text-slate-400 font-mono italic font-medium">Podstawa prawna: {result.legalBasis}</p>
              </div>
            </div>
          )}
          {aiExplanation && (
            <div className="bg-slate-900 text-slate-200 p-10 rounded-3xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <i className="fas fa-robot text-amber-500"></i> Analiza Prawna AI
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
