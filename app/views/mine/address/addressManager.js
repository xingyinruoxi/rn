/**
 * Created by liuzhenli on 2018/1/15.
 */
/**
 * Created by liuzhenli on 2018/1/15.
 */
import React,{ Component } from 'react'

import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image
} from 'react-native'
import Header from './../../components/commonHeader'
import Util from './../../../commons/util'
import Button from './../../components/button'
import EAlert from './../../components/ealert'
import Line from './../../../commons/line'
import Fetch from './../../../commons/fetch'
const EventEmitter = require('RCTDeviceEventEmitter');
import Loading from './../../components/loading'
let px = Util.pixel
export  default class AddressManger extends  Component<{}> {
	static navigationOptions = {
		header: null
	}
	constructor(props) {
		super(props);
		this.state = {
				userInfo: props.navigation.state.params.userInfo,
				addressObj: null
		}
		this.addNewAddress = this.addNewAddress.bind(this)
		EventEmitter.addListener('getStatus',this.getStatus.bind(this))
		EventEmitter.addListener('getAddress',this.getAddress.bind(this))
	}
	componentDidMount() {
		this.getAddress()
	}
	getAddress() {
		this.loading && this.loading.show()
		Fetch.getT(`addr/address?userId=${this.state.userInfo.useId || this.state.userInfo.sftUserMdl.useId}`,(res) => {
			console.log('ress', res)
			this.loading && this.loading.hide()
					this.setState({
						addressObj: res
					})
		}, (error) => {

		})
	}
	getStatus(){
		let data = {
			sessionId: __sessionId,
			useId: __useId
		};
		Fetch.post('userCenter/checkuserstatus',data,res => {
			if(res.success){
				this.setState({
					userInfo: res.body.extend
				});
				Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
					userInfo.sftUserMdl = res.body.extend;
					Storage.setItem(StorageKey.eTD_USERINFO,userInfo)
				}).then(() => EventEmitter.emit('getUserInfo'))
			}
		},error => {

		},null,this)
	}
	addNewAddress() {
		let userInfo = this.state.userInfo;
		let {navigation } = this.props;
		userInfo && userInfo.useAuthRealName == '1' ?
			navigation.navigate('addNewAddress',{userInfo: this.state.userInfo})
			:
			this.eAlert.show('confirm','您还未进行实名认证，请先进行实名认证',() => {
						navigation.navigate('createRealNameAccount',{haveCertify: false,userInfo: this.state.userInfo})
			})
	}
	deleteAddress() {
		this.eAlert.show('confirm',"地址删除后，发放奖品时会影响奖品发放，确定删除吗？",() => {
			let data = {
				userId: this.state.userInfo.useId || this.state.userInfo.sftUserMdl.useId,
				id: this.state.addressObj.id
			}
			this.loading.show()
			Fetch.postT('addr/remAddr',data, (res) => {
				this.loading.hide()
				this.getAddress()
			}, (data) => {
				console.log('remosveAddr error', res)
			})
		})
	}
	render() {
		let { navigation } = this.props;
		let { addressObj} = this.state
		return (
			<View style={styles.container}>
				<Header leftButton leftIcon title="地址管理" goBack navigation={navigation}/>
				<ScrollView contentContainerStyle={{flex:1}}>
					<View style={styles.contentBox}>
						{
							addressObj && addressObj.status == 1 ?

								<View style={styles.withAddressBox}>
									<View style={styles.containerBox}>
										<View style={styles.userNameBox}>
											<Text style={styles.userName}> {addressObj && addressObj.receiverName || ""}</Text>
											<Text style={styles.userName}> {addressObj && addressObj.contactPhone || ""} </Text>
										</View>
										<View style={styles.addressDetailBox}>
											<Text style={styles.addressDetailText}>{addressObj && addressObj.province + `  ` + addressObj.area + "  " +addressObj.detailedAddr || ""}</Text>
										</View>
										<Line full/>
										<View style={styles.userNameBox}>
											<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('addNewAddress',{userInfo: this.state.userInfo,addressObj: addressObj,type: 'edit'})}>
												<Image source={require('./../../../imgs/mine/edit.png')}/>
												<Text style={styles.buttonText}>编辑</Text>
											</TouchableOpacity>
											<TouchableOpacity style={styles.button} onPress={() => this.deleteAddress()}>
												<Image source={require('./../../../imgs/mine/delete.png')}/>
												<Text style={styles.buttonText}>删除</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
								:
								<View style={styles.withOutAddress}>
									<Image source={require('./../../../imgs/commons/noData_icon.png')}/>
									<Text style={styles.withOutAddressText}>您还没有添加您的地址，添加地址有助于发送奖品时更方便的联系您</Text>
									<Button buttonName="快去添加"  onPress={this.addNewAddress}/>
								</View>
						}

					</View>
				</ScrollView>
				<EAlert ref={eAlert => this.eAlert = eAlert}/>
				<Loading ref={loading => this.loading = loading}/>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	container: {
		flex:1
	},
	contentBox:{
		flex:1,
		backgroundColor: '#f6f7fa',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingHorizontal: 14 * px
	},
	withOutAddress: {
		minHeight: 100 * px,
		width: 250 * px,
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginTop: 90 * px
	},
	withOutAddressText: {
		fontSize: Util.commonFontSize(15),
		lineHeight: Util.lineHeight(22),
		color: '#4a4a4a',
		marginTop: 30 * px,
		textAlign: 'center',
		marginBottom: 100 * px
	},
	withAddressBox: {
		flex: 1,
	},
	containerBox: {
		minHeight: 200 * px,
		width: Util.size.width,
		backgroundColor: '#fff'
	},
	userNameBox: {
		height: 50 * px,
		backgroundColor: '#fff',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: 14 * px
	},
	addressDetailBox: {
		flex:1,
		paddingHorizontal: 14 * px,

	},
	addressDetailText: {
		fontSize: Util.commonFontSize(14),
		lineHeight: Util.lineHeight(18),
		color: '#9B9B9B'
	},
	button: {
		height: 50 * px,
		width: 50 * px,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	buttonText: {
		fontSize: Util.commonFontSize(13)
	},
	userName: {
		fontSize: Util.commonFontSize(15),
		color: '#4A4A4A'
	}
})
