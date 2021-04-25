import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Alert,
} from 'react-native';

import { Button } from '../components/Button';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function UserIdentification() {
  const navigation = useNavigation();

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [name, setName] = useState<string>('');


  async function handleSubmit() {
    if (!name) {
      return Alert.alert('Me diz como devo chamar você! 😢');
    }
    try {
      await AsyncStorage.setItem('@PlantManager:user', name);
      navigation.navigate('Confirmation', {
        title: 'Prontinho!',
        subtitle: 'Agora vamos começar a cuidar das suas plantinhas com muito cuidado.',
        buttonTitle: 'Começar',
        icon: 'smile',
        nextScreen: 'PlantSelect'
      });
    } catch (error) {
      Alert.alert('Não foi possível salvar o seu nome! 😢');

    }
  }

  function handleInputBlur() {
    setIsFocused(false);
  }

  function handleInputFocus() {
    setIsFocused(true);
    setIsFilled(!!name);
  }

  function handleInputChange(value: string) {
    setIsFilled(!!value);
    setName(value);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
        >
          <View style={styles.content}>
            <View style={styles.form}>
              <View style={styles.header}>
                <Text style={styles.emoji}>
                  {isFilled ? '😄' : '😀'}
                </Text>
                <Text style={styles.title}>
                  Como podemos {'\n'}
                  chamar você?
                </Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  (isFocused || isFilled) &&
                  { borderColor: colors.green }
                ]}
                placeholder="Digite um nome"
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onChangeText={handleInputChange}
                autoCapitalize='sentences'
                maxLength={16}
              />
              <View
                style={[
                  styles.footer,
                  isFilled ?
                    { opacity: 1 } : { opacity: 0.7 }
                ]}>
                <Button
                  title="Confirmar"
                  onPress={handleSubmit}
                // disabled={isFilled ? false : true}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  content: {
    flex: 1,
    width: '100%',
  },
  form: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 54,
  },
  header: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 44,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 20,
  },
  input: {
    width: '100%',
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
  },
  footer: {
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 20,
  }
});