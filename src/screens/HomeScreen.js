import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { setAuthToken } from '../services/api';

export default function Menu({ navigation }) {
  
  function handleLogout() {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza de que deseja encerrar a sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive', 
          onPress: () => {
            setAuthToken(null); // Limpa o token na camada de API
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } 
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cabeçalho de Perfil */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>SD</Text>
        </View>
        <Text style={styles.nomeUsuario}>Sabor Digital</Text>
        <Text style={styles.emailUsuario}>cliente@sabordigital.com</Text>
      </View>

      {/* Opções do Menu */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Navegação</Text>

        <TouchableOpacity 
          style={styles.opcao} 
          onPress={() => navigation.navigate('ListaProdutos')}
        >
          <Text style={styles.opcaoIcone}>🍝</Text>
          <Text style={styles.opcaoTexto}>Cardápio Principal</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.opcao} 
          onPress={() => navigation.navigate('Carrinho')}
        >
          <Text style={styles.opcaoIcone}>🛒</Text>
          <Text style={styles.opcaoTexto}>Meu Carrinho</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.opcao} 
          onPress={() => navigation.navigate('MeusPedidos')}
        >
          <Text style={styles.opcaoIcone}>📋</Text>
          <Text style={styles.opcaoTexto}>Meus Pedidos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Conta & Configurações</Text>

        <TouchableOpacity 
          style={styles.opcao} 
          onPress={() => Alert.alert('Em breve', 'Funcionalidade de edição de perfil')}
        >
          <Text style={styles.opcaoIcone}>👤</Text>
          <Text style={styles.opcaoTexto}>Meus Dados</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.opcao, styles.opcaoSair]} 
          onPress={handleLogout}
        >
          <Text style={styles.opcaoIcone}>🚪</Text>
          <Text style={[styles.opcaoTexto, styles.textoSair]}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginVertical: 20 },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#e63946', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 12 
  },
  avatarTexto: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  nomeUsuario: { fontSize: 20, fontWeight: 'bold', color: '#1d3557' },
  emailUsuario: { fontSize: 14, color: '#6c757d', marginTop: 4 },
  secao: { marginTop: 24 },
  secaoTitulo: { fontSize: 13, fontWeight: 'bold', color: '#adb5bd', textTransform: 'uppercase', marginBottom: 10 },
  opcao: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 10, 
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  opcaoIcone: { fontSize: 20, marginRight: 16 },
  opcaoTexto: { fontSize: 16, color: '#2b2d42', fontWeight: '500' },
  opcaoSair: { backgroundColor: '#fff5f5', borderWidth: 1, borderColor: '#ffe3e3' },
  textoSair: { color: '#e63946', fontWeight: 'bold' }
});