import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.80; 

interface HamburgerProps {
  onClose: () => void;
}

export default function HamburgerMenu({ onClose }: HamburgerProps) {
  const router = useRouter();

  const handleNav = (path: any) => {
    onClose();
    setTimeout(() => {
      router.replace(path);
    }, 100);
  };

  return (
    <SafeAreaView style={styles.drawerContainer}>
      {/* --- Header Section --- */}
      <View style={styles.drawerHeader}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={45} color="#0D2A94" />
        </View>
        <View style={styles.headerTextContent}>
          <Text style={styles.userName}>JOHN DOE D. PILI</Text>
          <Text style={styles.userRole}>Bachelor of Elementary Education</Text>
          <Text style={styles.userEmail}>johndoejacat10@gmail.com</Text>
        </View>
        
        <View style={styles.headerGraphic}>
             <Ionicons name="at-circle" size={130} color="rgba(255,255,255,0.1)" />
        </View>
      </View>

      {/* --- Menu Links --- */}
      <View style={styles.menuItems}>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('/homepage')}>
          <Feather name="home" size={22} color="#555" />
          <Text style={styles.menuText}>Dashboard</Text>
          <Ionicons name="chevron-forward" size={18} color="#BDC3C7" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('/profile')}>
          <Feather name="user" size={22} color="#555" />
          <Text style={styles.menuText}>My Profile</Text>
          <Ionicons name="chevron-forward" size={18} color="#BDC3C7" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('/courses')}>
          <Ionicons name="school-outline" size={22} color="#555" />
          <Text style={styles.menuText}>My Courses</Text>
          <Ionicons name="chevron-forward" size={18} color="#BDC3C7" />
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={22} color="#555" />
          <Text style={styles.menuText}>Settings</Text>
          <Ionicons name="chevron-forward" size={18} color="#BDC3C7" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={22} color="#555" />
          <Text style={styles.menuText}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('/')}>
          <Ionicons name="log-out-outline" size={22} color="#FF4D4D" />
          <Text style={[styles.menuText, { color: '#FF4D4D' }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: { 
    flex: 1, 
    backgroundColor: 'white', 
    width: DRAWER_WIDTH,
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  drawerHeader: { 
    backgroundColor: '#0D2A94', 
    padding: 20, 
    paddingTop: 50, 
    position: 'relative', 
    overflow: 'hidden',
    justifyContent: 'center',
  },
  avatarCircle: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  headerTextContent: {
    zIndex: 2, 
  },
  userName: { color: '#FFB800', fontSize: 18, fontWeight: 'bold' },
  userRole: { color: 'white', fontSize: 13, marginTop: 2 },
  userEmail: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
  headerGraphic: { 
    position: 'absolute', 
    right: -20, 
    bottom: -20,
    zIndex: 1 
  },
  menuItems: { flex: 1, paddingTop: 10 },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    paddingHorizontal: 20 
  },
  menuText: { 
    flex: 1, 
    marginLeft: 15, 
    fontSize: 15, 
    color: '#333', 
    fontWeight: '500' 
  },
  separator: { 
    height: 1, 
    backgroundColor: '#EEE', 
    marginVertical: 10, 
    marginHorizontal: 20 
  },
});