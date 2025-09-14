import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Vibration,
  Alert, // Importe o Alert para exibir mensagens de erro
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const logoAnim = useRef(new Animated.Value(1)).current;
  const logoTranslate = useRef(new Animated.Value(0)).current;
  const formTranslate = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const inputFocusAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(formOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const keyboardShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        Animated.parallel([
          Animated.timing(logoAnim, {
            toValue: 0.6,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(logoTranslate, {
            toValue: -80,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(formTranslate, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    );

    const keyboardHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        Animated.parallel([
          Animated.timing(logoAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(logoTranslate, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(formTranslate, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    );

    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

  const onInputFocus = () => {
    Animated.timing(inputFocusAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const onInputBlur = () => {
    Animated.timing(inputFocusAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const inputBorderColor = inputFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.3)", "#f3e8ff"],
  });

  const shake = () => {
    Vibration.vibrate(100);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      shake();
      Alert.alert("Erro de Login", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      // **Ajuste para o seu IP local e o nome da pasta da sua API**
      const apiURL = "http://192.168.0.100/projeto-integrador-3.0/api_login.php"; 

      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          email: email,
          senha: senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate("Home");
        setEmail("");
        setSenha("");
      } else {
        shake();
        // Exibe a mensagem de erro da API
        Alert.alert("Erro de Login", data.message || "E-mail ou senha inválidos.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      shake();
      Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor. Verifique sua rede e tente novamente.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={["#6a0dad", "#9333ea"]} style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.container}
        >
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoAnim }, { translateY: logoTranslate }],
              },
            ]}
          >
            <Image source={require("../assets/logo.png")} style={styles.logo} />
          </Animated.View>

          <Animated.View
            style={[
              styles.formContainer,
              {
                transform: [
                  { translateY: formTranslate },
                  { translateX: shakeAnim },
                ],
                opacity: formOpacity,
              },
            ]}
          >
            <Text style={styles.title}>Login</Text>

            <Animated.View
              style={[styles.inputWrapper, { borderColor: inputBorderColor }]}
            >
              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#ddd"
                value={email}
                onChangeText={setEmail}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
              />
            </Animated.View>

            <Animated.View
              style={[styles.inputWrapper, { borderColor: inputBorderColor }]}
            >
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#ddd"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
              />
            </Animated.View>

            <TouchableWithoutFeedback
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={handleLogin}
            >
              <Animated.View
                style={[styles.button, { transform: [{ scale: buttonScale }] }]}
              >
                <Text style={styles.buttonText}>Entrar</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1 },
  logoContainer: {
    alignItems: "center",
    marginTop: height * 0.1,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#f3e8ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  formContainer: {
    flex: 1,
    width: "100%",
    marginTop: 50,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  inputWrapper: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 15,
  },
  input: {
    height: 55,
    paddingHorizontal: 20,
    color: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#f3e8ff",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: "#6a0dad",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});