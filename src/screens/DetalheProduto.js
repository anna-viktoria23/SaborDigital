import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { buscarProdutoPorId } from '../services/api';

export default function DetalheProduto({ route, navigation }) {
  const { produtoId } = route.params;
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarProdutoPorId(produtoId);
        setProduto(dados);
      } catch (e) {
        Alert.alert('Erro', e.message);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [produtoId]);

  if (carregando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#e63946" />
      </View>
    );
  }

  if (!produto) return null;

  return (
    <View style={styles.container}>
      {produto.imagemUrl && (
        <Image source={{ uri: produto.imagemUrl }} style={styles.imagem} />
      )}
      <View style={styles.conteudo}>
        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.preco}>R$ {Number(produto.preco).toFixed(2)}</Text>
        <Text style={styles.descricao}>{produto.descricao}</Text>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Carrinho', { produto })}
        >
          <Text style={styles.textoBotao}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagem: { width: '100%', height: 250 },
  conteudo: { padding: 20, gap: 12 },
  nome: { fontSize: 22, fontWeight: 'bold' },
  preco: { fontSize: 20, color: '#2a9d8f', fontWeight: 'bold' },
  descricao: { fontSize: 15, color: '#666', lineHeight: 22 },
  botao: { backgroundColor: '#e63946', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});