import React, { useRef, useState, useMemo } from 'react';
import { Button, ScrollView, Image, Text, View, StyleSheet, Animated, Alert, Easing, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import Dish from './Dish';
import Order from './Order';
import Note from './note';

// You can import from local files
import AssetExample from './components/AssetExample';

export default function App() {

    const order = { odrName: 'order 1', Dishqty: 3, Time: "19:24:46P", Dish: ["PLAIN NAAN", "KADAI PANEER", "IDLY"], Qty: [5, 6, 2], PrepTime: ["3", "10", "2"], Chefcolor: ["green", "red", "purple"], Done: [false, false, false], Note: ["hello", "hi", ""] }

    const order2 = { odrName: 'order 2', Dishqty: 4, Time: "20:48:27P", Dish: ["PLAIN NAAN", "KADAI PANEER", "IDLY", "Curry"], Qty: [5, 6, 2], PrepTime: ["3", "10", "2", "10"], Chefcolor: ["green", "red", "purple", "blue"], Done: [false, false, false, false], Note: ["", "", "", ""] }

    const [orders, setOrders] = useState([order]);
    const [note, setNote] = useState({ notemode: false, note: '' });

    const Orders = () => {
        let ordersjsx = []
        for (let i = 0; i < orders.length; i++) {
            ordersjsx.push(Order(orders, setOrders, setNote, i));
        }
        return (
            <View style={Style.analyser}>
                {ordersjsx.map(elem => elem)}
            </View>
        );
    };

    return (
        <View style={Style.centeredView}>
            {Note(note, setNote)}
            <View style={Style.container}>
                <View style={{
                    flexDirection: 'row',
                    paddingTop: 50,
                    paddingBottom: 10,
                    justifyContent: 'center'
                }}>
                    <Button onPress={() => setOrders([...orders, order])} title="Add Odr3"
                        color="#8c8ca1" />
                    <Button onPress={() => setOrders([...orders, order2])} title="Add Odr2"
                        color="#8c8ca1" />
                </View>
                <ScrollView style={{ flexDirection: 'column-reverse' }}>
                    <Orders />
                </ScrollView>
                <View style={Style.navBar}>
                    <View style={Style.button}>
                        <Image style={Style.logo} source={require('/assets/mobile-phone.png')} />
                    </View>
                    <View style={[Style.button, { backgroundColor: '#5a5a69' }]}>
                        <Image style={Style.logo} source={require('/assets/statistics.png')} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const Style = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
    },
    analyser: {
        flexDirection: 'column-reverse',
        alignItems: 'center',
        flex: 1,
    },
    button: {
        backgroundColor: '#8c8ca1',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'column',
        backgroundColor: '#f5f5ff',
    },
    logo: {
        height: 40,
        width: 40
    },
    navBar: {
        backgroundColor: 'grey',
        height: 50,
        flexDirection: 'row',
    },
});