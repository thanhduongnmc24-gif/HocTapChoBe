import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

import { GAME_IMAGES } from './imageList'; 

type GameItem = {
  id: string;
  value: number;
  type: 'number' | 'image';
  isMatched: boolean;
  source: any;
};

export default function MatchingGame() {
  // 1. LẤY KÍCH THƯỚC MÀN HÌNH ĐỘNG
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  
  // Các thông số Card
  const CONTAINER_PADDING = 10;
  const GAP = 8;
  const CARD_WIDTH = (SCREEN_WIDTH - (CONTAINER_PADDING * 2) - (GAP * 3)) / 4;
  // Chiều cao thẻ = 1.2 lần chiều rộng (Tỉ lệ chuẩn thẻ bài)
  const CARD_HEIGHT = CARD_WIDTH * 1.2;

  const [topRow, setTopRow] = useState<GameItem[]>([]);
  const [bottomRow, setBottomRow] = useState<GameItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setShowConfetti(false);
    setSelectedId(null);
    const pairs: {num: GameItem, img: GameItem}[] = [];
    const usedNumbers = new Set();
    // Đảo danh sách ảnh gốc
    const shuffledImages = [...(GAME_IMAGES || [])].sort(() => Math.random() - 0.5);

    if (shuffledImages.length === 0) return;

    while (pairs.length < 4) { 
      const num = Math.floor(Math.random() * 12) + 1; // Random 1-12
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
        setSelectedId(null); return;
      }
      const allItems = [...topRow, ...bottomRow];
      const firstItem = allItems.find(i => i.id === selectedId);
      if (firstItem && firstItem.type === item.type) {
        setSelectedId(item.id); return;
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
        setTimeout(() => setSelectedId(null), 300);
      }
    }
  };

  // === 2. CÔNG THỨC TÍNH KÍCH THƯỚC ẢNH CHÍNH XÁC (BEST FIT) ===
  const calculateImageSize = (count: number) => {
    // Xác định số cột (cols) và số dòng (rows) tối ưu dựa trên số lượng
    let cols = 1;
    let rows = 1;

    if (count === 1) { cols = 1; rows = 1; }
    else if (count <= 4) { cols = 2; rows = 2; }       // Lưới 2x2
    else if (count <= 6) { cols = 3; rows = 2; }       // Lưới 3x2
    else if (count <= 9) { cols = 3; rows = 3; }       // Lưới 3x3
    else { cols = 3; rows = 4; }                       // Lưới 3x4 (cho 10,11,12)

    // Tính toán không gian khả dụng bên trong thẻ (trừ đi padding của thẻ)
    const paddingCard = 6; // Padding bên trong thẻ
    const availableWidth = CARD_WIDTH - (paddingCard * 2);
    const availableHeight = CARD_HEIGHT - (paddingCard * 2);

    // Tính kích thước tối đa cho mỗi ô ảnh
    // Trừ thêm 2px margin mỗi bên ảnh
    const maxW = (availableWidth / cols) - 2; 
    const maxH = (availableHeight / rows) - 2;

    // Chọn kích thước nhỏ hơn để đảm bảo vừa cả chiều ngang lẫn dọc
    return Math.min(maxW, maxH);
  };

  const renderImages = (count: number, source: any) => {
    const size = calculateImageSize(count);

    return (
      <View style={styles.imgContainer}>
        {Array.from({length: count}).map((_, i) => (
          <Image 
            key={i} 
            source={source} 
            style={{ 
              width: size, 
              height: size,     
              margin: 1 // Khoảng cách rất nhỏ để các ảnh không dính nhau
            }} 
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
          // Set cứng kích thước thẻ
          { width: CARD_WIDTH, height: CARD_HEIGHT }, 
          item.type === 'number' ? styles.cardTop : styles.cardBottom,
          item.isMatched && styles.cardMatched,
          isSelected && styles.cardSelected
        ]}
        onPress={() => handleTap(item)}
        activeOpacity={0.8}
        disabled={item.isMatched}
      >
        {item.isMatched ? (
          <Ionicons name="checkmark-circle" size={CARD_WIDTH * 0.4} color="#fff" />
        ) : item.type === 'number' ? (
          <Text 
            style={[styles.numberText, { fontSize: CARD_HEIGHT * 0.6 }]}
            adjustsFontSizeToFit={true} 
            numberOfLines={1}
            minimumFontScale={0.1}
          >
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
        <TouchableOpacity onPress={() => router.push('/math' as any)}>
           <View style={styles.circleBtn}><Ionicons name="arrow-back" size={24} color="#555" /></View>
        </TouchableOpacity>
        <Text style={styles.title}>Bé Ghép Số</Text>
        <TouchableOpacity onPress={startNewGame}>
             <View style={styles.circleBtn}><Ionicons name="refresh" size={24} color="#555" /></View>
        </TouchableOpacity>
      </View>

      <View style={styles.gameArea}>
        <Text style={styles.rowLabel}>Tìm số</Text>
        <View style={styles.row}>
          {topRow.map(item => renderCard(item))}
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Ionicons name="infinite" size={24} color="white" />
          <View style={styles.line} />
        </View>

        <View style={styles.row}>
          {bottomRow.map(item => renderCard(item))}
        </View>
        <Text style={styles.rowLabel}>Tìm lượng</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  circleBtn: { backgroundColor: 'white', padding: 8, borderRadius: 20, elevation: 3 },
  gameArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  rowLabel: { 
    color: '#006266', fontWeight: 'bold', fontSize: 12, marginBottom: 5, marginTop: 5,
    backgroundColor: 'rgba(255,255,255,0.5)', paddingHorizontal: 8, borderRadius: 4
  },

  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
  },

  divider: { flexDirection: 'row', alignItems: 'center', width: '80%', marginVertical: 10, opacity: 0.6 },
  line: { height: 1, backgroundColor: 'white', flex: 1, marginHorizontal: 10 },

  card: { 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 4, 
    shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 2,
    padding: 3, // Padding nhỏ cho thẻ
    overflow: 'hidden', 
  },
  
  cardTop: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' }, 
  cardBottom: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
  cardSelected: { borderColor: '#ff6b6b', borderWidth: 3 },
  cardMatched: { opacity: 0.3, transform: [{scale: 0.9}] },
  
  numberText: { fontWeight: 'bold', color: '#079992', textAlign: 'center' },
  
  imgContainer: { 
    width: '100%', 
    height: '100%', 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', // Căn giữa ngang
    alignContent: 'center',   // Căn giữa dọc (Quan trọng để không bị lệch lên trên)
    alignItems: 'center',
  },
  
  lottie: { position: 'absolute', width: '100%', height: '100%', zIndex: 99, pointerEvents: 'none' }
});