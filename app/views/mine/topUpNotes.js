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
    ActivityIndicator
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
export default class TopUpNotes extends Component {
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
            listInfo: null,
            page: 1,
            pageSize: 10,
            loading: false
        }
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState((state) => {
                state.userInfo = userInfo;
                return state
            });
            setTimeout(() => { this.getList() })
        });

    };
    componentDidMount(){

    };
    getList(type){
        let data = {
            page: this.state.page,
            pageSize: 12,
            sessionId: __sessionId,
            useId: this.state.userInfo.sftUserMdl.useId
        };
		this.loading && this.loading.show(null,null,null,() => {
            this.setState({
                loading: true
            })});
        Fetch.post('payment/selectRechargeList',data,(res) => {
			this.loading && this.loading.hide(() => {this.setState({loading: false})});
            this.setState({isRefreshing: false,})
            let list = type ? this.state.dataSource.concat(res.body.list) : res.body.list;
            if(res.success){
                this.setState({
                    isShowBottom: res.body.totalRecordNum == res.body.endRecordId,
                    dataSource: list,
                })
            }else{
                
            }
        },(error) => {
			this.loading && this.loading.show('netFail','网络超时',2000)
        },null,this,this.getList.bind(this,type))
    };
    renderItem({item}){
        let date = util.getDate(item.arfCreateTime,true,true);
        return(
            <View>
                <View style={topUpNotesPageStyle.itemBoxTop}>
                    <View style={[topUpNotesPageStyle.itemDateBox]}>
                        <Text allowFontScaling={false} style={[topUpNotesPageStyle.itemTextStatus,item.arfStateName.indexOf('成功') >= 0 && {color:'#36972C'},item.arfStateName.indexOf('失败') >= 0  && {color:'#E94639'}]}>{item.arfStateName}</Text>
                    </View>
                    <View style={[topUpNotesPageStyle.itemDateBoxRight]}>
                        <Text allowFontScaling={false} style={[topUpNotesPageStyle.itemTextStatus,item.arfStateName.indexOf('成功') >= 0 && {color:'#36972C'},item.arfStateName.indexOf('失败') >= 0  && {color:'#E94639'}]}>{util.thousandBitSeparator(item.afrSumYuan.toFixed(2))}(元)</Text>
                    </View>
                </View>
                <View style={topUpNotesPageStyle.itemBox}>
                    <View style={topUpNotesPageStyle.itemDateBox}>
                        <Text allowFontScaling={false} style={[topUpNotesPageStyle.itemTextDate]}>{date}</Text>
                    </View>
                    <View style={[topUpNotesPageStyle.itemDateBoxRight]}>
                        <Text allowFontScaling={false} style={[topUpNotesPageStyle.itemTextDate,]}>{item.recOrderNo}</Text>
                    </View>
                </View>
                <Line/>
            </View>
        )
    };
    _keyExtractor = (item, index) => {
        return item.recOrderNo;
    };
    _listEmptyComponent = () => {
        return(
            <View style={topUpNotesPageStyle.emptyItemBox}>
                <Image style={topUpNotesPageStyle.emptyItem} source={require('./../../imgs/commons/noData_icon.png')}/>
                <Text allowFontScaling={false} style={topUpNotesPageStyle.emptyItemText}>暂无充值记录</Text>
            </View>
        )
    };
    listFooterComponent = () =>{
        if(this.state.dataSource.length > 10){
            return(
                <View style={topUpNotesPageStyle.footerBox}>{
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
    onEndReached() {
        console.log('isShowBottom',this.state.isShowBottom)
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
    }
    render() {
        return (
            <View style={topUpNotesPageStyle.container}>
                <MineHeader title="充值记录" leftButton leftIcon goBack backKey={this.props.navigation.state.params && this.props.navigation.state.params.backKey? this.props.navigation.state.params.backKey : null} navigation={this.props.navigation}/>
                <View style={topUpNotesPageStyle.contentBox}>
                    <View style={topUpNotesPageStyle.contentItemBox}>
                        <FlatList data={this.state.dataSource}
                                  renderItem={this.renderItem}
                                  keyExtractor={this._keyExtractor}
                                  extraData={this.state.dataSource}
                                  ListEmptyComponent={this._listEmptyComponent.bind(this)}
                                  ListFooterComponent={this.listFooterComponent.bind(this)}
                                  onRefresh={this._onRefresh.bind(this)}
                                  refreshing={false}
                                  onEndReached={this.onEndReached.bind(this)}
                                  onEndReachedThreshold={0.2}
                                 />
                    </View>
                </View>
                <Loading ref={(ref) => this.loading = ref}/>
                <EAlert ref={(ref) => this.eAlert = ref}/>
            </View>
        );
    }
}