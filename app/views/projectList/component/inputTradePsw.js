/**
 * Created by glzc on 2017/8/22.
 */
import React,{Component} from 'react';
import {
    View,
    ScrollView,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
    Image,
} from 'react-native';
import Util,{Grow} from './../../../commons/util';
import Fetch from './../../../commons/fetch';
const Storage = require('./../../../commons/storage');
const StorageKeys = require('./../../../commons/storageKey');
const dismissKeyboard = require('dismissKeyboard');
export default class InputTradePsw extends Component{
    constructor(props){
        super(props);
        this.state={
            showModal: false,
            tradePsw: '',
            errInfo: '',
        };
        this.clickNum = 0;
    };
    componentWillMount(){
        this.keyboardShow = Keyboard.addListener('keyboardWillShow',() => {
            if(this.state.showModal){
                this.scrollView.scrollTo({x: 0, y: 80, animated: true});
            }
        });
        this.keyboardHide = Keyboard.addListener('keyboardWillHide',() => {
            if(this.state.showModal){
               this.scrollView.scrollTo({x: 0, y: 0, animated: true});
            };
        })
    };
    componentWillUnmount(){
        this.keyboardShow.remove();
        this.keyboardHide.remove();
    };
    show(){
        this.setState({
            showModal: true,
        })
    };
    hide(){
        this.setState({
            showModal: false,
            errInfo: '',
        })
    };
    loadPage(routeName,params){
        this.props.navigation.navigate(routeName,params);
    };
    hideKeyboard(){
        if(this.state.tradePsw){
            dismissKeyboard();
        }else{
            this.hide();
        }
    };
    resetTradePsw(){
        this.hide();
        Storage.getItem(StorageKeys.eTD_USERINFO).then(res => {
            if(res){
                this.loadPage('resetPwdByPhone',{userInfo: res.sftUserMdl,backKey: null});
            }
        });
    };
    getTradePsw(v){
        this.setState({
            tradePsw: v.trim()
        });
    };
    growingIO(){
        if(this.props.useType == 0){
            Grow.track('elbn_invest_investenterpwd_confirm_click',{'elbn_invest_investenterpwd_confirm_click':'确定按钮点击量'});
        }else{
            Grow.track('elbn_invest_transferenterpwd_confirm_click',{'elbn_invest_transferenterpwd_confirm_click':'确定按钮点击量'});
        }
    };
    back(){
        this.props.navigation.goBack();
    };
    submit(){
        this.growingIO();
        dismissKeyboard();
        if(this.clickNum > 0){
            return;
        }else{
            this.clickNum += 1;
        }
        if(!this.state.tradePsw || this.state.tradePsw == ''){
            this.clickNum = 0;
            this.setState({
                errInfo: '请输入交易密码！',
            });
            return;
        };
        let data={
            useType: this.props.useType,
            useId: this.props.root.state.useId,
            sessionId: this.props.root.state.sessionId,
            password: Util.Encode(this.state.tradePsw),
            iteId: this.props.useType == 0 ? this.props.root.state.formData.investItemDetailsMdl.iteId : this.props.root.state.formData.pptItemExtendMdl.iteId,
            money: this.props.useType == 0 ? this.props.root.state.value : this.props.root.state.formData.pptClaimExtendMdl.claTransSumYuan,
            payAmt: this.props.payFor,
        };
        if(this.props.useType == 1){
            data['claId'] = this.props.root.state.formData.pptClaimExtendMdl.claId;
        }else{
            if(this.props.root.state.redEnvelope){
                let item = this.props.root.state.redEnvelope;
                data['ticValue'] = item.ticValue;
                data['ticId'] = item.ticId;
                data['ticType'] = this.props.root.state.type;
            }
        };
        let uri = this.props.useType == 1 ? 'investments/invsafWithoutRsa' : 'invest/complete';
        Fetch.post(uri,data,res => {
            let name = this.props.useType == 0 ? '出借' : '承接';
            let title = name + (res.success ? '成功' : '失败');
            setTimeout(() => {
                this.clickNum = 0;
            });
            if(res && res.code == 'p2p502'){
                this.setState({
                    errInfo: res.info,
                });
            }else{
                this.hide();
                this.setState({
                    tradePsw: null,
                    errInfo: null,
                });
                res.success ?
                    this.loadPage('invsafState',{title: title,name: name,isSuccess: res.success,code: res.body.claId})
                :
                    this.props.root.eAlert.show('alert',res.info)
                ;
            }
        },err => {
            this.clickNum = 0;
            this.setState({errInfo:null});
        },null,this.props.root);
    };
    render(){
        return (
            <Modal animationType={'slide'} transparent={true} visible={this.state.showModal} onRequestClose={() => {}}>
                <ScrollView
                    contentContainerStyle={{flex:1}}
                    //style={inputTradePswStyles.container}
                    ref={ref => this.scrollView = ref}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                    >
                    <View style={inputTradePswStyles.container}>
                        <View style={inputTradePswStyles.content}>
                            <View style={[inputTradePswStyles.header,inputTradePswStyles.flexRow,{justifyContent: 'space-between'}]}>
                                <TouchableOpacity activeOpacity={0.8} onPress={this.hide.bind(this)}>
                                    <View style={[inputTradePswStyles.flexRow,inputTradePswStyles.headerLeft]}>
                                        <Image source={require('./../../../imgs/more/cancel_icon.png')} />
                                    </View>
                                </TouchableOpacity>
                                <Text allowFontScaling={false} style={inputTradePswStyles.headerText}>请输入交易密码</Text>
                                <View style={inputTradePswStyles.headerLeft}></View>
                            </View>
                            <View style={[inputTradePswStyles.flexRow,inputTradePswStyles.notice]}>
                                <Text allowFontScaling={false} style={inputTradePswStyles.noticeText}>如果您未设置过交易密码，则交易密码与您的登录密码一致</Text>
                            </View>
                            <View style={[inputTradePswStyles.flexRow,inputTradePswStyles.notice]}>
                                <Text allowFontScaling={false} style={[inputTradePswStyles.headerText,{color: '#9b9b9b'}]}>本次共支付</Text>
                                <Text allowFontScaling={false} style={[inputTradePswStyles.headerText,{color: '#e94639'}]}>{Util.numberFormat(this.props.payFor)}</Text>
                                <Text allowFontScaling={false} style={[inputTradePswStyles.headerText,{color: '#9b9b9b'}]}>元</Text>
                            </View>
                            <View style={inputTradePswStyles.flexRow}>
                                <TextInput
                                    style={inputTradePswStyles.input}
                                    placeholder={'请输入交易密码'}
                                    placeholderTextColor="#9b9b9b"
                                    underlineColorAndroid="transparent"
                                    autoCapitalize={'none'}
                                    secureTextEntry={true}
                                    maxLength={16}
                                    password={true}
                                    clearButtonMode="while-editing"
                                    onChangeText={this.getTradePsw.bind(this)}
                                    />
                            </View>
                            {
                                this.state.errInfo && this.state.errInfo != '' ?
                                    <View style={[inputTradePswStyles.flexRow,{marginTop: Util.pixel*2}]}>
                                        <Text allowFontScaling={false} style={inputTradePswStyles.errText}>{this.state.errInfo}</Text>
                                    </View>
                                    :null
                            }
                            <View style={inputTradePswStyles.flexRow}>
                                <TouchableOpacity style={[inputTradePswStyles.flexRow,inputTradePswStyles.forgetPsw]} activeOpacity={0.8} onPress={this.resetTradePsw.bind(this)}>
                                    <View>
                                        <Text allowFontScaling={false} style={[inputTradePswStyles.noticeText,{color: '#025fcb'}]}>忘记交易密码了？去找回</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={inputTradePswStyles.submitContent}>
                                <TouchableOpacity activeOpacity={0.8} onPress={this.submit.bind(this)}>
                                    <View style={[inputTradePswStyles.flexRow,inputTradePswStyles.submit]}>
                                        <Text allowFontScaling={false} style={inputTradePswStyles.submitText}>确定</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        )
    }
};
const inputTradePswStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'relative'
    },
    content: {
        width: Util.size.width,
        paddingBottom: Util.pixel*45,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#ffffff'
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        height: Util.pixel*39,
        borderBottomWidth: Util.pixel*0.5,
        borderColor: '#d8d8d8',
    },
    headerLeft: {
        width: Util.pixel*39,
        height: Util.pixel*39,
    },
    headerText: {
        color: '#025fcb',
        fontSize: Util.commonFontSize(15),
    },
    notice: {
        height: Util.pixel*34
    },
    noticeText: {
        color: '#9b9b9b',
        fontSize: Util.commonFontSize(12),
    },
    payTotal: {
        height: Util.pixel*33,
        marginTop: Util.pixel*5,
        marginBottom: Util.pixel*10,
    },
    input: {
        padding: 0,
        width: Util.pixel*270,
        height: Util.pixel*40,
        borderWidth: Util.pixel*0.5,
        borderColor: '#d8d8d8',
        borderRadius: Util.pixel*4,
        fontSize: Util.commonFontSize(14),
        paddingLeft: Util.pixel*8,
    },
    forgetPsw: {
        width: Util.pixel*150,
        height: Util.pixel*25,
    },
    submitContent: {
        paddingLeft: Util.pixel*14,
        paddingRight: Util.pixel*14,
        marginTop: Util.pixel*50,
    },
    submit: {
        height: Util.pixel*45,
        backgroundColor: '#025fcb',
        borderRadius: Util.pixel*4,
    },
    submitText: {
        fontSize: Util.commonFontSize(15),
        color: '#fff'
    },
    errText: {
        fontSize: Util.commonFontSize(13),
        color: '#e94639'
    }
});