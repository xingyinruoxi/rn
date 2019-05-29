/**
 * Created by liuzhenli on 2017/8/31.
 */
import React, { Component } from 'react';
import {
    Animated,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    ScrollableTabView
} from 'react-native';
import {fundNotesPageStyle} from './../../styles/mine/fundNotesStyle';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
var Fetch = require('./../../commons/fetch');
import Util,{ Grow } from './../../commons/util';
import EAlert from './../components/ealert';
import RightIcon from './../components/rightIcon';
import Line from './../../commons/line';
import Loading from './../components/loading';
import MineHeader from '../components/commonHeader';

export default class FundNotesItems extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.state = {
            isRefreshing: false,
            userInfo: null,
            dataSource: [],
            hideDate: false,
            type: "",
            endRecordId: null,
            totalRecordNum: null,
            page: 1,
            isShowBottom: false,
            listLength: null,
        }
    };
    componentWillMount(){
        this.changeFilterValue(this.props.tabLabel,this.props.value)
    };
    getList(flag,page){
        let data = {
            page: page ? page : this.state.page,
            pageSize:15,
            sessionId: __sessionId,
            useId: __useId,
            type: this.state.type
        };
		this.loading && this.loading.show(null,null,null,() => {
            this.setState({
                loading: true
            })
        });
        Fetch.post('userCenter/queryCapitalSubsidiary',data,res => {
			this.loading && this.loading.hide(() => {this.setState({loading: false})});
					console.log('queryCapitalSubsidiary',res)
            this.setState({isRefreshing: false,})
            if(res.code){
                this.eAlert.show('alert',res.info)
            }else if(res.success){
                let list = flag ? this.state.dataSource.concat(res.body.list) : res.body.list;
                this.setState({
                    isShowBottom: res.body.totalRecordNum == res.body.endRecordId,
                    dataSource:  list,
                    isRefreshing: false,
                    listLength: list.length
                });
            }
        },error => {
			this.loading && this.loading.show('netFail','网络超时',2000)
        },null,this);
    };
    getLabelImg(fufType){

        if(fufType == '1' || fufType == '1-1' ||fufType == '1-2') return require('./../../imgs/mine/topUpImg.png')

        if(fufType == "4" ||  fufType == "4-1" || fufType == "4-2" || fufType == "12-1" || fufType == "12-2" ||  fufType == "13-1" || fufType == "13-2")return require('./../../imgs/mine/invesmentImg.png')

        if(fufType == "7"  || fufType == "13-5") return require('./../../imgs/mine/withdrawImg.png')

        if(fufType == "5" || fufType == "12-5" || fufType == "13-3" || fufType == "6") return require('./../../imgs/mine/repayImg.png')

        if(fufType == "0" || fufType == "9" || fufType == "3" || fufType == "11" || fufType == "11-1"|| fufType == "11-2" || fufType == "12-6"  || fufType == "14-1" || fufType == "14-2" ||

            fufType == "19" || fufType == "12-4" || fufType == "13-4" || fufType == "21" ||

            fufType == "12-7" || fufType == "13-7" || fufType == "8" || fufType == "10" ||

            fufType == "27-1" || fufType == "29"|| fufType == "11-4"|| fufType == "17"|| fufType == "14-3"|| fufType == "14-4"|| fufType == "12-3"
				
            || fufType == "2"|| fufType == "14-5"|| fufType == "14-6"|| fufType == "14-7"|| fufType == "14-8"||fufType == "23"||fufType == "24"||fufType == "22"||fufType == "21"||fufType == "19"||fufType == "20")return require('./../../imgs/mine/otherImg.png');


    }
    renderItem(data){
        let date = Util.getDate(data.item.fufCreateTime,true,true);
        fufType = data.item.fufType;
        return(
            <TouchableOpacity  activeOpacity={0.7} onPress={() => this.props.navigation.navigate('fundDetail',{data:data.item})}>
                <View style={fundNotesPageStyle.itemBox} >
                    <View style={fundNotesPageStyle.leftImgBox}>
                        <Image source={this.getLabelImg(fufType)}/>
                    </View>
                    <View  style={fundNotesPageStyle.itemBoxLeft}>
                        <View style={fundNotesPageStyle.itemTitleBox}>
                            <Text allowFontScaling={false} style={fundNotesPageStyle.itemTitle}>{data.item.fufTypeFdName}</Text>
                        </View>
                        <View style={fundNotesPageStyle.itemContentBox}>
                            <View style={fundNotesPageStyle.itemContentBoxTime}>
                                <Text allowFontScaling={false} style={fundNotesPageStyle.itemContent}>{date}</Text>
                            </View>
                        </View>
                    </View>
                    <View  style={fundNotesPageStyle.itemBoxRight}>
                        <View>
                            <Text allowFontScaling={false} style={[{color: '#025FCB'},{paddingRight: 14 * Util.pixel}]} numberOfLines={1}>{data.item.fufSumYuan < 0 ?Util.thousandBitSeparator(data.item.fufSumYuan.toFixed(2)) : "+" + Util.thousandBitSeparator(data.item.fufSumYuan.toFixed(2))}元</Text>
                        </View>
                        <RightIcon/>
                    </View>

                </View>
                <Line full/>
            </TouchableOpacity>
        )
    };
    _keyExtractor = (item, index) => {
        return index;
    };
    _listEmptyComponent = () => {
        return(
            <View style={fundNotesPageStyle.emptyItemBox}>
                {
                    this.state.listLength == 0 ?
                        <View style={fundNotesPageStyle.emptyItemBox}>
                            <Image style={fundNotesPageStyle.emptyItem} source={require('./../../imgs/commons/noData_icon.png')}/>
                            <Text allowFontScaling={false} style={fundNotesPageStyle.emptyItemText}>暂无资金记录</Text>
                        </View>

                        :
                        null
                }

            </View>
        )
    };
    listFooterComponent = () =>{
        if(this.state.dataSource.length >= 10){
            return(
                <View style={fundNotesPageStyle.footerBox}>
                    {
                        this.state.isShowBottom  ?
                            <Text allowFontScaling={false} style={fundNotesPageStyle.footerTitle}>已加载完成，没有更多了</Text>
                            :
                            this.state.loading ?
                                <View style={fundNotesPageStyle.footerLoadingBox}>
                                    <ActivityIndicator style={fundNotesPageStyle.footerLoadingImg} size="small"/>
                                    <Text allowFontScaling={false} style={fundNotesPageStyle.footerTitle}>努力加载中...</Text>
                                </View>
                                :
                                <Text allowFontScaling={false} style={fundNotesPageStyle.footerTitle}>上拉加载更多</Text>

                    }

                </View>
            )
        }else{
            return null
        }
    };
    changeFilterValue(val,type){
        this.setState({
            activeButton: val,
            type: type,
            page: 1,
        });
        setTimeout(() => {
            this.getList();
        })
    };
    onEndReached(e) {
        if (!this.state.isShowBottom) {
            this.getList(true,this.state.page+ 1)
            this.setState({
                page: this.state.page + 1,
            });
        }
    };
    _onRefresh() {
        this.setState({
            isRefreshing: true,
            page: 1
        });
        setTimeout(() => {
            this.getList();
        }, 1)
    }
    render() {
        return (
            <View style={fundNotesPageStyle.container} tabLabel={this.props.tabLabel}>
                <View style={fundNotesPageStyle.contentBox}>
                    <FlatList ref={ref => this.flatList = ref}
                              data={this.state.dataSource}
                              renderItem={this.renderItem.bind(this)}
                              keyExtractor={this._keyExtractor}
                              extraData={this.state.dataSource}
                              ListEmptyComponent={this._listEmptyComponent.bind(this)}
                              ListFooterComponent={this.listFooterComponent.bind(this)}
                              onRefresh={this._onRefresh.bind(this)}
                              refreshing={false}
                              onEndReached={this.onEndReached.bind(this)}
                              removeClippedSubviews={true}
                              onEndReachedThreshold={0.2}
                    />
                </View>
                <EAlert ref={(ref) => this.eAlert = ref}/>
                <Loading ref={(ref) => this.loading = ref} height={Util.size.height * 0.7}/>
            </View>
        );
    }
}