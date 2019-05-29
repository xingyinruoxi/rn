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
    TouchableOpacity,
    FlatList,
    ActivityIndicator
} from 'react-native';
import {listItemPageStyle} from './../../styles/mine/myinvestmentListStyle';
import EAlert from './../components/ealert';
import Loading from './../components/loading';
import Line from './../../commons/line';
import RightIcon from './../components/rightIcon';
import Fetch from './../../commons/fetch';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import util,{ Grow } from './../../commons/util';
export default class MyInvestmentList extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.state = {
            isRefreshing: false,
            userInfo: null,
            refreshing: false,
            isShowBottom: true,
            page: 1,
            dataSource:[],
            type: this.props.type
        }
		this.setInvestmentButton = this.props.setInvestmentButton;
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            });
            setTimeout(() => {
                this.getListData();
            })
        });

    };
    componentDidMount(){


    };
    getListData(type,page){
        this.setState({
            refreshing: true
        });
        let data = {
            page: page ? page : this.state.page,
            pageSize: 5,
            sessionId: __sessionId,
            stateId: this.props.stateId,
            useId: __useId
        };
        let url = this.state.type == 'transfer' ? "transfer/list" : 'investor/myinvestors';
        this.props.root.loading && this.props.root.loading.show(null,null,null,() => {
            this.setState({
                loading: true
            })});
        Fetch.post(url,data,(res) => {
						console.log('res', res)
            this.props.root.loading && this.props.root.loading.hide(() => {this.setState({loading: false})});
            this.setState({
                refreshing: false,
            });
            if(res.success){
                let list = type ? this.state.dataSource.concat(res.body.list) : res.body.list;
				this.props.setInvestmentButton(list.length > 0 ? true : false);
                this.setState({
                    dataSource: list,
                    isShowBottom: res.body.totalRecordNum == res.body.endRecordId,
                })
            }
        },(error) => {
            this.props.root.loading && this.props.root.loading.show('netFail','网络超时',2000)
        },null,this,this.getListData.bind(this))
    };
    renderItem = ({item}) => {
		console.log('item',item)
        // let date = item.claCreateTime ? util.getDate(item.claCreateTime) :  util.getDate(item.claModifyTime);
        return(
                <View style={listItemPageStyle.itemBox}>
                    <View style={listItemPageStyle.itemBoxTop}>
                        <Text allowFontScaling={false} style={listItemPageStyle.itemBoxTopTitle} numberOfLines={1}>{item.iteTitle}</Text>
                    </View>
                    <Line/>
                    <View style={listItemPageStyle.itemBoxCenter}>
                        <View style={listItemPageStyle.itemBoxCenterLeft}>
                            <View style={listItemPageStyle.itemBoxSubTopLeft}>
                                <Text allowFontScaling={false} style={listItemPageStyle.itemBoxSubTopText}>
									{parseFloat(item.iteYearRate * 100).toFixed(2)}

									{
										item.ticType  == '1'
										? <Text allowFontScaling={false} style={{fontSize: 12,letterSpacing: 0}}>+{item.usedRedPackets}%</Text>
										:  <Text allowFontScaling={false} style={{fontSize: 12,letterSpacing: 0}}>%</Text>
									}

								</Text>
                            </View>
                            <View style={[listItemPageStyle.itemBoxSubBottom,{alignItems:'flex-start',}]}>
                                <Text allowFontScaling={false} style={listItemPageStyle.itemBoxSubBottomText}>预期年回报率</Text>
                            </View>
                        </View>
                        <View style={listItemPageStyle.itemBoxCenterLeft}>
                            <View style={listItemPageStyle.itemBoxSubTop}>
                                <Text allowFontScaling={false} style={listItemPageStyle.itemBoxCenterCenterSubTopText}>
                                    { this.state.type == 'transfer'?
                                        item.claTransSumYuan
                                        :
                                        item.claInitSumYuan
                                    }
                                    <Text allowFontScaling={false} style={listItemPageStyle.itemBoxCenterCenterSubTopUnit}>元</Text>
                                </Text>
                            </View>
                            <View style={listItemPageStyle.itemBoxSubBottom}>
                                <Text allowFontScaling={false} style={listItemPageStyle.itemBoxSubBottomText}>{
                                    this.state.type == 'transfer'?
                                    '承接金额'
                                    :
                                    "出借金额"
                                }</Text>
                            </View>
                        </View>
                        <View style={listItemPageStyle.itemBoxCenterLeft}>
                            <View style={listItemPageStyle.itemBoxSubTopRight}>
                                {
                                    this.state.type == 'transfer' ?

                                        <Text allowFontScaling={false} style={listItemPageStyle.itemBoxCenterCenterSubTopUnitState}>{item.claStateFdName.split('-').length > 0 ?item.claStateFdName.split('-')[0] : item.claStateFdName}</Text>
                                        :
                                        <Text><Text allowFontScaling={false} style={listItemPageStyle.itemBoxCenterRightSubTopText}>
                                            {parseFloat(item.claExpectInterestYuan).toFixed(2)}
                                            <Text allowFontScaling={false} style={listItemPageStyle.itemBoxCenterCenterSubTopUnit}>元</Text>
                                        </Text></Text>
                                }
                            </View>
                            <View style={[listItemPageStyle.itemBoxSubBottom,{alignItems:'flex-end',}]}>
                                {
                                    this.state.type == 'transfer'?
                                        <Text allowFontScaling={false} style={listItemPageStyle.itemBoxSubBottomText}>项目状态</Text> :
                                        <Text allowFontScaling={false} style={listItemPageStyle.itemBoxSubBottomText}>
                                            {
                                                this.state.type !== 'transfer' && this.props.stateId == '3' ?
                                                    '已收收益'
                                                    :
                                                    this.state.type !== 'transfer' && this.props.stateId == '2' ?
                                                        '预期收益'
                                                        :
                                                        '待收收益'
                                            }
                                        </Text>
                                }
                            </View>
                        </View>
                    </View>
                    <Line/>
                    <View style={listItemPageStyle.itemBoxBottom}>
                        <View style={listItemPageStyle.itemBoxBottomLeft}>
                            {
                                    this.props.stateId != '2' ?
                                            (item.claState == '4-1' || item.claState == '4-2' || item.claState == '4-3'|| item.claState == '4-4'|| item.claState == '8') ?
                                            <Text allowFontScaling={false} style={listItemPageStyle.itemBoxBottomLeftText}>{item.claStateFdName}</Text>
                                                :
                                        <Text allowFontScaling={false} style={listItemPageStyle.itemBoxBottomLeftText}>产品到期日：{item.endTime ? util.getDate(item.endTime) : util.getDate(item.iteRepayDeadline)}</Text>
                                        :
                                        <Text allowFontScaling={false} style={listItemPageStyle.itemBoxBottomLeftText}>产品出借日：{util.getDate(item.claAssigneeApplyTime)}</Text>
                            }
                        </View>
                        {
                            this.props.stateId != '2' ?
                                <TouchableOpacity style={listItemPageStyle.itemBoxBottomRight}  activeOpacity={0.7} onPress={this.state.type == 'transfer' && this.props.stateId == 3 ? null : () => {this.props.onPress(item,this.props.stateId)}}>
                                    <Text allowFontScaling={false} style={listItemPageStyle.itemBoxBottomRightText}>查看{this.state.type == 'transfer' ? '承接' : '出借'}详情</Text>
                                </TouchableOpacity>
                                :
                                null
                        }

                    </View>
                </View>

        )
    };
    _keyExtractor = (item, index) => {
        return index;
    };
    _listEmptyComponent = () => {
        return(
            <View style={listItemPageStyle.emptyItemBox}>
                <Image style={listItemPageStyle.emptyItem} source={require('./../../imgs/commons/noData_icon.png')}/>
                <Text allowFontScaling={false} style={listItemPageStyle.emptyItemText}>您还没有投资项目</Text>
            </View>
        )
    };
    listFooterComponent = () =>{
        if(this.state.dataSource.length > 10){
            return(
                <View style={listItemPageStyle.footerBox}>{
                    this.state.isShowBottom?
                        <Text allowFontScaling={false} style={listItemPageStyle.footerTitle}>已加载完成，没有更多了</Text>
                        :
                        this.state.loading ?
                            <View style={listItemPageStyle.footerLoadingBox}>
								<Text allowFontScaling={false} style={listItemPageStyle.footerTitle}>预期收益不承诺等于实际收益，投资需谨慎</Text>
                                <ActivityIndicator style={listItemPageStyle.footerLoadingImg} size="small"/>
                                <Text allowFontScaling={false} style={listItemPageStyle.footerTitle}>努力加载中...</Text>
                            </View>
                            :
                            <Text allowFontScaling={false} style={listItemPageStyle.footerTitle}>上拉加载更多</Text>
                }
                </View>
            )
        }else{
            return null
        }
    };
    onEndReached() {
        if (!this.state.isShowBottom) {
            this.getListData(true,this.state.page + 1)
            this.setState({
                page: this.state.page + 1,
            });
        }
    };
    _onRefresh() {
        this.setState({
            isRefreshing: true,
            page: 1,
        });
        setTimeout(() => {
            this.getListData();
        }, 1)
    }
    render() {
        let { tabLabel } = this.props;

        return (
            <View style={listItemPageStyle.container} tabLabel={tabLabel}>
                <View style={listItemPageStyle.contentBox}>

                    <FlatList data={this.state.dataSource}
                              renderItem={this.renderItem.bind(this)}
                              keyExtractor={this._keyExtractor}
                              extraData={this.state.dataSource}
                              ListEmptyComponent={this._listEmptyComponent.bind(this)}
                              ListFooterComponent={this.listFooterComponent.bind(this)}
                              onRefresh={this._onRefresh.bind(this)}
                              refreshing={false}
                              onEndReached={this.onEndReached.bind(this)}
                              onEndReachedThreshold={util.isIOS ? -0.1 : 0.01}
                              initialNumToRender={10}
                             />
                </View>
                <EAlert ref={(ref) => this.eAlert = ref}/>
                <Loading ref={(ref) => this.loading = ref} />
            </View>
        );
    }
}