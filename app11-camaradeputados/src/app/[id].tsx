import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { TextInput, List, Button } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { Historico } from '@/tipos/historico';
const  API = `https://dadosabertos.camara.leg.br/api/v2/deputados`

export default function Ortfrute() {
  const { id, nome, urlimg } = useLocalSearchParams();
      const [text, setText] = useState('');
      const [historico, setHistorico] = useState<Historico[]>([]);
      const [loading, setLoading] = useState(false);
      const [errorMessage, setErrorMessage] = useState('');

   useEffect(() => {
    if (id) {
      getHistorico(id as unknown as number);
    }
  }, [id]);

 /*Função para buscar histórico do deputado*/
  async function getHistorico(id: number) {
  /*Verificar se o ID foi informado, se não retorna mensagem de erro*/
  if (!id.toString().trim()) {
    setErrorMessage('Informe o ID do deputado para buscar.');
    return;
  }
  /* Montar a url com a api informada acima e adcionando sigla*/
  const url = `${API}/${id}/historico`;

  /*setar Loading e limpar mensagem de erro*/
  setLoading(true);
  setErrorMessage('');

  try {
    /*faço a requisição usando fetch e verifica se a resposta foi ok caso contrario emmite um erro*/
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Erro ao buscar dados');
    }

    const data = await res.json();
/*Verificar se a resposta tem um array de deputados e se ele tem elementos*/
    if (Array.isArray(data.dados) && data.dados.length > 0) {
      setHistorico(data.dados);
      setText('');
    } else {
      setHistorico([]);
      setErrorMessage('Nenhum histórico encontrado.');
    }
  /*tratamento de erros*/
  } catch (err) {
    console.log(err);
    setErrorMessage('Não foi possível buscar o histórico no momento.');
  } finally {
    setLoading(false);
  }
}

  return (
    <View style={styles.container}>

      <Image source={{ uri: urlimg }} style={styles.imagem} />

      <Text style={styles.text}>ID: {id}</Text>
      <Text style={styles.text}>Nome: {nome}</Text>

      <Button style={{ marginTop: 16 }}
        icon="magnify"
        mode="contained"
        onPress={() => getHistorico(Number(id))}
        loading={loading}
        disabled={loading}
      >
        Buscar histórico
      </Button>
   
      <ScrollView style={{ marginTop: 16, width: '100%' }}>
        {historico.map((item, index) => (
          <List.Item
            key={index}
            title={item.nome + ' - ' + item.siglaPartido + '/' + item.siglaUf+ ' - ' + new Date(item.dataHora).toLocaleString('pt-BR')}
            description={item.descricaoStatus}
          />
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    marginBottom: 10,

  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  imagem: {
    width: 200,
    height: 200,
  },
});