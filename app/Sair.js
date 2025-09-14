import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function Sair({ navigation }) {
    const handleLogout = () => {
        navigation.navigate('Login'); // volta para tela de login
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Deseja realmente sair?</Text>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6a0dad',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#f3e8ff',
        marginBottom: 30,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#9333ea',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
