/**
 * Created by liuzhenli on 2017/7/17.
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
    TextInput,
    Linking,
    BackHandler
} from 'react-native';
import {phoneCertifyPageStyle} from './../../../styles/mine/setting/phoneCertifyStyle';
var Storage = require('./../../../commons/storage');
var StorageKey = require('./../../../commons/storageKey');
import MineHeader from '../../components/commonHeader';
import Loading from './../../components/loading';
import EAlert from './../../components/ealert';
import Line from './../../../commons/line';
import Button from './../../components/button';
var Fetch = require('./../../../commons/fetch');
import Util,{ Grow } from './../../../commons/util'
var dismissKeyboard = require('dismissKeyboard');
const EventEmitter = require('RCTDeviceEventEmitter');
import { NavigationActions } from 'react-navigation';
const {systemInfos} = require('./../../../commons/config');
export default class PhoneCertify extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);

        this.state = {
            accountInfo: null,
            userInfo: this.props.navigation.state.params && this.props.navigation.state.params.userInfo,
            formData:{
                realName:'',
                IDCardNum: ''
            },
            errorTitle: '',
            showError: false,
            haveCertify: this.props.navigation.state.params.haveCertify,

        }
    };
    componentDidMount(){
				Grow.track('pg_my_verify_userbrowse',{'pg_my_verify_userbrowse':'实名认证页面浏览用户量'});
        if(!Util.isIOS){
            this.forbidGoBackHandler = BackHandler.addEventListener('forbidGoBack',this.callback.bind(this));
        }
    };
    componentWillUnmount(){
        this.forbidGoBackHandler && this.forbidGoBackHandler.remove();
    }
    checkFormData(){
			Grow.track('elbn_my_verify_goverify_click',{'elbn_my_verify_goverify_click':'立即认证按钮点击量'});
        let formData = this.state.formData;
        formData.realName.replace(/\s+/,'').length > 0 ?
            formData.IDCardNum.replace(/\s+/,'').length == 15 ||  formData.IDCardNum.replace(/\s+/,'').length == 18 ?
                this.submitData()
                :
                this.setState({

                    showError: '身份证号码输入错误，请重新输入'
                })
            :
            this.setState({

                showError: '请输入真实姓名'
            })
    };
    submitData(){
        let data = {
            useId: __useId,
            trueName: this.state.formData.realName,
            IDCard: this.state.formData.IDCardNum,
            sessionId: __sessionId
        };
        this.loading.show();
        Fetch.post('user/ceraudit',data,res => {
            console.log('ceraudit',res);
            this.loading.hide();
            if(res.success){
				console.log('ceraudit',res)
                EventEmitter.emit('getStatus');
                EventEmitter.emit('getUserInfo');
				this.getStatus();
                this.eAlert.show('alert','恭喜您实名认证完成，点击继续前往之前的操作',() => {
								Grow.track('elbn_my_verify_verifyokconfirm_click',{'elbn_my_verify_verifyokconfirm_click':'认证成功确认按钮点击量'});
                    this.callback();
                })
            }else{
                this.setState({
                    showError: res.info
                })
            }
        },error => {
            this.loading.show('netFail','网络错误',2000)
        },30 * 1000,this)
    }
    callback(){
				console.log('realName this.props.navigation', this.props.navigation.state)
        if(this.props.navigation.state.params && this.props.navigation.state.params.register){
            global.forbidTransition = true;
            this.props.navigation.navigate('home',{},NavigationActions.navigate({routeName: 'home'}));
            setTimeout(() => {global.forbidTransition = false,EventEmitter.emit('checkFingerPwd')},100)
        }else if(this.props.navigation.state.params && this.props.navigation.state.params.toMine){
					global.forbidTransition = true;
					this.props.navigation.navigate('mine',{},NavigationActions.navigate({routeName: 'mine'}));
					setTimeout(() => {global.forbidTransition = false,EventEmitter.emit('checkFingerPwd')},100)
				}else{
            EventEmitter.emit('getStatus');
            this.props.navigation.goBack();
        }
    };
	getStatus(){
		let data = {
			sessionId: __sessionId,
			useId: __useId
		};
		Fetch.post('userCenter/checkuserstatus',data,res => {
			console.log('checkuserstatus',res);
			if(res.success){
				this.setState({
					userInfo: {sftUserMdl :res.body.extend}
				});
				if(res.body.extend.useIdentityNum){
					let useIdentityNum = res.body.extend.useIdentityNum;
					let len = useIdentityNum && useIdentityNum.length
					if(len == 18){
						if(useIdentityNum.slice(len - 2 , 1) % 2 == 0){
							Grow.setCS2Value('女','gender');
						}else{
							Grow.setCS2Value("男",'gender');
						}

					}else{
						if(useIdentityNum.slice(len - 1 , 1) % 2 == 0){
							Grow.setCS2Value('女','gender');
						}else{
							Grow.setCS2Value("男",'gender');
						}
					}
				}
				res.body.extend.useIdentityNum && Grow.setCS3Value(res.body.extend.useIdentityNum.slice(6,8),'birthYear');
				Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
					userInfo.sftUserMdl = res.body.extend;
					Storage.setItem(StorageKey.eTD_USERINFO,userInfo)
				}).then(() => EventEmitter.emit('getUserInfo'))
			}
		},error => {

		},null,this)
	}
    toTell(){
        Linking.canOpenURL('tel://'+systemInfos.customer_service_tel_num).then((support) => {
            if(support){
                Linking.openURL('tel://'+systemInfos.customer_service_tel_num)
            }
        })
    }
    render() {
        let userInfo = this.state.userInfo;
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => dismissKeyboard()}style={phoneCertifyPageStyle.container}>
                <MineHeader title="实名认证" leftButton leftIcon callback={this.callback.bind(this)} navigation={this.props.navigation}/>
                {
                    this.state.haveCertify ?
                        <View style={phoneCertifyPageStyle.contentBox}>
                            <View  style={[phoneCertifyPageStyle.itemBox,phoneCertifyPageStyle.cancelMB]}>
                                <View style={[phoneCertifyPageStyle.labelTextBox]}>
                                    <Text allowFontScaling={false} style={phoneCertifyPageStyle.labelText}>真实姓名</Text>
                                </View>
                                <View style={[phoneCertifyPageStyle.labelTextBox,phoneCertifyPageStyle.labelTextBoxRight]}>
                                    <Text allowFontScaling={false} style={phoneCertifyPageStyle.labelTextRight}>{ userInfo ? userInfo.useName : '--'}</Text>
                                </View>
                            </View>
                            <Line/>
                            <View style={phoneCertifyPageStyle.itemBox}>
                                <View style={[phoneCertifyPageStyle.labelTextBox]}>
                                    <Text allowFontScaling={false} style={phoneCertifyPageStyle.labelText}>证件类型</Text>
                                </View>
                                <View style={[phoneCertifyPageStyle.labelTextBox,phoneCertifyPageStyle.labelTextBoxRight]}>
                                    <Text allowFontScaling={false} style={phoneCertifyPageStyle.labelTextRight}>身份证</Text>
                                </View>
                            </View>
                            <Line/>
                            <View style={phoneCertifyPageStyle.itemBox}>
                                <View style={[phoneCertifyPageStyle.labelTextBox]}>
                                    <Text allowFontScaling={false} style={phoneCertifyPageStyle.labelText}>证件号码</Text>
                                </View>
                                <View style={[phoneCertifyPageStyle.labelTextBox,phoneCertifyPageStyle.labelTextBoxRight]}>
                                    <Text allowFontScaling={false} style={phoneCertifyPageStyle.labelTextRight}>{userInfo ? userInfo.useIdentityNum.replace(/(\d{3})\d+(.{4})/,"$1****$2") :'--'}</Text>
                                </View>
                            </View>
                            <Line/>
                            <View  style={phoneCertifyPageStyle.bottomItemBox}>
                                <Text allowFontScaling={false} style={phoneCertifyPageStyle.bottomItemBoxTitle}  onPress={this.toTell.bind(this)}>
                                    如果您希望修改实名认证信息{'\n'}请拨打<Text allowFontScaling={false} style={{color:'#025FCC'}}>{systemInfos.customer_service_tel_num}</Text>
                                </Text>
                            </View>
                        </View>
                        :
                        <View style={phoneCertifyPageStyle.contentBox}>
                            <View style={phoneCertifyPageStyle.topRemindTitleBox}>
                                <Text allowFontScaling={false} style={phoneCertifyPageStyle.topRemindTitle}>完成实名认证才能继续您的充值、出借等操作</Text>
                            </View>
                            <View style={phoneCertifyPageStyle.inputBox}>
                                <View style={phoneCertifyPageStyle.inputItemBox}>
                                    <Image style={phoneCertifyPageStyle.inputLabelImg}source={require('./../../../imgs/mine/realName/userImg.png')}/>
                                    <TextInput style={[phoneCertifyPageStyle.smsCodeInput,{width: Util.isIOS ? Util.size.width - 160 : Util.size.width - 230}]}
                                               placeholder="请输入真实姓名"
                                               underlineColorAndroid="transparent"
                                               onChangeText={Util.setFormData.bind(this,this,'realName')}
                                               placeholderTextColor="#C5C5C5"
                                               clearButtonMode="while-editing"
                                               onFocus={() => {this.setState({activeInput:'realName'})}}/>
                                </View>
                                <Line/>
                                <View style={phoneCertifyPageStyle.inputItemBox}>
                                    <Image style={phoneCertifyPageStyle.inputLabelImg}source={require('./../../../imgs/mine/realName/idCardImg.png')}/>
                                    <TextInput style={[phoneCertifyPageStyle.smsCodeInput,{width: Util.isIOS ? Util.size.width - 160 : Util.size.width - 230}]}
                                               placeholder="请输入18位有效身份证号码"
                                               underlineColorAndroid="transparent"
                                               onChangeText={Util.setFormData.bind(this,this,'IDCardNum')}
                                               maxLength={18}
                                               keyboardType="email-address"
                                               placeholderTextColor="#C5C5C5"
                                               clearButtonMode="while-editing"
                                               onFocus={() => {this.setState({activeInput:'IDCardNum'})}}/>
                                </View>
                                <Line/>
                                <View style={phoneCertifyPageStyle.errorRemindTitleBox}>
                                    {
                                        this.state.showError ?
                                            <Text allowFontScaling={false} style={phoneCertifyPageStyle.errorRemindTitle}>
                                                {this.state.showError}
                                            </Text>
                                            :
                                            null
                                    }

                                </View>
                                <View style={phoneCertifyPageStyle.buttonBox}>
                                    <Button buttonName="立即认证" onPress={this.checkFormData.bind(this)}/>
                                </View>

                            </View>
                            <View style={phoneCertifyPageStyle.bottomRemindBox}>
                                <Text allowFontScaling={false} style={phoneCertifyPageStyle.bottomRemind}>如果您实名认证失败或者使用其他证件{'\n'}请拨打<Text allowFontScaling={false} style={{color:'#025FCB'}} onPress={this.toTell.bind(this)}>{systemInfos.customer_service_tel_num}</Text></Text>
                            </View>
                        </View>
                }
                <Loading ref={ref => this.loading = ref}/>
                <EAlert ref={ref => this.eAlert = ref}/>
            </TouchableOpacity>
        );
    }
}
