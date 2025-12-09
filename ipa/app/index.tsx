import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  // Lấy kích thước màn hình để chia cột
  const { width } = useWindowDimensions();
  
  // Tính toán chiều rộng thẻ: (Màn hình - 60px lề) / 2 cột
  const cardWidth = (width - 60) / 2; 

  const renderCard = (title: string, icon: any, color: string, onPress: () => void, disabled = false) => (
    <TouchableOpacity
      // Gán chiều rộng đã tính toán vào đây
      style={[styles.card, { width: cardWidth, backgroundColor: color, opacity: disabled ? 0.6 : 1 }]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <View style={styles.cardContent}>
        {icon}
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#fff1c1', '#f9f2e8']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>BÉ VUI HỌC 🌟</Text>
          <Text style={styles.subtitle}>Chọn trò chơi nào!</Text>
        </View>

        {/* Hàng 1: Toán học & Sắp ra mắt */}
        <View style={styles.row}>
          {renderCard('TOÁN HỌC',
            <View style={styles.iconGroup}>
              <View style={styles.iconBox}><Text style={styles.iconText}>1</Text></View>
              <View style={styles.iconBox}><Text style={styles.iconText}>2</Text></View>
              <View style={styles.iconBox}><Text style={styles.iconText}>3</Text></View>
            </View>,
            '#ff6b6b',
            () => router.push('/math')
          )}

          {renderCard('SẮP RA MẮT',
            <View style={styles.iconGroup}>
              <View style={[styles.iconBox, {backgroundColor: '#e17055'}]}><Text style={styles.iconText}>A</Text></View>
              <View style={[styles.iconBox, {backgroundColor: '#e17055'}]}><Text style={styles.iconText}>B</Text></View>
              <View style={[styles.iconBox, {backgroundColor: 'white'}]}><Ionicons name="logo-closed-captioning" size={30} color="#e17055" /></View>
            </View>,
            '#a29bfe',
            () => {},
            true
          )}
        </View>
        
        {/* Hàng 2: Lật Hình */}
        <View style={styles.row}>
          {renderCard('LẬT HÌNH',
            <View style={styles.iconGroup}>
              {/* Dùng icon bóng đèn tượng trưng cho trí tuệ */}
              <Ionicons name="bulb" size={60} color="white" />
            </View>,
            '#54a0ff', 
            () => router.push('/memory')
          )}
          
          {/* Ô trống ảo để giữ cân đối hàng lối */}
          <View style={[styles.card, { width: cardWidth, backgroundColor: 'transparent', elevation: 0 }]} />
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingVertical: 40, alignItems: 'center' },
  header: { marginBottom: 30, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#e67e22', textShadowColor: 'rgba(0,0,0,0.1)', textShadowRadius: 2 },
  subtitle: { fontSize: 18, color: '#7f8c8d', marginTop: 5 },
  
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20, 
    width: '100%', 
    paddingHorizontal: 20 
  },
  
  card: {
    aspectRatio: 1.1, 
    borderRadius: 25,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000", shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.2, shadowRadius: 5, elevation: 6
  },
  cardContent: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  iconGroup: { flexDirection: 'row', marginBottom: 15, justifyContent: 'center', alignItems: 'center' },
  iconBox: { width: 45, height: 45, backgroundColor: '#0984e3', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginHorizontal: 3, borderWidth: 2, borderColor: 'black' },
  iconText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  cardTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' },
});