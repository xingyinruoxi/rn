/**
 * Created by liuzhenli on 2017/8/21.
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
    Linking
} from 'react-native';
import {stockAccountPageStyle} from './../../../styles/mine/stockAccountStyle';
import EAlert from './../../components/ealert';
import { Grow } from './../../../commons/util';
import MineHeader from '../../components/commonHeader';
var Fetch = require('./../../../commons/fetch') ;
const {systemInfos} = require('./../../../commons/config');
export default class MyBankCard extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.state = {
            bankNo: this.props.navigation.state.params.bankNo,
            backCardInfo: null
        }
    };
    componentWillMount(){
        Fetch.post('withdrawal/getBKAccountInfo1',{bankAccount: this.state.bankNo},res => {
            console.log('getBKAccountInfo',res)
            if(res.success){
                this.setState({
                    backCardInfo: res.body
                });
            }
        },error => {

        },null,this)
    };
    toCell(){
        Linking.openURL('tel://'+systemInfos.customer_service_tel_num)
    }
    render() {
        let backCardInfo  = this.state.backCardInfo;
        return (
            <View style={stockAccountPageStyle.container}>
                <MineHeader title="我的银行卡" leftButton leftIcon goBack navigation={this.props.navigation}/>
                <View style={stockAccountPageStyle.contentBox}>
                    <View style={stockAccountPageStyle.bankAccountBox}>
                        <Image style={stockAccountPageStyle.cardBg} source={require('./../../../imgs/mine/bankCardBgImg.png')}>
                            <View style={stockAccountPageStyle.cardTitleBox}>
                                <View style={stockAccountPageStyle.cardType}>
                                    <Text allowFontScaling={false}  style={stockAccountPageStyle.cardTypeTitle}>{backCardInfo ? backCardInfo.bankName : ''}</Text>
                                </View>
                            </View>
                            <View style={stockAccountPageStyle.cardNoBox}>
                                <Text allowFontScaling={false} style={stockAccountPageStyle.cardNo}>{this.state.bankNo.replace(/(\d{4})\d+(\d{4})/,"$1 **** **** $2")}</Text>
                            </View>
                        </Image>
                    </View>
                    <View style={stockAccountPageStyle.remindTitleBox}>
                        <Text allowFontScaling={false} style={stockAccountPageStyle.remindTitle}>移动端暂时不支持解绑银行卡, 如果您需要解绑银行卡, 请去PC端操作。</Text>
                    </View>
                    <View style={stockAccountPageStyle.userAccountBox}>
                       <Text allowFontScaling={false} style={stockAccountPageStyle.bottomRemind}>如果您需要客服的帮助，请拨打</Text>
                       <Text allowFontScaling={false} style={[stockAccountPageStyle.bottomRemind,]}>客服电话:<Text allowFontScaling={false} style={{color:'#025FCB'}} onPress={this.toCell.bind(this)}>{systemInfos.customer_service_tel_num}</Text></Text>
                    </View>
                </View>

                <EAlert ref={(ref) => this.eAlert = ref}/>
            </View>
        );
    }
}