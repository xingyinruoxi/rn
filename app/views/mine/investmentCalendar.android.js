/**
 * Credit Life React Native App
 * This is select city
 * @John
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    requireNativeComponent,
    InteractionManager,
    NativeModules,
    ScrollView
} from 'react-native';
import MineHeader from './../components/commonHeader';

import util,{ Grow } from './../../commons/util';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
var Fetch = require('./../../commons/fetch');
import EAlert from './../components/ealert';
import Loading from './../components/loading';
import Button from './../components/button';
var px = util.pixel;
import Line from './../../commons/line';
var InvestmentCalendarView = requireNativeComponent('ETDInvestmentCalendarView', null);
export default class InvestmentCalendar extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state = {
            userInfo: null,
            data: null,
            date: null
        }
        this.selectedDate=this.selectedDate.bind(this);
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            });
        });
    };
    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {this.getData()})
        })
    };
    getData(nativeDate){
        let date = new Date();
        let currentDate = date.getFullYear() + "-" + (parseInt(date.getMonth()) + 1 >= 10 ? parseInt(date.getMonth()) + 1 : "0" + (parseInt(date.getMonth()) + 1));
        let data = {
            useId: __useId,
            date: nativeDate ? util.isIOS ? nativeDate.nativeEvent.date : nativeDate : currentDate,
            sessionId: __sessionId,
        };
        console.log('data',data);
		this.loading && this.loading.show();
        Fetch.post('userCenter/repaymentDateOfMonth',data,res => {
            console.log('repaymentDateOfMonth',res)
            this.loading.hide();
            if(res.success){
                if(res.body.list.length > 0){
                    this.getDayPayment(res.body.list[0]);
                    this.setState({
                        date: res.body.list[0]
                    })
                }else{
                    this.setState({
                        paymentArr: null
                    })
                }
                this.setState({
                    data: JSON.stringify(res),
                    payment: res.body
                });

            }else{
                this.setState({
                    paymentArr: null
                })
            }
        },error => {
            this.setState({
                paymentArr: null
            })
        },null,this)
    };
    selectedDate(event:Event){
        console.log('event.nativeEvent.date',event.nativeEvent)
        if(event.nativeEvent.onSelectDate){
            this.setState({
                date: event.nativeEvent.onSelectDate
            });
            this.getDayPayment(event.nativeEvent.onSelectDate)
        }else if(event.nativeEvent.date){
            this.getData(event.nativeEvent.date);
        }
    };
    turnToCurrentMonth(){
        NativeModules.ETDInvestmentCalendarAndroidView.changeDisplayMonth('we')
    };
    getDayPayment(MonthData){
        let data = {
            sessionId: __sessionId,
            useId: __useId,
            type: 0,
            page:1,
            pageSize:300,
            date: MonthData
        };
        Fetch.post('userCenter/queryRepaymentByMonth',data,res => {
            if(res.success && res.body.list.length > 0){
                this.setState({
                    paymentArr: res.body.list
                })
            }else{
                this.setState({
                    paymentArr:null
                })
            }
        },error => {
            this.setState({
                paymentArr: null
            })
        },null,this)
    }
    toInvesment(){
        global.forbidTransition = true;
        this.props.navigation.navigate('list');
        setTimeout(() => {global.forbidTransition = false;})
    }
    render() {
        let payment = this.state.payment;
        let moneyCount = 0;
        return (
            <View style={styles.container}>
                <MineHeader title="回款日历" leftIcon leftButton goBack rightButton="本月" currentMonth rightButtonCallback={this.turnToCurrentMonth.bind(this)} navigation={this.props.navigation}/>

                {
                    this.state.data ?
                        <ScrollView style={{flex:1}}>
                            <View style={ styles.investmentCalendarView }>
                                <InvestmentCalendarView style={ styles.investmentCalendarView }  currentMonthData={this.state.data} onChange={this.selectedDate}/>
                            </View>
                            {
                                this.state.paymentArr && this.state.paymentArr.length > 0 ?
                                    <View style={styles.itemBox}>
                                        <Line/>
                                        <View style={styles.item}>
                                            <Text allowFontScaling={false} style={styles.itemTitle}>本月应回款（元）</Text>
                                            <Text allowFontScaling={false} style={styles.itemTitle}>{payment ? util.thousandBitSeparator(parseFloat(payment.planSumYuanMonth).toFixed(2)) : 0.00}</Text>
                                        </View>
                                        <View style={styles.item}>
                                            <Text allowFontScaling={false} style={styles.itemTitle}>本月已回款（元）</Text>
                                            <Text allowFontScaling={false} style={styles.itemTitle}>{payment ? util.thousandBitSeparator(parseFloat(payment.actualSumYuanMonth).toFixed(2)) : 0.00}</Text>
                                        </View>
                                        <View style={styles.item}>
                                            <Text allowFontScaling={false} style={styles.itemTitle}>本月待回款（元）</Text>
                                            <Text allowFontScaling={false} style={styles.itemTitle}>{payment? util.thousandBitSeparator(parseFloat(payment.planSumYuanMonth - payment.actualSumYuanMonth).toFixed(2)) : 0.00}</Text>
                                        </View>
                                    </View>
                                    :
                                    <View style={styles.itemBox}>
                                        <View style={[styles.itemSubBox]}>
                                            <Text allowFontScaling={false} style={[styles.itemSubBoxTitle]}>您还没有回款日历</Text>
                                            <Text allowFontScaling={false} style={[styles.itemSubBoxTitle]}>快去赚取收益吧</Text>
                                            <View style={[styles.buttonBox]}>
                                                <Button buttonName="去出借" width={150} onPress={this.toInvesment.bind(this)}/>
                                            </View>
                                        </View>
                                    </View>

                            }
                            {
                                this.state.paymentArr && this.state.paymentArr.length > 0 ?
                                    <View style={styles.itemBox}>
                                        <View style={[styles.item,styles.timeBox]}>
                                            <Text allowFontScaling={false} style={styles.timeTitle}>{this.state.date && this.state.paymentArr.length > 0 ? this.state.date.replace(/\-/,'年').replace(/\-/,'月')+'日' : null}</Text>
                                            <Text allowFontScaling={false} style={styles.itemTitle}>共{ this.state.paymentArr && this.state.paymentArr.map((item,index) => {
                                                moneyCount = moneyCount + (item.rescPlanSumYuan + (item.rescPlanIncreaseInterestYuan ? item.rescPlanIncreaseInterestYuan : 0.00 ))
                                                if(index == this.state.paymentArr.length - 1){
                                                    return util.thousandBitSeparator(parseFloat(moneyCount).toFixed(2));
                                                }
                                            })}元</Text>
                                        </View>
                                    </View>
                                    :
                                    null
                            }
                            <View style={styles.itemBox}>
                                {
                                    this.state.paymentArr && this.state.paymentArr.map((item,index) => {
                                        return(
                                            <View key={index}>
                                                <View style={[styles.DetailBox]} key={index}>
                                                    <View style={[styles.DetailBoxLeft]}>
                                                        <Text allowFontScaling={false} style={styles.topTitle}>当日应回本息（元）</Text>
                                                        <Text allowFontScaling={false} style={styles.topTitle}>{item.iteTitle}</Text>
                                                    </View>
                                                    <View style={[styles.DetailBoxRight]}>
                                                        <Text allowFontScaling={false} style={styles.topTitle}>{util.thousandBitSeparator(parseFloat(item.rescPlanSumYuan + (item.rescPlanIncreaseInterestYuan ? item.rescPlanIncreaseInterestYuan : 0.00 )).toFixed(2))}</Text>
                                                        <Text allowFontScaling={false} style={styles.topTitle}>{item.rescStateFdName}</Text>
                                                    </View>
                                                </View>
                                                <Line/>
                                            </View>

                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                        :
                        null
                }
                <EAlert ref={ref => this.eAlert = ref}/>
                <Loading ref={ref => this.loading = ref}/>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f6f7fa'
    },
    investmentCalendarView: {
        minHeight: 310 * px,
        width: util.size.width,
        backgroundColor:'#f6f7fa'
    },
    itemBox:{
        minHeight: 0,
        width: util.size.width,
        backgroundColor:'#fff',
    },
    itemSubBox:{
        minHeight: 80 * px,
        width: util.size.width,
        justifyContent:'space-around',
        alignItems:"center",
        backgroundColor:'#f6f7fa',
        paddingTop: 20 * px,
        paddingBottom: 10 * px,
    },
    itemSubBoxTitle:{
        fontSize: util.commonFontSize(15),
        color:'#9B9B9B'
    },
    item:{
        height: 35 * px,
        backgroundColor:'#fff',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal: 28 * px
    },
    itemTitle:{
        fontSize: util.commonFontSize(17),
        color:'#025FCB'
    },
    timeBox:{
        backgroundColor:'#f6f7fa'
    },
    timeTitle:{
        fontSize: util.commonFontSize(15),
        color:'#025FCB'
    },
    DetailBox:{
        height: 50 * px,
        flexDirection:'row',
        alignItems:"center",
        justifyContent:'center'
    },
    DetailBoxLeft:{
        flex:1.5,
        height: 50 * px,
        justifyContent:'space-around',
        paddingLeft: 28  * px,
        paddingVertical:5 * px
    },
    DetailBoxRight:{
        flex:1,
        height: 50 * px,
        justifyContent:'space-around',
        alignItems:'flex-end',
        paddingRight: 28  * px,
        paddingVertical:5 * px
    },
    topTitle:{
        fontSize: util.commonFontSize(12),
        color:'#9B9B9B'
    },
    buttonBox:{
        marginTop: 10 * px,
    }
});
