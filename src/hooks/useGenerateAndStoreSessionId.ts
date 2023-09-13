/**
 * 6桁の16進数を生成する
 * @return {string} 生成されたID
 * @example const localId = generateAndStoreSessionID();
 */

export const useGenerateAndStoreSessionId = () => {
  /**
   * 6桁の16進数を生成する
   * @return {string} 6桁の16進数
   */
  function generateHexId() {
    let hexId = '';
    const characters = '0123456789ABCDEF';

    for (let i = 0; i < 6; i++) {
      hexId += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return hexId;
  }
  return generateHexId();
};
