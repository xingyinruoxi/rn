/**
 * Created by liuzhenli on 2017/7/11.
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
import {repayCalenderPageStyle} from './../../styles/mine/repayCalenderStyle';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import EAlert from './../components/ealert';
import { Grow } from './../../commons/util';
import MineHeader from '../components/commonHeader';
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
            <View style={repayCalenderPageStyle.container}>
                <MineHeader title="还款日历" leftButton leftIcon goBack navigation={this.props.navigation}/>
                    <View style={repayCalenderPageStyle.userInfoBox}>
                        
                    </View>
                <EAlert ref={(ref) => this.eAlert = ref}/>
            </View>
        );
    }
}