import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
  } from 'react-native'
  import React, { useState } from 'react'
  import { useStore } from '../store/store'
  import {
    BORDERRADIUS,
    COLORS,
    FONTFAMILY,
    FONTSIZE,
    SPACING,
  } from '../theme/theme'
  import Ionicons from 'react-native-vector-icons/Ionicons'
  import { Dimensions } from 'react-native'
  import OTPInputView from '@twotalltotems/react-native-otp-input'
  import phoneSchema from '../validation/zod' 
  import AuthService from '../services'
  
  const windowHeight = Dimensions.get('window').height
  
  const AuthScreen = () => {
    
    const userAuthentication = useStore(
      (state: any): any => state.userAuthentication,
    )
    const [phone, setPhone] = useState('')
    const [validationPhone, setValidationPhone] = useState(false)
    const [code, setCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
  
    const handlePhoneChange = (text: string) => {
      setPhone(text)
    }
  
    const handleValidatePhone = async () => {
      
      setIsLoading(true)
      try {
        phoneSchema.parse(phone);
        const response = await AuthService.sendLoginOTP(phone);
        // console.log("response",response);
  
        if (response.status === 200) {
          setIsLoading(false)
          setValidationPhone(true);
        } else {
          setIsLoading(false)
          Alert.alert('Something Unwanted happened');
        }
      } catch (error:any) {
        setIsLoading(false)
        Alert.alert('Error', error.message || 'Something went wrong');
      }
    };
  
    const VerifyOtp = async () => {
      setIsLoading(true)
      try {
        const response = await AuthService.verifyLoginOTP(phone, code);
        if (response.status === 200) {
          setIsLoading(false)
          userAuthentication();
        } else {
          setIsLoading(false)
          Alert.alert('Wrong Otp');
        }
      } catch (error) {
        setIsLoading(false)
        Alert.alert('Something Went wrong');
      }
    };
  
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.ScreenContainer}>
        <StatusBar backgroundColor={COLORS.primaryBlackHex} />
        <View style={styles.AuthContainer}>
          <Image
            source={require('../assets/auth-coffee-logo.png')}
            style={styles.Logo}
          />
          <Text style={styles.Quote}>Keep calm and drink tea.</Text>
          <View style={styles.PhoneContainer}>
            {!validationPhone ? (
              <View style={styles.InputContainer}>
                <Ionicons
                  name="call"
                  size={FONTSIZE.size_24}
                  color={COLORS.secondaryLightGreyHex}
                />
                <TextInput
                  style={styles.phone}
                  placeholder="Enter your phone number"
                  onChangeText={handlePhoneChange}
                  value={phone}
                  keyboardType="phone-pad"
                />
              </View>
            ) : (
              <>
                <Text style={styles.OtpText}>OTP sent to your phone.</Text>
                <OTPInputView
                  style={styles.OtpContainer}
                  pinCount={6}
                  autoFocusOnLoad
                  codeInputFieldStyle={styles.underlineStyleBase}
                  codeInputHighlightStyle={styles.underlineStyleHighLighted}
                  onCodeFilled={(code) => {
                    setCode(code)
                  }}
                />
              </>
            )}
            {validationPhone ? (
              <TouchableOpacity onPress={VerifyOtp}>
                <View style={styles.AuthButton}>
                  <Text style={styles.Authenticate}>{isLoading?'Processing...':'Verify'}</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleValidatePhone}>
                <View style={styles.AuthButton}>
                  <Text style={styles.Authenticate}>{isLoading?'Processing...':'Enter'}</Text>
                </View>
              </TouchableOpacity>
            )}
            {validationPhone ? (
              <TouchableOpacity
                onPress={() => {
                  setValidationPhone(false)
                }}
              >
                <Text style={styles.Back}>Back</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
  
  export default AuthScreen
  
  const styles = StyleSheet.create({
    ScreenContainer: {
      flex: 1,
      backgroundColor: COLORS.primaryBlackHex,
    },
    AuthContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SPACING.space_30,
    },
    Logo: {
      height: 80,
      width: 80,
      marginBottom: SPACING.space_20,
    },
    Quote: {
      color: COLORS.primaryWhiteHex,
      fontSize: FONTSIZE.size_14,
      fontFamily: FONTFAMILY.poppins_medium,
      marginBottom: SPACING.space_36,
      textAlign: 'center',
    },
    PhoneContainer: {
      width: '100%',
      maxWidth: 320,
      alignItems: 'center',
    },
    AuthButton: {
      width: '100%',
      height: 56,
      borderRadius: BORDERRADIUS.radius_20,
      backgroundColor: COLORS.primaryOrangeHex,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: SPACING.space_24,
      shadowColor: COLORS.primaryOrangeHex,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    Authenticate: {
      color: COLORS.primaryWhiteHex,
      fontSize: FONTSIZE.size_16,
      fontFamily: FONTFAMILY.poppins_semibold,
    },
    phone: {
      flex: 1,
      color: COLORS.primaryBlackHex,
      fontSize: FONTSIZE.size_14,
      fontFamily: FONTFAMILY.poppins_regular,
      paddingHorizontal: SPACING.space_12,
    },
    InputContainer: {
      width: '100%',
      height: 56,
      borderRadius: BORDERRADIUS.radius_20,
      backgroundColor: COLORS.primaryWhiteHex,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.space_16,
      shadowColor: COLORS.primaryBlackHex,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    OtpContainer: {
      width: '100%',
      height: 56,
      marginTop: SPACING.space_24,
    },
    OtpText: {
      color: COLORS.primaryWhiteHex,
      fontSize: FONTSIZE.size_14,
      fontFamily: FONTFAMILY.poppins_medium,
      textAlign: 'center',
      marginBottom: SPACING.space_16,
    },
    underlineStyleBase: {
      width: 45,
      height: 56,
      borderWidth: 1,
      borderColor: COLORS.primaryGreyHex,
      backgroundColor: COLORS.primaryWhiteHex,
      borderRadius: BORDERRADIUS.radius_10,
      color: COLORS.primaryBlackHex,
      fontSize: FONTSIZE.size_16,
      fontFamily: FONTFAMILY.poppins_semibold,
    },
    underlineStyleHighLighted: {
      borderColor: COLORS.primaryOrangeHex,
    },
    Back: {
      color: COLORS.primaryWhiteHex,
      fontSize: FONTSIZE.size_14,
      fontFamily: FONTFAMILY.poppins_medium,
      textAlign: 'center',
      marginTop: SPACING.space_24,
      textDecorationLine: 'underline',
    },
  });