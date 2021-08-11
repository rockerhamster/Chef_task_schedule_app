import { RNCamera } from 'react-native-camera';
import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default function Scanner() {
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
          let order = Text2Data(data);
          console.log(order);
        }}
      >
      </RNCamera>
    </View>
  );
}

function Text2Data(data) {
  words = [];
  sentence = [];
  order = {
    odrname: '',
    Dishqty: '',
    Time: '',
    Date: '',
    Dish: [],
    Qty: [],
    PrepTime: [],
    Chefcolor: [],
    Done: [],
    Note: [],
  };
  //raw data recieved
  const dishes = ['KADAI PANEER', 'GARLIC NAAN', 'KOTHU PARATHA', 'IDLY', 'PANEER PALAK', 'BHEL PURI', 'YELLOW DAL FRY', 'MASALA DOSA', 'MUTTER PANEER', 'ALOO GOBI MASALA', 'PLAIN NAAN'];
  const dishtimes = ['10:00', '3:00', '6:00', '2:00', '15:00', '3:00', '13:00', '2:00', '17:00', '16:00', '3:00']
  // const words = ["spray", "PLAIN", "NAAN", "man", "wip", "limit", "KADAI", "PANEER", "elite", "exuberant", "ALOO", "GOBI", "MASALA", "destruction", "present"];

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
    if (order.odrname == '') {
      if (j == 0 || j == 1) {
        let array = [...sentence[j].matchAll(/: ([a-z]+)/gi)];
        order.odrname = array[0][1];
      }
    }
    if (timecheck != null) {
      //records time
      order.Time = timecheck[0];
    }
    if (datecheck != null) {
      //records date
      order.Date = datecheck[0];
    }
    for (var i = 0; i < dishes.length; i++) {
      var Checker = true;
      //checks if dish matches
      if (dishes[i].split(' ')[0] == words[j].toUpperCase()) {
        for (k = 1; k < dishes[i].split(' ').length; k++) {
          Checker = Checker && (dishes[i].split(' ')[k] == words[j + k].toUpperCase());
        }
        if (Checker) {
          //checks for repeat
          if (order.Dish.filter(word => word == dishes[i]).length < 1) {
            order.Dish.push(dishes[i]);
            order.PrepTime.push(dishtimes[i]);
            order.Chefcolor.push('blue');
            order.Done.push(false);
            order.Note.push('');
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
              order.Qty[order.Dish.indexOf(dishes[i])] += Number(words[j - 1]);
            }
            else {
              order.Qty[order.Dish.indexOf(dishes[i])]++;
            }
          }
        }
      }
    }
  }
  for (var i = 0; i < sentence.length - 1; i++) {
    for (var j = 0; j < order.Dish.length; j++) {
      if (sentence[i].includes(order.Dish[j]) && !order.Dish.some(e => sentence[i + 1].includes(e))) {
        console.log(sentence[i]);
        console.log(order.Dish[j]);
        if (sentence[i + 1].includes('ID:')) {
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