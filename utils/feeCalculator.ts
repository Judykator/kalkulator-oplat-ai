import { CaseType, ProcedureType, CalculationResult } from '../types';

export const calculateCivilFee = (wps: number, procedure: ProcedureType, caseType: CaseType): CalculationResult => {
  let fee = 0;
  let description = "";
  let legalBasis = "";

  switch (caseType) {
    case CaseType.INHERITANCE_DIVISION:
      fee = 500;
      description = "Opłata stała od wniosku o dział spadku.";
      legalBasis = "Art. 51 ust. 1 u.k.s.c.";
      break;
    case CaseType.INHERITANCE_DIVISION_AGREED:
      fee = 300;
      description = "Opłata stała przy zgodnym projekcie działu spadku.";
      legalBasis = "Art. 51 ust. 2 u.k.s.c.";
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
    case CaseType.BANKING_CONSUMER:
      fee = 1000;
      description = "Opłata stała w sprawach o roszczenia bankowe (tylko dla konsumenta).";
      legalBasis = "Art. 13a u.k.s.c.";
      break;
    case CaseType.DIVORCE:
      fee = 600;
      description = "Opłata stała od pozwu o rozwód.";
      legalBasis = "Art. 26 ust. 1 pkt 1 u.k.s.c.";
      break;
    case CaseType.REAL_ESTATE_ZASIEDZENIE:
      fee = 2000;
      description = "Opłata stała od wniosku o stwierdzenie zasiedzenia.";
      legalBasis = "Art. 40 u.k.s.c.";
      break;
    default:
      if (wps <= 500) fee = 30;
      else if (wps <= 1500) fee = 100;
      else if (wps <= 4000) fee = 200;
      else if (wps <= 7500) fee = 400;
      else if (wps <= 10000) fee = 500;
      else if (wps <= 15000) fee = 750;
      else if (wps <= 20000) fee = 1000;
      else fee = Math.ceil(wps * 0.05);
      
      description = "Opłata stosunkowa lub stała wg wartości przedmiotu sporu.";
      legalBasis = "Art. 13 ust. 1 i 2 u.k.s.c.";
  }

  if (procedure === ProcedureType.WRIT_PROCEEDINGS) {
    fee = Math.ceil(fee * 0.25);
    description += " (Obniżono do 1/4 w trybie nakazowym).";
  } else if (procedure === ProcedureType.ORDER_PAYMENT_ELECTRONIC) {
    fee = Math.ceil(wps * 0.0125);
    if (fee < 30) fee = 30;
    description = "Opłata w EPU (1.25% WPS).";
    legalBasis = "Art. 13 ust. 4 u.k.s.c.";
  }

  return { fee, description, legalBasis };
};
