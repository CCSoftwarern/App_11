import { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { TextInput, List } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { Filme } from '../tipos/filme';

const API_KEY = 'a279621c';
const API = `http://www.omdbapi.com/?apikey=${API_KEY}`;

export default function Tab() {
    const [text, setText] = useState('');
    const [movies, setMovies] = useState<Filme[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

  async function getMovie(title: string) {
    const movieTitle = title.trim();

    if (!movieTitle) {
      setErrorMessage('Informe o nome do filme para buscar.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`${API}&s=${movieTitle}`);
      const data = await res.json();

      if (data.Response === 'True' && Array.isArray(data.Search)) {
        setMovies(data.Search as Filme[]);
        setText('');
      } else {
        setErrorMessage(data.Error || 'Nenhum filme encontrado.');
      }
    } catch (err) {
      console.log(err);
      setErrorMessage('Não foi possível buscar o filme no momento.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.containerCaixaPesquisa}>
      <TextInput
      label="Nome do filme"
      value={text}
      onChangeText={setText}
      placeholder="Digite o título do filme"
    />

  <Button style={{ marginTop: 16 }}
    icon="magnify"
    mode="contained"
    onPress={() => getMovie(text)}
    loading={loading}
    disabled={loading}
  >
    Buscar filme
  </Button>

  {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

  <ScrollView
    style={styles.resultsContainer}
    contentContainerStyle={styles.resultsContent}
    showsVerticalScrollIndicator={true}
  >
    <List.Section title="Resultados">
      {movies.length === 0 ? (
        <List.Item
          title="Nenhum filme pesquisado ainda"
          description="Digite um título e pressione Buscar filme."
          left={(props) => <List.Icon {...props} icon="movie-open" />}
        />
      ) : (
        movies.map((movie, index) => (
          <List.Item
            key={movie.imdbID || `${movie.Title}-${movie.Year}-${index}`}
            title={movie.Title}
            description={`${movie.Year} • ${movie.Type || 'Filme'}`}
            left={(props) =>
              movie.Poster && movie.Poster !== 'N/A' ? (
                <View style={styles.posterContainer}>
                  <Image
                    source={{ uri: movie.Poster }}
                    style={styles.posterImage}
                  />
                </View>
              ) : (
                <List.Icon {...props} icon="movie" />
              )
            }
          />
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
  posterImage: {
    width: 56,
    height: 80,
    borderRadius: 0,
  },
});
