/**
 * Created by liuzhenli on 2017/7/13.
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
    ActivityIndicator,
    BackHandler
} from 'react-native';
import {topUpNotesPageStyle} from './../../styles/mine/topUpNoteStyle';
import Line from './../../commons/line';
import Fetch from './../../commons/fetch';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import util,{ Grow } from './../../commons/util';
import EAlert from './../components/ealert';
import Loading from './../components/loading';
import MineHeader from '../components/commonHeader';
export default class WithdrawNotes extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.state = {
            isRefreshing: false,
            userInfo: null,
            userAccountData: null,
            hideAccountInfo: false,
            dataSource: [],
            refreshing: false,
            page: 1,
            isShowBottom: true
        };
        if(this.props.navigation.state.params && this.props.navigation.state.params.backKey && !util.isIOS){
            this.forbidGoBackHandler = BackHandler.addEventListener('forbidGoBack',this.pop.bind(this))
        }
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            });
            setTimeout(() => {this.getList()})
        });

    };
    removeHandler(){
        if(!util.isIOS){
            this.forbidGoBackHandler && this.forbidGoBackHandler.remove();
        }
    };
    componentWillUnmount(){
       this.removeHandler();
    }
    renderItem({item}){
        let date = util.getDate(item.witCreateTime,true);
        return(
            <View>
                <View style={topUpNotesPageStyle.w_itemBox}>
                    <View style={topUpNotesPageStyle.w_itemDateBox}>
                        <Text allowFontScaling={false} style={topUpNotesPageStyle.w_itemText}>{date}</Text>
                    </View>
                    <View style={topUpNotesPageStyle.w_itemDateBox}>
                        <Text allowFontScaling={false} style={topUpNotesPageStyle.w_itemText}>{util.thousandBitSeparator((item.witSumYuan).toFixed(2))}</Text>
                    </View>
                    <View style={topUpNotesPageStyle.w_itemDateBox}>
                        <Text allowFontScaling={false} style={topUpNotesPageStyle.w_itemText}>{util.thousandBitSeparator((item.witSumYuan - item.witHandlingChargeYuan).toFixed(2))}</Text>
                    </View>
                    <View style={topUpNotesPageStyle.w_itemDateBox}>
                        <Text allowFontScaling={false} style={[topUpNotesPageStyle.w_itemText,item.witStateName == '成功' && {color:'#36972C'},item.witStateName == '失败' && {color:'#E94639'}]}>{item.witStateName}</Text>
                    </View>

                </View>
                <Line/>
            </View>
        )
    };
    _keyExtractor = (item, index) => {
        return index;
    };
    _listEmptyComponent = () => {
        return(
            <View style={topUpNotesPageStyle.emptyItemBox}>
                <Image style={topUpNotesPageStyle.emptyItem} source={require('./../../imgs/commons/noData_icon.png')}/>
                <Text allowFontScaling={false} style={topUpNotesPageStyle.emptyItemText}>暂无提现记录</Text>
            </View>
        )
    };
    listFooterComponent = () =>{
        if(this.state.dataSource.length > 0){
            return(
                <View style={topUpNotesPageStyle.footerBox}>
                    {
                        this.state.isShowBottom ?
                            <Text allowFontScaling={false} style={topUpNotesPageStyle.footerTitle}>已加载完成，没有更多了</Text>
                            :
                            this.state.loading ?
                                <View style={topUpNotesPageStyle.footerLoadingBox}>
                                    <ActivityIndicator style={topUpNotesPageStyle.footerLoadingImg} size="small"/>
                                    <Text allowFontScaling={false} style={topUpNotesPageStyle.footerTitle}>努力加载中...</Text>
                                </View>
                                :
                                <Text allowFontScaling={false} style={topUpNotesPageStyle.footerTitle}>上拉加载更多</Text>
                    }
                </View>
            )
        }else{
            return null
        }
        
    };
    getList(type){
        let data = {
            page: this.state.page,
            pageSize: 12,
            sessionId: __sessionId,
            useId: this.state.userInfo.sftUserMdl.useId
        };
        this.loading.show(null,null,null,() => {
            this.setState({
                loading: true
            })});
        Fetch.post('withdrawal/history',data,(res) => {
            this.loading.hide(() => {this.setState({loading: false})});
            this.setState({isRefreshing: false,})
            if(res.success){
                let list = type ? this.state.dataSource.concat(res.body.list) : res.body.list;
                this.setState({
                    isShowBottom: res.body.totalRecordNum == res.body.endRecordId,
                    dataSource: list,
                })
            }
        },(error) => {
			this.loading && this.loading.show('netFail','网络超时',2000)
        },null,this,this.getList.bind(this,type))
    };
    onEndReached() {
        if (!this.state.isShowBottom) {
            this.setState({
                page: this.state.page + 1,
            });
            setTimeout(() => {
                this.loading.show();
                this.getList(true)
            }, 1)

        }
    };
    _onRefresh() {
        this.setState({
            page: 1,
        });
        setTimeout(() => {
            this.loading.show();
            this.getList();
        }, 1)

    };
    pop(){
        this.removeHandler();
        if(this.props.navigation.state.params && this.props.navigation.state.params.backKey){
            this.props.navigation.goBack(this.props.navigation.state.params.backKey)
        }else{
            this.props.navigation.goBack();
        }
    }
    render() {
        return (
            <View style={topUpNotesPageStyle.container}>
                <MineHeader title="提现记录" leftButton leftIcon callback={this.pop.bind(this)} root={this} navigation={this.props.navigation}/>
                <View style={topUpNotesPageStyle.contentBox}>
                    <View style={topUpNotesPageStyle.titleBox}>
                        <View style={topUpNotesPageStyle.titleBoxItem} >
                            <Text allowFontScaling={false} style={topUpNotesPageStyle.titleItem} >提现时间</Text>
                        </View>
                        <View style={topUpNotesPageStyle.titleBoxItem} >
                            <Text allowFontScaling={false} style={topUpNotesPageStyle.titleItem}>提现金额(元)</Text>
                        </View>
                        <View style={topUpNotesPageStyle.titleBoxItem} >
                            <Text allowFontScaling={false} style={topUpNotesPageStyle.titleItem}>实际到账(元)</Text>
                        </View>
                        <View style={topUpNotesPageStyle.titleBoxItem} >
                            <Text allowFontScaling={false} style={topUpNotesPageStyle.titleItem}>状态</Text>
                        </View>
                    </View>
                    <View style={topUpNotesPageStyle.contentItemBox}>
                        <FlatList data={this.state.dataSource}
                                  renderItem={this.renderItem}
                                  keyExtractor={this._keyExtractor}
                                  extraData={this.state.dataSource}
                                  ListEmptyComponent={this._listEmptyComponent.bind(this)}
                                  onRefresh={this._onRefresh.bind(this,'Refresh')}
                                  refreshing={false}
                                  ListFooterComponent={this.listFooterComponent.bind(this)}
                                  onEndReached={this.onEndReached.bind(this)}
                                  onEndReachedThreshold={0.2}
                        />
                    </View>
                </View>
                <EAlert ref={(ref) => this.eAlert = ref}/>
                <Loading ref={(ref) => this.loading = ref}/>
            </View>
        );
    }
}