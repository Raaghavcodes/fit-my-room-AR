import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.lastUpdated}>Last Updated: May 2026</Text>

      <View style={styles.section}>
        <Text style={styles.heading}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to Fit My Room. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you use our mobile application and tell you about your privacy rights and how the law protects you.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>2. Data We Collect</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Account Data:</Text> When you create an account, we collect your email address and display name via Google Sign-In or direct email registration. This authentication process is securely managed by Firebase Authentication.{'\n\n'}
          <Text style={styles.bold}>Usage Data:</Text> We may collect anonymous analytical data regarding how you use the app to improve the user experience (via Google Analytics for Firebase).{'\n\n'}
          <Text style={styles.bold}>Camera & Photo Data:</Text> The app requires access to your device's camera and photo library to generate 3D spatial models and dimensions. Images you process are transmitted securely to our AI servers solely for the purpose of generating the requested dimensions and visualizations. We do not permanently store or use your personal photos for any other purpose without explicit consent.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>3. Third-Party Services</Text>
        <Text style={styles.paragraph}>
          Our app relies on third-party services that may collect information used to identify you. Link to the privacy policies of third-party service providers used by the app:
        </Text>
        <Text style={styles.bullet}>• Google Play Services / Google Sign-In</Text>
        <Text style={styles.bullet}>• Google Analytics for Firebase</Text>
        <Text style={styles.bullet}>• Firebase Crashlytics</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          We have put in place appropriate security measures (such as SSL encryption and Firebase security rules) to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>5. Your Legal Rights</Text>
        <Text style={styles.paragraph}>
          Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, or erasure of your personal data. You can delete your account directly through the app settings or by contacting our support team.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>6. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this privacy policy or our privacy practices, please contact us via the "Contact Support" option in the app.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0b1c30',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#76777d',
    marginBottom: 32,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0b1c30',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: '#45464d',
  },
  bold: {
    fontWeight: '700',
    color: '#0b1c30',
  },
  bullet: {
    fontSize: 15,
    lineHeight: 24,
    color: '#45464d',
    marginLeft: 8,
    marginTop: 4,
  },
});
