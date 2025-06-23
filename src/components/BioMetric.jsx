import React from 'react';
import { Button, Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const BiometricLogin = () => {
  const handleBiometric = async () => {
    const rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true,
    });

    try {
      const { available, biometryType } =
        await rnBiometrics.isSensorAvailable();
      console.log('available, type:', available, biometryType);

      if (available && biometryType) {
        const { success, error } = await rnBiometrics.simplePrompt({
          promptMessage: 'Authenticate to proceed',
          fallbackPromptMessage: 'Enter your device PIN or pattern',
          cancelButtonText: 'Cancel',
        });

        if (success) {
          Alert.alert('Authenticated ➡️ Access granted');
          // Navigate or unlock
        } else {
          Alert.alert('Auth failed', error || 'User canceled');
        }
      } else {
        Alert.alert(
          'Unavailable',
          'No biometric or device credentials support',
        );
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <Button title="Login or Use Device Credentials" onPress={handleBiometric} />
  );
};

export default BiometricLogin;
