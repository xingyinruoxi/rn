/**
 * Created by glzc on 2017/7/9.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Keyboard,
} from 'react-native';
import  DeviceInfo from 'react-native-device-info';
import Util from './../../../commons/util';
import Btn from './Button';
import Fetch from './../../../commons/fetch';
import HeaderBar from './../../../commons/headerBar';
import EAlert from  './../../components/ealert';
import Loading from './../../components/loading';
import Line from './../../../commons/line';
var dismissKeyboard = require('dismissKeyboard');
const Storage = require('./../../../commons/storage');
const StorageKeys = require('./../../../commons/storageKey');
const Config = require('./../../../commons/config');
const EventEmitter = require('RCTDeviceEventEmitter');
export default class FeedBack extends Component{
    constructor(props){
        super(props);
        this.state = {
            content: null,
            contactWay: null,
            sessionId: null,
            useId: null,
            adviceType: 0,
            count: 0,
            bottom: 0,
        }
    };
    static navigationOptions = ({navigation}) => ({
        title: '意见反馈',
        header: () => <HeaderBar navigation={navigation} />
    });
    componentWillMount(){
        this.keyboardShow = Keyboard.addListener('keyboardWillShow',() => {
            console.log('this.keyboardShow');
            this.scrollView.scrollTo({x: 0, y: 50, animated: true});
        });
        this.keyboardHide = Keyboard.addListener('keyboardWillHide',() => {
            this.scrollView.scrollTo({x: 0, y: 0, animated: true});
        })
    };
    componentDidMount(){
        this.getUserInfo();
        this.eventEmit = EventEmitter.addListener('checkLogin',this.getUserInfo.bind(this));
    };
    getUserInfo(){
        Storage.getItem(StorageKeys.eTD_USERINFO).then( res => {
            if(res){
                this.setState({
                    sessionId: res.sessionId,
                    useId: res.sftUserMdl.useId,
                    contactWay: res.sftUserMdl.useMobilePhones
                })
            };
        });
    };
    componentWillUnmount(){
        this.eventEmit.remove();
        this.keyboardHide.remove();
        this.keyboardShow.remove();
    };
    checkedAdviceType(n){
        this.setState({
            adviceType: n,
        })
    };
    sendFeedBack(res){
        //console.log(this.state.formData);
        if(res && res.count > 3){
            this.eAlert.show('alert','为了更好的服务您，我们每日提交的上限为5次，如果您还有其他问题，请您明日继续反馈');
            return;
        };
        let data = {
            content: this.state.content,
            contactWay: this.state.contactWay,
            opinionType: this.state.adviceType,
            clientVersion: Util.isIOS ? Config.appVersion : Config.appAndroidVersion,
            system: Util.isIOS ? 'ios' : 'android',
            mobileModel: DeviceInfo.getModel(),
        };
        if(this.state.sessionId && this.state.useId){
            data.sessionId = this.state.sessionId;
            data.useId = this.state.useId;
        };
        this.loading.show();
        Fetch.post('more/feedbackToEmail',data,res => {
            console.log('more/feedbackToEmail',res);
            this.loading.hide();
            if(res.success){
                if(res && res.time){
                    let t = new Date(),time='';
                    time = time+t.getFullYear()+(t.getMonth()+1)+t.getDate();
                    Storage.setItem(StorageKeys.eTD_FEEDBACK,{count: res.time == time ? this.state.count + 1 : 0,time: time});
                    this.eAlert.show('alert','您的反馈已成功提交，\n感谢您的宝贵建议。',this.props.navigation.goBack.bind(this));
                }
            }else{
                this.eAlert.show('alert',res.info);
            }
        },err => {
            this.loading.hide();
           console.log(err);
        },null,this);
    };
    changeText(arg,val){
        switch (arg){
            case 'content':
                this.setState({
                    content: val
                });
                break;
            case 'contactWay':
                this.setState({
                    contactWay: val
                });
                break;
            default :
                break;
        }
    };
    _submit(){
        if(!this.state.content || !this.state.contactWay){
            this.eAlert.show('alert','反馈内容或联系方式不能为空！');
            return;
        };
        Storage.getItem(StorageKeys.eTD_FEEDBACK).then(res => {
            console.log('StorageKeys.eTD_FEEDBACK',res);
            this.sendFeedBack(res);
        });
    };
    render(){
        return (
            <ScrollView
                ref={ref => this.scrollView = ref}
                style={{backgroundColor: '#f8f8f8'}}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
            <TouchableOpacity activeOpacity={1} onPress={() => {dismissKeyboard();}}>
                <View style={{backgroundColor: '#fff'}}>
                    <View style={FeedBackStyles.contact}>
                        <Text allowFontScaling={false} style={FeedBackStyles.text}>我遇到的问题</Text>
                    </View>
                    <Line full={true} />
                    <View style={FeedBackStyles.contact}>
                        <View style={[FeedBackStyles.flexRow,FeedBackStyles.adviceSpace,{justifyContent: 'space-between'}]}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={this.checkedAdviceType.bind(this,0)}
                                >
                                <View style={[FeedBackStyles.flexRow,FeedBackStyles.adviceTypeWidth]}>
                                    <View style={[FeedBackStyles.circleOut,this.state.adviceType == 0 && {borderColor: '#025fcb'}]}>
                                        { this.state.adviceType == 0 ? <View style={FeedBackStyles.circleIn}></View> : null }
                                    </View>
                                    <Text allowFontScaling={false} style={FeedBackStyles.text}>充值问题</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={this.checkedAdviceType.bind(this,1)}
                                >
                                <View style={[FeedBackStyles.flexRow,FeedBackStyles.adviceTypeRightWidth]}>
                                    <View style={[FeedBackStyles.circleOut,this.state.adviceType == 1 && {borderColor: '#025fcb'}]}>
                                        { this.state.adviceType == 1 ? <View style={FeedBackStyles.circleIn}></View> : null}
                                    </View>
                                    <Text allowFontScaling={false} style={FeedBackStyles.text}>短信验证码问题</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[FeedBackStyles.flexRow,FeedBackStyles.adviceSpace,{justifyContent: 'space-between'}]}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={this.checkedAdviceType.bind(this,2)}
                                >
                                <View style={[FeedBackStyles.flexRow,FeedBackStyles.adviceTypeWidth]}>
                                    <View style={[FeedBackStyles.circleOut,this.state.adviceType == 2 && {borderColor: '#025fcb'}]}>
                                        { this.state.adviceType == 2 ? <View style={FeedBackStyles.circleIn}></View> : null}
                                    </View>
                                    <Text allowFontScaling={false} style={FeedBackStyles.text}>提现问题</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={this.checkedAdviceType.bind(this,3)}
                                >
                                <View style={[FeedBackStyles.flexRow,FeedBackStyles.adviceTypeRightWidth]}>
                                    <View style={[FeedBackStyles.circleOut,this.state.adviceType == 3 && {borderColor: '#025fcb'}]}>
                                        { this.state.adviceType == 3 ? <View style={FeedBackStyles.circleIn}></View> : null}
                                    </View>
                                    <Text allowFontScaling={false} style={FeedBackStyles.text}>出借类问题</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[FeedBackStyles.flexRow,FeedBackStyles.adviceSpace,{justifyContent: 'space-between'}]}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={this.checkedAdviceType.bind(this,4)}
                                >
                                <View style={[FeedBackStyles.flexRow,FeedBackStyles.adviceTypeWidth]}>
                                    <View style={[FeedBackStyles.circleOut,this.state.adviceType == 4 && {borderColor: '#025fcb'}]}>
                                        { this.state.adviceType == 4 ? <View style={FeedBackStyles.circleIn}></View> : null}
                                    </View>
                                    <Text allowFontScaling={false} style={FeedBackStyles.text}>页面加载失败问题</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={this.checkedAdviceType.bind(this,5)}
                                >
                                <View style={[FeedBackStyles.flexRow,FeedBackStyles.adviceTypeRightWidth]}>
                                    <View style={[FeedBackStyles.circleOut,this.state.adviceType == 5 && {borderColor: '#025fcb'}]}>
                                        { this.state.adviceType == 5 ? <View style={FeedBackStyles.circleIn}></View> : null}
                                    </View>
                                    <Text allowFontScaling={false} style={FeedBackStyles.text}>账号密码问题</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={FeedBackStyles.contact}>
                    <TextInput
                    style={[FeedBackStyles.textInput,FeedBackStyles.textArea]}
                    placeholder={'请输入反馈意见内容'}
                    placeholderTextColor="#9b9b9b"
                    multiline={true}
                    underlineColorAndroid="transparent"
                    onChangeText = {this.changeText.bind(this,'content')}
                    maxLength={140}
                    />
                </View>
                <View>
                    <View style={[FeedBackStyles.contact,{paddingTop: 0}]}>
                        <Text allowFontScaling={false} style={FeedBackStyles.text}>您的联系方式</Text>
                    </View>
                    <View style={[FeedBackStyles.contact,{paddingTop: 0}]}>
                        <TextInput
                            style={[FeedBackStyles.textInput,{paddingLeft: Util.pixel*10}]}
                            placeholder={'手机号/微信/QQ'}
                            placeholderTextColor="#9b9b9b"
                            multiline={false}
                            defaultValue={this.state.contactWay}
                            underlineColorAndroid="transparent"
                            onChangeText = {this.changeText.bind(this,'contactWay')}
                            keyboardType={'ascii-capable'}
                            />
                    </View>
                </View>
                <View style={FeedBackStyles.btn}>
                    <Btn buttonColor={this.state.content && this.state.contactWay && this.state.contactWay.length > 4 ? {backgroundColor:'#025fcb'} : {backgroundColor:'#c5c5c5'}} disabled={!this.state.content || !this.state.contactWay || this.state.contactWay.length < 5 ? true : false} title={'发送'} callBack={this._submit.bind(this)} />
                </View>
                <EAlert ref={ref => this.eAlert = ref} />
                <Loading ref={ref => this.loading = ref} />
            </TouchableOpacity>
            </ScrollView>
        )
    }
};

const FeedBackStyles = StyleSheet.create({
    textInput: {
        height: Util.pixel * 45,
        fontSize: Util.commonFontSize(14),
        color: '#636f83',
        textDecorationColor: '#2b8dff',
        padding: 0,
        backgroundColor: '#ffffff',
        borderRadius: Util.pixel*4,
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textArea: {
        height: Util.pixel*124,
        paddingLeft: Util.pixel*10,
        paddingTop: Util.pixel*10,
        paddingRight: Util.pixel*10,
        paddingBottom: Util.pixel*10,
        borderWidth: Util.pixel*0.5,
        borderColor: '#e8e8e8',
        textAlignVertical: 'top',//for Android
    },
    contact: {
        paddingHorizontal: 10 * Util.pixel,
        paddingTop: Util.pixel*12,
        paddingBottom: Util.pixel*10,
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        height: Util.pixel*100,
    },
    text: {
        color: '#4a4a4a',
        fontSize: Util.commonFontSize(15),
    },
    circleOut: {
        width: Util.pixel*14,
        height: Util.pixel*14,
        borderRadius: Util.pixel*14,
        borderWidth: Util.pixel*0.5,
        borderColor: '#4a4a4a',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Util.pixel*8,
    },
    circleIn: {
        width: Util.pixel*6,
        height: Util.pixel*6,
        borderRadius: Util.pixel*6,
        backgroundColor: '#025fcb',
    },
    adviceSpace: {
        paddingLeft: Util.pixel*(Util.size.width <= 320 ? 15 : 25),
        paddingRight: Util.pixel*(Util.size.width <= 320 ? 10 : 10),
        paddingBottom: Util.pixel*20,
    },
    adviceTypeWidth: {
        width: (Util.size.width - Util.pixel*20 - Util.pixel*(Util.size.width <= 320 ? 30 : 40))/2+Util.pixel*5,
        justifyContent: 'flex-start'
    },
    adviceTypeRightWidth: {
        width: (Util.size.width - Util.pixel*20 - Util.pixel*(Util.size.width <= 320 ? 30 : 40))/2-Util.pixel*5,
        justifyContent: 'flex-start'
    }
});