import React,{useState,useEffect} from 'react';
import { SafeAreaView, View, TextInput, FlatList, Button, StyleSheet, Text, Image, TouchableOpacity,Modal } from 'react-native';

import { API, graphqlOperation } from 'aws-amplify'
import { createOrder } from '../src/graphql/mutations'

const order = { odrName: 'order 5', Dishqty: 3, Time: "00:24:46P", Dish: ["PAIN NAAN", "KADAI PANEER", "IDLY"], Qty: [5, 6, 2], PrepTime: ["3", "10", "2"], Chefcolor: ["green", "red", "purple"], Done: [false, false, false], Note: ["hello", "hi", ""] }

const dishList = [['ANDHRA SPICY DOSA'], ['BHEL PURI', 'BUTTER DOSA', 'BUTTER MSL DOSA', 'BHINDI Fry.2028BHINDI MASALA', 'BOMBAY PAV BHAJI'],['CHILLY CHZ DOSA', 'Chilly cheese dosa', 'Cheese & vegetable Uthappam ', 'CURD RICE', 'CHANNA MASALA', 'Channa batura', 'Cheese & vegetable Uthappam '], ['DAHI VADA', 'DAL MASALA '], ['Extra RAITHA', 'EXTRA BATURA', 'EXTRA RICE'], [], ['GHEE ROAST', 'Gobi mutter masala', 'Gobi manchurian', 'Ghee cone dosa'], [], ['IDLY', 'Idly Vada'], ['Jeera Rice'], ['Kothamalli dosa', 'KADAI PANEER'], [], ['MEDU VADA', 'MASALA DOSA ', 'MYSORE MSL DOSA', 'MIX VEG UTHAPPAM', 'MUSHROOM MTR MSL', 'MUTTER PANEER', 'Malabar paratha (1PC)', 'Molagapodi', 'Mini puri with potato '], [], ['ONION KARA PODI DO', 'ONION RAVA', 'ONI-CHILY UTHAPAM.2028ON-TOM-CHILLY UTHA', 'ONION UTHAPPAM', 'Onion - Kara Uthappam'], ['PLAIN DOSA', 'PANEER DOSA', 'PANEER MSL DOSA', 'Pavbhaj masala dosa', 'PAPER DOSA', 'Paper masala dosa', 'PLAIN RAVA ', 'PLAIN UTHAPPAM', 'Paneer & peas uthappam', 'Pineapple & chilly Uthappam', 'Paneer butter masala', 'PANEER CHILLY ', 'Paneer makhani', 'Paneer palak', 'PLAIN YOGURT', 'PURI W/SPICY POTATO', 'PURI ( 1 PC )'], [], [], ['SAMBAR IDLY', 'SAMBAR VADAa', 'SAMOSA CHAT', 'SPL CHILI BAJJI', 'SET DOSA', 'Sada Mysore dosa', 'SPINACH MSL DOSA', 'Spinach paneer dosa', 'SPL RAVA MASALA ', 'Spicy masala Uthappam ', 'SAAG ALOO', 'SAAG PANEER', 'Special Paratha with korma', 'SO1.papad'], ['Teddy bear dosa'], [], ['VEG. SAMOSA', 'VEG KORMA'], [], [], ['YELLOW DAL FRY']];

