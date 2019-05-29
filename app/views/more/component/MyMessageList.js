/**
 * Created by glzc on 2017/7/11.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    ListView,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import ListItem from './ListItem';
import Fetch from './../../../commons/fetch';
import Util from './../../../commons/util';
import BackToTop from './../../../commons/backToTop';
import Loading from './../../components/loading';
import EAlert from './../../components/ealert';
const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1!==r2});
const {url} = require('./../../../commons/config');
export default class MyMessageList extends Component{
    static navigationOptions = ({navigation}) => ({
        title: '我的消息',
        header: null
    });
    constructor(props){
        super(props);
        this.state = {
            isRefresh: false,
            noMoreData: false,
            page: 1,
            dataSource: null,
            toTop: false,
            scrollHeight: (Util.size.height - Util.pixel * 300) * 3,
            downLoading: false,
        }
    };
    componentDidMount(){
        this._loadData(true);
    };
    _loadData(flag){
        this.loading.show('loading','加载中···');
        let data = this.props.type == 0 ? {
            pageSize: Util.deviceId.indexOf('iPhone10') > -1 ? 15 : 14,
            pageId: flag ? 1 : this.state.page,
        } :{
            useId: __useId,
            sessionId: __sessionId,
            pageSize:  Util.deviceId.indexOf('iPhone10') > -1 ? 15 : 14,
            page: flag ? 1 : this.state.page,
        };
        //let url = this.props.type == 0 ? 'more/gglist' : 'more/mymessage';
        let url = this.props.type == 0 ? 'more/helpContextData' : 'more/mymessage';
        Fetch.post(url,data,res => {
            this.loading.hide();
            this.setState({
                isRefresh: false,
            });
            if(this.props.type == 0){
                if(res && (typeof res == 'string' && res.indexOf('<') === -1) && JSON.parse(res) instanceof Array){
                    this.setState({
                        dataSource: flag ? JSON.parse(res) : this.state.dataSource.concat(JSON.parse(res)),
                        noMoreData: JSON.parse(res).length < data.pageSize ? true : false,
                    })
                }
            }else{
                if(res && res.success){
                    this.setState({
                        dataSource: flag ? res.body.list : this.state.dataSource.concat(res.body.list),
                        noMoreData: res.body.list.length < data.pageSize ? true : false,
                    });
                }
            }
        },err => {
            this.loading.hide();
            this.setState({
                isRefresh: false,
            });
        },null,this,this._loadData.bind(this,true));
    };
    loadPage(routeName,params,index){
        if(this.props.type != 0 && this.state.dataSource[index].mesReadState == 1){
            this.props.root.updateMessageNum();
            let msgs = this.state.dataSource;
            msgs[index].mesReadState = 2;
            this.setState({
                dataSource: msgs
            });
        }
        this.props.root.navigation.navigate(routeName,params);
    };
    onScroll(e){
        if(e.nativeEvent.contentOffset.y > this.state.scrollHeight){
            this.setState({
                toTop: true
            });
        }else{
            this.setState({
                toTop: false
            });
        }
    };
    _renderHeader(){
        return (
            <View style={MyMessageStyles.view}></View>
        )
    };
    _renderFooter(){
        return (
            <View style={MyMessageStyles.footer}>
            {
                this.state.noMoreData ?
                    <View>
                        <Text allowFontScaling={false} style={MyMessageStyles.footText}>没有更多数据了</Text>
                    </View>
                    : !this.state.noMoreData && this.state.downLoading ?
                    <View style={{justifyContent: 'center',alignItems: 'center'}}>
                        <Text allowFontScaling={false} style={[MyMessageStyles.footerText,{fontSize:Util.commonFontSize(10)}]}>预期收益不承诺等于实际收益，选择需谨慎</Text>
                        <ActivityIndicator
                            style={MyMessageStyles.loading}
                            size="large"
                            />
                        <Text allowFontScaling={false} style={MyMessageStyles.footerText}>加载更多</Text>
                    </View>
                    :
                    <View style={MyMessageStyles.view}></View>
            }
            </View>
        )
    };
    _renderRow(data,sId,rId){
        return (
            <TouchableOpacity activeOpacity={0.7} onPress={this.loadPage.bind(this,this.props.type == 0 ? 'webview' : 'myMessage',this.props.type == 0 ? {source: {uri: url.server.slice(0,url.server.length - 1)+data.url+'?rct=true'},title: '网站公告',h5Page: true} : {mesId:data.mesId,title: '站内消息'},rId)}>
                <ListItem isMessage={true} title={this.props.type == 0 ? data.artTitle : data.mesTitle} date={this.props.type == 0 ? data.artCreateTime : data.mesSendTime} type={this.props.type} unRead={this.props.type == 0 ? true : data.mesReadState == 1 ? true : false} />
            </TouchableOpacity>
        )
    };
    _refresh(){
        this.setState({
           isRefresh: !this.state.isRefresh,
            page: 1,
        },this._loadData.bind(this,true));
    };
    onEndReached(){
        if(!this.state.downLoading){
            this.setState({
                downLoading: true,
            });
            return;
        }
        if(!this.state.noMoreData && this.state.downLoading){
            this.setState({
                page: this.state.page + 1,
                downLoading: true,
            },this._loadData.bind(this));
        }
    };
    render(){
        return (
            <View ref={(ref) => this.view = ref} style={MyMessageStyles.container}>
                {
                    this.state.dataSource && this.state.dataSource.length > 0 ?
                        <ListView
                            ref='listview'
                            dataSource={ds.cloneWithRows(this.state.dataSource)}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            renderHeader={this._renderHeader.bind(this)}
                            renderRow={this._renderRow.bind(this)}
                            renderFooter={this._renderFooter.bind(this)}
                            onEndReached={this.onEndReached.bind(this)}
                            onEndReachedThreshold={25}
                            refreshControl={<RefreshControl onRefresh={this._refresh.bind(this)} refreshing={this.state.isRefresh}  title="Loading..." />}
                            onScroll={(e)=>this.onScroll(e)}
                            />
                        : <View style={MyMessageStyles.noMessage}><Text style={MyMessageStyles.noMessageText}>暂无消息</Text></View>
                }
                {this.state.toTop?<BackToTop root={this} />:null}
                <Loading ref={(ref) => this.loading=ref} />
                <EAlert ref={ref => this.eAlert = ref} />
            </View>
        )
    };
};

const MyMessageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    view: {
        height: Util.pixel*10,
    },
    footer: {
        paddingTop: Util.pixel*10,
        paddingBottom: Util.pixel*10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noMessage: {
        flex: 1,
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: Util.pixel*200,
    },
    noMessageText: {
        color: '#9d9d9d',
        fontSize: Util.commonFontSize(14)
    },
    footText: {
        color: '#9b9b9b',
        fontSize: Util.commonFontSize(12),
    },
    loading: {
        marginTop: Util.pixel*5,
        marginBottom: Util.pixel*5,
    },
});