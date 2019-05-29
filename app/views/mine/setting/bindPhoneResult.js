/**
 * Created by liuzhenli on 2017/12/15.
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  StatusBar,
  Image,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import {topUpResultPageStyle} from './../../../styles/mine/topUpResultStyle';
import { NavigationActions } from 'react-navigation';
import EAlert from './../../components/ealert';
import Button from './../../components/button';
import MineHeader from '../../components/commonHeader';
import Util,{ Grow } from './../../../commons/util';
var Fetch = require('./../../../commons/fetch');
var EventEmitter = require('RCTDeviceEventEmitter');
export default class BindPhoneResult extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
    gesturesEnabled:false
  });
  constructor(props){
    super(props);
    this._onPress = this._onPress.bind(this)
  };
  componentWillMount(){

  };
  componentDidMount(){

  }
  _onPress(){
    EventEmitter.emit('getStatus');
    setTimeout(() => EventEmitter.emit('getUserInfo'))
    this.props.navigation.goBack(this.props.navigation.state.params.backKey);
  };
  render() {
    let status = this.props.navigation.state.params.status;
    return (
      <View style={topUpResultPageStyle.container}>
        <MineHeader title={"绑定新手机"}  navigation={this.props.navigation}/>
            <View style={topUpResultPageStyle.contentBox}>
              <View style={[topUpResultPageStyle.contentTopBox,{paddingHorizontal: 14 * Util.pixel}]}>
                <View style={topUpResultPageStyle.contentImgBox}>
                  {
                    status == 'success' ?
                      <Image style={topUpResultPageStyle.contentImg}source={require('./../../../imgs/mine/successImg.png')}/>
                        :
                        <Image style={topUpResultPageStyle.contentImg}source={require('./../../../imgs/mine/failImg.png')}/>
                  }

                </View>
                {
                  status == 'success' ?
                    <Text allowFontScaling={false} style={[topUpResultPageStyle.topUpNum,{textAlign:"center"}]}>手机号绑定成功！</Text>
                    :
                    <Text allowFontScaling={false} style={topUpResultPageStyle.topUpNum}>很抱歉，手机号绑定失败！</Text>
                }

              </View>
              <View style={topUpResultPageStyle.buttonBox}>
                <Button buttonName="确认" onPress={this._onPress}/>
              </View>
            </View>
        <EAlert ref={(ref) => this.eAlert = ref}/>
      </View>
    );
  }
}