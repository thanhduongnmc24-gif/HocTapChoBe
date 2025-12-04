import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Audio } from 'expo-av'; // Thư viện âm thanh
import LottieView from 'lottie-react-native'; // Thư viện hoạt hình

export default function MathGame() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [bgColor, setBgColor] = useState('#81ECEC'); // Màu nền đổi khi đúng/sai

  // Tạo câu hỏi mới
  const generateQuestion = () => {
    // Random số từ 1 đến 5 (cho bé 5 tuổi dễ tính)
    const n1 = Math.floor(Math.random() * 5) + 1;
    const n2 = Math.floor(Math.random() * 5) + 1;
    const correct = n1 + n2;

    // Tạo đáp án sai
    let wrong1 = correct + Math.floor(Math.random() * 2) + 1;
    let wrong2 = correct - Math.floor(Math.random() * 2) - 1;
    
    // Đảm bảo không bị trùng hoặc âm
    if (wrong2 < 0) wrong2 = correct + 3;
    if (wrong1 === wrong2) wrong1 = wrong1 + 1;

    // Trộn đáp án
    const list = [correct, wrong1, wrong2].sort(() => Math.random() - 0.5);

    setNum1(n1);
    setNum2(n2);
    setAnswers(list);
    setBgColor('#81ECEC'); // Reset màu nền về xanh mát
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleChoice = async (choice: number) => {
    const correct = num1 + num2;
    if (choice === correct) {
      // --- XỬ LÝ KHI ĐÚNG ---
      setBgColor('#55E6C1'); // Chuyển nền xanh lá
      // playSound('correct.mp3'); // (Chờ thêm file âm thanh)
      Alert.alert("Hoan hô! 🎉", "Bé giỏi quá!", [
        { text: "Tiếp tục", onPress: generateQuestion }
      ]);
    } else {
      // --- XỬ LÝ KHI SAI ---
      setBgColor('#FF7675'); // Chuyển nền đỏ nhẹ
      // playSound('wrong.mp3'); // (Chờ thêm file âm thanh)
      Alert.alert("Oh no! 😅", "Sai rồi, bé chọn lại nhé!");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Nút thoát */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>🏠 Về nhà</Text>
      </TouchableOpacity>

      {/* Câu hỏi to đùng */}
      <View style={styles.questionBox}>
        <Text style={styles.questionText}>{num1} + {num2} = ?</Text>
      </View>

      {/* Các ô đáp án */}
      <View style={styles.answersContainer}>
        {answers.map((ans, index) => (
          <TouchableOpacity key={index} style={styles.answerBtn} onPress={() => handleChoice(ans)}>
            <Text style={styles.answerText}>{ans}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtn: { position: 'absolute', top: 20, left: 20, padding: 10, backgroundColor: 'white', borderRadius: 10 },
  backText: { fontWeight: 'bold' },
  questionBox: { backgroundColor: 'white', paddingHorizontal: 50, paddingVertical: 20, borderRadius: 30, marginBottom: 40, elevation: 10 },
  questionText: { fontSize: 80, fontWeight: 'bold', color: '#2D3436' },
  answersContainer: { flexDirection: 'row', gap: 20 },
  answerBtn: { width: 100, height: 100, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 25, elevation: 5, borderBottomWidth: 5, borderBottomColor: '#b2bec3' },
  answerText: { fontSize: 40, fontWeight: 'bold', color: '#0984e3' }
});