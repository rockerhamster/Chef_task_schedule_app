import React, { useRef, useState, useMemo } from 'react';
import { Modal, TouchableHighlight, Text, View, StyleSheet, Animated, Alert, Easing, Dimensions } from 'react-native';

export default function Note(note, setNote) {
    return (
        <View style={Style.center}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={note.notemode}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}>
                <View style={Style.modalView}>
                    <Text>Note : {note.note}</Text>
                    <TouchableHighlight
                        style={{ ...Style.openButton, backgroundColor: "lightgrey" }}
                        onPress={() => {
                            setNote({ notemode: false, note: '' });
                        }}
                    >
                        <Text style={Style.textStyle}>Hide Modal</Text>
                    </TouchableHighlight>
                </View>
            </Modal>
        </View>
    )
}
const Style = StyleSheet.create({
    center: {
        alignItems: "center",
        justifyContent: "center",
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
        elevation: 5,
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    }
});