import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
    return (
        <View style={styles.container}>
        {/* Logo no topo */}
        <View style={styles.top}>
            <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            />
        </View>

        {/* Mensagem de boas-vindas um pouco acima do centro */}
        <View style={styles.center}>
            <Text style={[styles.welcome, { marginBottom: 15 }]}>Bem-vindo ao</Text>
            <Text style={styles.welcome}>Sistema Financeiro Pessoal</Text>
        </View>

        {/* Créditos no rodapé */}
        <View style={styles.footer}>
            <Text style={styles.credits}>
            Desenvolvido por Luciano Faria e Bruno Gomes
            </Text>
        </View>

        <StatusBar style="light" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6a0dad',
        padding: 20,
    },
    top: {
        alignItems: 'center',
        marginTop: 40,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 60,
    },
    footer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 200,   // aumentei
        height: 200,  // aumentei
        borderRadius: 100, // metade de width/height p/ manter redondo
        borderWidth: 4,
        borderColor: '#d8b4fe',
    },
    welcome: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#f3e8ff',
        textAlign: 'center',
    },
    credits: {
        fontSize: 14,
        color: '#e9d5ff',
        textAlign: 'center',
    },
});
