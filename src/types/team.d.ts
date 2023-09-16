export type ChargeUnitsData = { member: string; count: number };

// チーム情報
export type TeamArticleData = {
  id: string;
  name: string;
  member: string[];
  challenger?: string;
  chargeUnits?: ChargeUnitsData[];
  usedUnits?: number;
};
