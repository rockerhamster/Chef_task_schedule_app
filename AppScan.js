import { RNCamera } from 'react-native-camera';
import React, { Component } from 'react';
import { StyleSheet, View ,Button, Alert} from 'react-native';
import Editor from './Components/Editor';
import { label } from 'aws-amplify';

export default function Scanner({navigation}) {
  let orders = [];
  let max = [0,0];
  const order = {odrName: '',Date:"", Dishqty: 0, Time: "", Dish: [], Qty: [], PrepTime: [], Chefcolor: [], Done: [], Note: [] }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.topBarButton}>
            <Button onPress={()=>navigation.navigate("Editor",order)} title="MAKE" color="#8c8ca1"/>
        </View>
      ),
    });
  }, [navigation]);

  

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }}>
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
          width: '100%',
        }}
        onTextRecognized={(data) => {
          if(data.textBlocks.length>2){
            if(data.textBlocks[0].value.length>5||data.textBlocks[1].value.length>5)
            {
              let order = Text2Data(data);
              if(order.Dish.length!=0)
              {
                if(order.Dish.length>max){
                  max[0]=order.Dish.length;
                  max[1]=orders.length;
                }
                orders.push(order);

                if(orders.length>1){
                  navigation.navigate("Editor",orders[max[1]]);
                    orders = [];
                    max = [0,0];
                }
              }
            }
          }
        }}
      >
      </RNCamera>
    </View>
  );
}


const styles = StyleSheet.create({
  topBarButton: {
    paddingRight: 10,
  },
});

