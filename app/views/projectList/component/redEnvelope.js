/**
 * Created by glzc on 2017/7/12.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ListView,
    RefreshControl,
    Animated,
    NativeModules,
} from 'react-native';
import HeaderBar from './../../../commons/headerBar';
import {redEnvelopeStyles} from './../../../styles/projectList/redEnvelopeStyles';
import Fetch from './../../../commons/fetch';
import RedEnvelopeItem from './../../components/redEnvelopeItem';
import TicketsItem from './../../mine/ticketsItem';
import BackToTop from './../../../commons/backToTop';
import EAlert from './../../components/ealert';
import Loading from './../../components/loading';
import NoData from './../../../commons/noData';
const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
const Storage = require('./../../../commons/storage');
const StorageKeys = require('./../../../commons/storageKey');
const ETDGrowingIO = NativeModules.ETDGrowingIO;
export default class RedEnvelope extends Component{
    static navigationOptions = ({navigation}) => ({
        title: '选择红包',
        header: null
    });
    constructor(props){
        super(props);
        this.state = {
            data: null,
            isRefresh: false,
            useId: null,
            sessionId: null,
            toTop: false,
            checked: this.props.navigation.state.params.ticId,
            noData: false,
        };
    };
    componentWillUnmount(){

    };
    componentDidMount(){
        ETDGrowingIO.track('pg_invest_investenterprice_redlist_userbrowse',null);
        this.getUserInfo();
    };
    getUserInfo(){
        if(this.view){
            Storage.getItem(StorageKeys.eTD_USERINFO).then(res => {
                if(res && res.sftUserMdl){
                    this.setState({
                        useId: res.sftUserMdl.useId,
                        sessionId: res.sessionId,
                    },this._loadData);
                }
            });
        }
    };
    _loadData(downLoading){
        this.loading.show();
        let body = {
            useId: this.state.useId,
            itemId: this.props.navigation.state.params.itemId,
            sessionId: this.state.sessionId,
            type: this.props.type,
            repayDate: this.props.navigation.state.params.repayDate,
        };
        //let url = this.props.type === 0 ? 'redPacket/listCanUse' : 'ticket/canusedlist'
        //  旧的红包查询接口：redPacket/listCanUse
        Fetch.post('ticket/canusedlist',body,res => {
            this.loading.hide();
            /*this.setState({
                isRefresh: false,
            });*/
            if(res.body && res.body.length > 0){
                this.setState({
                    data: res.body,
                    noData: false,
                });
            }else if(res.success && res.body.length < 1){
                this.setState({
                    noData: true,
                });
            };
        },err => {
            this.loading.hide();
            /*this.setState({
                isRefresh: false,
            });*/
        });
    };
    back(data){
        let navigation = this.props.navigation;
        navigation.state.params.checkedRedEnvelope(data, (data && data != '') ? this.props.type : 0);
        navigation.goBack();
    };
    checkedRedPacked(id){
        this.setState({
            checked: this.state.checked == id ? '' : id
        })
    };
    _renderRow(data,sid,rid){
        return (
            <View>
                {
                    this.props.type === 0 ?
                        <RedEnvelopeItem data={data} unused={data.ticUseState === 'UNUSED'} checked={this.state.checked} checkedRedPacked={this.checkedRedPacked.bind(this)} callBack={this.back.bind(this)} radio={true} />
                    :
                        <TicketsItem data={data} checked={this.state.checked} checkedRedPacked={this.checkedRedPacked.bind(this)} callBack={this.back.bind(this)} radio={true} />
                }
            </View>
        )
    };
    /*_refresh(){
        this.setState({
            isRefresh: true
        },this._loadData.bind(this));
    };*/
    _renderFooter(){
        return (
            <View>
                <View style={redEnvelopeStyles.view}></View>
            </View>
        )
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
    render(){
        return (
            <View ref={ref => this.view = ref} style={redEnvelopeStyles.container} >
                {
                    this.state.data ?
                        <ListView
                            dataSource={ds.cloneWithRows(this.state.data)}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            renderFooter={this._renderFooter.bind(this)}
                            renderRow={this._renderRow.bind(this)}
                            //refreshControl={<RefreshControl onRefresh={this._refresh.bind(this)} refreshing={this.state.isRefresh} />}
                            onScroll={(e)=>this.onScroll(e)}
                            />
                        : this.state.noData ?
                            <NoData />
                            : null
                }
                {this.state.toTop?<BackToTop root={this} />:null}
                <Loading ref={(ref) => this.loading=ref} />
                <EAlert ref={ref => this.eAlert = ref} />
            </View>
        )
    }
};