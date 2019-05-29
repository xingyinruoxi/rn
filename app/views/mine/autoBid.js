/**
 * Created by liuzhenli on 2017/7/12.
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
    Modal,
    Animated,
    Easing,
	KeyboardAvoidingView,
	Keyboard
} from 'react-native';
import {autoBidPageStyle} from './../../styles/mine/autoBidStyle';
import Uitl from './../../commons/util';
import Picker from 'react-native-picker';
import Line from './../../commons/line';
import Util,{ Grow } from './../../commons/util';
var Fetch = require('./../../commons/fetch') ;
var Gbk = require('./../../commons/gbk') ;
import Button from './../components/button';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
var Config = require('./../../commons/config');
import EAlert from './../components/ealert';
import CloseButton from './../components/closeButton';
import Loading from './../components/loading';
import Switch from 'react-native-switch-pro';
import MineHeader from '../components/commonHeader';
var dismissKeyboard = require('dismissKeyboard');
import SinglePicker from './../components/picker';
import Device from 'react-native-device-info';
export default class AutoBid extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
        gesturesEnabled:false
    });
    constructor(props){
        super(props);
        this.state = {
            isRefreshing: false,
            userInfo: null,
            userAccountData: null,
            hideAccountInfo: false,
            repayDataString: '',
            repayDataArr: [],
            selected: true,
            openSetting: false,
            expectRepay: "请选择预期投资回报率",
            notSave: false,
            formData:{
                singleAmount: '',
                saveAmount: '',
                repayDataEnd: '',
            },
            repayDataStart:'请选择',
            repayDataEnd:'请选择',
            signedState: false,
            dicValue: '1',
            visible: false,
            height: new Animated.Value(45 * Uitl.pixel),
            scale: new Animated.Value(0),
            showSureModal: false,
						options:[],
						type: '',
			showKeyboardControll: false
        }
		this.keyboardWillShowShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow.bind(this));
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.__keyboardDidHide.bind(this));
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));

		this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    };
	componentWillUnmount(){
		dismissKeyboard();
		Picker.hide();
		this.keyboardWillShowShowListener.remove();
		this.keyboardDidHideListener.remove();

		this.setState({ showModal:false })
	}
    componentWillMount(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            });
            setTimeout(() => {
                this.getBidInfo(userInfo)
            })
        });

    };
	keyboardWillHide(e) {
		this.setState({
			showKeyboardControll: false
		});
	}
	keyboardDidShow() {
		!Util.isIOS && this.setState({
			showKeyboardControll: true
		});
	}
	_keyboardWillShow(e){

		this.setState({
			showKeyboardControll: true
		})
	}
	__keyboardDidHide(){
		!Util.isIOS &&this.setState({
			showKeyboardControll: false
		});
	}
    initPicker(type){
        dismissKeyboard();
        this.setState({
            showModal: true
        });
        let data =  type == 'start' ?
					[{key:'7',value:'7'},{key:'8',value:'8'},{key:'9',value:'9'},{key:'10',value:'10'},{key:'11',value:'11'}]
					: [{key:'7',value:'7'},{key:'8',value:'8'},{key:'9',value:'9'},{key:'10',value:'10'},{key:'11',value:'11'},{key:'12',value:'12'},{key:'13',value:'13'},{key:'14',value:'14'},{key:'15',value:'15'}];
			this.setState({
				options: data,
				type: type
			});
			setTimeout(() => {
				console.log('this.state.data',this.state.options)
				this.singlePicker.show();
			},100);
    }
		selectedData(data){
				let type = this.state.type;
				type == 'start' ? this.setState({ repayDataStart: data.value, })
					:
					this.setState({ repayDataEnd: data.value, })
				this.judgeNum()
		}
    judgeNum(){
        if(this.state.repayDataStart != '请选择' && this.state.repayDataEnd != '请选择'){
            if(parseInt(this.state.repayDataEnd) - parseInt(this.state.repayDataStart) < 0){
                this.eAlert.show('alert','开始区间值不能大于结束区间值',() => {
                    this.setState({
                        repayDataStart: 7
                    })
                })
            }
        }
    }
    getBidInfo(userInfo){
        let data = {
            sessionId:  __sessionId,
            useId: __useId
        };
        Fetch.post('autobid/autoBidInfo',data,res => {
            console.log('autoBidInfo',res)
            if(res.success){
                this.setState({
                    signedState: res.body,
                    notSave: false,
                    openClose: res.body.openClose,
                    autoBidData: res.body
                });
                
            }
        },error => {
			this.loading && this.loading.show('netFail','网络超时',2000);
        },20 * 1000,this)
    };
    setRepayData(date){
        let repayDataString = this.state.repayDataString;
        let repayDataArr = this.state.repayDataArr;
        if(repayDataArr.length == 3 && repayDataString.indexOf(date) == -1) return;
        if(repayDataString.indexOf(date) >= 0){
            let copyRepayDataArr = [];
            repayDataArr.map((item,index) => {
                if(date != item){
                    copyRepayDataArr.push(item);
                }
            });
            this.setState({
                repayDataArr: copyRepayDataArr,
                repayDataString: copyRepayDataArr.join(','),
                notSave: true
            })
        }else{
            repayDataArr.push(date);
            this.setState({
                repayDataArr: repayDataArr,
                repayDataString: repayDataArr.join(','),
                notSave: true
            })
        }
    };
    changeSelectedAr = () =>{
        this.setState({
            selected: !this.state.selected
        })
    };
    setFormData(module,arg,val,auto){
        if(!auto){
            this.setState({
                notSave: true
            });
        }
        Util.setFormData(module,arg,val)
    };

    checkFormData(){
        let fromData = this.state.formData;
        fromData.singleAmount.replace(/\s+/).length > 0 ?
            parseInt(fromData.singleAmount) >= 100 && parseInt(fromData.singleAmount) <= 100000 ?
                this.state.repayDataStart !='请选择' &&  this.state.repayDataEnd !='请选择'?
                    fromData.saveAmount.replace(/\s+/).length > 0 ?
                        this.state.repayDataArr.length > 0 ?
                            this.state.selected ?
                                this.sureBindCard()
                                :
                                this.eAlert.show('alert','请同意自动投标授权协议！')
                            :
                            this.eAlert.show('alert','请选择还款期限')
                        :
                        this.eAlert.show('alert','请输入账户保留金额')
                    :
                    this.eAlert.show('alert','请设置预期投资回报率')
                :
                this.eAlert.show('alert','投标金额需100～100000之间')
            :
            this.eAlert.show('alert','请输入投标金额')

    };
    checkRule = () => {
        dismissKeyboard();
        Picker.hide();
        this.setState({showModal:false})
        this.props.navigation.navigate('autoBidAgreement')
    };
    pop(){
        if(this.state.notSave){
            this.eAlert.show('confirm','当前设置未保存，您确认要退出吗？',() => {this.props.navigation.goBack()})
        }else{
            this.props.navigation.goBack()
        }
    };

    saveData(){
        this.hideModal();
        let data = {
            accountRetentionAmount:parseFloat(this.state.formData.saveAmount).toFixed(2),
            autoBidQuota: parseFloat(this.state.formData.singleAmount).toFixed(2),
            itemList: this.state.repayDataString,
            openClose: this.state.openSetting ? 1 : 0,
            sessionId: __sessionId,
            useId: this.state.userInfo.sftUserMdl.useId,
            yearRateIntervalKey: this.state.repayDataStart + '%~' + this.state.repayDataEnd + '%',
            bidOperateTermimal: Uitl.isIOS ? '2-2' :'2-1',
        };
        this.loading.show();
        Fetch.post('autobid/saveOrUpdate',data,res => {
            console.log('autoBid/saveOrUpdate',res)
            this.loading.hide();
            this.setState({
                notSave: false,
            });
            if(res.success){
                this.getBidInfo();
            }else{
                this.eAlert.show('alert',res.info);
            }
        },error => {
            this.loading.show('netFail','网络超时',2000);
        },20 * 1000,this)
    };
    resetData(){
        this.state.signedState.autoBidQuota && this.setFormData(this,'singleAmount',this.state.signedState.autoBidQuota.toString(),true);
        this.state.signedState.accountRetentionAmount && this.setFormData(this,'saveAmount',this.state.signedState.accountRetentionAmount.toString(),true);
        this.setState({
            openSetting: true,
            notSave: true,
            openClose: 2,
        });
        Animated.timing(this.state.height,{
            toValue:0,
            duration: 330,
            easing: Easing.inOut(Easing.circle)
        }).start()
    };
    closeAutoBid(){
        this.eAlert.show('confirm','您确认关闭自动投标',() => {
            this.loading.show();
            Fetch.post('autobid/openClose',{
                openClose: 2,
                sessionId: __sessionId,
                useId: this.state.userInfo.sftUserMdl.useId,
                bidOperateTermimal: Uitl.isIOS ? '2-2' :'2-1',
            },(res) => {
                this.loading.hide();
                if(res.success){
                    this.setState({autoBidOpen: false,openSetting:false,signedState:false,notSave:false,openClose: 2, height: new Animated.Value(45 * Uitl.pixel),})
                }else{
                    this.setState({
                        autoBidOpen: true,

                    });
                    this.eAlert.show('alert',res.info)
                }
            },(error) => {

            },null,this)
        },null,() => {
            this.setState({
               openClose : 1
            })
        });
    };
    changeBoxVisible(value){
         this.setState({
             openSetting: value,
             notSave: !this.state.notSave,
         });
        Animated.timing(this.state.height,{
            toValue: 0,
            duration: 330,
            easing: Easing.inOut(Easing.circle)
        }).start()
    }
    sureBindCard(){
        this.setState({showSureModal: true})
        setTimeout(() => {
            Animated.spring(this.state.scale,{
                toValue: 1,
                duration: 10,
                tension: 30,
                friction: 4
            }).start();
        });
    };
    hideModal(){
        this.setState({showSureModal: false, scale: new Animated.Value(0),})
    };
    render() {
        return (
            <TouchableOpacity activeOpacity={1} style={autoBidPageStyle.container} onPress={() => {dismissKeyboard();this.singlePicker.hide();this.setState({activeInput:'',showModal:false,showSureModal: false})}}>
                <MineHeader title="自动投标设置" leftButton leftIcon checkRule
                            rightButton={(this.state.openClose == 1 || (this.state.openClose != 1 && this.state.openSetting)) ? "规则说明" : false}
                            rightButtonCallback={this.checkRule}
                            navigation={this.props.navigation}
                            root={this}
                            callback={this.pop.bind(this)}/>
                {
                    this.state.openClose == 1 ?
                       <ScrollView style={autoBidPageStyle.settingBox}>
                           <View  style={autoBidPageStyle.itemBox} >
                               <View style={[autoBidPageStyle.labelTextBox]}>
                                   <Text allowFontScaling={false} style={autoBidPageStyle.labelText}>自动投标状态</Text>
                               </View>
                               <View style={[autoBidPageStyle.labelTextBox,autoBidPageStyle.labelTextBoxRight]}>
                                   <Switch  width={50} height={25} value={this.state.openClose == 1} onSyncPress={this.closeAutoBid.bind(this)}/>
                               </View>
                           </View>

                           <View activeOpacity={0.7} style={autoBidPageStyle.autoStatus}>
                                   <Text allowFontScaling={false} style={autoBidPageStyle.labelText}>当前自动投标开启状态</Text>
                           </View>

                           <View activeOpacity={0.7} style={autoBidPageStyle.itemBox}>
                               <View style={[autoBidPageStyle.labelTextBox]}>
                                   <Text allowFontScaling={false} allowFontScaling={false} style={autoBidPageStyle.labelText}>单笔投标金额</Text>
                               </View>
                               <View style={[autoBidPageStyle.labelTextBox,autoBidPageStyle.labelTextBoxRight]}>
                                   <Text allowFontScaling={false} style={[autoBidPageStyle.labelTextRight,{color:"#3F3A39"}]}>{this.state.signedState ? this.state.signedState.autoBidQuota.toFixed(2) : null}元</Text>
                               </View>

                           </View>
                           <Line />
                           <View activeOpacity={0.7} style={autoBidPageStyle.itemBox}>
                               <View style={[autoBidPageStyle.labelTextBox]}>
                                   <Text allowFontScaling={false} style={autoBidPageStyle.labelText}>预期年回报率</Text>
                               </View>
                               <View style={[autoBidPageStyle.labelTextBox,autoBidPageStyle.labelTextBoxRight]}>
                                   <Text allowFontScaling={false} style={[autoBidPageStyle.labelTextRight,{color:"#3F3A39"}]}>{this.state.signedState ? this.state.signedState.yearRateInterval : null}</Text>
                               </View>
                           </View>
                           <Line />
                           <View activeOpacity={0.7} style={autoBidPageStyle.itemBox}>
                               <View style={[autoBidPageStyle.labelTextBox]}>
                                   <Text allowFontScaling={false} style={autoBidPageStyle.labelText}>账户保留金额</Text>
                               </View>
                               <View style={[autoBidPageStyle.labelTextBox,autoBidPageStyle.labelTextBoxRight]}>
                                   <Text allowFontScaling={false} style={[autoBidPageStyle.labelTextRight,{color:"#3F3A39"}]}>{this.state.signedState ? this.state.signedState.accountRetentionAmount.toFixed(2): null}元</Text>
                               </View>
                           </View>
                           <Line />
                           <View activeOpacity={0.7} style={[autoBidPageStyle.itemBox,autoBidPageStyle.limitsTime]}>
                               <View style={[autoBidPageStyle.labelTextBox]}>
                                   <Text allowFontScaling={false} style={autoBidPageStyle.labelText}>还款期限</Text>
                               </View>
                               <View style={[autoBidPageStyle.labelTextBox,autoBidPageStyle.labelTextBoxRight,{ flex:2.5,}]}>
                                   {this.state.signedState ? this.state.signedState.itemList.map((item,index) => {
                                           if(item.iteRepayInterval == '1'){
                                               return <View style={[autoBidPageStyle.autoTimeItem,]} key={index}><Text allowFontScaling={false} style={[autoBidPageStyle.autoTimeItemText]}>{item.iteRepayDate + '个月'}</Text></View>
                                           }else{
                                               return <View style={[autoBidPageStyle.autoTimeItem,]} key={index}><Text allowFontScaling={false} style={[autoBidPageStyle.autoTimeItemText]}>{item.iteRepayDate + '天'}</Text></View>
                                           }
                                   }) : null}
                               </View>
                           </View>
                           <View style={autoBidPageStyle.buttonBox}>
                               <View style={autoBidPageStyle.buttonSubBox}>
                                   <Button buttonName="修改设置" color="#025FCB" textColor='#fff' onPress={this.resetData.bind(this)}/>

                           </View>
                           </View>
                       </ScrollView>
                        :
                        <ScrollView style={autoBidPageStyle.settingBox}>
                            <Animated.View  style={[autoBidPageStyle.itemBox,{height: this.state.height}]}>
                                <View style={[autoBidPageStyle.labelTextBox]}>
                                    <Text allowFontScaling={false} style={autoBidPageStyle.labelText}>自动投标未生效</Text>
                                </View>
                                <View style={[autoBidPageStyle.labelTextBox,autoBidPageStyle.labelTextBoxRight]}>
                                    <Switch  width={50} height={25} onSyncPress={(value) => this.changeBoxVisible(value)}/>
                                </View>
                            </Animated.View>
                            {
                                this.state.openSetting ?
                                    <View >
                                        <TouchableOpacity activeOpacity={0.7} style={autoBidPageStyle.itemBox} onPress={this.checkBankNum}>
                                            <View style={[autoBidPageStyle.labelTextBox]}>
                                                <Text allowFontScaling={false} style={autoBidPageStyle.labelText}>单笔投标金额</Text>
                                            </View>
                                            <View style={[autoBidPageStyle.labelTextBox,autoBidPageStyle.labelTextBoxRight]}>
                                                <TextInput style={autoBidPageStyle.input}
                                                           onChangeText={this.setFormData.bind(this,this,'singleAmount')}
                                                           placeholderTextColor="#C5C5C5"
                                                           underlineColorAndroid="transparent"
                                                           placeholder="请输入单笔出借金额"
                                                           maxLength={6}
                                                           keyboardType="numeric"
                                                           onFocus={() => {this.setState({activeInput: 'singleAmount'});Picker.hide()}}
                                                           value={this.state.formData.singleAmount}
                                                />
                                                {
                                                    !Util.isIOS && this.state.activeInput == 'singleAmount'?  <CloseButton onPress={() => {this.setFormData(this,'singleAmount',"")}}/> : null
                                                }
                                            </View>
                                            <Text allowFontScaling={false} style={autoBidPageStyle.labelTextRight}>元</Text>
                                        </TouchableOpacity>
                                        <Line notFull={true}/>
                                        <View>
                                            <View activeOpacity={0.7} style={autoBidPageStyle.itemBox} >
                                                <View style={[autoBidPageStyle.labelTextBox]}>
                                                    <Text allowFontScaling={false} style={autoBidPageStyle.labelText}>预期年回报率</Text>
                                                </View>
                                                <TouchableOpacity onPress={this.initPicker.bind(this,'start')}style={[autoBidPageStyle.labelTextBox,autoBidPageStyle.labelTextBoxWithBorder]}>
                                                    <Text allowFontScaling={false} style={[autoBidPageStyle.inputStart,this.state.repayDataStart != '请选择' && {color:"#4A4A4A"}]}>{this.state.repayDataStart}</Text>
                                                </TouchableOpacity>
                                                <Text allowFontScaling={false} style={[autoBidPageStyle.labelTextRight]}>% 至</Text>
                                                <TouchableOpacity onPress={this.initPicker.bind(this,'end')}style={[autoBidPageStyle.labelTextBox,autoBidPageStyle.labelTextBoxRight,autoBidPageStyle.labelTextBoxWithBorder]}>
                                                    <Text allowFontScaling={false} style={[autoBidPageStyle.inputEnd,this.state.repayDataEnd != '请选择' && {color:"#4A4A4A"}]}>{this.state.repayDataEnd}</Text>
                                                </TouchableOpacity>
                                                <Text allowFontScaling={false} style={[autoBidPageStyle.labelTextRight]}>% </Text>
                                            </View>
                                            <View style={[autoBidPageStyle.repayDataRemind]}>
                                                <Text allowFontScaling={false} style={[autoBidPageStyle.repayDataRemindText]}>预期年回报率区间均为整数</Text>
                                            </View>
                                        </View>


                                        <Line notFull={true}/>
                                        <TouchableOpacity activeOpacity={0.7} style={autoBidPageStyle.itemBox} onPress={this.checkBankNum}>
                                            <View style={[autoBidPageStyle.labelTextBox]}>
                                                <Text allowFontScaling={false} style={autoBidPageStyle.labelText}>账户保留金额</Text>
                                            </View>
                                            <View style={[autoBidPageStyle.labelTextBox,autoBidPageStyle.labelTextBoxRight]}>
                                                <TextInput style={autoBidPageStyle.input}
                                                           onChangeText={this.setFormData.bind(this,this,'saveAmount')}
                                                           placeholderTextColor="#C5C5C5"
                                                           underlineColorAndroid="transparent"
                                                           placeholder="请输入账户保留金额"
                                                           keyboardType="numeric"
                                                           maxLength={6}
                                                           onFocus={() => {this.setState({activeInput: 'saveAmount'});Picker.hide()}}
                                                           value={this.state.formData.saveAmount}
                                                />
                                                {
                                                    !Util.isIOS && this.state.activeInput == 'saveAmount'?  <CloseButton onPress={() => {this.setFormData(this,'saveAmount',"")}}/> : null
                                                }


                                            </View>
                                            <Text allowFontScaling={false} style={autoBidPageStyle.labelTextRight}>元</Text>
                                        </TouchableOpacity>

                                        <Line notFull={true}/>
                                        <TouchableOpacity activeOpacity={0.7} style={autoBidPageStyle.itemBox} onPress={this.checkBankNum}>
                                            <View style={[autoBidPageStyle.labelTextBox]}>
                                                <Text allowFontScaling={false} style={autoBidPageStyle.labelText}>还款期限</Text>
                                            </View>
                                            <View style={[autoBidPageStyle.labelTextBox,autoBidPageStyle.labelTextBoxRight]}>
                                                <Text allowFontScaling={false} style={autoBidPageStyle.labelTextRightRepayData}>还款期限最多可选三项</Text>
                                            </View>

                                        </TouchableOpacity>
                                        <Line notFull={true}/>
                                        <View style={autoBidPageStyle.repayDataBox}>
                                            {
                                                this.state.autoBidData && this.state.autoBidData.deadline.map((item,index) => {
                                                    return(
                                                        <TouchableOpacity activeOpacity={0.7} key={index} onPress={this.setRepayData.bind(this,item.dicValue)}style={[autoBidPageStyle.repayDataItem,(this.state.repayDataString.indexOf(item.dicValue)>0 || this.state.repayDataString.indexOf(item.dicValue)== 0) && autoBidPageStyle.repayDataItemActive ]}>
                                                            <Text allowFontScaling={false} style={[autoBidPageStyle.repayDataItemText,(this.state.repayDataString.indexOf(item.dicValue)>0 || this.state.repayDataString.indexOf(item.dicValue)== 0) && autoBidPageStyle.repayDataItemTextActive]}>{item.dicValue}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>
                                        <View style={autoBidPageStyle.agreementBox}>
                                            {
                                                this.state.showAgreement ?
                                            <TouchableOpacity activeOpacity={0.9} style={autoBidPageStyle.forgotPwdBox} onPress={this.changeSelectedAr}>
                                                {
                                                    this.state.selected ?
                                                        <Image source={require('./../../imgs/mine/selected.png')}/>
                                                        :
                                                        <Image source={require('./../../imgs/mine/unselected.png')}/>
                                                }

                                                <Text allowFontScaling={false} style={autoBidPageStyle.forgotPwdTitle} >
                                                    我已阅读并同意易通贷<Text allowFontScaling={false} style={{color:"#025FCB"}} onPress={() => this.props.navigation.navigate('webViewWithBridge',{url:Config.systemInfos.auto_bid_protocol_agreement_url,title: '自动投标授权协议'})}>《自动投标授权协议》</Text>
                                                </Text>
                                            </TouchableOpacity>
                                                    :
                                                    null
                                            }
                                        </View>
                                        <View style={autoBidPageStyle.buttonBox}>
                                            <TouchableOpacity activeOpacity={0.7} style={autoBidPageStyle.cancelButton} onPress={this.pop.bind(this)}>
                                                <Text allowFontScaling={false} style={autoBidPageStyle.cancelButtonText}>暂不设置</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity={0.7} style={autoBidPageStyle.sureButton} onPress={this.checkFormData.bind(this)}>
                                                <Text allowFontScaling={false} style={autoBidPageStyle.sureButtonText}>提交</Text>
                                            </TouchableOpacity>
                                            
                                        </View>

                                    </View>
                                    :
                                    null
                            }

                        </ScrollView>
                }
                {
                    this.state.showModal &&  <TouchableOpacity activeOpacity={1} onPress={() => {this.singlePicker.hide();this.setState({ showModal: false,})}} style={[autoBidPageStyle.modal]}/>

                }
                <Modal visible={this.state.showSureModal}
                       transparent={true}
                       animationType='fade'
                        onRequestClose={this.hideModal.bind(this)}>
                    <View style={autoBidPageStyle.m_container}>
                        <Animated.View style={[autoBidPageStyle.m_contentBox,{transform:[{scale: this.state.scale}]}]}>
                            <View style={[autoBidPageStyle.m_titleBox]}>
                                <Text allowFontScaling={false} style={[autoBidPageStyle.m_title]}>自动投标确认</Text>
                            </View>
                            <View style={[autoBidPageStyle.m_contentSubBox]}>
                                <View  style={[autoBidPageStyle.m_content]}>
                                    <Text allowFontScaling={false} style={[autoBidPageStyle.m_contentText]}>单笔投标金额：</Text>
                                    <Text allowFontScaling={false} style={[autoBidPageStyle.m_contentText]}>{this.state.formData.singleAmount}元</Text>
                                </View>
                                <View  style={[autoBidPageStyle.m_content]}>
                                    <Text allowFontScaling={false} style={[autoBidPageStyle.m_contentText]}>预期年回报率：</Text>
                                    <Text allowFontScaling={false} style={[autoBidPageStyle.m_contentText]}>{this.state.repayDataStart + "%至" + this.state.repayDataEnd + "%"}</Text>
                                </View>
                                <View  style={[autoBidPageStyle.m_content]}>
                                    <Text allowFontScaling={false} style={[autoBidPageStyle.m_contentText]}>账户保留金额：</Text>
                                    <Text allowFontScaling={false} style={[autoBidPageStyle.m_contentText]}>{this.state.formData.saveAmount}元</Text>
                                </View>
                                <View  style={[autoBidPageStyle.m_content]}>
                                    <Text allowFontScaling={false} style={[autoBidPageStyle.m_contentText]}>还款期限：</Text>
                                </View>
                                <View  style={[autoBidPageStyle.m_contentCity]}>
                                    {
                                        this.state.repayDataArr.length > 0 && this.state.repayDataArr.map((item,index) => {
                                            return (
                                                <View key={index} style={[autoBidPageStyle.repayDataItemSure]}>
                                                    <Text allowFontScaling={false} style={[autoBidPageStyle.repayDataItemText]}>{item}</Text>
                                                </View>
                                            )

                                    })
                                    }
                                </View>
                            </View>
                            <View style={[autoBidPageStyle.m_buttonBox]}>
                                <Button buttonName="再想想" width={100} color="#fff" textColor="#025FCB" borderColor="#025FCB"onPress={this.hideModal.bind(this)}/>
                                <Button buttonName="确认" width={100} onPress={this.saveData.bind(this)}/>
                            </View>
                        </Animated.View>
                    </View>
                </Modal>
				<KeyboardAvoidingView behavior={Util.isIOS ? 'padding' : 'height'} contentContainerStyle={autoBidPageStyle.keyboardControllBox}>
					{
						this.state.showKeyboardControll ?
							<TouchableOpacity  activeOpacity={1} onPress={() => dismissKeyboard()} style={autoBidPageStyle.keyboardControll}>
								<Text style={autoBidPageStyle.keyboardControllText}>收起</Text>
							</TouchableOpacity>
							:
							null
					}
				</KeyboardAvoidingView>
							<SinglePicker
								lang="zh-CN"
								ref={ref=>this.singlePicker=ref}
								onConfirm={(option)=>{
									this.selectedData(option)
									this.setState({showModal:false})
                    //this.setState({selected:option.value})
                }}
								onCancel={() => {
									this.judgeNum()
									this.setState({showModal:false})
								}}
								onSelect={(option)=>{
                    // this.setState({selected:option.value})
                    this.selectedData(option)
                }}
								options={this.state.options}
							>

							</SinglePicker>

                <EAlert ref={(ref) => this.eAlert = ref}/>
                <Loading ref={(ref) => this.loading = ref}/>

            </TouchableOpacity>
        );
    }
}