function Editor ({navigation, route}) {

  const [DATA,setDATA] = useState([]);
  let [SeachList,setSeachList] = useState([]);
  const [AdderVisible, setAdderVisible] = useState(false);
  const [NoteditVisible, setNoteditVisible] = useState(false);
  const [TextSearch, setTextSearch] = useState('');
  const [Notedit, setNotedit] = useState({name:'',no:0});

  useEffect(()=>{
    let Temp=[];
    for(let i=0;i<route.params.Dish.length;i++){
      Temp.push({title:route.params.Dish[i],id:i,qty:route.params.Qty[i],notes:route.params.Note[i]});
    }
    setDATA(Temp);
  },[]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.topBarButton}>
            <Button onPress={()=>setAdderVisible(!AdderVisible)} title="ADD" color="#8c8ca1"/>
        </View>
      ),
    });
  }, [navigation]);

  async function onComplete() {
    const Dishes=[];
    const Qty=[];
    const Notes=[];
    const Color=[];
    const Done=[];
    for(let i =0 ; i<DATA.length; i++){
        Dishes.push(DATA[i].title);
        Qty.push(DATA[i].qty);
        Notes.push(DATA[i].notes);
        Done.push(false);
        DATA[i].notes==""?Color.push('blue'):Color.push('red');
    }
    try {
      await API.graphql(graphqlOperation(createOrder, {input: {
        odrName: route.params.odrName,
        Time: route.params.Time,
        Date: route.params.Date,
        Dish: Dishes,
        Qty: Qty, 
        PrepTime: [0], //future code
        Color: Color,
        Done: Done,
        Note: Notes,
        Workerno: [0], //futur code
          }}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
    navigation.navigate("Bar");
  }
  
  const dishItem = ({ item , index, separators }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={{ height:30, width:100, margin:5, paddingHorizontal:5 }}
        onPress={()=>{
          if(DATA.length!=0){
            DATA.push({title:item.title,id:DATA[DATA.length-1].id+1,qty:1,notes:''});
          }
          else{
            DATA.push({title:item.title,id:0,qty:1,notes:''});
          }
          setAdderVisible(!AdderVisible);
        }}
      >
        <Text style={styles.textStyle}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  )
  const renderItem = ({ item , index, separators }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={ styles.buttonLeft }
        onPress={()=>setDATA(prevState => {
          prevState[index].qty=prevState[index].qty+1;
          return [...prevState];
        })}>
        <Image source={require('../src/Assets/plus.png')} style={styles.stretch} />
      </TouchableOpacity>
      <TouchableOpacity
        style={ styles.buttonLeft }
        onPress={()=>{
            if(DATA[index].qty==1)
            {
                setDATA(DATA.filter((v,i)=>i!=index));
            }
            else{
                setDATA(prevState => {
                prevState[index].qty=prevState[index].qty-1;
                return [...prevState];
                });
            }  
          }
        } >
        <Image source={require('../src/Assets/minus.png')} style={styles.stretch} />
      </TouchableOpacity>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.qty}>
        <Text>{item.qty}</Text>
      </View>
      <TouchableOpacity
        style={ styles.buttonRight }
        onPress={()=>{
          setNotedit({name:item.notes,no:index});
          setNoteditVisible(true);
        }}>
        <Image source={require('../src/Assets/edit.png')} style={styles.stretch} />
      </TouchableOpacity>
    </View>
  );

  if(AdderVisible){
    
    SeachList=[];
    if(TextSearch.length!=0&&dishList[TextSearch.charCodeAt(0)-65]!=undefined){
      if(TextSearch.length==1){
        for(let i=0;i<dishList[TextSearch.charCodeAt(0)-65].length;i++){
          SeachList.push({title:dishList[TextSearch.charCodeAt(0)-65][i],id:i});
        }
      }
      else{
        for(let i=0;i<dishList[TextSearch.charCodeAt(0)-65].length;i++){
          for(let j=0;j<TextSearch.length;j++){
            if(TextSearch[j]==dishList[TextSearch.charCodeAt(0)-65][i][j]){
              if(j==TextSearch.length-1){
                SeachList.push({title:dishList[TextSearch.charCodeAt(0)-65][i],id:i});
              }
              else{
                continue;
              }
            }
            else{
              break;
            }
          }
        }
      }
    }
  }


  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={AdderVisible}
        onRequestClose={() => {
          setAdderVisible(!AdderVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Find Dish!</Text>
            <TextInput
              style={{ height: 30, 
              backgroundColor:'lightgrey', 
              paddingHorizontal:5, 
              marginBottom:10,
              }}
              onChangeText={text => setTextSearch(text)}
              placeholder="Enter Dish"
              value={TextSearch}
            />
            <FlatList
              data={SeachList}
              renderItem={dishItem}
              keyExtractor={item => item.id.toString()}
            />
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setAdderVisible(!AdderVisible);
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={NoteditVisible}
        onRequestClose={() => {
          setNoteditVisible(!NoteditVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Edit Note!</Text>
                <TextInput
                  style={{ height: 30, 
                  backgroundColor:'lightgrey', 
                  paddingHorizontal:5, 
                  marginBottom:10,
                  }}
                  onChangeText={text =>{ 
                    setNotedit({name:text,no:Notedit.no});
                  }}
                  value={Notedit.name}
                  placeholder = "Enter Note"
                />
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setNoteditVisible(!NoteditVisible);
                setDATA(prevState => {
                  prevState[Notedit.no].notes=Notedit.name;
                  return [...prevState];
                })
              }}
            >
              <Text style={styles.textStyle}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <Button onPress={onComplete} title='Done' color="#8c8ca1"/>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonLeft:{
    width:50,
    height:50,
    marginRight:10,
    borderRadius:5,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:'rgba(256,256,256,0.4)'
  },
  buttonRight:{
    width:50,
    height:50,
    marginLeft:10,
    borderRadius:7,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:'rgba(256,256,256,0.4)'
  },
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#bfb8ac',
    padding: 10,
    flexDirection:"row",
    alignItems:"center",
    marginVertical: 2,
    marginHorizontal: 2,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  qty: {
    backgroundColor:'rgba(256,256,256,0.6)',
    width:30,
    height:30,
    borderRadius:15,
    alignItems:"center",
    justifyContent:"center",
  },
  stretch: {
    width: 40,
    height: 40,
    resizeMode: 'stretch',
  },
  title: {
    fontSize: 24,
    flex:1,
  },
  topBarButton: {
    paddingRight: 10,
  },
});

export default Editor;