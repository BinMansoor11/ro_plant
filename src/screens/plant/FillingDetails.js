import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import {
  Pic,
  ScreenSize,
  FontSize,
  FontColor,
  Fonts,
} from '../../components/theme';
import { Container } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { API } from '../../utils';

const Plants = (props) => {
  const { navigation } = props;
  const { data } = props.route.params;

  const isFocused = useIsFocused();
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    console.log('props', data);

    getPlantFillingDetails();
  }, []);

  const getPlantFillingDetails = async () => {
    try {
      var bodyFormData = new FormData();

      bodyFormData.append('plant_id', JSON.stringify(data.id));

      const response = await axios.post(
        API + '/get_plants_filling_detail_by_plant_id',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'application/form-data',
          },
        },
      );

      console.log('Response', response.data);

      setCardData(
        response.data.status == 'ERROR'
          ? []
          : response.data.plants_filling_data,
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  const StatCard = (props) => {
    const { v, i } = props;

    const splited_time = v.created_at != undefined && v.created_at.split(' ');

    const statData = [
      {
        title: ' Filled Delivered',
        value: v.containers_delivered,
      },
      { title: 'Empty Recieved', value: v.containers_received },
      { title: 'Container Balance', value: v.price_per_container },
      {
        title: 'Due Amount',
        value: v.containers_delivered * v.price_per_container,
      },
      { title: 'Amount Paid', value: v.amount_received },
      { title: 'Amount Balance', value: v.net_amount },
    ];

    return (
      <View style={styles.mainView}>
        <View style={styles.dateView}>
          <Text style={{ color: 'gray', fontSize: FontSize.font25 }}>
            Date: {splited_time[0]}
          </Text>
          <Text style={{ color: 'gray', fontSize: FontSize.font25 }}>
            Time: {splited_time[1]} {splited_time[1] > '12' ? ' PM ' : ' AM '}
          </Text>
        </View>
        <View style={{ width: '95%', alignSelf: 'center', marginTop: '2%' }}>
          <Text style={{ color: 'gray', fontSize: FontSize.font25 }}>
            Plant Name: {v.name}
          </Text>
        </View>
        <View style={styles.statsView}>
          {statData.map((v, i) => {
            return (
              <Text key={i} style={styles.statsText}>
                {v.title} {'\n'}
                <Text style={styles.statsSubText}>{v.value}</Text>
              </Text>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <>
      <GlobalHeader
        headingText="Delivery App"
        back
        navigation={props.navigation}
      />

      <View style={styles.container}>
        <Container>
          <ScrollView showsVerticalScrollIndicator={false}>
            {cardData.map((v, i) => {
              return <StatCard key={i} v={v} i={i} />;
            })}
          </ScrollView>
        </Container>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mainView: {
    // alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginVertical: '2%',
    marginHorizontal: '2%',
    borderRadius: 3,
    paddingHorizontal: '2%',
    paddingVertical: '5%',
    elevation: 5,
  },
  statsView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: '4%',
  },
  statsText: {
    textAlign: 'center',
    width: '30%',
    color: 'gray',
    fontSize: FontSize.font25,
    marginTop: '2%',
  },
  statsSubText: {
    fontWeight: 'bold',
    fontSize: FontSize.font27,
  },
  dateView: {
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Plants;
