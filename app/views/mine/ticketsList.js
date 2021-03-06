/**
 * Created by liuzhenli on 2017/12/22.
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
	InteractionManager
} from 'react-native';
import {redPacketPageStyle} from './../../styles/mine/redPacketStyle';
import Fetch from './../../commons/fetch';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import TicketsItem from './ticketsItem';
import util,{ Grow } from './../../commons/util';
import { NavigationActions } from 'react-navigation';
import Loading from './../components/loading';
import EAlert from './../components/ealert';
export default class TicketsList extends Component {
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
			redPacketUsed: this.props.ticketsUsed,
			isShowBottom: false,
			page: 1,
			tabs:null,
			type: null,
			tickets:[]
		}
	};
	componentWillMount(){
		Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
			this.setState({
				userInfo: userInfo
			});
			
		});
	};
	componentDidMount(){
		InteractionManager.runAfterInteractions(() => {
			setTimeout(() => {
				this.getRedPacketList();
			})
		});
	}
	getRedPacketList(type){
		let data = {
			pageNum: this.state.page,
			pageSize:10,
			type: 1,
			sessionId: __sessionId,
			useId: __useId
		}
		let url = this.props.ticketsUsed ? 'ticket/usedList' : 'ticket/unusedList'
		this.loading && this.loading.show();
		Fetch.post(url,data,(res) => {
			console.log('res',res)
			this.loading && this.loading.hide();
			if(res.success){
				let list = type ? this.state.dataSource.concat(res.body.list) :  res.body.list
				this.setState({
					isShowBottom: res.body.totalRecordNum == res.body.endRecordId,
					dataSource: list,
					refreshing: false
				})
			}
		},() => {
			this.loading && this.loading.show('netFail','网络超时',2000)
		},null,this,this.getRedPacketList.bind(this))
	};
	toUseRedPack(){
		global.forbidTransition = true;
		this.props.navigation.navigate('tab',{},NavigationActions.navigate({routeName: 'list'}));
		setTimeout(() => { global.forbidTransition = false;})
	}
	renderItem = ({item}) => {
		return(
			<TicketsItem data={item} navigation={this.props.navigation} callBack={this.toUseRedPack.bind(this)}/>
		)
	};
	_keyExtractor = (item, index) => {
		return index;
	};
	
	_listEmptyComponent = () => {
		return(
			<View style={redPacketPageStyle.emptyItemBox}>
				<Image style={redPacketPageStyle.emptyItem} source={require('./../../imgs/commons/noData_icon.png')}/>
				<Text allowFontScaling={false}  style={redPacketPageStyle.emptyItemText}>{this.state.redPacketUsed ? "您尚无已使用的加息券" : '您尚无未使用的加息券'}</Text>
			</View>
		)
	};
	listFooterComponent = () =>{
		if(this.state.dataSource.length > 10){
			return(
				<View style={redPacketPageStyle.footerBox}>
					<Text allowFontScaling={false} style={redPacketPageStyle.footerTitle}>已加载完成，没有更多了</Text>
				</View>
			)
		}else{
			return null
		}
	};
	onEndReached() {
		if (!this.state.isShowBottom) {
			this.setState({
				page: this.state.page + 1,
			});
			setTimeout(() => {
				this.getRedPacketList(true)
			}, 1)
		}
	};
	_onRefresh() {
		this.setState({
			refreshing: true,
			page: 1,
		});
		setTimeout(() => {
			this.getRedPacketList();
		}, 1)
		
	}
	render() {
		let { tabLabel } = this.props;
		return (
			<View style={redPacketPageStyle.container} tabLabel={tabLabel}>
				<View style={redPacketPageStyle.contentBox}>
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
				<Loading ref={(ref) => this.loading = ref} height={util.size.height * 0.6}/>
				<EAlert ref={(ref) => this.eAlert = ref}/>
			</View>
		);
	}
}