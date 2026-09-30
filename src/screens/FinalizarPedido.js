import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { criarPedido } from '../services/api';

export default function Carrinho({ route, navigation }) {
  const { produto } = route.params || {};
  const [quantidade, setQuantidade] = useState(1);
  const [enviando, setEnviando] = useState(false);

  if (!produto) {
    return (
      <View style={styles.centrado}>
        <Text>Seu carrinho está vazio.</Text>
      </View>
    );
  }

  const total = Number(produto.preco) * quantidade;

  async function handleFinalizarPedido() {
    setEnviando(true);
    try {
      const itens = [{ produto_id: produto.id, quantidade }];
      await criarPedido('Cliente App', itens);

      Alert.alert('Sucesso!', 'Seu pedido foi realizado!', [
        { text: 'Acompanhar Pedido', onPress: () => navigation.navigate('MeusPedidos') }
      ]);
    } catch (e) {
      Alert.alert('Erro', e.message || 'Erro ao realizar pedido');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Resumo do Pedido</Text>

      <View style={styles.item}>
        <Text style={styles.itemNome}>{produto.nome}</Text>
        <Text>Preço Unitário: R$ {Number(produto.preco).toFixed(2)}</Text>
        
        <View style={styles.qtdContainer}>
          <TouchableOpacity onPress={() => setQuantidade(Math.max(1, quantidade - 1))}>
            <Text style={styles.qtdBotao}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtdTexto}>{quantidade}</Text>
          <TouchableOpacity onPress={() => setQuantidade(quantidade + 1)}>
            <Text style={styles.qtdBotao}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalTexto}>Total:</Text>
        <Text style={styles.totalValor}>R$ {total.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.botao} onPress={handleFinalizarPedido} disabled={enviando}>
        {enviando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>Confirmar e Pedir</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'space-between' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  item: { padding: 16, borderWidth: 1, borderColor: '#eee', borderRadius: 8, gap: 8 },
  itemNome: { fontSize: 18, fontWeight: 'bold' },
  qtdContainer: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 },
  qtdBotao: { fontSize: 20, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4 },
  qtdTexto: { fontSize: 18, fontWeight: 'bold' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderTopWidth: 1, borderColor: '#ccc' },
  totalTexto: { fontSize: 18, fontWeight: 'bold' },
  totalValor: { fontSize: 20, color: '#2a9d8f', fontWeight: 'bold' },
  botao: { backgroundColor: '#2a9d8f', padding: 16, borderRadius: 8, alignItems: 'center' },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});