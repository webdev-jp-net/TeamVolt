export type ChargeUnitsData = { member: string; count: number };
export type MemberData = { id: string; name: string };

// チーム情報
export type TeamArticleData = {
  id: string;
  name: string;
  member: MemberData[];
  challenger?: string;
  chargeUnits?: ChargeUnitsData[];
  usedUnits?: number;
  currentPosition?: number;
};
