import { CaseType, ProcedureType, CalculationResult } from '../types';

export const calculateCivilFee = (wps: number, procedure: ProcedureType, caseType: CaseType): CalculationResult => {
  let fee = 0;
  let description = "";
  let legalBasis = "";

  const baseForCalculation = Math.ceil(wps);

  switch (caseType) {
    case CaseType.CONCILIATION_LOW:
      fee = 120;
      description = "Zawezwanie do próby ugodowej (WPS do 20 000 zł).";
      legalBasis = "Art. 23a pkt 1 u.k.s.c.";
      break;
    case CaseType.CONCILIATION_HIGH:
      fee = 300;
      description = "Zawezwanie do próby ugodowej (WPS powyżej 20 000 zł).";
      legalBasis = "Art. 23a pkt 2 u.k.s.c.";
      break;
    case CaseType.BANKING_CONSUMER:
      fee = (baseForCalculation > 20000) ? 1000 : calculateStandardNoCeil(baseForCalculation);
      description = "Opłata dla konsumenta w sprawie bankowej.";
      legalBasis = "Art. 13a u.k.s.c.";
      break;
    case CaseType.EUROPEAN_SMALL_CLAIMS:
      fee = 100;
      description = "Europejskie postępowanie w sprawie drobnych roszczeń.";
      legalBasis = "Art. 27 pkt 13 u.k.s.c.";
      break;
    case CaseType.POSSESSION_DISTURBANCE:
    case CaseType.LEASE_SUCCESSION:
    case CaseType.EVICTION_RESIDENTIAL:
      fee = 200;
      description = "Opłata stała (naruszenie posiadania / wstąpienie w najem / eksmisja).";
      legalBasis = "Art. 27 u.k.s.c.";
      break;
    case CaseType.REAL_ESTATE_ZASIEDZENIE:
      fee = 2000;
      description = "Zasiedzenie nieruchomości.";
      legalBasis = "Art. 40 u.k.s.c.";
      break;
    case CaseType.EASEMENT_PRESCRIPTION:
    case CaseType.PROPERTY_DEMARCATION:
    case CaseType.EASEMENT_ROAD_NECESSITY:
      fee = 200;
      description = "Zasiedzenie służebności / Rozgraniczenie / Droga konieczna.";
      legalBasis = "Art. 39 u.k.s.c.";
      break;
    case CaseType.CO_OWNERSHIP_DISSOLUTION:
      fee = 1000;
      description = "Zniesienie współwłasności.";
      legalBasis = "Art. 41 ust. 1 u.k.s.c.";
      break;
    case CaseType.CO_OWNERSHIP_DISSOLUTION_AGREED:
      fee = 600;
      description = "Zniesienie współwłasności (zgodne).";
      legalBasis = "Art. 41 ust. 2 u.k.s.c.";
      break;
    case CaseType.INHERITANCE_STATEMENT:
    case CaseType.INHERITANCE_PROTECTION:
    case CaseType.INHERITANCE_INVENTORY:
    case CaseType.INHERITANCE_DECLARATION:
      fee = 100;
      description = "Sprawy spadkowe.";
      legalBasis = "Art. 49 u.k.s.c.";
      break;
    case CaseType.INHERITANCE_DIVISION:
      fee = 500;
      description = "Dział spadku.";
      legalBasis = "Art. 51 ust. 1 u.k.s.c.";
      break;
    case CaseType.INHERITANCE_DIVISION_AGREED:
      fee = 300;
      description = "Dział spadku (zgodny).";
      legalBasis = "Art. 51 ust. 1 u.k.s.c.";
      break;
    case CaseType.INHERITANCE_DIVISION_CO_OWNERSHIP:
      fee = 1000;
      description = "Dział spadku połączony ze zniesieniem współwłasności.";
      legalBasis = "Art. 51 ust. 2 u.k.s.c.";
      break;
    case CaseType.DEPOSIT_CASES:
      fee = 100;
      description = "Sprawy depozytowe.";
      legalBasis = "Art. 68 u.k.s.c.";
      break;
    case CaseType.ENFORCEABILITY_CLAUSE:
    case CaseType.REISSUE_ENFORCEMENT_TITLE:
    case CaseType.BAILIFF_COMPLAINT:
      fee = 50;
      description = "Klauzula / Tytuł / Skarga na komornika.";
      legalBasis = "Właściwe przepisy u.k.s.c.";
      break;
    case CaseType.NON_ADVERSARIAL_GENERAL:
      fee = 100;
      description = "Inna sprawa nieprocesowa (Art. 23).";
      legalBasis = "Art. 23 pkt 1 u.k.s.c.";
      break;
    default:
      fee = calculateStandardNoCeil(baseForCalculation);
      description = "Opłata wg skali Art. 13.";
      legalBasis = "Art. 13 u.k.s.c.";
  }

  if (procedure === ProcedureType.WRIT_PROCEEDINGS) {
    fee = fee * 0.25;
    description += " (Czwarta część opłaty).";
  } else if (procedure === ProcedureType.ORDER_PAYMENT_ELECTRONIC) {
    fee = baseForCalculation * 0.0125;
    if (fee < 30) fee = 30;
    description = "EPU (Czwarta część opłaty).";
    legalBasis = "Art. 13 ust. 4 u.k.s.c.";
  }

  return { fee: Math.ceil(fee), description, legalBasis };
};

function calculateStandardNoCeil(wps: number): number {
  if (wps <= 500) return 30;
  if (wps <= 1500) return 100;
  if (wps <= 4000) return 200;
  if (wps <= 7500) return 400;
  if (wps <= 10000) return 500;
  if (wps <= 15000) return 750;
  if (wps <= 20000) return 1000;
  return wps * 0.05;
}
