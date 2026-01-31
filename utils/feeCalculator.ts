import { RELATIVE_FEE_BRACKETS, PERCENTAGE_FEE_RATE, MAX_FEE } from '../constants';
import { CaseType, ProcedureType, CalculationResult } from '../types';

export const calculateCivilFee = (wps: number, procedure: ProcedureType, caseType: CaseType): CalculationResult => {
  let fee = 0;
  let description = '';
  let legalBasis = 'Ustawa o kosztach sądowych w sprawach cywilnych.';

  // 1. Calculate base fee based on CaseType and WPS
  switch (caseType) {
    // --- FIXED FEES (OPŁATY STAŁE) ---
    case CaseType.DIVORCE:
    case CaseType.SEPARATION:
      fee = 600;
      legalBasis = 'Art. 26 ust. 1 pkt 1';
      description = 'Opłata stała od pozwu o rozwód lub separację.';
      break;

    case CaseType.PROTECTION_PERSONAL_RIGHTS:
      fee = 600;
      legalBasis = 'Art. 26 ust. 1 pkt 3';
      description = 'Opłata stała w sprawie o ochronę dóbr osobistych.';
      break;

    case CaseType.INTELLECTUAL_PROPERTY:
      fee = 300; // Minimal for IP according to Art. 26a.2
      legalBasis = 'Art. 26a';
      description = 'Opłata stała w sprawach o ochronę praw autorskich (art. 26a ust. 2).';
      break;

    case CaseType.EVICTION_RESIDENTIAL:
      fee = 200;
      legalBasis = 'Art. 27 pkt 11';
      description = 'Opłata stała od pozwu o opróżnienie lokalu mieszkalnego.';
      break;

    case CaseType.POSSESSION_DISTURBANCE:
      fee = 200;
      legalBasis = 'Art. 27 pkt 7';
      description = 'Opłata stała od pozwu o naruszenie posiadania.';
      break;

    case CaseType.COMPANY_DISSOLUTION:
      fee = 5000;
      legalBasis = 'Art. 29 pkt 1';
      description = 'Opłata stała od pozwu o rozwiązanie spółki.';
      break;

    case CaseType.ENVIRONMENTAL_PROTECTION:
      fee = 100;
      legalBasis = 'Art. 30';
      description = 'Opłata stała od pozwu w sprawach z zakresu ochrony środowiska.';
      break;

    case CaseType.PRIVATIZATION_TENDER:
      fee = 1500;
      legalBasis = 'Art. 31';
      description = 'Opłata stała od pozwu w sprawach o unieważnienie przetargu.';
      break;

    case CaseType.MARRIAGE_PERMISSION:
      fee = 100;
      legalBasis = 'Art. 37 pkt 1';
      description = 'Opłata stała od wniosku o zezwolenie na zawarcie małżeństwa.';
      break;

    case CaseType.ESTATE_DIVISION_JOINT:
      fee = 1000;
      legalBasis = 'Art. 38';
      description = 'Opłata stała od wniosku o podział majątku wspólnego.';
      break;

    case CaseType.REAL_ESTATE_ZASIEDZENIE:
      fee = 2000;
      legalBasis = 'Art. 40';
      description = 'Opłata stała od wniosku o stwierdzenie nabycia własności nieruchomości przez zasiedzenie.';
      break;

    case CaseType.CO_OWNERSHIP_DISSOLUTION:
      fee = 1000;
      legalBasis = 'Art. 41 ust. 1';
      description = 'Opłata stała od wniosku o zniesienie współwłasności.';
      break;

    case CaseType.LAND_REGISTER_OWNERSHIP:
      fee = 200;
      legalBasis = 'Art. 42 ust. 1';
      description = 'Opłata stała od wniosku o wpis prawa własności w księdze wieczystej.';
      break;

    case CaseType.LAND_REGISTER_MORTGAGE:
      fee = 100;
      legalBasis = 'Art. 43';
      description = 'Opłata stała od wniosku o wpis hipoteki.';
      break;

    case CaseType.INHERITANCE_STATEMENT:
      fee = 100;
      legalBasis = 'Art. 49 ust. 1 pkt 1';
      description = 'Opłata stała od wniosku o stwierdzenie nabycia spadku.';
      break;

    case CaseType.INHERITANCE_DIVISION:
      fee = 500;
      legalBasis = 'Art. 51 ust. 1';
      description = 'Opłata stała od wniosku o dział spadku.';
      break;

    case CaseType.KRS_REGISTRATION:
      fee = 500;
      legalBasis = 'Art. 52 ust. 1';
      description = 'Opłata stała od wniosku o zarejestrowanie podmiotu w rejestrze przedsiębiorców KRS.';
      break;

    case CaseType.KRS_CHANGE:
      fee = 250;
      legalBasis = 'Art. 55 ust. 1';
      description = 'Opłata stała od wniosku o dokonanie zmiany wpisu w KRS.';
      break;

    case CaseType.CONSUMER_PROBATION:
      fee = 120; // Art. 23a
      legalBasis = 'Art. 23a ust. 1';
      description = 'Opłata stała od wniosku o zawezwanie do próby ugodowej (WPS < 20k).';
      break;

    // --- EXEMPTIONS (ZWOLNIENIA) ---
    case CaseType.ALIMONY:
      return { fee: 0, description: 'Zwolnienie ustawowe dla dochodzących alimentów.', legalBasis: 'Art. 96 ust. 1 pkt 2', wps };

    case CaseType.SOCIAL_SECURITY:
      return { fee: 0, description: 'Zwolnienie ustawowe w sprawach z zakresu ubezpieczeń społecznych (z wyjątkiem niektórych skarg).', legalBasis: 'Art. 36', wps };

    case CaseType.LABOR_EMPLOYEE:
      if (wps <= 50000) {
        return { fee: 0, description: 'Pracownik zwolniony z opłaty przy WPS do 50.000 zł.', legalBasis: 'Art. 35 ust. 1', wps };
      } else {
        fee = Math.ceil(wps * PERCENTAGE_FEE_RATE);
        legalBasis = 'Art. 35 ust. 1 zd. 2';
        description = 'Opłata stosunkowa 5% (pracownik przy WPS > 50.000 zł).';
      }
      break;

    // --- RELATIVE FEES (OPŁATY STOSUNKOWE) ---
    case CaseType.BANKING_CONSUMER:
      if (wps > 20000) {
        fee = 1000;
        legalBasis = 'Art. 13a';
        description = 'Opłata stała 1.000 zł w sprawach o roszczenia bankowe (konsument/rolnik).';
      } else {
        // Fallback to relative brackets below 20k
        const bracket = RELATIVE_FEE_BRACKETS.find(b => wps <= b.max);
        fee = bracket ? bracket.fee : 1000;
        description = 'Opłata stała właściwa dla przedziału WPS do 20.000 zł.';
      }
      break;

    case CaseType.PAULIAN_ACTION:
      if (wps > 20000) {
        fee = 1000;
        legalBasis = 'Art. 13f';
        description = 'Opłata stała 1.000 zł w sprawach o uznanie czynności prawnej za bezskuteczną (skarga pauliańska).';
      } else {
        const bracket = RELATIVE_FEE_BRACKETS.find(b => wps <= b.max);
        fee = bracket ? bracket.fee : 1000;
        description = 'Opłata stała właściwa dla przedziału WPS do 20.000 zł.';
      }
      break;

    default: // CIVIL_GENERAL
      if (wps <= 20000) {
        const bracket = RELATIVE_FEE_BRACKETS.find(b => wps <= b.max);
        fee = bracket ? bracket.fee : 1000;
        legalBasis = 'Art. 13 ust. 1';
        description = 'Opłata stała (progowa) dla WPS do 20.000 zł.';
      } else {
        fee = Math.ceil(wps * PERCENTAGE_FEE_RATE);
        if (fee > MAX_FEE) fee = MAX_FEE;
        legalBasis = 'Art. 13 ust. 2';
        description = `Opłata stosunkowa 5% wartości przedmiotu sporu (maks. 200.000 zł).`;
      }
      break;
  }

  // 2. Adjustments based on Procedure (Art. 19, Art. 13e)
  if (procedure === ProcedureType.WRIT_PROCEEDINGS) {
    const originalFee = fee;
    fee = Math.ceil(fee / 4);
    if (fee < 30) fee = 30;
    description = `Czwarta część opłaty (tryb nakazowy - Art. 19 ust. 2 pkt 1). Oryginalnie: ${originalFee} zł.`;
  } else if (procedure === ProcedureType.ORDER_PAYMENT_ELECTRONIC) {
    fee = Math.ceil(fee / 4);
    if (fee < 30) fee = 30;
    description = `Czwarta część opłaty (elektroniczne postępowanie upominawcze - Art. 19 ust. 2 pkt 2).`;
  } else if (procedure === ProcedureType.PRIVATE_MEDIATION_SETTLEMENT) {
    fee = Math.ceil(fee / 3);
    if (fee > 400) fee = 400; // Art. 13e logic simplified
    description = `Obniżona opłata ze względu na udział w mediacji (Art. 13e).`;
  }

  // Final sanity check for Art. 12/14 (minimum fee 30 PLN unless free)
  if (fee > 0 && fee < 30) fee = 30;

  return { fee, description, legalBasis, wps };
};

