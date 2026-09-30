import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { buscarProdutos } from '../services/api';

export default function ListaProdutos({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await buscarProdutos();
      setProdutos(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (carregando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#e63946" />
        <Text>Carregando produtos...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.textoErro}>Erro: {erro}</Text>
        <TouchableOpacity style={styles.botaoTentar} onPress={carregar}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DetalheProduto', { produtoId: item.id })}
          >
            {item.imagemUrl ? (
              <Image source={{ uri: item.imagemUrl }} style={styles.imagem} />
            ) : (
              <View style={[styles.imagem, styles.semImagem]}>
                <Text>Sem foto</Text>
              </View>
            )}
            <View style={styles.info}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text>
              <Text style={styles.preco}>R$ {Number(item.preco).toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, elevation: 2 },
  imagem: { width: 80, height: 80, borderRadius: 6, marginRight: 12 },
  semImagem: { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, justifyContent: 'center' },
  nome: { fontSize: 16, fontWeight: 'bold' },
  descricao: { fontSize: 13, color: '#6c757d', marginVertical: 4 },
  preco: { fontSize: 15, fontWeight: 'bold', color: '#2a9d8f' },
  textoErro: { color: 'red', textAlign: 'center' },
  botaoTentar: { backgroundColor: '#e63946', padding: 12, borderRadius: 6 }
});