function Text2Data(data) {
  let words = [];
  let sentence = [];
  let order = {
    odrName: '',
    Time: '',
    Date: '',
    Dish: [],
    Qty: [],
    PrepTime: [],
    Note: [],
  };
  //raw data recieved
  const dishes = [['ANDHRA SPICY DOSA'], ['BHEL PURI', 'BUTTER DOSA', 'BUTTER MSL DOSA', 'BHINDI Fry.2028BHINDI MASALA', 'BOMBAY PAV BHAJI'],['CHILLY CHZ DOSA', 'Chilly cheese dosa', 'Cheese & vegetable Uthappam ', 'CURD RICE', 'CHANNA MASALA', 'Channa batura', 'Cheese & vegetable Uthappam '], ['DAHI VADA', 'DAL MASALA '], ['Extra RAITHA', 'EXTRA BATURA', 'EXTRA RICE'], [], ['GHEE ROAST', 'Gobi mutter masala', 'Gobi manchurian', 'Ghee cone dosa'], [], ['IDLY', 'Idly Vada'], ['Jeera Rice'], ['Kothamalli dosa', 'KADAI PANEER'], [], ['MEDU VADA', 'MASALA DOSA ', 'MYSORE MSL DOSA', 'MIX VEG UTHAPPAM', 'MUSHROOM MTR MSL', 'MUTTER PANEER', 'Malabar paratha (1PC)', 'Molagapodi', 'Mini puri with potato '], [], ['ONION KARA PODI DO', 'ONION RAVA', 'ONI-CHILY UTHAPAM.2028ON-TOM-CHILLY UTHA', 'ONION UTHAPPAM', 'Onion - Kara Uthappam'], ['PLAIN DOSA', 'PANEER DOSA', 'PANEER MSL DOSA', 'Pavbhaj masala dosa', 'PAPER DOSA', 'Paper masala dosa', 'PLAIN RAVA ', 'PLAIN UTHAPPAM', 'Paneer & peas uthappam', 'Pineapple & chilly Uthappam', 'Paneer butter masala', 'PANEER CHILLY ', 'Paneer makhani', 'Paneer palak', 'PLAIN YOGURT', 'PURI W/SPICY POTATO', 'PURI ( 1 PC )'], [], [], ['SAMBAR IDLY', 'SAMBAR VADAa', 'SAMOSA CHAT', 'SPL CHILI BAJJI', 'SET DOSA', 'Sada Mysore dosa', 'SPINACH MSL DOSA', 'Spinach paneer dosa', 'SPL RAVA MASALA ', 'Spicy masala Uthappam ', 'SAAG ALOO', 'SAAG PANEER', 'Special Paratha with korma', 'SO1.papad'], ['Teddy bear dosa'], [], ['VEG. SAMOSA', 'VEG KORMA'], [], [], ['YELLOW DAL FRY']];
  const dishtimes = ['10:00', '3:00', '6:00', '2:00', '15:00', '3:00', '13:00', '2:00', '17:00', '16:00', '3:00'];
  
  for (var i = 0; i < data.textBlocks.length; i++) {
    //splits data to words
    words = words.concat(data.textBlocks[i].value.split(' ').map(x => x.split('\n')).flat());
    sentence = sentence.concat(data.textBlocks[i].value.split('\n'));
  }
  // sorts the words to order object
  for (var j = 0; j < words.length; j++) {
    //\d{2}=20 :\d{2}=:20 :?(\d{2})?=:20 (20:20:20)
    var timecheck = words[j].match(/\d{0,2}:\d{2}:?(\d{2})?((\s+)?p\w?|(\s+)?a\w?)?/gi);
    //\d{2}= 20 (day) (-|\/)(...|\d{2})= -jun (month) (-|\/)(21|20|19)\d{2}= -2020 (year)
    var datecheck = words[j].match(/(\d{2}(-|\/)(jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec|\d{2})(\w+)?(-|\/)(21|20|19)?\d{2})|((jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec|\d{2})(\w+)?\s+\d{2},(19|20|21)\d{2})/gi);
    if (order.odrName == '') {
      if (j == 0 || j == 1) {
        let array = sentence[j].match(/: ([a-z]+)/i);
        if(array!=null)
        {
          order.odrName = array[1];
        }
      }
    }
    if (order.Time=='' && timecheck != null) {
      //records time
      order.Time = timecheck[0];
    }
    if (order.Date=='' && datecheck != null) {
      //records date
      order.Date = datecheck[0];
    }
    if(words[j].charCodeAt(0)>64 && words[j].charCodeAt(0)<91){
      let dish = dishes[words[j].charCodeAt(0)-65];
      for (var i = 0; i < dish.length; i++) {
        var Checker = true;
        //checks if dish matches
        if (dish[i].split(' ')[0] == words[j].toUpperCase()) {
          for (k = 1; k < dish[i].split(' ').length; k++) {
            //Error here
            Checker = Checker && (dish[i].split(' ')[k] == words[j + k].toUpperCase());
          }
          if (Checker) {
            //checks for repeat
            if (order.Dish.filter(word => word == dish[i]).length < 1) {
              order.Dish.push(dish[i]);
              order.Note.push('');
              // order.PrepTime.push(dishtimes[i]);
              // Add for timing
              // checks how many orders
              if (!isNaN(words[j - 1])) {
                order.Qty.push(Number(words[j - 1]));
              }
              else {
                order.Qty.push(1);
              }
            }
            else {
              if (!isNaN(words[j - 1])) {
                order.Qty[order.Dish.indexOf(dish[i])] += Number(words[j - 1]);
              }
              else {
                order.Qty[order.Dish.indexOf(dish[i])]++;
              }
            }
          }
        }
      }
    }
  }
  for (var i = 0; i < sentence.length - 1; i++) {
    for (var j = 0; j < order.Dish.length; j++) {
      if (sentence[i].includes(order.Dish[j]) && !order.Dish.some(e => sentence[i + 1].includes(e))) {
        if (sentence[i + 1].includes('ID:')||sentence[i + 1].includes('I0:')||sentence[i + 1].includes('1D:')) {
          continue;
        }
        else {
          order.Note[j] = sentence[i + 1];
        }
      }
    }
  }
  return (order);
}