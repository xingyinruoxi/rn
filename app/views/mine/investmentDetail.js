/**
 * Created by liuzhenli on 2017/7/21.
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
    FlatList,
    InteractionManager
} from 'react-native';
import {investmentDetail} from './../../styles/mine/funDetailStyle';
import MineHeader from './../components/commonHeader';
import Line from './../../commons/line';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
var Fetch = require('./../../commons/fetch');
import Util,{ Grow } from './../../commons/util';
import Loading from './../components/loading';
import EAlert from './../components/ealert';
export default class InvestmentDetail extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.state = {
            userInfo: null,
            detailInfo: null,
            type: this.props.navigation.state.params.type
        };
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            })
        });

    };
    componentDidMount(){
        this.loading && this.loading.show();
        InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
                this.getData();
            })
        });
    }
    getData(){
        let params = this.props.navigation.state.params.data;
        let data = this.state.type == 'transfer' ?{
            useId: __useId,
            claTransId: params.claTransId,
            sessionId: __sessionId,
        } :{
            useId: __useId,
            sessionId: __sessionId,
            claModifyTime: params.claModifyTime,
            claId: params.claId,
            rsbId: params.claScheduleBorrower,
        };
        this.loading && this.loading.show();
        let url = this.state.type == 'transfer' ? 'transfer/myTransferDetail' : 'investor/queryDetail';
        console.log('this.state.type',this.state.type)
        console.log('data',data)
        Fetch.post(url,data,res => {
            this.loading && this.loading.hide();
            console.log('res',res);
            if(res.success){
                this.setState({detailInfo: res.body})
            }else{
                this.eAlert.show('alert',res.info)
            }
        },error => {
			this.loading && this.loading.show('netFail','网络超时',2000)
        },null,this,this.getData.bind(this))
    };
    _keyExtractor = (item, index) => {
        return index;
    };
    renderItems({item}){
        console.log('item',item)
        let LocalDate = new Date(Number(item.rescPlanDate));
        let date = LocalDate.getFullYear() + "-" + ((parseInt(LocalDate.getMonth()) + 1 ) >= 10 ? (parseInt(LocalDate.getMonth()) + 1 ) : "0" + (parseInt(LocalDate.getMonth()) + 1 )) + "-" + (LocalDate.getDate() >= 10 ?  LocalDate.getDate() : '0' +  LocalDate.getDate());
        return(
            <View>
                <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                    <View style={[investmentDetail.labelTitleBoxLeft]}>
                        <Text allowFontScaling={false} style={investmentDetail.labelTextItemRight}>{date}</Text>
                    </View>
                    <View style={[investmentDetail.labelTitleBoxCenter]}>
                        <Text allowFontScaling={false} style={[investmentDetail.labelTextRight,{textAlign:'center'}]}>{item ? Util.thousandBitSeparator(item.rescPlanSumYuan.toFixed(2)) : ""}元</Text>
                    </View>
                    <View style={[investmentDetail.labelTitleBoxRight]}>
                        <Text allowFontScaling={false} style={[investmentDetail.labelTextItemRight,{paddingRight: 5 * Util.pixel,}]}>{item.rescStateFdName}</Text>
                    </View>
                </View>
                <Line full/>
            </View>
        )
    };
    ListHeaderComponent(){
        return(
            <View>
                <View activeOpacity={0.7} style={[investmentDetail.itemBoxItemList,investmentDetail.cancelMB]}>
                    <View style={[investmentDetail.labelTitleBoxLeft]}>
                        <Text allowFontScaling={false} style={investmentDetail.labelText}>收款日期</Text>
                    </View>
                    <View style={[investmentDetail.labelTitleBoxCenter]}>
                        <Text allowFontScaling={false} style={investmentDetail.labelText}>预期本息(元)</Text>
                    </View>
                    <View style={[investmentDetail.labelTitleBoxRight]}>
                        <Text allowFontScaling={false} style={investmentDetail.labelText}>还款状态</Text>
                    </View>
                </View>
                <Line full/>
            </View>
        )
    };
    render() {
        let params =this.state.detailInfo;
        console.log('detailInfo',params)
        return (
            <View style={investmentDetail.container}>
                <MineHeader title={this.state.type == 'transfer' ? "承接详情" : "出借详情"} leftButton leftIcon goBack navigation={this.props.navigation}/>
                {
                    this.state.type == 'transfer' ?
                        <View style={{flex:1}}>
                            <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                <View style={[investmentDetail.labelTextBox]}>
                                    <Text allowFontScaling={false} style={investmentDetail.labelText}>项目名称：</Text>
                                </View>
                                <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                    <Text allowFontScaling={false} style={investmentDetail.labelTextRight} numberOfLines={1}>{params ? params.pptClaimExtendMdl.claDesc : ""}</Text>
                                </View>
                            </View>
                            <Line full/>
                            <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                <View style={[investmentDetail.labelTextBox]}>
                                    <Text allowFontScaling={false} style={investmentDetail.labelText}>承接金额：</Text>
                                </View>
                                <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                    <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? params.pptClaimExtendMdl.claTransSumYuan.toFixed(2) : ""}元</Text>
                                </View>
                            </View>
                            <Line full/>
                            <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                <View style={[investmentDetail.labelTextBox]}>
                                    <Text allowFontScaling={false} style={investmentDetail.labelText}>预期投资回报：</Text>
                                </View>
                                <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                    <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? this.state.detailInfo.expectedNetIncome.toFixed(2) + "元" : ""}</Text>
                                </View>
                            </View>
                            <Line full/>
                            <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                <View style={[investmentDetail.labelTextBox]}>
                                    <Text allowFontScaling={false} style={investmentDetail.labelText}>待收本息：</Text>
                                </View>
                                <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                    <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? Util.thousandBitSeparator(params.pptClaimExtendMdl.surplusProfitYuan.toFixed(2)) : ""}元</Text>
                                </View>
                            </View>
                            <Line full/>
                            <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                <View style={[investmentDetail.labelTextBox]}>
                                    <Text allowFontScaling={false} style={investmentDetail.labelText}>已收本息：</Text>
                                </View>
                                <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                    <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? Util.thousandBitSeparator(params.pptClaimExtendMdl.rsbSumYuan.toFixed(2)) : ""}元</Text>
                                </View>
                            </View>
                            <Line full/>
                            <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                <View style={[investmentDetail.labelTextBox]}>
                                    <Text allowFontScaling={false} style={investmentDetail.labelText}>状态：</Text>
                                </View>
                                <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                    <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? params.pptClaimExtendMdl.claAssigneeHoldStateName : ""}</Text>
                                </View>
                            </View>
                            <View style={investmentDetail.listBox}>
                                {
                                    this.state.detailInfo && this.state.detailInfo.repaymentScheduleList.length > 0?
                                        <FlatList data={this.state.detailInfo.repaymentScheduleList}
                                                  renderItem={this.renderItems.bind(this)}
                                                  
                                                  keyExtractor={this._keyExtractor}
                                                  ListHeaderComponent={this.ListHeaderComponent.bind(this)}
                                                  extraData={this.state.detailInfo.repaymentScheduleList}/>
                                        :
                                        null
                                }
                            </View>
                        </View>
                        :
                        <ScrollView >
                            <View style={investmentDetail.contentBox}>
                                <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                    <View style={[investmentDetail.labelTextBox]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelText}>项目名称：</Text>
                                    </View>
                                    <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelTextRight} numberOfLines={1}>{params ? params.iteTitle : ""}</Text>
                                    </View>
                                </View>
                                {
                                    this.props.navigation.state.params.stateId && this.props.navigation.state.params.stateId == 3 ?
                                        null
                                        :
                                        <View>
                                            <Line full/>
                                            <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                                <View style={[investmentDetail.labelTextBox]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelText}>出借时间：</Text>
                                                </View>
                                                <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? Util.getDate(Number(params.claCreateTime)): ''}</Text>
                                                </View>
                                            </View>
                                        </View>
                                }
                                <Line full/>
                                <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                    <View style={[investmentDetail.labelTextBox]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelText}>计息日期：</Text>
                                    </View>
                                    <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ?   Util.getDate(Number(params.claInterestTime)): ''}</Text>
                                    </View>
                                </View>
                                <Line full/>
                                <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                    <View style={[investmentDetail.labelTextBox]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelText}>项目期限：</Text>
                                    </View>
                                    <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ?   params.iteRepayDate + params.iteRepayIntervalFdName: ''}</Text>
                                    </View>
                                </View>
                                {
                                    this.props.navigation.state.params.stateId && this.props.navigation.state.params.stateId == 3 ?
                                        <View>
                                            <Line full/>
                                            <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                                <View style={[investmentDetail.labelTextBox]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelText}>结束日期：</Text>
                                                </View>
                                                <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? Util.getDate(Number(params.claModifyTime)): ''}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        :
                                        null
                                }
                                <Line full/>

                                <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                    <View style={[investmentDetail.labelTextBox]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelText}>还款方式：</Text>
                                    </View>
                                    <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ?  params.iteRepayTypeName ? params.iteRepayTypeName : '' : ""}</Text>
                                    </View>
                                </View>
                                <Line full/>
                                <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                    <View style={[investmentDetail.labelTextBox]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelText}>出借金额：</Text>
                                    </View>
                                    <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? Util.thousandBitSeparator(params.claInitSumYuan.toFixed(2)): ''}元</Text>
                                    </View>
                                </View>

                                <Line full/>
                                <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                    <View style={[investmentDetail.labelTextBox]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelText}>预期年回报率：</Text>
                                    </View>
                                    <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? (params.iteYearRate * 100).toFixed(2) + '%' : ''}</Text>
                                    </View>
                                </View>
															{
																params && params.ticType == '1' ?

																	<View>
																		<Line full/>
																		<View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
																			<View style={[investmentDetail.labelTextBox]}>
																				<Text allowFontScaling={false} style={investmentDetail.labelText}>使用加息券：</Text>
																			</View>
																			<View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
																				<Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? (params.ticValue).toFixed(2) : "0"}%</Text>
																			</View>
																		</View>
																		<Line full/>
																		<View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
																			<View style={[investmentDetail.labelTextBox]}>
																				<Text allowFontScaling={false} style={investmentDetail.labelText}>实际预期年回报率：</Text>
																			</View>
																			<View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
																				<Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? ( params.ticValue+ params.iteYearRate * 100).toFixed(2) + '%' : ''}</Text>
																			</View>
																		</View>
																	</View>
																	:
																	null
															}
                                <Line full/>

                                <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                    <View style={[investmentDetail.labelTextBox]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelText}>出借使用终端：</Text>
                                    </View>
                                    <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? params.claTerminal : ''}</Text>
                                    </View>
                                </View>
															{
																params && params.ticType == '0' ?
																	<View>
																		<Line full/>
																		<View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
																			<View style={[investmentDetail.labelTextBox]}>
																				<Text allowFontScaling={false} style={investmentDetail.labelText}>使用红包金额：</Text>
																			</View>
																			<View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
																				<Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? params.usedRedPackets.toFixed(2) : ''}元</Text>
																			</View>
																		</View>
																	</View>
																	:
																	null
															}

                                <Line full/>
                                {
                                    this.props.navigation.state.params.stateId && this.props.navigation.state.params.stateId == 3 ?
                                        <View>
                                            <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                                <View style={[investmentDetail.labelTextBox]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelText}>已收本金：</Text>
                                                </View>
                                                <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? Util.thousandBitSeparator((parseFloat(params.rsbPrincipalYuan)).toFixed(2)) : ''}元</Text>
                                                </View>
                                            </View>
                                            <Line full/>
                                            <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                                <View style={[investmentDetail.labelTextBox]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelText}>已收利息：</Text>
                                                </View>
                                                <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? Util.thousandBitSeparator(params.rsbInterestYuan.toFixed(2)) : ''}元</Text>
                                                </View>
                                            </View>
                                        </View>
                                        :
                                        <View>
                                            <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                                <View style={[investmentDetail.labelTextBox]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelText}>已收本息：</Text>
                                                </View>
                                                <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? Util.thousandBitSeparator((parseFloat(params.rsbPrincipalYuan) +  parseFloat(params.rsbInterestYuan)).toFixed(2)) : ''}元</Text>
                                                </View>
                                            </View>
                                            <Line full/>
                                            <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                                <View style={[investmentDetail.labelTextBox]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelText}>待收总额：</Text>
                                                </View>
                                                <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? Util.thousandBitSeparator(params.surplusProfitYuan.toFixed(2)) : ''}元</Text>
                                                </View>
                                            </View>
                                            <Line full/>
                                            <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                                <View style={[investmentDetail.labelTextBox]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelText}>待收利息：</Text>
                                                </View>
                                                <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? Util.thousandBitSeparator(params.surplusInterestYuan.toFixed(2)) : ''}元</Text>
                                                </View>
                                            </View>
                                    </View>

                                }


                                <Line full/>
                                <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                    <View style={[investmentDetail.labelTextBox]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelText}>项目状态：</Text>
                                    </View>
                                    <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? params.claStateFdName : ''}</Text>
                                    </View>
                                </View>
                                <Line full/>
                                <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                    <View style={[investmentDetail.labelTextBox]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelText}>逾期天数：</Text>
                                    </View>
                                    <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                        <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? params.overdueDays : ''}天</Text>
                                    </View>
                                </View>
                                {
                                    this.state.showFaix ?
                                        <View>
                                            <Line full/>
                                            <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                                <View style={[investmentDetail.labelTextBox]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelText}>逾期罚息：</Text>
                                                </View>
                                                <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                                    <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? "": ''}元</Text>
                                                </View>
                                            </View>
                                        </View>
                                        : null
                                }

                                {
                                    this.props.navigation.state.params.stateId && this.props.navigation.state.params.stateId == 3 ?
                                        null:

                                    <View>
                                        <Line full/>
                                        <View activeOpacity={0.7} style={[investmentDetail.itemBox,investmentDetail.cancelMB]}>
                                            <View style={[investmentDetail.labelTextBox]}>
                                                <Text allowFontScaling={false} style={investmentDetail.labelText}>当前期数/总期数：</Text>
                                            </View>
                                            <View style={[investmentDetail.labelTextBox,investmentDetail.labelTextBoxRight]}>
                                                <Text allowFontScaling={false} style={investmentDetail.labelTextRight}>{params ? params.surplusTotalNo + "/" +params.rsbTotalNo : ''}</Text>
                                            </View>
                                        </View>
                                    </View>
                                }


                                <Line full/>
                            </View>
                        </ScrollView>
                }

                <EAlert ref={(ref) => this.eAlert = ref}/>
                <Loading ref={(ref) => this.loading = ref} notFull/>
            </View>
        );
    }
}