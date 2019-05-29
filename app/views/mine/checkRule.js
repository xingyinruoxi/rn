/**
 * Created by liuzhenli on 2017/7/12.
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
    TouchableOpacity
} from 'react-native';
import {checkRulePageStyle} from './../../styles/mine/checkRuleStyle';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import EAlert from './../components/ealert';
import MineHeader from '../components/commonHeader';
import { Grow } from './../../commons/util';
export default class RepayCalender extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.state = {
            isRefreshing: false,
            userInfo: null,
            userAccountData: null,
            hideAccountInfo: false
        }
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            })
        });

    };
    componentDidMount(){

    };
    _onRefresh = () => {
        this.setState({
            isRefreshing: true
        });

    };

    routePage(routeName,params){
        this.props.navigation.navigate(routeName,params)
    };
    render() {
        return (
            <View style={checkRulePageStyle.container}>
                <MineHeader title="自动投标规则" leftButton root={this} leftIcon goBack navigation={this.props.navigation}/>
                <View style={checkRulePageStyle.userInfoBox}></View>
                <EAlert ref={(ref) => this.eAlert = ref}/>
            </View>
        );
    }
}