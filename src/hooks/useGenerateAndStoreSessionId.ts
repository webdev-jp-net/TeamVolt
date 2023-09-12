/**
 * 端末にユニークなセッションIDを生成・保存する例
 * @return {string} 生成されたセッションID
 * @example const sessionID = generateAndStoreSessionID();
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

  // localStorageにuserIdが存在しているか確認
  const watchId = localStorage.getItem('userId');
  // 存在しない場合は生成する
  const myId = watchId || generateHexId();
  localStorage.setItem('userId', myId);
  return myId;
};
