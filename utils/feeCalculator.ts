import { CaseType, ProcedureType, CalculationResult } from '../types';

export const calculateCivilFee = (wps: number, procedure: ProcedureType, caseType: CaseType): CalculationResult => {
  let fee = 0;
  let description = "";
  let legalBasis = "";

  switch (caseType) {
    case CaseType.NON_ADVERSARIAL_GENERAL:
      fee = 100;
      description = "Opłata stała od wniosku w sprawie nieprocesowej, jeżeli przepis szczególny nie stanowi inaczej.";
      legalBasis = "Art. 23 pkt 1 u.k.s.c.";
      break;
    case CaseType.INHERITANCE_DIVISION:
      fee = 500;
      description = "Opłata stała od wniosku o dział spadku.";
      legalBasis = "Art. 51 ust. 1 u.k.s.c.";
      break;
    case CaseType.INHERITANCE_DIVISION_AGREED:
      fee = 300;
      description = "Opłata stała przy zgodnym projekcie działu spadku.";
      legalBasis = "Art. 51 ust. 1 u.k.s.c.";
      break;
    case CaseType.ESTATE_DIVISION_JOINT:
      fee = 1000;
      description = "Opłata stała od wniosku o podział majątku wspólnego.";
      legalBasis = "Art. 38 ust. 1 u.k.s.c.";
      break;
    case CaseType.ESTATE_DIVISION_JOINT_AGREED:
      fee = 300;
      description = "Opłata stała przy zgodnym projekcie podziału majątku.";
      legalBasis = "Art. 38 ust. 2 u.k.s.c.";
      break;
    case CaseType.CO_OWNERSHIP_DISSOLUTION:
      fee = 1000;
      description = "Opłata stała od wniosku o zniesienie współwłasności.";
      legalBasis = "Art. 41 ust. 1 u.k.s.c.";
      break;
    case CaseType.CO_OWNERSHIP_DISSOLUTION_AGREED:
      fee = 600;
      description = "Opłata stała przy zgodnym projekcie zniesienia współwłasności.";
      legalBasis = "Art. 41 ust. 2 u.k.s.c.";
      break;
    case CaseType.REAL_ESTATE_ZASIEDZENIE:
      fee = 2000;
      description = "Opłata stała od wniosku o stwierdzenie zasiedzenia.";
      legalBasis = "Art. 40 u.k.s.c.";
      break;
    case CaseType.EASEMENT_ROAD_NECESSITY:
      fee = 200;
      description = "Ustanowienie drogi koniecznej.";
      legalBasis = "Art. 39 ust. 1 pkt 1 u.k.s.c.";
      break;
    case CaseType.BANKING_CONSUMER:
      fee = (wps > 20000) ? 1000 : calculateStandard(wps).fee;
      description = "Opłata dla konsumenta w sprawie bankowej.";
      legalBasis = "Art. 13a u.k.s.c.";
      break;
    case CaseType.DIVORCE:
    case CaseType.SEPARATION:
    case CaseType.PROTECTION_PERSONAL_RIGHTS:
      fee = 600;
      description = "Opłata stała od pozwu.";
      legalBasis = "Art. 26 ust. 1 pkt 1 u.k.s.c.";
      break;
    case CaseType.CONCILIATION_PROPOSAL:
      fee = (wps > 20000) ? 300 : 120;
      description = "Zawezwanie do próby ugodowej.";
      legalBasis = "Art. 23a u.k.s.c.";
      break;
    case CaseType.BAILIFF_COMPLAINT:
      fee = 50;
      description = "Skarga na komornika.";
      legalBasis = "Art. 25 ust. 1 u.k.s.c.";
      break;
    case CaseType.EVICTION_RESIDENTIAL:
    case CaseType.POSSESSION_DISTURBANCE:
    case CaseType.MATRIMONIAL_PROPERTY_DISSOLUTION:
      fee = 200;
      description = "Opłata stała (eksmisja / posiadanie / rozdzielność).";
      legalBasis = "Przepisy szczegółowe u.k.s.c.";
      break;
    case CaseType.INHERITANCE_STATEMENT:
      fee = 100;
      description = "Stwierdzenie nabycia spadku.";
      legalBasis = "Art. 49 ust. 1 pkt 1 u.k.s.c.";
      break;
    default:
      const std = calculateStandard(wps);
      fee = std.fee;
      description = std.description;
      legalBasis = std.legalBasis;
  }

  // Czwarta część opłaty dla trybów specjalnych
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
  return { fee, description: "Opłata stosunkowa lub stała (widełki).", legalBasis: "Art. 13 u.k.s.c." };
}
