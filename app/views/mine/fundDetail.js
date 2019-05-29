/**
 * Created by liuzhenli on 2017/7/17.
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
import {fundDetailPageStyle} from './../../styles/mine/funDetailStyle';
import MineHeader from './../components/commonHeader';
import Line from './../../commons/line';
import Util,{ Grow } from './../../commons/util';
export default class FundDetail extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    render() {
        let data = this.props.navigation.state.params.data;
        let date = Util.getDate(data.fufCreateTime,true,true);
        return (
            <View style={fundDetailPageStyle.container}>
                <MineHeader title="资金详情" leftButton leftIcon goBack navigation={this.props.navigation}/>
                <View style={fundDetailPageStyle.contentBox}>
                    <View activeOpacity={0.7} style={[fundDetailPageStyle.itemBox,fundDetailPageStyle.cancelMB]}>
                        <View style={[fundDetailPageStyle.labelTextBox]}>
                            <Text allowFontScaling={false} style={fundDetailPageStyle.labelText}>类型：</Text>
                        </View>
                        <View style={[fundDetailPageStyle.labelTextBox,fundDetailPageStyle.labelTextBoxRight]}>
                            <Text allowFontScaling={false} style={[fundDetailPageStyle.labelTextRight,{color:'#025FCC'}]} numberOfLines={1}>{data.fufTypeName}</Text>
                        </View>
                    </View>
                    <Line full/>
                    <View activeOpacity={0.7} style={[fundDetailPageStyle.itemBox,fundDetailPageStyle.cancelMB]}>
                        <View style={[fundDetailPageStyle.labelTextBox]}>
                            <Text allowFontScaling={false} style={fundDetailPageStyle.labelText}>时间：</Text>
                        </View>
                        <View style={[fundDetailPageStyle.labelTextBox,fundDetailPageStyle.labelTextBoxRight]}>
                            <Text allowFontScaling={false} style={fundDetailPageStyle.labelTextRight}>{date}</Text>
                        </View>
                    </View>
                    <Line full/>
                    <View activeOpacity={0.7} style={[fundDetailPageStyle.itemBox,fundDetailPageStyle.cancelMB]}>
                        <View style={[fundDetailPageStyle.labelTextBox]}>
                            <Text allowFontScaling={false} style={fundDetailPageStyle.labelText}>流水号：</Text>
                        </View>
                        <View style={[fundDetailPageStyle.labelTextBox,fundDetailPageStyle.labelTextBoxRight]}>
                            <Text allowFontScaling={false} style={fundDetailPageStyle.labelTextRight}>{data.fufId}</Text>
                        </View>
                    </View>
                    <Line full/>
                    <View activeOpacity={0.7} style={[fundDetailPageStyle.itemBox,fundDetailPageStyle.cancelMB]}>
                        <View style={[fundDetailPageStyle.labelTextBox]}>
                            <Text allowFontScaling={false} style={fundDetailPageStyle.labelText}>金额：</Text>
                        </View>
                        <View style={[fundDetailPageStyle.labelTextBox,fundDetailPageStyle.labelTextBoxRight]}>
                            <Text allowFontScaling={false} style={[fundDetailPageStyle.labelTextRight,{color:'#025FCB'}]}>{Util.thousandBitSeparator(parseFloat(data.fufSumYuan).toFixed(2))}元</Text>
                        </View>
                    </View>
                    <Line full/>
                    <View activeOpacity={0.7} style={[fundDetailPageStyle.itemBox,fundDetailPageStyle.cancelMB]}>
                        <View style={[fundDetailPageStyle.labelTextBox]}>
                            <Text allowFontScaling={false} style={fundDetailPageStyle.labelText}>状态：</Text>
                        </View>
                        <View style={[fundDetailPageStyle.labelTextBox,fundDetailPageStyle.labelTextBoxRight]}>
                            <Text allowFontScaling={false} style={fundDetailPageStyle.labelTextRight}>交易成功</Text>
                        </View>
                    </View>
                    <Line full/>
                    <View activeOpacity={0.7} style={[fundDetailPageStyle.itemBoxRemark,fundDetailPageStyle.cancelMB]}>
                        <View style={[fundDetailPageStyle.labelTextBoxRemarks]}>
                            <Text allowFontScaling={false} style={fundDetailPageStyle.labelText}>备注：</Text>
                        </View>
                        <View style={[fundDetailPageStyle.labelTextBox,fundDetailPageStyle.labelTextBoxRight,fundDetailPageStyle.remarksBox]}>
                            <Text allowFontScaling={false} style={[fundDetailPageStyle.labelTextRight,fundDetailPageStyle.remarks]}>{data.fufDesc}</Text>
                        </View>
                    </View>
                    <Line full/>
                </View>
            </View>
        );
    }
}