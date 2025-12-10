import { Audio } from 'expo-av';

// Khai báo đường dẫn file (Đảm bảo anh đã bỏ file vào assets/sounds nhé)
const SOUND_FILES = {
  correct: require('../../assets/sounds/correct.mp3'),
  wrong: require('../../assets/sounds/wrong.mp3'),
  win: require('../../assets/sounds/win.mp3'),
  click: require('../../assets/sounds/click.mp3'),
};

class SoundManager {
  // Hàm phát âm thanh
  static async play(soundName: keyof typeof SOUND_FILES) {
    try {
      // 1. Tạo đối tượng âm thanh mới
      const { sound } = await Audio.Sound.createAsync(
        SOUND_FILES[soundName],
        { shouldPlay: true } // Tự động phát ngay khi load xong
      );

      // 2. Lắng nghe khi phát xong thì giải phóng bộ nhớ
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync(); // Dọn dẹp bộ nhớ
        }
      });
    } catch (error) {
      console.log('Lỗi phát âm thanh:', error);
    }
  }
}

export default SoundManager;