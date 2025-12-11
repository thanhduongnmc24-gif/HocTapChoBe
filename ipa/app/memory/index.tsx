import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, ScrollView, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

// Dùng kho ảnh có sẵn
import { GAME_IMAGES } from '../math/imageList'; 
// [Tèo thêm] Import bộ quản lý âm thanh
import SoundManager from '../utils/SoundManager';

const DEFAULT_IMAGES = [
  { uri: 'https://cdn-icons-png.flaticon.com/512/3769/3769035.png' }, 
  { uri: 'https://cdn-icons-png.flaticon.com/512/1864/1864514.png' }, 
  { uri: 'https://cdn-icons-png.flaticon.com/512/616/616408.png' },   
  { uri: 'https://cdn-icons-png.flaticon.com/512/802/802360.png' },   
  { uri: 'https://cdn-icons-png.flaticon.com/512/1998/1998627.png' }, 
  { uri: 'https://cdn-icons-png.flaticon.com/512/1998/1998749.png' }, 
];

// --- Component Thẻ Bài ---
const MemoryCard = ({ item, onPress, isFlipped, isMatched, cardSize }: any) => {
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: isFlipped || isMatched ? 1 : 0,
      friction: 8, tension: 10, useNativeDriver: true,
    }).start();
  }, [isFlipped, isMatched]);

  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} disabled={isFlipped || isMatched}>
      <View style={{ width: cardSize, height: cardSize * 1.2 }}> 
        {/* MẶT SAU (HÌNH ẢNH) */}
        <Animated.View style={[styles.cardFace, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
          <Image source={item.imgSource} style={styles.cardImage} resizeMode="contain" />
        </Animated.View>

        {/* MẶT TRƯỚC (DẤU HỎI) */}
        <Animated.View style={[styles.cardFace, styles.cardFront, { transform: [{ rotateY: frontInterpolate }] }]}>
          <Text style={styles.questionMark}>?</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export default function MemoryGame() {
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCards, setSelectedCards] = useState<any[]>([]); 
  const [matches, setMatches] = useState(0);
  const [isLockBoard, setIsLockBoard] = useState(false); 
  const [moves, setMoves] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Tính toán kích thước thẻ
  const { width } = useWindowDimensions();
  const cardSize = width > 500 ? 100 : (width - 60) / 4;

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setShowConfetti(false);
    setMatches(0);
    setMoves(0);
    setSelectedCards([]);
    setIsLockBoard(false);

    const sourceList = (GAME_IMAGES && GAME_IMAGES.length > 0) ? GAME_IMAGES : DEFAULT_IMAGES;
    const shuffledSource = [...sourceList].sort(() => Math.random() - 0.5);
    const selectedImages = shuffledSource.slice(0, 6);

    const gameCards = [...selectedImages, ...selectedImages].map((img, index) => ({
      id: index,
      imgSource: img,
      contentId: sourceList.indexOf(img),
      isFlipped: false,
      isMatched: false,
    }));

    setCards(gameCards.sort(() => Math.random() - 0.5));
  };

  const handleTapCard = (card: any) => {
    if (isLockBoard || card.isFlipped || card.isMatched) return;

    // [Tèo thêm] Phát tiếng Click
    SoundManager.play('click');

    const newCards = [...cards];
    const index = newCards.findIndex(c => c.id === card.id);
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      setIsLockBoard(true); 
      checkForMatch(newSelected, newCards);
    }
  };

  const checkForMatch = (selected: any[], currentCards: any[]) => {
    const [card1, card2] = selected;

    if (card1.imgSource === card2.imgSource) {
      // --- ĐÚNG ---
      SoundManager.play('correct'); // [Tèo thêm] Âm thanh đúng

      const newCards = currentCards.map(c => 
        (c.id === card1.id || c.id === card2.id) ? { ...c, isMatched: true, isFlipped: true } : c
      );
      setCards(newCards);
      setMatches(m => {
        const newMatches = m + 1;
        if (newMatches === 6) {
            // --- THẮNG ---
            SoundManager.play('win'); // [Tèo thêm] Nhạc chiến thắng
            setTimeout(() => setShowConfetti(true), 500);
        }
        return newMatches;
      });
      setSelectedCards([]);
      setIsLockBoard(false);
    } else {
      // --- SAI ---
      SoundManager.play('wrong'); // [Tèo thêm] Âm thanh sai để bé biết

      setTimeout(() => {
        const newCards = currentCards.map(c => 
          (c.id === card1.id || c.id === card2.id) ? { ...c, isFlipped: false } : c
        );
        setCards(newCards);
        setSelectedCards([]);
        setIsLockBoard(false);
      }, 1000);
    }
  };

  return (
    <LinearGradient colors={['#ff9a9e', '#fad0c4']} style={styles.container}>
      <View style={styles.header}>
        {/* Nút Back */}
        <TouchableOpacity 
            onPress={() => {
                SoundManager.play('click');
                router.back();
            }} 
            style={styles.backBtn}
        >
          <Ionicons name="arrow-back-circle" size={45} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Lật Hình 🧠</Text>
        
        <View style={styles.scoreBoard}>
           <Text style={styles.scoreText}>Lượt: {moves}</Text>
        </View>
        
        {/* Nút Reset */}
        <TouchableOpacity onPress={() => {
            SoundManager.play('click');
            startNewGame();
        }}>
           <Ionicons name="refresh-circle" size={45} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {cards.map((item) => (
          <MemoryCard 
            key={item.id} 
            item={item} 
            cardSize={cardSize} 
            isFlipped={item.isFlipped} 
            isMatched={item.isMatched}
            onPress={() => handleTapCard(item)}
          />
        ))}
      </ScrollView>

      {showConfetti && (
        <View style={styles.winOverlay}>
           <LottieView
             source={{ uri: 'https://assets2.lottiefiles.com/packages/lf20_u4yrau.json' }} 
             autoPlay loop={false} style={styles.lottie} resizeMode="cover"
           />
           <Text style={styles.winText}>CHIẾN THẮNG!</Text>
           <TouchableOpacity 
                style={styles.playAgainBtn} 
                onPress={() => {
                    SoundManager.play('click');
                    startNewGame();
                }}
           >
              <Text style={{color: '#ff9a9e', fontWeight: 'bold', fontSize: 20}}>Chơi Lại</Text>
           </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  
  backBtn: { 
    width: 50, 
    height: 50, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  title: { fontSize: 28, fontWeight: 'bold', color: 'white', textShadowColor: 'rgba(0,0,0,0.2)', textShadowRadius: 3 },
  scoreBoard: { backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15 },
  scoreText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    gap: 15, 
    paddingBottom: 50,
    paddingHorizontal: 10
  },

  cardFace: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: "#000", shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4
  },
  cardFront: {
    backgroundColor: '#ff7675', 
    borderWidth: 2, borderColor: 'white'
  },
  cardBack: {
    backgroundColor: 'white',
  },
  cardImage: {
    width: '70%',
    height: '70%',
  },
  questionMark: {
    fontSize: 40, 
    color: 'white', 
    fontWeight: 'bold'
  },

  winOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center', alignItems: 'center', zIndex: 999
  },
  winText: { fontSize: 40, fontWeight: 'bold', color: '#55efc4', marginBottom: 20 },
  playAgainBtn: { backgroundColor: 'white', paddingHorizontal: 30, paddingVertical: 10, borderRadius: 25 },
  lottie: { position: 'absolute', width: '100%', height: '100%' }
});