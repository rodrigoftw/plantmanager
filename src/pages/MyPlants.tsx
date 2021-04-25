import React, { useEffect, useState } from 'react';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';

import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Alert,
} from 'react-native';

import { loadPlant, PlantProps, removePlant } from '../libs/storage';

import { Load } from '../components/Load';
import { Header } from "../components/Header";
import { PlantCardSecondary } from '../components/PlantCardSecondary';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import waterdrop from '../assets/waterdrop.png';

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>('');

  useEffect(() => {
    async function loadStorageData() {
      const storagedPlants = await loadPlant();

      if (storagedPlants.length > 0) {
        const nextTime = formatDistance(
          new Date(storagedPlants[0].dateTimeNotification).getTime(),
          new Date().getTime(),
          { locale: pt }
        );

        setNextWatered(
          `Não esqueça de regar a ${storagedPlants[0].name} em ${nextTime}.`
        );

        setMyPlants(storagedPlants);
      } else {
        setMyPlants([]);
        setNextWatered('Já que ainda não tem plantinhas aqui, porque não se hidratar? Beba água! 🥤');
      }
      setLoading(false);
    }

    loadStorageData();
  }, [])

  function handleRemove(plant: PlantProps) {
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
      {
        text: 'Não 🙏🏽',
        style: 'cancel'
      },
      {
        text: 'Sim 😢',
        onPress: async () => {
          try {
            await removePlant(plant.id);
            setMyPlants(oldData =>
              oldData.filter(item => item.id !== plant.id)
            );

          } catch (error) {
            Alert.alert('Não foi possível remover! 😳');
          }
        }
      },
    ])
  }

  if (loading) {
    return <Load />;
  }

  return (
    <>
      <View style={styles.container}>
        <Header
          title="Minhas"
          subtitle="Plantinhas"
        />
        <View style={styles.spotlight}>
          <Image
            source={waterdrop}
            style={styles.spotlightImage}
          />
          <Text style={styles.spotlightText}>
            {nextWatered}
          </Text>
        </View>
      </View>
      <View style={styles.plantsContainer}>
        <View style={styles.plants}>
          <Text style={styles.plantsTitle}>
            Próximas regadas
          </Text>
          <FlatList
            data={myPlants}
            ListEmptyComponent={() => (
              <View style={styles.emptyList}>
                <Text style={styles.emoji}>
                  😬
                </Text>
                <Text style={styles.emptyListTitle}>
                  Nenhuma plantinha salva por aqui!
                </Text>
              </View>
            )}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <PlantCardSecondary
                data={item}
                handleRemove={() => handleRemove(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flex: 1 }}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 32,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotlightImage: {
    height: 60,
    width: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
    textAlign: 'justify'
  },
  plantsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.background,
  },
  plants: {
    flex: 1,
    width: '100%',
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
    paddingHorizontal: 30,
  },
  emptyList: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
    marginVertical: 5,
  },
  emptyListTitle: {
    fontSize: 20,
    fontFamily: fonts.text,
    color: colors.heading,
    marginVertical: 5,
  },
});