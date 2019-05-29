/**
 * Created by liuzhenli on 2017/7/7.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var px  = Util.pixel;
var commonFontSize = Util.commonFontSize
const forgotPwdPageStyles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    },
    headerStyle:{
        backgroundColor:"#2EA7E0"
    },
    headerTitleStyle:{
        color:'#fff',
        fontWeight: '400'
    },
    inputBox:{
        width: Util.size.width,
        backgroundColor:'#fff',
        marginTop: 15 * px
    },
    userNameBox:{
        height: 60 * px,
        width: Util.size.width,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        paddingRight: 14 * px,
    },
    labelImg:{

    },
    labelImgBox:{
        height: 36* px,
        width: 36* px,
        justifyContent:'center',
        alignItems:'center',
        marginLeft: 14 * Util.pixel,
    },
    input:{
        height: 60 * px,
        flex:1,
        fontSize: commonFontSize(15),
    },
    verifyCodeInput:{
        height: 60 * px,
        width: Util.isIOS ? Util.size.width - 165 * px : Util.size.width - 205 * px,
        fontSize: commonFontSize(15),
    },
    smsCodeInput:{
        height: 60 * px,
        width: Util.isIOS ? Util.deviceType == '5' || Util.deviceType == '5s'  ? Util.size.width - 185* px : Util.size.width - 205* px : Util.size.width - 225* px,
        fontSize: Util.isIOS ?commonFontSize(15):commonFontSize(15),
    },
    verifyCodeBox:{
        height: 36 * px,
        width: 100 * px,
        justifyContent:'center',
    },
    smsCodeBox:{
        height: 36* px,
        width: Util.isIOS ?  120 * px : 100 * px,
        justifyContent:'center',
        alignItems:'center',
        flexDirection: 'row',
        paddingRight: 14 * px,
    },
    buttonBox:{
        height: 45 * px,
        justifyContent:'center',
        alignItems:'center',
        marginTop: 20 * px,
    },
    button: {
        height: 45 * px,
        width: Util.size.width - 40* px,
        backgroundColor:'#2EA7E0',
        borderRadius: 5 * px,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonTitle:{
        fontSize: commonFontSize(18),
        color:'#fff'
    },
    forgotPwdBox:{
        height: 18 * px,
        width: Util.size.width - 40* px,
        backgroundColor:'transparent',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom: 3 * px,
    },
    forgotPwdTitle:{
        fontSize: commonFontSize(10),
        color:'#4A4A4A'
    },
    registerTitle:{
        fontSize: commonFontSize(13),
        color:'#2EA7E0'
    },
    verifyCode:{
        height: 34 * px,
        width: 100 * px,
    },
    bannerBox:{
        height: 94 * px,
        width: Util.size.width,
        backgroundColor:"#fff"
    },
    getSmsButton:{
        height: 30 * px,
        width: Util.deviceType == '5' || Util.deviceType == '5s'  ? 100 * px : 140 * px,
        justifyContent:'center',
        alignItems:'center',
        marginLeft: 10 * px,
    },
    getSmsButtonTitle:{
        color:'#888889',
        fontSize: Util.isIOS ? commonFontSize(13) : commonFontSize(12)
    },
    servicesBox:{
        height: 100* px,
        width:  Util.size.width,
        position: 'absolute',
        bottom: 10,
        left: 0,
        justifyContent:'center',
        alignItems:'center',
    },
    services:{
        fontSize: commonFontSize(15),
        color:'#4A4A4A'
    },
    errorRemindTitleBox:{
        height: 30 * px,
        width:Util.size.width,
        justifyContent:'center',
        paddingLeft: 50 * px,
    },
    errorRemindTitle:{
        color:'#888889',
        fontSize: commonFontSize(12)
    },
    topRemindBox:{
        minHeight: 120 * px,
        justifyContent:'center',
        alignItems:'center',
    },
    topRemind:{
        fontSize: commonFontSize(15),
        color:'#4A4A4A',
        width: Util.size.width / 3 * 1.8,
        textAlign:'center',
        lineHeight: Util.lineHeight(25)
    },
    showErrorBox:{
        height: 40 * px,
        justifyContent:'center',
        paddingLeft: 50 * px
    },
    showErrorTitle:{
        color:'#E94639',
        fontSize: commonFontSize(12)
    },
    
});


export {
    forgotPwdPageStyles
};