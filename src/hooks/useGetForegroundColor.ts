/**
 * 背景色から文字色を判定する関数
 *
 * @param hexColor 16進数形式の背景色 (#FFFFFF形式)
 * @returns 文字色。明るい背景には'dark'、暗い背景には'light'を返す
 *
 * @example
 * const color = getForegroundColor("#FFFFFF");  // Output: 'dark'
 */
export const useGetForegroundColor = (hexColor: string): string => {
  const [r, g, b] = [1, 3, 5].map(start => parseInt(hexColor.substr(start, 2), 16));
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 140 ? 'dark' : 'light';
};
