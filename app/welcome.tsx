import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail } from 'lucide-react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { signInWithGoogle } from '../src/services/authService';

import { auth } from '../src/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

// Chair icon matching the Stitch design
const ChairIcon = () => (
  <Svg width={32} height={32} viewBox="0 0 24 24" fill="white">
    <Path d="M20 8V6c0-2.76-2.24-5-5-5H9C6.24 1 4 3.24 4 6v2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2v4c0 .55.45 1 1 1s1-.45 1-1v-4h12v4c0 .55.45 1 1 1s1-.45 1-1v-4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM6 6c0-1.65 1.35-3 3-3h6c1.65 0 3 1.35 3 3v2H6V6zm14 8H4v-4h2v1c0 .55.45 1 1 1s1-.45 1-1v-1h8v1c0 .55.45 1 1 1s1-.45 1-1v-1h2v4z" />
  </Svg>
);

// Google "G" icon (white version for dark button)
const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#ffffff" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#ffffff" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#ffffff" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ffffff" />
  </Svg>
);

// Apple icon removed

export default function IntroScreen() {
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/(tabs)');
      }
    });
    return unsubscribe;
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signInWithGoogle();
      // On success, the onAuthStateChanged listener in _layout.tsx will route us to /(tabs)
    } catch (error) {
      console.error(error);
      // Fallback or user cancelled, stop loading
      setIsGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Image with overlay */}
      <ImageBackground
        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoMC9VLk5a3cr7m5gtKxjAwTie9eeZzMp5pzkRpiaiRtek8wtYrxKLJIsfzLJ8UapSw5Hj1dpMwzam3sr6dbxDu4jft_5Je37t_LgorpXPhGrvA7AgzotwXS78rmG_aZ1_aXjZ5nEQKVLnaaZOuAmadAGgyOj_ejOJD0ldoKaShb_90Jzibc2mVJy38bvTYxQIB3eqbQDkU9F5tr1BxEJ_xkIOjOX1tR46ibqNJSIkO9f54CDWy7D71nAnS492xbZCrGCrzsACE1Y" }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient overlay to wash out the background */}
        <LinearGradient
          colors={['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.50)', 'rgba(255,255,255,0.92)']}
          style={StyleSheet.absoluteFillObject}
        />
      </ImageBackground>

      <SafeAreaView style={styles.safeArea}>
        {/* Top Content: Logo + Headlines */}
        <View style={styles.topContent}>
          {/* Logo */}
          <LinearGradient
            colors={['#EA4335', '#FBBC05']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoContainer}
          >
            <ChairIcon />
          </LinearGradient>

          {/* Headlines */}
          <Text style={styles.headlineText}>
            Welcome{"\n"}to Fit My Room
          </Text>
          <Text style={styles.sloganText}>Visualize your space</Text>
        </View>

        {/* Bottom Action Area */}
        <View style={styles.bottomActions}>
          {/* Continue with Google */}
          <TouchableOpacity
            style={[styles.darkButton, isGoogleLoading && { opacity: 0.7 }]}
            activeOpacity={0.85}
            onPress={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            <GoogleIcon />
            <Text style={styles.darkButtonText}>
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </Text>
          </TouchableOpacity>



          {/* Continue with email */}
          <TouchableOpacity
            style={styles.lightButton}
            activeOpacity={0.85}
            onPress={() => router.push("/auth/email")}
          >
            <Mail size={20} color="#0b1c30" />
            <Text style={styles.lightButtonText}>Continue with email</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topContent: {
    alignItems: 'center',
    paddingTop: height * 0.12,
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headlineText: {
    fontSize: 42,
    fontWeight: '800',
    color: '#0b1c30',
    textAlign: 'center',
    letterSpacing: -1,
    lineHeight: 48,
  },
  sloganText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#45464d',
    fontStyle: 'italic',
    marginTop: 16,
    textAlign: 'center',
  },
  bottomActions: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 16,
  },
  darkButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#000000',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  darkButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  lightButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#d5dae7',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  lightButtonText: {
    color: '#0b1c30',
    fontSize: 16,
    fontWeight: '600',
  },
});
