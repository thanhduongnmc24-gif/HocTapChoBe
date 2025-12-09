import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ViewStyle, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

import { GAME_IMAGES } from './imageList'; 

// 1. Lấy chiều rộng màn hình thực tế
const { width: SCREEN_WIDTH } = Dimensions.get('window');
// 2. Tính chiều rộng của 1 cái thẻ (Màn hình trừ padding chia 4 cột)
// Trừ đi khoảng 40px padding 2 bên và khoảng cách giữa các thẻ
const CARD_WIDTH = (SCREEN_WIDTH - 40) / 4;

type GameItem = {
  id: string;
  value: number;
  type: 'number' | 'image';
  isMatched: boolean;
  source: any;
};

export default function MatchingGame() {
  const [topRow, setTopRow] = useState<GameItem[]>([]);
  const [bottomRow, setBottomRow] = useState<GameItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!GAME_IMAGES || GAME_IMAGES.length < 4) {
      console.warn("Cảnh báo: Ít ảnh quá đại ca ơi!");
    }
    startNewGame();
  }, []);

  const startNewGame = () => {
    setShowConfetti(false);
    setSelectedId(null);

    const pairs: {num: GameItem, img: GameItem}[] = [];
    const usedNumbers = new Set();
    const shuffledImages = [...GAME_IMAGES].sort(() => Math.random() - 0.5);

    while (pairs.length < 4) { 
      const num = Math.floor(Math.random() * 12) + 1; 
      
      if (!usedNumbers.has(num)) {
        usedNumbers.add(num);
        const imgSource = shuffledImages[pairs.length % shuffledImages.length];
        
        pairs.push({
          num: { id: `num-${num}`, value: num, type: 'number', isMatched: false, source: null },
          img: { id: `img-${num}`, value: num, type: 'image', isMatched: false, source: imgSource }
        });
      }
    }

    setTopRow(pairs.map(p => p.num).sort(() => Math.random() - 0.5));
    setBottomRow(pairs.map(p => p.img).sort(() => Math.random() - 0.5));
  };

  const handleTap = (item: GameItem) => {
    if (item.isMatched) return;

    if (!selectedId) {
      setSelectedId(item.id);
    } else {
      if (selectedId === item.id) {
        setSelectedId(null);
        return;
      }

      const allItems = [...topRow, ...bottomRow];
      const firstItem = allItems.find(i => i.id === selectedId);

      if (firstItem && firstItem.type === item.type) {
        setSelectedId(item.id);
        return;
      }

      if (firstItem && firstItem.value === item.value) {
        const updateRow = (row: GameItem[]) => row.map(i => 
          (i.id === item.id || i.id === selectedId) ? { ...i, isMatched: true } : i
        );
        setTopRow(updateRow(topRow));
        setBottomRow(updateRow(bottomRow));
        setSelectedId(null);

        if ([...updateRow(topRow), ...updateRow(bottomRow)].every(i => i.isMatched)) {
          setShowConfetti(true);
          setTimeout(startNewGame, 2000);
        }
      } else {
        setSelectedId(null);
      }
    }
  };

  // [CẢI TIẾN] Tính kích thước dựa trên CARD_WIDTH thay vì số cố định
  const renderImages = (count: number, source: any) => {
    let size = 0;
    
    switch (count) {
      case 1: 
        size = CARD_WIDTH * 0.75; break; // Chiếm 75% chiều rộng thẻ
      case 2: 
        size = CARD_WIDTH * 0.55; break; // Chiếm 55% (xếp dọc)
      case 3: 
        size = CARD_WIDTH * 0.45; break; 
      case 4: 
        size = CARD_WIDTH * 0.38; break; // Chia đôi thẻ (trừ padding)
      case 5: 
        size = CARD_WIDTH * 0.35; break; 
      case 6: 
        size = CARD_WIDTH * 0.35; break;
      case 7: 
      case 8: 
      case 9: 
        size = CARD_WIDTH * 0.28; break; // Chia 3 cột
      case 10: 
        size = CARD_WIDTH * 0.28; break; // 10 hình chia 2 cột nhưng nhỏ lại tí
      case 11: 
      case 12: 
        size = CARD_WIDTH * 0.26; break; // Chia 3 cột
      default: 
        size = CARD_WIDTH * 0.25;
    }

    const customStyle: ViewStyle = count === 10 ? { width: '70%' } : { width: '100%' };

    return (
      <View style={[styles.imgContainer, customStyle]}>
        {Array.from({length: count}).map((_, i) => (
          <Image 
            key={i} 
            source={source} 
            style={{width: size, height: size}} 
            resizeMode="contain"
          />
        ))}
      </View>
    );
  };

  const renderCard = (item: GameItem) => {
    const isSelected = selectedId === item.id;
    return (
      <TouchableOpacity 
        key={item.id}
        style={[
          styles.card,
          item.type === 'number' ? styles.cardTop : styles.cardBottom,
          item.isMatched && styles.cardMatched,
          isSelected && styles.cardSelected
        ]}
        onPress={() => handleTap(item)}
        activeOpacity={0.8}
      >
        {item.isMatched ? (
          <Ionicons name="checkmark-circle" size={40} color="#fff" />
        ) : item.type === 'number' ? (
          <Text style={[styles.numberText, { fontSize: CARD_WIDTH * 0.4 }]}>
            {item.value}
          </Text>
        ) : (
          renderImages(item.value, item.source)
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#a8e6cf', '#dcedc1']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/math')}>
          <View style={styles.circleBtn}><Ionicons name="arrow-back" size={24} color="#555" /></View>
        </TouchableOpacity>
        <Text style={styles.title}>Bé Ghép Số (1-12) 🧩</Text>
        <TouchableOpacity onPress={startNewGame}>
           <View style={styles.circleBtn}><Ionicons name="refresh" size={24} color="#555" /></View>
        </TouchableOpacity>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.rowLabelContainer}><Text style={styles.rowLabel}>Tìm số</Text></View>
        <View style={styles.row}>{topRow.map(item => renderCard(item))}</View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Ionicons name="infinite" size={24} color="white" />
          <View style={styles.line} />
        </View>

        <View style={styles.row}>{bottomRow.map(item => renderCard(item))}</View>
        <View style={styles.rowLabelContainer}><Text style={styles.rowLabel}>Tìm hình</Text></View>
      </View>

      {showConfetti && (
        <LottieView
          source={{ uri: 'https://assets2.lottiefiles.com/packages/lf20_u4yrau.json' }} 
          autoPlay loop={false} style={styles.lottie} resizeMode="cover"
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 40, paddingHorizontal: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  circleBtn: { backgroundColor: 'white', padding: 8, borderRadius: 20, elevation: 3 },
  gameArea: { flex: 1, justifyContent: 'center' },
  rowLabelContainer: { alignItems: 'center', marginBottom: 2, marginTop: 2 },
  rowLabel: { backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 8, color: '#006266', fontWeight: 'bold', fontSize: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2, gap: 6 },
  divider: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 5, opacity: 0.6 },
  line: { height: 1, backgroundColor: 'white', flex: 0.4, marginHorizontal: 10 },
  
  // Card không fix cứng nữa, mà flex để tự giãn
  card: { flex: 1, aspectRatio: 0.8, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.2, shadowRadius: 2 },
  
  cardTop: { backgroundColor: '#fff' }, 
  cardBottom: { backgroundColor: '#fff', padding: 2 },
  cardSelected: { borderColor: '#ff6b6b', borderWidth: 3, transform: [{scale: 1.02}] },
  cardMatched: { backgroundColor: '#b8e994', opacity: 0.5 },
  
  // Cỡ chữ số cũng linh hoạt luôn
  numberText: { fontWeight: 'bold', color: '#079992' },
  
  imgContainer: { 
    height: '100%', 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    alignContent: 'space-evenly', 
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  
  lottie: { position: 'absolute', width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }
});