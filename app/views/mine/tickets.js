/**
 * Created by liuzhenli on 2017/12/22.
 */
import React, { Component } from 'react';
import {
	Text,
	View,
	RefreshControl,
	StatusBar,
	Image,
	TouchableOpacity,
	FlatList,
	InteractionManager
} from 'react-native';
import {redPacketPageStyle} from './../../styles/mine/redPacketStyle';
import ScrollableTabView from 'react-native-scrollable-tab-view';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import Util,{ Grow } from './../../commons/util';
import EAlert from './../components/ealert';
import Loading from './../components/loading';
import MineHeader from '../components/commonHeader';
import TicketsList from './ticketsList';
import DefaultTabBar from './../more/component/messageTabBar';
export default class Tickets extends Component {
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
			active: 'notUse',
			dataSource: [],
			refreshing: false,
			redPacketUsed: false,
			isShowBottom: false,
			page: 1,
			tabs:null,
			type: null
		}
	};
	componentWillMount(){
		Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
			this.setState({
				userInfo: userInfo
			});
			this.setState({
				tabs:[{label:'未使用',used: false},{label:'已使用',used: true}]
			})
		});

	};
	componentDidMount(){
	};
	renderTabBar = (name) =>{
		return(
			<DefaultTabBar activeTextColor='#025FCC'
						   inactiveTextColor='#9B9B9B'
						   tabStyle={redPacketPageStyle.tabBarStyle}
						   textStyle={redPacketPageStyle.tabBarTextStyle}
						   underlineStyle={redPacketPageStyle.menuItem}
			/>
		)
	};
	render() {
		return (
			<View style={redPacketPageStyle.container}>
				{
					Util.isIOS ?
						<StatusBar  barStyle="light-content" />
						: null
				}
				<MineHeader title="我的加息券" leftButton leftIcon goBack root={this}navigation={this.props.navigation}/>
				<View style={redPacketPageStyle.contentBox}>
					{
						this.state.tabs ?
							<ScrollableTabView
								ref={(tabView) => { this.tabView = tabView; }}
								style={redPacketPageStyle.ScrollableTabBar}
								removeClippedSubviews={false}
								renderTabBar={this.renderTabBar}
								locked={false}>
								{
									this.state.tabs.map((item,index) => {
										return (
											<TicketsList key={index} root={this} tabLabel={item.label} ticketsUsed={item.used} navigation={this.props.navigation}/>
										)
									})
								}
							</ScrollableTabView>
							:
							null
					}

				</View>
				<EAlert ref={(ref) => this.eAlert = ref}/>
				<Loading ref={(ref) => this.loading = ref}/>
			</View>
		);
	}
}