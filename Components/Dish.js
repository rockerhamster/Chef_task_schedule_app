import React, { useRef, useState, useMemo } from 'react';
import { Button, ScrollView, Alert, Text, View, StyleSheet, Animated, PanResponder, Easing, Dimensions } from 'react-native';

import { API, graphqlOperation} from 'aws-amplify'
import * as mutations from '../src/graphql/mutations';

export default function Dish({orders, setOrders, setNote, orderno, dishno}) {

    const pan = useRef(new Animated.Value(0)).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => { },
            onPanResponderMove: Animated.event([
                null,
                
                { dy: pan }
            ], { useNativeDriver:false }),
            onPanResponderRelease: (event, gestureState) => {
                if (orders[orderno].Done[dishno] == false) {
                    if (gestureState.dy > -5 && gestureState.dy < 5) {
                        if (orders[orderno].Note[dishno] != '') {
                            setNote({ notemode: true, note: orders[orderno].Note[dishno] })
                        }
                        Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
                    }
                    else if (gestureState.dy < -100) {
                        Animated.spring(pan, { toValue: -100, useNativeDriver: true }).start();
                        const Done = orders[orderno].Done;
                        Done[dishno] = true;
                        onUpdate(orders[orderno].id,Done);
                        setOrders(prevState => {
                            prevState[orderno].Done[dishno] = true;
                            return [...prevState];
                        })
                    }
                    else {
                        Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
                    }
                }
                else {
                    if (gestureState.dy > 80) {
                        Animated.spring(pan, { toValue: 100, useNativeDriver: true }).start();
                        const Done = orders[orderno].Done;
                        Done[dishno] = false;
                        onUpdate(orders[orderno].id,Done);
                        setOrders(prevState => {
                            prevState[orderno].Done[dishno] = false;
                            return [...prevState];
                        })
                    }
                    else {
                        Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
                    }
                }
            }
        })
    ).current;

    const animstyle = {
        opacity: pan.interpolate({
            inputRange: [-100, 0, 100], outputRange: [0, 1, 1]
        })
    }
    const dishstyle = {
        height: 100,
        backgroundColor: orders[orderno].Color[dishno],
    }

    async function onUpdate(id, Done) {
        try {
          await API.graphql(graphqlOperation(mutations.updateOrder, {input: {
            id: id,
            Done: Done,
              }}))
        } catch (err) {
          console.log('error creating todo:', err)
        }
      }

    if (orders[orderno].Done[dishno]) {
        animstyle.opacity = pan.interpolate({
            inputRange: [-100, 0, 100], outputRange: [0, 0, 1]
        })
    }

    return (
        <View>
            <View style={[Style.order, dishstyle, {
                position: 'absolute',
                backgroundColor: '#e4e7f2',
                flexDirection: 'column',
                alignItems: 'center',
            }]}>
                <Text style={[Style.text, {
                    color: 'black',
                    borderBottomWidth: 1,
                    paddingBottom: 1,
                    borderBottomColor: "grey"
                }]}
                >Done </Text>
                <Text style={[Style.text, { color: 'black', paddingTop: 5 }]}>{orders[orderno].Dish[dishno]}</Text>
            </View>
            <Animated.View
                style={animstyle}
                {...panResponder.panHandlers}
            >
                <View style={[Style.order, dishstyle]}>
                    <Text style={Style.text}>{orders[orderno].Dish[dishno]}</Text>
                    <View style={Style.qty}>
                        <Text style={Style.text}>{orders[orderno].Qty[dishno]}</Text>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}

const Style = StyleSheet.create({
    text: {
        color: 'white',
        textAlign: 'center',
    },
    qty: {
        backgroundColor:'rgba(255,255,255,0.5)',
        height: 20,
        width: 20,
        borderRadius:10,
    },
    order: {
        width: 60,
        height: 50,
        marginLeft: 10,
        marginBottom: 10,
        backgroundColor: 'blue',
        borderRadius: 6,
        borderColor: 'black',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
    },
});