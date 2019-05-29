

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  requireNativeComponent,
  Dimensions
} from 'react-native';

import MineHeader from './../components/commonHeader';

var util = require('./../../commons/util');
var ContactsSelectView = requireNativeComponent('ETDContactsSelectView', null);

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


// module.exports = React.createClass({
export default class ContactsSelect extends Component {
  static navigationOptions= {
    header:null
  }
  constructor(props){
    super(props);

  };

  componentWillMount(){

  };

  handleSendFinished(){
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={styles.container}>
        <MineHeader title="邀请好友" leftIcon leftButton goBack navigation={this.props.navigation}/>
        <ContactsSelectView style={ styles.contactsSelectView } shareInfos={this.props.navigation.state.params.infos} onPopSelf={this.handleSendFinished.bind(this)}/>
      </View>
    )
  }

};

const styles = StyleSheet.create({
    container:{
        height: util.size.height - 64 * util.pixel,
        width: util.size.width
    },
      contactsSelectView: {
        height: util.size.height - 64 * util.pixel,
          width: util.size.width
      }
});