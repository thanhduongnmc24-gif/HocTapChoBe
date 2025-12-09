import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions, Easing } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Kho ảnh của đại ca
import { GAME_IMAGES } from './imageList'; 

const DEFAULT_IMAGES = [
  { uri: 'https://cdn-icons-png.flaticon.com/512/3769/3769035.png' }, 
  { uri: 'https://cdn-icons-png.flaticon.com/512/1864/1864514.png' }, 
  { uri: 'https://cdn-icons-png.flaticon.com/512/616/616408.png' },
  { uri: 'https://cdn-icons-png.flaticon.com/512/802/802360.png' },
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- 1. BÓNG BAY (Nền) ---
const BalloonsEffect = () => {
  const balloons = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    startX: Math.random() * (SCREEN_WIDTH - 80),
    delay: Math.random() * 800,
    duration: 3000 + Math.random() * 1000,
    color: ['#ff7675', '#74b9ff', '#55efc4', '#fdcb6e', '#a29bfe'][Math.floor(Math.random() * 5)],
    scale: 0.7 + Math.random() * 0.4
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {balloons.map((item) => <SingleBalloon key={item.id} item={item} />)}
    </View>
  );
};

const SingleBalloon = ({ item }: { item: any }) => {
  const anim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: -150, 
      duration: item.duration,
      delay: item.delay,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease)
    }).start();
  }, []);

  return (
    <Animated.View style={{
      position: 'absolute', left: item.startX, top: anim,
      transform: [{ scale: item.scale }]
    }}>
      <Ionicons name="balloon" size={80} color={item.color} style={{opacity: 0.6}} />
      <View style={{width: 3, height: 35, backgroundColor: 'rgba(255,255,255,0.4)', marginLeft: 39, marginTop: -5}} />
    </Animated.View>
  );
};

// --- 2. PHÁO GIẤY (Nền) ---
const ConfettiEffect = ({ iconName }: { iconName: any }) => {
  const pieces = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    startX: Math.random() * SCREEN_WIDTH,
    delay: Math.random() * 500,
    duration: 2000 + Math.random() * 1000,
    color: ['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#1dd1a1'][Math.floor(Math.random() * 5)],
    size: 30 + Math.random() * 20 
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((item) => <SingleConfetti key={item.id} item={item} iconName={iconName} />)}
    </View>
  );
};

const SingleConfetti = ({ item, iconName }: { item: any, iconName: any }) => {
  const anim = useRef(new Animated.Value(-100)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, {
        toValue: SCREEN_HEIGHT + 100,
        duration: item.duration,
        delay: item.delay,
        useNativeDriver: false,
      }),
      Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: false,
        })
      )
    ]).start();
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={{
      position: 'absolute', left: item.startX, top: anim,
      transform: [{ rotate: spin }]
    }}>
      <Ionicons name={iconName} size={item.size} color={item.color} style={{ opacity: 0.7, textShadowColor: 'rgba(0,0,0,0.1)', textShadowRadius: 4 }} />
    </Animated.View>
  );
};

// --- [SỬA ĐỔI] 3. HIỆU ỨNG ẢNH LƯỚT ĐẾN VÀ DỪNG LẠI ---

