import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";
import { TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStatusBarHeight } from "react-native-iphone-x-helper";

import userImg from "../assets/avatar.png";
import colors from "../styles/colors";
import fonts from '../styles/fonts';
import { Feather } from '@expo/vector-icons';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { goBack } = useNavigation();
  const [userName, setUserName] = useState<string>('');

  function turnBack() {
    goBack();
  }

  useEffect(() => {
    async function loadUserNameFromStorage() {
      const user = await AsyncStorage.getItem('@PlantManager:user');
      setUserName(user || '');

    }
    loadUserNameFromStorage();
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => turnBack()}
      >
        <Feather
          name="chevron-left"
          color={colors.heading}
        />
      </TouchableOpacity>
      <View>
        <Text style={styles.greeting}>
          {title ? title : 'Olá,'}
        </Text>
        <Text style={styles.userName}>
          {subtitle ? subtitle : userName}
        </Text>
      </View>
      <Image
        source={userImg}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text,
  },
  userName: {
    fontSize: 32,
    lineHeight: 40,
    color: colors.heading,
    fontFamily: fonts.heading,
  },
  image: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
})