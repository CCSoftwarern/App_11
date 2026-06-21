import { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { TextInput, List } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { Deputado } from '@/tipos/deputado';
import { router } from 'expo-router';


const  API = `https://dadosabertos.camara.leg.br/api/v2/deputados`

export default function TabIndex() {
    const [text, setText] = useState('');
    const [deputados, setDeputados] = useState<Deputado[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

  /*Função para buscar deputados por UF*/
  async function getDeputados(uf: string) {
  /*Verificar se o UF foi informado, se não retorna mensagem de erro*/
  if (!uf.trim()) {
    setErrorMessage('Informe a UF do deputado para buscar.');
    return;
  }
  /* Montar a url com a api informada acima e adcionando sigla*/
  const url = `${API}?siglaUf=${uf}&ordem=ASC&ordenarPor=nome`;

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
      setDeputados(data.dados);
      setText('');
    } else {
      setDeputados([]);
      setErrorMessage('Nenhum deputado encontrado.');
    }
  /*tratamento de erros*/
  } catch (err) {
    console.log(err);
    setErrorMessage('Não foi possível buscar os deputados no momento.');
  } finally {
    setLoading(false);
  }
}

  return (
    <View style={styles.containerCaixaPesquisa}>
      <TextInput
      maxLength={2}
      autoCapitalize="characters"
      label="UF do deputado"
      value={text}
      onChangeText={setText}
      placeholder="Digite a UF do deputado"
    />

  <Button style={{ marginTop: 16 }}
    icon="magnify"
    mode="contained"
    onPress={() => getDeputados(text)}
    loading={loading}
    disabled={loading}
  >
    Buscar deputado
  </Button>

  {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

  <ScrollView
    style={styles.resultsContainer}
    contentContainerStyle={styles.resultsContent}
    showsVerticalScrollIndicator={true}
  >
    <List.Section title="Resultados">
      {deputados.length === 0 ? (
        <List.Item
          title="Nenhum deputado pesquisado ainda"
          description="Digite um nome e pressione Buscar deputado."
          left={(props) => <List.Icon {...props} icon="account" />}
        />
      ) : (
        deputados.map((deputado, index) => (
          /* list do componente react-native-paper*/
        <Pressable key={deputado.id} style={styles.texto} onPress={() => router.navigate({ pathname: '/[id]', params: { id: deputado.id, nome: deputado.nome, urlimg: deputado.urlFoto } })}>
          <List.Item
            key={deputado.id || `${deputado.nome}-${deputado.siglaUf}-${index}`}
            title={deputado.nome}
            description={`${deputado.siglaUf} • ${deputado.siglaPartido || 'Partido desconhecido'}`}
            left={(props) =>
              deputado.urlFoto && deputado.urlFoto !== 'N/A' ? (
                <View style={styles.posterContainer}>
                  <Image
                    source={{ uri: deputado.urlFoto }}
                    style={styles.fotoImage}
                  />
                </View>
              ) : (
                <List.Icon {...props} icon="account" />
              )
            }
          />
           </Pressable> 
        ))
      )}
    </List.Section>
  </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerCaixaPesquisa:{
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingBottom: 24,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
  },
  posterContainer: {
    marginRight: 8,
  },
  fotoImage: {
    width: 56,
    height: 80,
    borderRadius: 0,
  },
});
