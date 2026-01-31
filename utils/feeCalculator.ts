import { CaseType, ProcedureType, CalculationResult } from '../types';

export const calculateCivilFee = (wps: number, procedure: ProcedureType, caseType: CaseType): CalculationResult => {
  let fee = 0;
  let description = "";
  let legalBasis = "";

  switch (caseType) {
    case CaseType.BANKING_CONSUMER:
      fee = (wps > 20000) ? 1000 : calculateStandard(wps).fee;
      description = "Opłata stała dla konsumenta (Art. 13a stosuje się przy WPS > 20.000 zł).";
      legalBasis = "Art. 13a u.k.s.c.";
      break;
    case CaseType.CONCILIATION_PROPOSAL:
      fee = (wps > 20000) ? 300 : 120;
      description = "Zawezwanie do próby ugodowej.";
      legalBasis = "Art. 23a u.k.s.c.";
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
      fee = 200;
      description = "Zasiedzenie służebności gruntowej.";
      legalBasis = "Art. 39 ust. 1 pkt 3 u.k.s.c.";
      break;
    case CaseType.PROPERTY_DEMARCATION:
    case CaseType.EASEMENT_ROAD_NECESSITY:
      fee = 200;
      description = "Rozgraniczenie / droga konieczna.";
      legalBasis = "Art. 39 ust. 1 u.k.s.c.";
      break;
    case CaseType.CO_OWNERSHIP_DISSOLUTION:
      fee = 1000;
      description = "Zniesienie współwłasności.";
      legalBasis = "Art. 41 ust. 1 u.k.s.c.";
      break;
    case CaseType.CO_OWNERSHIP_DISSOLUTION_AGREED:
      fee = 600;
      description = "Zniesienie współwłasności (zgodny projekt).";
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
      fee = 50;
      description = "Nadanie klauzuli wykonalności / ponowne wydanie tytułu.";
      legalBasis = "Art. 71 pkt 1 i 2 u.k.s.c.";
      break;
    case CaseType.BAILIFF_COMPLAINT:
      fee = 50;
      description = "Skarga na czynności komornika.";
      legalBasis = "Art. 25 ust. 1 u.k.s.c.";
      break;
    case CaseType.NON_ADVERSARIAL_GENERAL:
      fee = 100;
      description = "Inna sprawa nieprocesowa (niewymieniona odrębnie).";
      legalBasis = "Art. 23 pkt 1 u.k.s.c.";
      break;
    default:
      const std = calculateStandard(wps);
      fee = std.fee;
      description = std.description;
      legalBasis = std.legalBasis;
  }

  if (procedure === ProcedureType.WRIT_PROCEEDINGS) {
    fee = Math.ceil(fee * 0.25);
    description += " (Pobrano czwartą część opłaty).";
  } else if (procedure === ProcedureType.ORDER_PAYMENT_ELECTRONIC) {
    fee = Math.max(30, Math.ceil(wps * 0.0125));
    description = "EPU (Pobrano czwartą część opłaty).";
    legalBasis = "Art. 13 ust. 4 u.k.s.c.";
  }

  return { fee, description, legalBasis };
};

function calculateStandard(wps: number) {
  let fee = 0;
  if (wps <= 500) fee = 30;
  else if (wps <= 1500) fee = 100;
  else if (wps <= 4000) fee = 200;
  else if (wps <= 7500) fee = 400;
  else if (wps <= 10000) fee = 500;
  else if (wps <= 15000) fee = 750;
  else if (wps <= 20000) fee = 1000;
  else fee = Math.ceil(wps * 0.05);
  return { fee, description: "Opłata wg skali Art. 13.", legalBasis: "Art. 13 u.k.s.c." };
}
