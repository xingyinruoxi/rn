/**
 * Created by liuzhenli on 2017/7/14.
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
import {phoneCertifyPageStyle} from './../../../styles/mine/setting/phoneCertifyStyle';
import EAlert from './../../components/ealert';
import Loading from './../../components/loading';
import MineHeader from '../../components/commonHeader';
import Button from './../../components/button';
import Line from './../../../commons/line';
import { Grow } from './../../../commons/util';
import Fetch from './../../../commons/fetch';
export default class PhoneCertify extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.state = {
            phone: this.props.navigation.state.params.phone,
            getSmsCodeStatus: 1,
        }
    };
    componentWillMount(){

    };
    getMsg(){
        this.props.navigation.navigate('resetPhone',{backKey: this.props.navigation.state.params.backKey,phone: this.state.phone})
    }
    render() {

        return (
            <View style={phoneCertifyPageStyle.container}>
                <MineHeader title="手机认证" leftButton leftIcon goBack navigation={this.props.navigation}/>
                <View style={phoneCertifyPageStyle.contentBox}>
                    <View activeOpacity={0.7} style={phoneCertifyPageStyle.itemBox}>
                        <View style={[phoneCertifyPageStyle.labelTextBox]}>
                            <Text allowFontScaling={false} style={phoneCertifyPageStyle.labelText}>当前认证手机号</Text>
                        </View>
                        <View style={[phoneCertifyPageStyle.labelTextBox,phoneCertifyPageStyle.labelTextBoxRight]}>
                            <Text allowFontScaling={false} style={phoneCertifyPageStyle.labelTextRight}>{this.state.phone && this.state.phone.replace(/(\d{3})\d{4}(\d{4})/,"$1****$2")}</Text>
                        </View>
                    </View>
                    <Line/>
                    <View style={phoneCertifyPageStyle.buttonBox}>
                        <Button buttonName="修改手机号" onPress={() => this.getMsg()}/>
                    </View>
                </View>
                <EAlert ref={ref => this.eAlert = ref}/>
                <Loading ref={ref => this.loading = ref}/>
            </View>
        );
    }
}