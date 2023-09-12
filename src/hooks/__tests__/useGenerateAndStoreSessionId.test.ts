import { cleanup, renderHook } from '@testing-library/react';
import { useGenerateAndStoreSessionId } from '../useGenerateAndStoreSessionId';

describe('useGenerateAndStoreSessionIdのテスト', () => {
  beforeEach(() => {
    cleanup();
  });
  it('useGenerateAndStoreSessionIdの機能テスト', () => {
    const { result } = renderHook(() => {
      return useGenerateAndStoreSessionId();
    });
    // expect().toBe();
  });
});
