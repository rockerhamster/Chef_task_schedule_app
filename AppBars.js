import React, {useState, useEffect} from 'react';
import { Button, ScrollView, View, StyleSheet } from 'react-native';

import Amplify from 'aws-amplify'
import config from './aws-exports'
import { API, graphqlOperation} from 'aws-amplify'
import { listOrders } from './src/graphql/queries'
import * as mutations from './src/graphql/mutations';
import * as subscriptions from './src/graphql/subscriptions';

import Order from './Components/Order';
import Note from './Components/Note';

Amplify.configure(config)

export default function Bars({navigation}) {
    const [orders, setOrders] = useState([]);
    const [note, setNote] = useState({ notemode: false, note: '' });

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <View style={Style.button}>
                <Button onPress={undoButton} title="Undo" color="#8c8ca1"/>
            </View>
          ),
        });
      }, [navigation]);

    useEffect(() => {
        fetchOrders();
        subscribe();
        return () => {Subscription.unsubscribe();}
      }, [])

    function subscribe(){
        const Subscription = API.graphql(
        graphqlOperation(subscriptions.onChangeOrder)
        ).subscribe({
        next: () => {
            fetchOrders();
        }
        });
    }

    async function fetchOrders() {
        try {
            //optimizations
            //1. Only get Done from dynamodb on update and single orders on create
            //2. Check if Done update is done on same device
            const spliceCoordinates = [0,2,3,5,6,8];
            const orderData = await API.graphql(graphqlOperation(listOrders))
            let Orders = orderData.data.listOrders.items
            Orders=Orders.filter(e => !e.Done.every(e => e))
            for (let i = 0; i < Orders.length-1; i++){
                for (let j = 0; j < Orders.length-i-1; j++){
                    if (istimeGreater(Orders[j].Time, Orders[j+1].Time, spliceCoordinates))
                    {
                        let temp = Orders[j];
                        Orders[j] = Orders[j+1];
                        Orders[j+1] = temp;
                    }
                }
            } 
            setOrders(Orders);
        } catch (err) { console.log('error fetching todos') }
    }

    async function updateOrders(id, Done) {
    try {
        await API.graphql(graphqlOperation(mutations.updateOrder, {input: {
        id: id,
        Done: Done,
            }}))
    } catch (err) {
        console.log('error updating order:', err)
        }
    }
    
    async function undoButton(){
    try {
        //optimizations
        //1.callonly Done orders
        const orderData = await API.graphql(graphqlOperation(listOrders))
        const Orders = orderData.data.listOrders.items
        const spliceCoordinates = [11, 13, 14, 16, 17, 19 ];
        let Temp = {value:"0000-00-00T00:00:00.000Z",i:-1};
        let Condition
        Orders.forEach((e,i) => {
            Condition = istimeGreater(e.updatedAt, Temp.value, spliceCoordinates) && e.Done.every(x=>x);
            Temp.value = Condition ? e.updatedAt : Temp.value
            Temp.i = Condition ? i : Temp.i
        });
        Temp.value != "0000-00-00T00:00:00.000Z" ? 
        updateOrders(Orders[Temp.i].id,Orders[Temp.i].Done.map(e => false)) :
        null;
    } catch(err){
        console.log('error getting orders from undo:', err)
        }
    }

    function istimeGreater(time1, time2, spliceCoordinates){
        a=spliceCoordinates[0];
        b=spliceCoordinates[1];
        c=spliceCoordinates[2];
        d=spliceCoordinates[3];
        e=spliceCoordinates[4];
        f=spliceCoordinates[5];
        let temp = parseInt(time1.slice(a,b))*10000+parseInt(time1.slice(c,d))*100+parseInt(time1.slice(e,f));
        let temp2 = parseInt(time2.slice(a,b))*10000+parseInt(time2.slice(c,d))*100+parseInt(time2.slice(e,f));
        return(temp>temp2);
    }
    

    const Orders = () => {
        let ordersjsx = []
        for (let i = 0; i < orders.length; i++) {
            ordersjsx.push(
            <Order 
                key={i.toString()}
                orders={orders} 
                setOrders={setOrders} 
                setNote={setNote}
                orderno={i}
            />);
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
                <ScrollView style={{ flexDirection: 'column-reverse' }}>
                    <Orders />
                </ScrollView>
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
        paddingRight: 10,
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