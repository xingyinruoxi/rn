/**
 * Created by liuzhenli on 2017/7/25.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var px  = Util.pixel;
var commonFontSize = Util.commonFontSize
const findPwdPageStyles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f6f7fa',
    },
    headerStyle:{
        backgroundColor:"#2EA7E0"
    },
    headerTitleStyle:{
        color:'#fff',
        fontWeight: '400'
    },
    inputBox:{
        minHeight: 60 * px,
        width: Util.size.width,
        backgroundColor:'#fff',
        marginTop: 15 * px,
    },
    userNameBox:{
        minHeight: 44 * px,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff'
    },
    labelImg:{

    },
    labelImgBox:{
        height: 36* px,
        width: 36* px,
        justifyContent:'center',
        alignItems:'center',
    },
    input:{
        height: 44 * px,
        width: Util.size.width - 60,
        fontSize: commonFontSize(13)
    },
    verifyCodeInput:{
        height: 44 * px,
        width: Util.size.width - 140,
        fontSize: commonFontSize(13),
    },
    smsCodeInput:{
        height: 44 * px,
        width: Util.size.width - 160,
        fontSize: commonFontSize(13),
    },
    verifyCodeBox:{
        height: 36,
        width: 80,
        justifyContent:'center',
        alignItems:'center',
    },
    smsCodeBox:{
        height: 36,
        width: 100,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonBox:{
        height: 45 * px,
        justifyContent:'center',
        alignItems:'center',
        marginTop: 30 * px,
    },
    button: {
        height: 45 * px,
        width: Util.size.width - 40,
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
        width: Util.size.width - 40,
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
        width: 66 * px,
    },
    bannerBox:{
        height: 94 * px,
        width: Util.size.width,
        backgroundColor:"#fff"
    },
    getSmsButton:{
        height: 30 * px,
        width: 98 * px,
        backgroundColor:'#2EA7E0',
        borderRadius: 5,
        justifyContent:'center',
        alignItems:'center',
    },
    getSmsButtonTitle:{
        color:'#fff',
        fontSize: commonFontSize(12)
    },
    servicesBox:{
        height: 100,
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
    }
});


export {
    findPwdPageStyles
};