const SmoothFlyingReward = () => {
    const animX = useRef(new Animated.Value(0)).current;
    const animY = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    
    // Chọn 1 hình ngẫu nhiên
    const sourceList = (GAME_IMAGES && GAME_IMAGES.length > 0) ? GAME_IMAGES : DEFAULT_IMAGES;
    const randomImg = sourceList[Math.floor(Math.random() * sourceList.length)];
    const imgSize = 150; // Hình to rõ

    useEffect(() => {
        const edge = Math.floor(Math.random() * 4); // 0:Trên, 1:Phải, 2:Dưới, 3:Trái
        
        let startX = 0, startY = 0;
        // Điểm đến là chính giữa màn hình
        const centerX = (SCREEN_WIDTH - imgSize) / 2;
        const centerY = (SCREEN_HEIGHT - imgSize) / 2;

        // Cấu hình điểm xuất phát (bay từ ngoài vào)
        switch (edge) {
            case 0: // Từ trên xuống
                startX = centerX; startY = -imgSize - 50;
                break;
            case 1: // Từ phải qua
                startX = SCREEN_WIDTH + 50; startY = centerY;
                break;
            case 2: // Từ dưới lên (Trồi lên)
                startX = centerX; startY = SCREEN_HEIGHT + 50;
                break;
            case 3: // Từ trái qua
                startX = -imgSize - 50; startY = centerY;
                break;
        }

        // Đặt vị trí ban đầu
        animX.setValue(startX);
        animY.setValue(startY);

        // Chuỗi hiệu ứng: Bay vào -> Dừng lại & Nhún nhảy
        Animated.sequence([
            // 1. Lướt vào giữa (800ms - êm ái)
            Animated.parallel([
                Animated.timing(animX, { toValue: centerX, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(animY, { toValue: centerY, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
            
            // 2. Nhún nhảy nhẹ nhàng (Loop vô tận cho đến khi tắt)
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
                    Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                ])
            )
        ]).start();

    }, []);

    return (
        <Animated.Image
            source={randomImg}
            style={{
                position: 'absolute',
                width: imgSize,
                height: imgSize,
                transform: [{ translateX: animX }, { translateY: animY }, { scale: scaleAnim }],
                zIndex: 9999, // Đè lên trên cùng
                // Thêm bóng đổ cho hình nổi lên
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
            }}
            resizeMode="contain"
        />
    );
};


export default function CalculationGame() {
  const [question, setQuestion] = useState({ n1: 0, n2: 0, ans: 0, operator: '+', wrong: [0, 0] });
  const [answers, setAnswers] = useState<number[]>([]);
  const [mode, setMode] = useState<'number' | 'image'>('image');
  const [imgSource, setImgSource] = useState<any>(null);
  
  const [isSuccess, setIsSuccess] = useState(false); 
  const [effectType, setEffectType] = useState<'none' | 'balloon' | 'star' | 'confetti' | 'flower'>('none');
  const [showSad, setShowSad] = useState(false);
  const [showFlyingRewards, setShowFlyingRewards] = useState(false);

  // Animation
  const shakeAnim = useRef(new Animated.Value(0)).current; 
  const pulseAnim = useRef(new Animated.Value(1)).current; 
  const borderColorAnim = pulseAnim.interpolate({ inputRange: [1, 1.1], outputRange: ['rgba(255,255,255,0)', '#FFD700'] });

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    setIsSuccess(false); 
    setEffectType('none'); 
    setShowSad(false); 
    setShowFlyingRewards(false);
    pulseAnim.setValue(1);

    setMode(Math.random() > 0.3 ? 'image' : 'number');
    const sourceList = (GAME_IMAGES && GAME_IMAGES.length > 0) ? GAME_IMAGES : DEFAULT_IMAGES;
    const randomImg = sourceList[Math.floor(Math.random() * sourceList.length)];
    setImgSource(randomImg);

    const isPlus = Math.random() > 0.5;
    const operator = isPlus ? '+' : '-';
    let n1, n2, ans;

    if (isPlus) {
      ans = Math.floor(Math.random() * 9) + 2; 
      n1 = Math.floor(Math.random() * (ans - 1)) + 1;
      n2 = ans - n1;
    } else {
      n1 = Math.floor(Math.random() * 9) + 2;
      n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
      ans = n1 - n2;
    }

    let w1 = ans + Math.floor(Math.random() * 3) + 1;
    let w2 = ans - Math.floor(Math.random() * 3) - 1;
    if (w2 < 0) w2 = ans + 2;
    if (w1 === w2) w1 = w1 + 1;
    if (w1 === ans) w1 = w1 + 2;
    if (w2 === ans) w2 = w2 + 3;

    setQuestion({ n1, n2, ans, operator, wrong: [w1, w2] });
    setAnswers([ans, w1, w2].sort(() => Math.random() - 0.5));
  };

  const handleChoice = (choice: number) => {
    if (choice === question.ans) {
      // --- ĐÚNG ---
      setIsSuccess(true); 
      setShowSad(false); 
      
      const types = ['balloon', 'star', 'confetti', 'flower'];
      setEffectType(types[Math.floor(Math.random() * types.length)] as any);
      
      // Kích hoạt hiệu ứng bay
      setShowFlyingRewards(true);

      // Hiệu ứng Pulse cho câu hỏi
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 150, useNativeDriver: false }), 
        Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: false })
      ]).start();

      // Đợi 3 giây rồi qua câu mới
      setTimeout(() => {
        // setShowFlyingRewards(false); // Không cần tắt thủ công, generateQuestion sẽ reset
        generateQuestion();
      }, 3000); 

    } else {
      // --- SAI ---
      setShowSad(true);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 15, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -15, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
      ]).start(() => {
        setTimeout(() => setShowSad(false), 1000);
      });
    }
  };

  const renderVisualCount = (count: number) => {
    const size = count > 5 ? 30 : 40;
    return (
      <View style={styles.groupImage}>
        {Array.from({length: count}).map((_, i) => (
          <Image key={i} source={imgSource} style={{ width: size, height: size, margin: 2 }} resizeMode="contain" />
        ))}
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <LinearGradient colors={['#8EC5FC', '#E0C3FC']} style={styles.container}>
        
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/math')}>
          <Ionicons name="arrow-back-circle" size={50} color="white" />
        </TouchableOpacity>

        <Animated.View style={[
            styles.questionBox, 
            { 
              transform: [{ translateX: shakeAnim }, { scale: pulseAnim }],
              borderColor: borderColorAnim,
              borderWidth: 4 
            }
        ]}>
          {showSad && (
            <View style={styles.sadOverlay}>
              <Ionicons name="sad" size={100} color="#FF7675" />
              <Text style={{color: '#FF7675', fontWeight: 'bold', fontSize: 24, marginTop: 10}}>Sai rồi bé ơi!</Text>
            </View>
          )}

          {mode === 'image' ? (
            <View style={styles.visualContainer}>
              <View style={styles.partContainer}>
                {renderVisualCount(question.n1)}
                <Text style={styles.miniNum}>{question.n1}</Text>
              </View>
              <View style={styles.operatorBox}><Text style={styles.operatorText}>{question.operator}</Text></View>
              <View style={styles.partContainer}>
                {renderVisualCount(question.n2)}
                <Text style={styles.miniNum}>{question.n2}</Text>
              </View>
              <Text style={styles.equalSign}>=</Text>
              <Text style={[styles.questionMark, isSuccess && { color: '#00b894', fontSize: 60 }]}>
                {isSuccess ? question.ans : '?'}
              </Text>
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <Text style={[styles.textNumber, {color: '#6c5ce7'}]}>{question.n1}</Text>
               <Text style={[styles.textOperator, {marginHorizontal: 20}]}>{question.operator}</Text>
               <Text style={[styles.textNumber, {color: '#0984e3'}]}>{question.n2}</Text>
               <Text style={[styles.textOperator, {marginHorizontal: 20}]}>=</Text>
               
               <Text style={[styles.textNumber, isSuccess ? {color: '#00b894'} : {color: '#fdcb6e'}]}>
                 {isSuccess ? question.ans : '?'}
               </Text>
            </View>
          )}
        </Animated.View>

        <View style={styles.bottomArea}>
          {!isSuccess ? (
            <View style={styles.answersContainer}>
              {answers.map((ans, index) => (
                <TouchableOpacity key={index} style={styles.answerBtn} onPress={() => handleChoice(ans)} activeOpacity={0.7}>
                  <View style={styles.btnShadow} />
                  <View style={styles.btnContent}>
                    <Text style={styles.answerText}>{ans}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.celebrationContainer}>
               <View style={styles.praiseBox}>
                  <Text style={styles.praiseText}>GIỎI QUÁ! 🎉</Text>
               </View>
            </View>
          )}
        </View>

        {/* --- KHU VỰC HIỆU ỨNG --- */}
        <View style={[StyleSheet.absoluteFill, { zIndex: 9999, elevation: 99 }]} pointerEvents="none">
            {/* Nền nhẹ nhàng */}
            {effectType === 'balloon' && <BalloonsEffect />}
            {effectType === 'confetti' && <ConfettiEffect iconName="square" />}
            {effectType === 'star' && <ConfettiEffect iconName="star" />}
            {effectType === 'flower' && <ConfettiEffect iconName="flower" />}
            
            {/* [SỬA LẠI] CHỈ 1 HÌNH LƯỚT VÀO VÀ ĐỨNG YÊN */}
            {showFlyingRewards && <SmoothFlyingReward />}
        </View>

      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 60 },
  backBtn: { position: 'absolute', top: 30, left: 30, zIndex: 50 },
  
  questionBox: { 
    backgroundColor: 'white', width: '90%', minHeight: 220, borderRadius: 30, 
    justifyContent: 'center', alignItems: 'center', 
    shadowColor: "#000", shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.2, shadowRadius: 5, elevation: 8,
    overflow: 'hidden', marginTop: 20, borderColor: 'transparent', zIndex: 1 
  },
  
  sadOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 100, justifyContent: 'center', alignItems: 'center'
  },
  
  visualContainer: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', padding: 10 },
  partContainer: { alignItems: 'center', backgroundColor: '#F0F9FF', padding: 10, borderRadius: 15, borderWidth: 2, borderColor: '#BDE0FE', minWidth: 80 },
  groupImage: { flexDirection: 'row', flexWrap: 'wrap', maxWidth: 100, justifyContent: 'center' },
  miniNum: { fontSize: 20, fontWeight: 'bold', color: '#888', marginTop: 5 },
  operatorBox: { marginHorizontal: 10 },
  operatorText: { fontSize: 50, fontWeight: 'bold', color: '#FF7675' },
  equalSign: { fontSize: 40, fontWeight: 'bold', color: '#888', marginHorizontal: 10 },
  questionMark: { fontSize: 50, fontWeight: 'bold', color: '#FDCB6E' }, 
  textNumber: { fontSize: 80, fontWeight: 'bold' },
  textOperator: { fontSize: 80, fontWeight: 'bold', color: '#fab1a0' },

  bottomArea: { height: 160, width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 30, zIndex: 1 },

  answersContainer: { flexDirection: 'row', gap: 20 },
  answerBtn: { width: 90, height: 90 },
  btnShadow: { position: 'absolute', top: 6, width: '100%', height: '100%', backgroundColor: '#6c5ce7', borderRadius: 20 },
  btnContent: { width: '100%', height: '100%', backgroundColor: '#a29bfe', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
  answerText: { fontSize: 40, fontWeight: 'bold', color: 'white' },

  celebrationContainer: { alignItems: 'center', justifyContent: 'center', height: '100%' }, 
  praiseBox: { marginTop: 10, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 20, elevation: 5 },
  praiseText: { color: '#e17055', fontWeight: 'bold', fontSize: 20 },
});