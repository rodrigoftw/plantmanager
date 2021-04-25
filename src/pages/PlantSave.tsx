import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { format, isBefore } from 'date-fns';
import { PlantProps, savePlant } from '../libs/storage';

import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SvgFromUri } from 'react-native-svg';
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper';

import { Button } from '../components/Button';

import tipImage from '../assets/waterdrop.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface RouteParams {
  plant: PlantProps
}

export function PlantSave() {
  const navigation = useNavigation();
  const route = useRoute();
  const { plant } = route.params as RouteParams;

  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');

  function handleChangeTime(event: Event, dateTime: Date | undefined) {
    if (Platform.OS === 'android') {
      setShowDatePicker(oldState => !oldState);
    }

    if (dateTime && isBefore(dateTime, new Date())) {
      setSelectedDateTime(new Date());
      return Alert.alert('Escolha uma hora no futuro! ⏰');
    }

    if (dateTime) {
      setSelectedDateTime(dateTime);
    }
  }

  function handleOpenDateTimePickerForAndroid() {
    setShowDatePicker(oldState => !oldState);
  }

  async function handleSave() {
    try {
      await savePlant({
        ...plant,
        dateTimeNotification: selectedDateTime,
      });

      navigation.navigate('Confirmation', {
        title: 'Tudo certo!',
        subtitle: 'Fique tranquilo(a) que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado.',
        buttonTitle: 'Muito obrigado :D',
        icon: 'hug',
        nextScreen: 'MyPlants'
      });

    } catch (error) {
      Alert.alert('Não foi possível salvar! 😢');
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.plantInfo}>
          <SvgFromUri
            uri={plant.photo}
            height={100}
            width={100}
          />
          <Text style={styles.plantName}>
            {plant.name}
          </Text>

          <Text style={styles.plantDetails}>
            {plant.about}
          </Text>
        </View>

        <View style={styles.controller}>
          <View style={styles.tipContainer}>
            <Image
              source={tipImage}
              style={styles.tipImage}
            />
            <Text style={styles.tipText}>
              {plant.water_tips}
            </Text>
          </View>
          <Text style={styles.alertLabel}>
            Escolha o melhor horário para ser lembrado:
            </Text>

          {
            showDatePicker && (
              <DateTimePicker
                value={selectedDateTime}
                mode='time'
                display='spinner'
                onChange={handleChangeTime}
              />
            )
          }

          {
            Platform.OS === 'android' && (
              <TouchableOpacity
                onPress={handleOpenDateTimePickerForAndroid}
                style={styles.dateTimePickerButton}
              >
                <Text style={styles.dateTimePickerText}>
                  {`Mudar ${format(selectedDateTime, 'HH:mm')}`}
                </Text>
              </TouchableOpacity>
            )
          }

          <Button
            title="Cadastrar planta"
            onPress={handleSave}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.shape,
  },
  plantInfo: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.shape,
    marginTop: getStatusBarHeight(),
  },
  plantName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 15,
  },
  plantDetails: {
    textAlign: 'center',
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    marginTop: 10,
    paddingBottom: 40,
  },
  controller: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: getBottomSpace() || 20,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
    bottom: 60,
  },
  tipImage: {
    height: 56,
    width: 56,
  },
  tipText: {
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
    textAlign: 'justify',
  },
  alertLabel: {
    textAlign: 'center',
    fontFamily: fonts.complement,
    color: colors.heading,
    fontSize: 12,
    marginBottom: 5,
  },
  dateTimePickerButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  dateTimePickerText: {
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text,
  },
});