import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// [Tèo thêm] Import SoundManager (lùi lại 1 cấp thư mục để tìm utils)
import SoundManager from '../utils/SoundManager';

export default function MathMenu() {
  return (
    <LinearGradient colors={['#f6d365', '#fda085']} style={styles.container}>
      
      {/* Nút Back về Trang Chủ */}
      <TouchableOpacity 
        style={styles.backBtn} 
        onPress={() => {
            SoundManager.play('click'); // [Tèo thêm]
            router.push('/');
        }}
      >
        <Ionicons name="home" size={30} color="#d35400" />
        <Text style={{fontWeight: 'bold', color: '#d35400'}}> Trang Chủ</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Góc Toán Học 📐</Text>
      
      <View style={styles.menuList}>
        {/* Nút vào Game Tính Toán */}
        <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
                SoundManager.play('click'); // [Tèo thêm]
                router.push('/math/calculation');
            }}
        >
          <LinearGradient colors={['#84fab0', '#8fd3f4']} style={styles.iconBox}>
            <Text style={{fontSize: 40}}>➕</Text>
          </LinearGradient>
          <View style={styles.textBox}>
            <Text style={styles.menuTitle}>Bé Tập Tính</Text>
            <Text style={styles.menuSub}>Cộng trừ đơn giản</Text>
          </View>
          <Ionicons name="play-circle" size={40} color="#00cec9" />
        </TouchableOpacity>

        {/* Nút vào Game Ghép Nối */}
        <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
                SoundManager.play('click'); // [Tèo thêm]
                router.push('/math/matching');
            }}
        >
          <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.iconBox}>
            <Text style={{fontSize: 40}}>🧩</Text>
          </LinearGradient>
          <View style={styles.textBox}>
            <Text style={styles.menuTitle}>Ghép Hình</Text>
            <Text style={styles.menuSub}>Nối số với hình</Text>
          </View>
          <Ionicons name="play-circle" size={40} color="#0984e3" />
        </TouchableOpacity>

        {/* Nút chờ game mới (Disabled nên không cần gắn âm thanh) */}
        <TouchableOpacity style={[styles.menuItem, {opacity: 0.6}]} disabled>
          <View style={[styles.iconBox, {backgroundColor: '#ddd'}]}>
            <Text style={{fontSize: 40}}>🔒</Text>
          </View>
          <View style={styles.textBox}>
            <Text style={styles.menuTitle}>Sắp Ra Mắt</Text>
            <Text style={styles.menuSub}>So sánh lớn bé...</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.5)', alignSelf: 'flex-start', padding: 8, borderRadius: 15 },
  title: { fontSize: 35, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 30, textShadowColor: 'rgba(0,0,0,0.1)', textShadowRadius: 5 },
  menuList: { gap: 20 },
  menuItem: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 25, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
  iconBox: { width: 70, height: 70, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textBox: { flex: 1 },
  menuTitle: { fontSize: 20, fontWeight: 'bold', color: '#2d3436' },
  menuSub: { color: '#636e72' }
});