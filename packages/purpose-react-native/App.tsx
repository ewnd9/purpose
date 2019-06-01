import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';

import * as firebaseOptions from './firebaseWeb.json';

import firebase from 'firebase';
import 'firebase/firestore';

firebase.initializeApp(firebaseOptions);

const firestore = firebase.firestore();
const itemsCollection = firestore.collection('items');

type Props = {};
type State = {
  docs: Array<any> | null;
  input: string;
};

export default class App extends Component<Props, State> {
  state: State = {
    docs: null,
    input: '',
  }

  async componentDidMount() {
    const result = await itemsCollection.orderBy('updatedAt', 'desc').limit(3).get();
    this.setState(() => ({
      docs: result.docs.map(doc => doc.data())
    }));
  }

  inPressSubmit = async () => {
    const id = `item-temp-999`;
    const now = new Date().toUTCString();

    const doc = {
      id,
      text: this.state.input,
      createdAt: now,
      updatedAt: now,
    };

    const itemRef = itemsCollection.doc(id);
    await itemRef.set(doc);

    this.setState(() => ({
      input: '',
    }));
  };

  render() {
    const {docs, input} = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>{docs ? `items ${docs.slice(0, 3).map(doc => doc.text).join('\n')}` : `null`}</Text>

        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={input => this.setState(() => ({input}))}
          value={input}
        />
        <Button
          onPress={this.inPressSubmit}
          title="Submit"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
