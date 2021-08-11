import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Button, ScrollView, Image, Text, View, StyleSheet, Animated, PanResponder, Easing, Dimensions } from 'react-native';
import Dish from './Dish';


export default function Order({orders, setOrders, setNote, orderno}) {
    const value = useState(new Animated.Value(0))[0];
    let dishes = [];

    const animation = {
        toValue: Dimensions.get('window').width,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.cubic,
    };

    function moveBar(index) {
        Animated.timing(value, animation).start(({ finished }) => {
            value.setValue(0);
            setOrders(orders.filter((v, i) => i != index));
        });
    }
    if (orders[orderno].Done.every(e => e)) {
        moveBar(orderno);
    }
    for (let i = 0; i < orders[orderno].Dish.length; i++) {
    dishes.push(
        <Dish
        key={i.toString()}
        orders={orders} 
        setOrders={setOrders}
        setNote={setNote}
        orderno={orderno}
        dishno={i}
        />);
    }
    return (
        <Animated.View style={[Style.order, { transform:[{translateX:value,translateY: 0}]}]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>
                    {orders[orderno].odrName}
                </Text>
                <Text>
                    {orders[orderno].Time}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                {dishes.map(elem => elem)}
            </View>
        </Animated.View>
    );
}

const Style = StyleSheet.create({
    order: {
        flexDirection: 'column',
        borderTopWidth: 1,
        borderTopColor: '#b3b0bf',
        width: '100%',
    }
});