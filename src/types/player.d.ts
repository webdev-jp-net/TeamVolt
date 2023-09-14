import { TeamArticleData } from './team';

export type PlayerArticleData = {
  id: string;
  localId: string;
  team?: TeamArticleData;
};
