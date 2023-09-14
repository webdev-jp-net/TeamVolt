// チーム情報
export type TeamArticleData = {
  id: string;
  name: string;
  member: string[];
  challenger?: string;
};

// メンバー追加
export type TeamMemberAddRequestData = {
  team: string;
  member: string;
};
