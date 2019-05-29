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
    TouchableOpacity
} from 'react-native';
import {myInvestmentPageStyle} from './../../styles/mine/myInvestmentStyle';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import EAlert from './../components/ealert';
import Loading from './../components/loading';
import MineHeader from '../components/commonHeader';
import MyInvestmentList from './myInvestmentList';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DefaultTabBar from './../more/component/messageTabBar';
import {NavigationActions} from 'react-navigation';
import Button from './../components/button';
import { Grow } from './../../commons/util';
export default class MyInvestment extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.state = {
            isRefreshing: false,
            userInfo: null,
            activeMenu: 'comeIn',
            activeTab: 1,
            tabs:null,
            type: null,
            initPage: (this.props.navigation.state.params && this.props.navigation.state.params.page) || 0,
			InvestmentButton: false
        };
		this.setInvestmentButton = this.setInvestmentButton.bind(this);
    };
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            })
        });
        if(this.props.navigation.state.params && this.props.navigation.state.params.transfer){
            this.setState({
                tabs:[{label:'承接中',stateId: 3},{label:'已转入',stateId: 4}],
                type: "transfer"
            })
        }else{
            this.setState({
                tabs:[{label:'收款中',stateId: 1},{label:'出借中',stateId: 2},{label:'已完成',stateId: 3}]
            })
        }
    };
    componentDidMount(){

    };
    renderTabBar = (name) =>{
        return(
            <DefaultTabBar activeTextColor='#025FCC'
                           inactiveTextColor='#9B9B9B'
                           tabStyle={myInvestmentPageStyle.tabBarStyle}
                           textStyle={myInvestmentPageStyle.tabBarTextStyle}
                           underlineStyle={myInvestmentPageStyle.menuItem}
                           />
        )
    };
    toDetail(item,stateId){

            if(stateId == '1' || stateId == '3' || (this.state.type)){
                if(stateId == '3' && (item.claState == '4-1' || item.claState == '4-2' || item.claState == '4-3'|| item.claState == '4-4'|| item.claState == '8') ){
                    this.eAlert.show('alert',item.claStateFdName);
                }else{
                    this.props.navigation.navigate('investmentDetail',{data:item,stateId:stateId,claTransId: this.state.type == 'transfer' ? item.claTransId : null,type:this.state.type})

                }
            }
    };
    callback(){
        if(this.props.navigation.state.params && this.props.navigation.state.params.fromList){
            global.forbidTransition = true;
            this.props.navigation.navigate('tab',{},NavigationActions.navigate({routeName: 'mine'}));
            setTimeout(() => { global.forbidTransition = false;})
        }else{
            this.props.navigation.goBack();
        }
    }
	setInvestmentButton (showType) {
		this.setState({
			InvestmentButton: showType
		})
	}
    render() {
        return (
            <View style={myInvestmentPageStyle.container}>

                <MineHeader title={this.state.type == 'transfer' ? "债权转让" : "我的出借"} leftButton leftIcon callback={this.callback.bind(this)} root={this} navigation={this.props.navigation}/>

                <View style={myInvestmentPageStyle.contentBox}>
                    {
                        this.state.tabs ?
                            <ScrollableTabView
								
                                ref={(tabView) => { this.tabView = tabView; }}
                                style={myInvestmentPageStyle.ScrollableTabBar}
                                removeClippedSubviews={false}
                                renderTabBar={this.renderTabBar}
                                initialPage={this.state.initPage}
								
                            >
                                {
                                    this.state.tabs.map((item,index) => {
                                        return (
                                            <MyInvestmentList tabLabel={item.label} root={this} setInvestmentButton={this.setInvestmentButton} type={this.state.type}stateId={item.stateId}key={index} onPress={this.toDetail.bind(this)} navigation={this.props.navigation}/>
                                        )
                                    })
                                }
                            </ScrollableTabView>
                            :
                            null
                    }

                </View>
				{
					this.state.type != 'transfer' ?
						<TouchableOpacity activeOpacity={0.75} style={myInvestmentPageStyle.buttonBox} onPress={() => {global.forbidTransition = true;this.props.navigation.navigate('list');setTimeout(() => {global.forbidTransition = false},100)}}>
							<Text style={myInvestmentPageStyle.buttonText}>{
								this.state.InvestmentButton ? '继续出借' : '立即出借'
							}</Text>
						</TouchableOpacity>
						:
						null

				}

                <EAlert ref={(ref) => this.eAlert = ref}/>
                <Loading ref={(ref) => this.loading = ref}/>
            </View>
        );
    }
}