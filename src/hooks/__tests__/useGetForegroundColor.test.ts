import { cleanup, renderHook } from '@testing-library/react';

import { useGetForegroundColor } from '../useGetForegroundColor';

describe('useGetForegroundColorのテスト', () => {
  beforeEach(() => {
    cleanup();
  });
  it('暗い背景を指定すると明るい色を前景色にする', () => {
    const { result } = renderHook(() => {
      return useGetForegroundColor('000000'); // pass a hex color string as an argument
    });

    expect(result.current).toBe('light');
  });
  it('明るい背景を指定すると暗い色を前景色にする', () => {
    const { result } = renderHook(() => {
      return useGetForegroundColor('ffffff'); // pass a hex color string as an argument
    });

    expect(result.current).toBe('dark');
  });
});
