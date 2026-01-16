import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  Linking,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import LinearGradient from '../../components/LinearGradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../context/AuthContext';
import EventService from '../../services/EventService';
import GamificationService from '../../services/GamificationService';
import {COLORS, SIZES} from '../../utils/constants';

const QRScannerScreen = ({navigation, route}) => {
  const {eventId} = route.params || {};
  const {user} = useAuth();
  const [scanning, setScanning] = useState(true);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    const status = await RNCamera.getCameraStatus();
    setHasPermission(status === 'AUTHORIZED');
    
    if (status === 'NOT_AUTHORIZED') {
      Alert.alert(
        'Camera Permission',
        'Camera access is needed to scan QR codes',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Settings', onPress: () => Linking.openSettings()},
        ],
      );
    }
  };

  const handleScan = async (e) => {
    if (!scanning) return;

    setScanning(false);
    Vibration.vibrate(100);

    try {
      const scannedData = JSON.parse(e.data);
      
      // Validate QR code format
      if (!scannedData.eventId || !scannedData.type === 'club_event') {
        Alert.alert('Invalid QR Code', 'This QR code is not valid for attendance.');
        setScanning(true);
        return;
      }

      // Mark attendance
      const result = await EventService.markAttendance(
        scannedData.eventId,
        user.uid,
      );

      if (result.success) {
        // Award XP for attending
        await GamificationService.awardXP(user.uid, 'ATTEND_EVENT', {
          eventId: scannedData.eventId,
        });

        Alert.alert(
          '✅ Success!',
          `Attendance marked successfully!\n\n+100 XP earned! 🎉`,
          [
            {
              text: 'Done',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to mark attendance');
        setScanning(true);
      }
    } catch (error) {
      Alert.alert(
        'Invalid QR Code',
        'Unable to read QR code. Please try again.',
      );
      setScanning(true);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="camera" size={64} color={COLORS.textTertiary} />
          <Text style={styles.loadingText}>Requesting camera permission...</Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="camera-off" size={64} color={COLORS.error} />
          <Text style={styles.errorTitle}>Camera Access Denied</Text>
          <Text style={styles.errorText}>
            Please enable camera access in your device settings to scan QR codes.
          </Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => Linking.openSettings()}>
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={handleScan}
        reactivate={scanning}
        reactivateTimeout={3000}
        showMarker={true}
        customMarker={
          <View style={styles.cameraOverlay}>
            {/* Header */}
            <LinearGradient
              colors={['rgba(0,0,0,0.8)', 'transparent']}
              style={styles.overlayTop}>
              <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
                <Icon name="close" size={28} color={COLORS.white} />
              </TouchableOpacity>
              <Text style={styles.title}>Scan QR Code</Text>
              <Text style={styles.subtitle}>
                Position the QR code within the frame
              </Text>
            </LinearGradient>

            {/* Scanning Frame */}
            <View style={styles.scannerMiddle}>
              <View style={styles.transparentArea} />
              <View style={styles.scannerFrame}>
                {/* Corner brackets */}
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
                
                {/* Scanning line animation */}
                {scanning && (
                  <View style={styles.scanLine}>
                    <LinearGradient
                      colors={[
                        'transparent',
                        COLORS.primary,
                        COLORS.primary,
                        'transparent',
                      ]}
                      style={styles.scanLineGradient}
                    />
                  </View>
                )}
              </View>
              <View style={styles.transparentArea} />
            </View>

            {/* Bottom Instructions */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.overlayBottom}>
              <View style={styles.instructionsCard}>
                <Icon name="info-outline" size={24} color={COLORS.primary} />
                <View style={styles.instructionsText}>
                  <Text style={styles.instructionTitle}>How to Scan</Text>
                  <Text style={styles.instructionText}>
                    • Hold your device steady{'\n'}
                    • Ensure good lighting{'\n'}
                    • Center the QR code in the frame
                  </Text>
                </View>
              </View>
              
              <View style={styles.rewardBadge}>
                <Icon name="stars" size={20} color={COLORS.accent} />
                <Text style={styles.rewardText}>+100 XP for attendance! 🎉</Text>
              </View>
            </LinearGradient>
          </View>
        }
        cameraStyle={styles.camera}
        flashMode={RNCamera.Constants.FlashMode.off}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  camera: {
    height: '100%',
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlayTop: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  subtitle: {
    fontSize: SIZES.font,
    color: COLORS.white,
    opacity: 0.9,
  },
  scannerMiddle: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparentArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scannerFrame: {
    width: 280,
    height: 280,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: COLORS.primary,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanLine: {
    width: '100%',
    height: 2,
    position: 'absolute',
    top: '50%',
  },
  scanLineGradient: {
    width: '100%',
    height: '100%',
  },
  overlayBottom: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  instructionsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: SIZES.cardRadius,
    padding: 16,
    marginBottom: 16,
    backdropFilter: 'blur(10px)',
  },
  instructionsText: {
    flex: 1,
    marginLeft: 12,
  },
  instructionTitle: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: SIZES.small,
    color: COLORS.white,
    opacity: 0.9,
    lineHeight: 20,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent + '30',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  rewardText: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.error,
    marginTop: 24,
    marginBottom: 12,
  },
  errorText: {
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  settingsButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: SIZES.buttonRadius,
    marginBottom: 12,
  },
  settingsButtonText: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  cancelButton: {
    paddingVertical: 14,
  },
  cancelButtonText: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default QRScannerScreen;
