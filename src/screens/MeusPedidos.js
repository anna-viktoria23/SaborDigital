import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { buscarPedidos } from '../services/api';

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await buscarPedidos();
      setPedidos(dados);
    } catch (e) {
      console.error(e);
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cabecalho}>
              <Text style={styles.pedidoId}>Pedido #{item.id}</Text>
              <Text style={[styles.status, { color: getCorStatus(item.status) }]}>
                {item.status ? item.status.toUpperCase() : 'PENDENTE'}
              </Text>
            </View>

            <Text style={styles.total}>Total: R$ {Number(item.total).toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#666' }}>
            Nenhum pedido realizado ainda.
          </Text>
        }
      />
    </View>
  );
}

function getCorStatus(status) {
  switch (status) {
    case 'pronto': return '#2a9d8f';
    case 'preparo': return '#e9c46a';
    case 'entregue': return '#457b9d';
    default: return '#e63946'; // pendente
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  pedidoId: { fontSize: 16, fontWeight: 'bold' },
  status: { fontWeight: 'bold' },
  total: { fontSize: 15, color: '#333' }
});