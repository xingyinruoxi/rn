/**
 * Created by glzc on 2017/8/23.
 */
import React,{Component} from 'react';
import {
    View,
} from 'react-native';
import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view';
import {messageCenterStyle} from './../../../styles/more/messageCenterStyle';
import MyMessageList from './MyMessageList';
import HeaderBar from './../../../commons/headerBar';
import Util, { Grow } from './../../../commons/util';
import MessageTabBar from './messageTabBar';
import Fetch from './../../../commons/fetch';
import Loading from './../../components/loading';
import EAlert from './../../components/ealert';

export default class MessageCenter extends Component{
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state={
            items: [{
                name: '网站公告',
                type: 0,
            },{
                name: '站内消息',
                type: 1,
            }],
            newMessageNoticesNum: this.props.navigation.state.params.newMessageNoticesNum,  //网站公告
            newMessageNum: this.props.navigation.state.params.newMessageNum,   //站内消息
            isReload: true,
        };
        this.navigation=this.props.navigation;
    };
    updateMessageNum(){
        if(this.state.newMessageNum > 0){
            this.setState({
                newMessageNum: this.state.newMessageNum - 1,
            });
        }
    };
	componentDidMount() {
		Grow.track('pg_other_messagecenter_browse', {"pg_other_messagecenter_browse": "消息中心浏览量"})
	}
    _setAllRead(){
        let data = {
            useId: __useId,
            sessionId: __sessionId
        }
        this.loading.show('loading','加载中···')
        this.setState({
            isReload: false
        },() => {
            Fetch.post('more/updatemessage', data, res => {
                this.loading.hide();
                if(res && res.success){
                    this.setState({
                        isReload: true,
                        newMessageNum: 0
                    })
                }
            }, err => {
                this.loading.hide();
            }, null, this, this._setAllRead.bind(this))
        })
    };
    render(){
        return (
            <View style={messageCenterStyle.container}>
                <HeaderBar title='消息中心' navigation={this.navigation} rightText="全部已读" rightCallBack={this._setAllRead.bind(this)} />
                <ScrollableTabView
                    tabBarUnderlineStyle={{height:Util.pixel * 2, backgroundColor:'#025fcc'}}
                    locked={true}
                    tabBarActiveTextColor='#025fcc'
                    tabBarInactiveTextColor='#9b9b9b'
                    tabBarTextStyle={{fontSize:Util.commonFontSize(15)}}
                    style={messageCenterStyle.ScrollableTabBar}
                    renderTabBar={() => <MessageTabBar tabStyle={{paddingBottom: 0}} newMessageNum={this.state.newMessageNum} newMessageNoticesNum={this.state.newMessageNoticesNum} style={{height: Util.pixel*40,}} />}
                    removeClippedSubviews={false}
                >
                        {
                            this.state.isReload ?
                                this.state.items.map((v,key) => <MyMessageList tabLabel={v.name} key={key} type={v.type} root={this} navigation={this.navigation} />)
                            :
                                this.state.items.map((v,key) => <View tabLabel={v.name} key={key} />)
                        }
                </ScrollableTabView>
                <Loading ref={(ref) => this.loading=ref} />
                <EAlert ref={ref => this.eAlert = ref} />
            </View>
        )
    }
}