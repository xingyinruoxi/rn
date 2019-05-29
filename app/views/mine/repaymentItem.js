/**
 * Created by liuzhenli on 2017/7/26.
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
import MineHeader from './../components/commonHeader';
import Loading from './../components/loading';
import Line from './../../commons/line';
import Fetch from './../../commons/fetch';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import Util,{ Grow } from './../../commons/util';
var px = Util.pixel;
export default class RepaymentItem extends Component {
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
    getListData(type){
        this.setState({
            refreshing: true
        });
        let data = {
            useId: this.state.userInfo.sftUserMdl.useId,
            sessionId: __sessionId,
            date: this.props.navigation.state.params.date,
            type: 0,
            page:1,
            pageSize:10,
        };
        this.loading.show(null,null,null,() => {
            this.setState({
                loading: true
            })});
        console.log('repayMentdata',data)
        Fetch.post('userCenter/queryRepaymentByMonth',data,(res) => {
            this.loading.hide(() => {this.setState({loading: false})});
            this.setState({
                refreshing: false
            });
            console.log('res',res);
            if(res.success){
                let list = type ? this.state.dataSource.concat(res.body.list) : res.body.list;
                this.setState({
                    dataSource: list,
                    isShowBottom: res.body.totalRecordNum == res.body.endRecordId,
                })
            }
        },(error) => {
            this.loading.show('netFail','网络超时',2000)
        },null,this,this.getListData.bind(this))
    };
    renderItem = ({item}) => {
        return(
            <View >
                <View style={styles.itemBox}>
                    <View style={[styles.itemBoxLeft,]}>
                        <View style={styles.itemTitleBox}>
                            <Text allowFontScaling={false} style={[styles.itemBottomTitleLeft,]}>当日应回本金（元）：</Text>
                            <Text allowFontScaling={false} style={[styles.itemTopTitle,{color:'#E94639'}]} numberOfLines={1}>{Util.thousandBitSeparator(parseFloat(item.rescPlanSumYuan).toFixed(2))}</Text>
                        </View>
                        <View style={styles.itemTitleBox}>
                            <Text allowFontScaling={false} style={[styles.itemBottomTitleLeft,]}>{item.iteTitle}</Text>
                            <Text allowFontScaling={false} style={[styles.itemBottomTitleLeft,]}>{item.rescState}</Text>
                        </View>
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
            <TouchableOpacity onPress={this.getListData.bind(this)}style={listItemPageStyle.emptyItemBox}>
                <Image style={listItemPageStyle.emptyItem} source={require('./../../imgs/commons/noData_icon.png')}/>
                <Text allowFontScaling={false} style={listItemPageStyle.emptyItemText}>您还没有投资项目</Text>
            </TouchableOpacity>
        )
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
                <MineHeader title="本日还款项目" leftIcon leftButton goBack navigation={this.props.navigation}/>
                <View style={listItemPageStyle.contentBox}>
                    <FlatList data={this.state.dataSource}
                              renderItem={this.renderItem.bind(this)}
                              keyExtractor={this._keyExtractor}
                              extraData={this.state.dataSource}
                              ListEmptyComponent={this._listEmptyComponent.bind(this)}
                    />
                </View>
                <EAlert ref={(ref) => this.eAlert = ref}/>
                <Loading ref={(ref) => this.loading = ref} notFull/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    itemBox: {
        minHeight: 50 * px,
        width: Util.size.width,
        paddingHorizontal: 30 * px,
        backgroundColor:'#fff',
        paddingVertical: 5 * px

    },
    itemTitleBox:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        height: 25 * px,
    },
    itemBottomTitleLeft:{
        color:'#9B9B9B',
        fontSize: Util.commonFontSize(12)
    }
})