import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const headerBg = require('../assets/images/llpt.jpg');

export default function EnrollmentCodeScreen() {
    const router = useRouter();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    
    const inputs = useRef<TextInput[]>([]);

    const handleTextChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1 }}
            >
                <ImageBackground source={headerBg} style={styles.header}>
                    <View style={styles.headerOverlay}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#0D2A94" />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>

                <View style={styles.content}>
                    <Text style={styles.title}>Activate your Account</Text>
                    <Text style={styles.subtitle}>You're a few steps away from your growth journey!</Text>

                    <View style={styles.inputSection}>
                        <Text style={styles.inputLabel}>Enter Enrollment Code</Text>
                        
                        <View style={styles.codeContainer}>
                            {code.map((digit, index) => (
                                <View key={index} style={styles.codeBox}>
                                    <TextInput
                                        ref={(el) => { if (el) inputs.current[index] = el; }}
                                        style={styles.codeInput}
                                        maxLength={1}
                                        keyboardType="number-pad"
                                        onChangeText={(text) => handleTextChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        value={digit}
                                        placeholder="•"
                                        placeholderTextColor="#0D2A94"
                                    />
                                </View>
                            ))}
                        </View>

                        <View style={styles.hintContainer}>
                            <Ionicons name="bulb-outline" size={16} color="#FFB800" />
                            <Text style={styles.hintText}>
                                Didn't receive the code? Kindly check your spam folder
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={styles.continueBtn} 
                        onPress={() => router.push('/succes')}
                    >
                        <Text style={styles.continueText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    header: { width: '100%', height: 200 },
    headerOverlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
    backBtn: { marginTop: 20, marginLeft: 20, backgroundColor: 'white', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 5 },
    content: { flex: 1, paddingHorizontal: 30, alignItems: 'center', marginTop: 30 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0D2A94', marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 40 },
    inputSection: { width: '100%' },
    inputLabel: { fontSize: 18, fontWeight: 'bold', color: '#0D2A94', marginBottom: 20 },
    codeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    codeBox: {
        width: (width - 100) / 6,
        height: 55,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    codeInput: { fontSize: 20, fontWeight: 'bold', color: '#0D2A94', textAlign: 'center', width: '100%' },
    hintContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    hintText: { fontSize: 11, color: '#666', marginLeft: 5, fontStyle: 'italic' },
    continueBtn: { 
        backgroundColor: '#0D2A94', 
        width: '100%', 
        padding: 16, 
        borderRadius: 8, 
        alignItems: 'center',
        position: 'absolute',
        bottom: 40
    },
    continueText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});