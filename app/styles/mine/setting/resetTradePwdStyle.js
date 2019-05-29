/**
 * Created by liuzhenli on 2017/7/17.
 */
import { StyleSheet } from 'react-native';
import Util from './../../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const resetTradePwdPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
    contentBox:{
        marginTop: 15 * px,
        backgroundColor:'#fff',

    },
    userNameBox:{

        height: 50 * px,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 14 * px,
    },
    remindBox:{
        height: 30 * px,
        justifyContent:'center',
    },
    remindText:{
        marginLeft: 51 * px,
        color:'#888889',
        fontSize: commonFontSize(12)
    },
    labelImg:{
        marginLeft: 10 * px
    },
    labelText:{
        marginLeft: 10 * px,
        color:'#4A4A4A',
        fontSize: Util.isIOS ? commonFontSize(15) :  commonFontSize(12)
    },
    labelImgBox:{
        height: 36* px,
        alignItems:'center',
        paddingBottom: 3 * px,
        flexDirection:'row',
    },
    input:{
        height: 34 * px,
        width: Util.size.width - 60,
        fontSize: commonFontSize(13)
    },
    verifyCodeInput:{
        height: 44 * px,
        width: Util.isIOS ? Util.size.width - 150 : Util.size.width - 180,
        fontSize: commonFontSize(13),
    },
    verifyCodeBox:{
        height: 36 * px,
        width: Util.isIOS ?  110 * px : 100 * px,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonBox:{
        height: 45 * px,
        justifyContent:'center',
        alignItems:'center',
        marginTop: 53 * px,
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
    getSmsButton:{
        height: 28 * px,
        width: 140 * px,
        justifyContent:'center',
        alignItems:'center',
    },
    getSmsButtonTitle:{
        color:'#888889',
        fontSize: Util.isIOS ? commonFontSize(15) : commonFontSize(12)
    },
    verifyCode:{
        height: 34 * px,
        width: 80 * px,
    },
    cardIDCodeInput:{
        height: 50 * px,
        marginLeft: Util.isIOS ? 10 * px: 5 * px,
        flex:1,
        fontSize: Util.isIOS ? commonFontSize(15) :  commonFontSize(13) ,
        color:'#888889',
    },
    userName:{
        
        color:'#3F3A39'
    },
    submitButtonBox:{
        marginTop: 20 * px,
        alignItems:'center',
    },
    forgetBox:{
        height: 60 * px,
        justifyContent:'center',
        alignItems:'flex-end',
        paddingHorizontal: 14 * px,
    },
    forgetTitle:{
        color:'#025FCB',
        fontSize: commonFontSize(12)
    },
    bottomRemindBox:{
        height: 40 * px,
        alignItems:'center',
        justifyContent:'center',
    },
    remindTitle:{
        color:'#E94639',
        fontSize: commonFontSize(12)
    },

});
export {
    resetTradePwdPageStyle
}