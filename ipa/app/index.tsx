import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; // Nếu chưa có thì dùng View màu thường cũng được

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BÉ VUI HỌC 🌟</Text>
      
      <View style={styles.menuContainer}>
        {/* Nút vào game Toán */}
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: '#FF6B6B' }]} 
          onPress={() => router.push('/math')}
        >
          <Text style={styles.cardEmoji}>1️⃣2️⃣3️⃣</Text>
          <Text style={styles.cardTitle}>TOÁN HỌC</Text>
        </TouchableOpacity>

        {/* Nút giữ chỗ cho môn Tiếng Việt sau này */}
        <TouchableOpacity style={[styles.card, { backgroundColor: '#4ECDC4', opacity: 0.6 }]} disabled>
          <Text style={styles.cardEmoji}>🅰️🅱️©️</Text>
          <Text style={styles.cardTitle}>SẮP RA MẮT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9C4', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 40, fontWeight: 'bold', color: '#FF9F43', marginBottom: 30, textShadowColor: 'rgba(0, 0, 0, 0.1)', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 5 },
  menuContainer: { flexDirection: 'row', gap: 20 },
  card: { width: 200, height: 150, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: 0, height: 4 } },
  cardEmoji: { fontSize: 50, marginBottom: 10 },
  cardTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' }
});