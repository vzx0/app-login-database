import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Platform, StatusBar } from 'react-native';
import { supabase } from './supabaseClient';

export default function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [sessao, setSessao] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session);
    });
  }, []);

  const buscarMensagens = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setMensagens(data);
    }
  };

  const enviarMensagem = async () => {
    if (mensagem) {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ content: mensagem }]);

      if (error) {
        console.error(error);
      } else {
        setMensagem('');
        buscarMensagens();
      }
    }
  };

  const entrarComEmail = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) alert(error.message);
  };

  const cadastrarComEmail = async () => {
    const { error } = await supabase.auth.signUp({ email, password: senha });

    if (error) alert(error.message);
  };

  const sair = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
  };

  if (!sessao) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao App</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        {isSignUp ? (
          <>
            <TouchableOpacity style={styles.button} onPress={cadastrarComEmail}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
            <Text onPress={() => setIsSignUp(false)} style={styles.link}>Já tem uma conta? Entrar</Text>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={entrarComEmail}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <Text onPress={() => setIsSignUp(true)} style={styles.link}>Não tem uma conta? Cadastrar</Text>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite sua mensagem"
        value={mensagem}
        onChangeText={setMensagem}
      />
      <TouchableOpacity style={styles.button} onPress={enviarMensagem}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
      <FlatList
        data={mensagens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.message}>{item.content}</Text>}
        style={styles.messageList}
      />
      <TouchableOpacity style={styles.button} onPress={sair}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  message: {
    padding: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
  },
  messageList: {
    width: '100%',
  },
  link: {
    color: '#6200ee',
    marginTop: 10,
    textAlign: 'center',
  },
});

