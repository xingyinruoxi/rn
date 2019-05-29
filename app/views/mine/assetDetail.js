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
import {assetDetailPageStyle} from './../../styles/mine/assetDetailStyle';
import VLine from './../../commons/vLine';
import Line from './../../commons/line';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import Util,{ Grow } from './../../commons/util';
import EAlert from './../components/ealert';
import MineHeader from '../components/commonHeader';
import Login from './../components/login';
import HeaderLeftButton from './../components/headerLeftButton';
import {leftButtonStyle} from './../../styles/common/leftButtonStyle';
export default class AssetDetail extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.state = {
            isRefreshing: false,
            userInfo: null,
            accountData: null
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
        this.setState({
            accountData: this.props.navigation.state.params.accountData
        });
			
    };
    render() {
        let accountData = this.state.accountData;
        return (
            <View style={assetDetailPageStyle.container}>
                <MineHeader title="总资产明细" color="#006EEE"leftButton leftIcon goBack root={this} navigation={this.props.navigation}/>
                <View style={assetDetailPageStyle.contentBox}>
									<ScrollView>
										<View style={assetDetailPageStyle.assetBox}>
											<View style={assetDetailPageStyle.totalAssetBox}>
												<Text allowFontScaling={false} style={assetDetailPageStyle.accountMoneyTitle}>账户总资产(元)</Text>
												<Text allowFontScaling={false} style={assetDetailPageStyle.accountMoney}>{accountData ? Util.thousandBitSeparator(accountData.accountMoney.toFixed(2)) : "0.00"}</Text>
											</View>
											<View style={assetDetailPageStyle.avaBox}>
												<View style={assetDetailPageStyle.avaBoxLeft}>
													<Text allowFontScaling={false} style={assetDetailPageStyle.userAccountNumTitle}>可用余额(元)</Text>
													<Text allowFontScaling={false} style={assetDetailPageStyle.userAccountNum}>{
														accountData ?
															Util.thousandBitSeparator(accountData.vaildMoney.toFixed(2))
															:
															"0.00"
													}</Text>

												</View>
												<VLine color="#e8e8e8" height={40}/>
												<View style={assetDetailPageStyle.avaBoxLeft}>
													<Text allowFontScaling={false} style={assetDetailPageStyle.userAccountNumTitle}>冻结余额(元)</Text>
													<Text allowFontScaling={false} style={assetDetailPageStyle.userAccountNum}>{
														accountData ?
															Util.thousandBitSeparator(accountData.freezeMoney.toFixed(2))
															:
															"0.00"
													}</Text>

												</View>
											</View>
										</View>
										<Line/>
										<View style={[assetDetailPageStyle.profitBox,assetDetailPageStyle.profitBoxSp]}>
											<View style={assetDetailPageStyle.comeInItemBox}>
												<Text allowFontScaling={false} style={assetDetailPageStyle.comeInBoxNumTitle}>待收金额</Text>
												<Text allowFontScaling={false} style={assetDetailPageStyle.packetNum}>{
													accountData ?
														Util.thousandBitSeparator(accountData.dueInMoney.toFixed(2))
														:
														"0.00"
												}元</Text>
											</View>
										</View>
										<Line/>
										<View style={assetDetailPageStyle.profitBox}>
											<View style={assetDetailPageStyle.comeInItemBox}>
												<Text allowFontScaling={false} style={assetDetailPageStyle.comeInBoxNumTitle}>待收本金</Text>
												<Text allowFontScaling={false} style={assetDetailPageStyle.packetNum}>{
													accountData ?
														Util.thousandBitSeparator(accountData.rescPlanPrin.toFixed(2))
														:
														"0.00"
												}元</Text>
											</View>
										</View>
										<Line/>
										<View style={assetDetailPageStyle.profitBox}>
											<View style={assetDetailPageStyle.comeInItemBox}>
												<Text allowFontScaling={false} style={assetDetailPageStyle.comeInBoxNumTitle}>待收收益</Text>
												<Text allowFontScaling={false} style={assetDetailPageStyle.packetNum}>{
													accountData ?
														Util.thousandBitSeparator(accountData.rescPlanInte.toFixed(2))
														:
														"0.00"
												}元</Text>
											</View>
										</View>

										<View style={[assetDetailPageStyle.profitBox,assetDetailPageStyle.profitBoxSp]}>
											<View style={[assetDetailPageStyle.comeInItemBox]}>
												<Text allowFontScaling={false} style={assetDetailPageStyle.comeInBoxNumTitle}>可用红包</Text>
												<Text allowFontScaling={false} style={assetDetailPageStyle.packetNum}>{
													accountData ?
														Util.thousandBitSeparator(accountData.redPacketSum.toFixed(2))
														:
														"0.00"
												}元</Text>
											</View>
										</View>
										<Line/>
										<View style={assetDetailPageStyle.profitBox}>
											<View style={[assetDetailPageStyle.comeInItemBox]}>
												<Text allowFontScaling={false} style={assetDetailPageStyle.comeInBoxNumTitle}>红包已使用</Text>
												<Text allowFontScaling={false} style={assetDetailPageStyle.packetNum}>{
													accountData ?
														Util.thousandBitSeparator(accountData.usedPacketSum.toFixed(2))
														:
														"0.00"
												}元</Text>
											</View>
										</View>

										<View style={[assetDetailPageStyle.profitBox,assetDetailPageStyle.profitBoxSp]}>
											<View style={assetDetailPageStyle.comeInItemBox}>
												<Text allowFontScaling={false} style={assetDetailPageStyle.comeInBoxNumTitle}>净赚取收益</Text>
												<Text allowFontScaling={false} style={assetDetailPageStyle.packetNum}>{
													accountData ?
														Util.thousandBitSeparator(accountData.netIncome.toFixed(2))
														:
														"0.00"
												}元</Text>
											</View>
										</View>
										<Line/>
										{
											this.state.showTotal ?
												<View>
													<View style={assetDetailPageStyle.profitBox}>
														<View style={[assetDetailPageStyle.comeInItemBox]}>
															<Text allowFontScaling={false} style={assetDetailPageStyle.comeInBoxNumTitle}>充值总额</Text>
															<Text allowFontScaling={false} style={assetDetailPageStyle.packetNum}>{
																accountData && accountData.investSum && parseFloat(accountData.investSum) > 0?
																	Util.thousandBitSeparator(parseFloat(accountData.investSum).toFixed(2))
																	:
																	"0.00"
															}元</Text>
														</View>
													</View>
													<Line/>
													<View style={assetDetailPageStyle.profitBox}>
														<View style={[assetDetailPageStyle.comeInItemBox]}>
															<Text allowFontScaling={false} style={assetDetailPageStyle.comeInBoxNumTitle}>提现总额</Text>
															<Text allowFontScaling={false} style={assetDetailPageStyle.packetNum}>{
																accountData && accountData.withDrawSum && parseFloat(accountData.withDrawSum) > 0?
																	Util.thousandBitSeparator(parseFloat(accountData.withDrawSum).toFixed(2))
																	:
																	"0.00"
															}元</Text>
														</View>
													</View>
													<View style={assetDetailPageStyle.reminderBox}>
														<Text style={assetDetailPageStyle.reminder}>统计纬度自2014年9月26日至今</Text>
													</View>
												</View>
												:
												null
										}

									</ScrollView>

                </View>
                <EAlert ref={(ref) => this.eAlert = ref}/>
            </View>
        );
    }
}