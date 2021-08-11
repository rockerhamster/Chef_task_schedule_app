import { RNCamera } from 'react-native-camera';
import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class HelloWorldApp extends Component {
    render() {
        const dishes = ['KADAI PANEER', 'GARLIC NAAN', 'KOTHU PARATHA', 'IDLY', 'PANEER PALAK', 'BHEL PURI'
            , 'YELLOW DAL FRY', 'MASALA DOSA', 'MUTTER PANEER', 'ALOO GOBI MASALA', 'PLAIN NAAN'];
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
                        words = [];
                        order = {
                            Time: '',
                            Date: '',
                            Dish: [],
                            Qty: [],
                            PrepTime: []
                        };
                        console.log('onTextRecognized', data.textBlocks[0]);
                        console.log('onTextRecognized', data.textBlocks[0].value);
                        for (var i = 0; i < data.textBlocks.length; i++) {
                            var temp = data.textBlocks[i].value.split('\n');
                            var temp2 = [];
                            for (var j = 0; j < temp.length; j++) {
                                temp2 = push(temp[j].split(' '));
                            }
                            words.push(temp);
                            // if(temp.includes(':'))
                            // {

                            // }
                            // //get date!!!!
                            // else(temp.includes('2020')||temp.includes('2019'))
                        }
                        // for(var i=0;i<dishes.length;i++)
                        // {
                        //   for(var j=0;j<words.length;j++)
                        //   {
                        //     var Checker = true;
                        //     if(dishes[i].split(' ')[0]==words[j])
                        //     {
                        //       for(k=1;k<dishes[i].length;k++)
                        //       {
                        //         Checker=Checker&&(dishes[i].split(' ')[k]==words[j+k])
                        //       }
                        //       if(!isNaN(dishes[i-1]))
                        //       {
                        //         order.qty.push(dishes[i-1])
                        //       }
                        //       if(Checker)
                        //       {
                        //         if(dishes[i-1]==dishes[i])
                        //         {
                        //           var temp = order.qty[order.qty.length-1]+1;
                        //           order.qty.pop();
                        //           order.qty.push(temp);
                        //         }
                        //         else
                        //         {
                        //           order.dish.push(dishes[i])
                        //         }
                        //       }
                        //     }
                        //   }
                        // }
                    }}
                >
                </RNCamera>
            </View>
        );
    }
}