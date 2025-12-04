import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <>
      <StatusBar hidden={true} /> {/* Giấu thanh pin/sóng đi cho bé tập trung */}
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="math" />
      </Stack>
    </>
  );
}