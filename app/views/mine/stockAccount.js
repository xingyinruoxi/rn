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
import {stockAccountPageStyle} from './../../styles/mine/stockAccountStyle';
import VLine from './../../commons/vLine';
import EAlert from './../components/ealert';
import MineHeader from '../components/commonHeader';
import Util,{ Grow } from './../../commons/util';
export default class StockAccount extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.state = {
            accountData: null,
        }
    };
    componentWillMount(){
        this.setState({
            accountData: this.props.navigation.state.params.accountData
        })
    };
    componentDidMount(){
        console.log(this.state.accountData)
    };
    render() {
        return (
            <View style={stockAccountPageStyle.container}>
                <MineHeader title="徽商银行存管账户" leftButton leftIcon goBack navigation={this.props.navigation}/>
                <View style={stockAccountPageStyle.contentBox}>
                    <View style={stockAccountPageStyle.bankAccountBox}>
                        <Image style={stockAccountPageStyle.cardBg} source={require('./../../imgs/mine/huishangbank.png')}>
                            <View style={stockAccountPageStyle.cardTitleBox}>
                                <View style={stockAccountPageStyle.cardType}>
                                    <Text allowFontScaling={false}  style={stockAccountPageStyle.cardTypeTitle}>电子交易账户</Text>
                                </View>
                            </View>
                            <View style={stockAccountPageStyle.cardNoBox}>
                                <Text allowFontScaling={false} style={stockAccountPageStyle.cardNo}>{this.state.accountData ? this.state.accountData.cardnbr : ''}</Text>
                            </View>
                            <View style={stockAccountPageStyle.cardInfoBox}>
                                <Text allowFontScaling={false} style={stockAccountPageStyle.userName}>开户名：{this.state.accountData.useName ? this.state.accountData.useName.replace(/(\S{1})\S+/,"$1**") : ''}</Text>
                                <Text allowFontScaling={false}  style={stockAccountPageStyle.userName}>开户行：徽商银行股份有限公司</Text>
                            </View>
                        </Image>
                    </View>
                    <View style={stockAccountPageStyle.remindTitleBox}>
                        <Text allowFontScaling={false} style={stockAccountPageStyle.remindTitle}>注：目前可通过徽商电话银行查询您的银行账户信息及资金信息</Text>
                    </View>

                    <View style={stockAccountPageStyle.userAccountBox}>
                        <View style={stockAccountPageStyle.userAccountBoxLeft}>
                            <Text allowFontScaling={false} style={stockAccountPageStyle.userAccountNum}>{
                                this.state.accountData ?
                                    Util.thousandBitSeparator(this.state.accountData.availBal)
                                    :
                                    "0.00"
                            }</Text>
                            <Text allowFontScaling={false} style={stockAccountPageStyle.userAccountNumTitle}>账户余额（元）</Text>
                        </View>
                        <VLine color="#E9E9E9" height={36}/>
                        <View style={stockAccountPageStyle.userAccountBoxLeft}>
                            <Text allowFontScaling={false} style={stockAccountPageStyle.userAccountNum}>{
                                this.state.accountData ?
                                    Util.thousandBitSeparator(this.state.accountData.currBal)
                                    :
                                    "0.00"
                            }</Text>
                            <Text allowFontScaling={false} style={stockAccountPageStyle.userAccountNumTitle}>可用余额（元）</Text>
                        </View>
                    </View>
                </View>

                <EAlert ref={(ref) => this.eAlert = ref}/>
            </View>
        );
    }
}