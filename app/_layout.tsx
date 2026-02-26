import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade', 
      }}
    >
      {/* Starting Screen */}
      <Stack.Screen name="index" />
      
      {/* Onboarding & Main Portal */}
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      
      {/* Action Pages */}
      <Stack.Screen name="signin" />
      <Stack.Screen name="enroll" />
    </Stack>
  );
}