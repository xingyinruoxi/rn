/**
 * Created by liuzhenli on 2017/7/14.
 */
import { StyleSheet } from 'react-native';
import Util from './../../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const phoneCertifyPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff',
    },
    contentBox:{
        alignItems:'center',
        flex:1,
        backgroundColor:'rgba(245,245,245,1)',
    },
    contentSubBox:{
        backgroundColor:'#fff',
        width: Util.size.width,
    },
    itemBox:{
        height: 45 * px,
        width: Util.size.width,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 21 * px,
        backgroundColor:'#fff',
    },
    labelTextBox:{
        height: 45 * px,
        width: (Util.size.width - 40 * px)/2,
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection:'row',
    },
    labelText:{
        fontSize: commonFontSize(15),
        color:'#4A4A4A',
    },
    labelTextRight:{
        fontSize: commonFontSize(15),
        color:'#4A4A4A'
    },
    labelTextBoxRight:{
        justifyContent:'flex-end',
        alignItems:'center',
    },
    accountBox:{
        marginTop: 15 * px,
        backgroundColor:"#fff",
    },
    userNameBox:{
        height: 50 * px,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:"#fff",
        paddingHorizontal: 10  * px
    },

    labelImgBox:{
        height: 50* px,
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
        width: Util.isIOS ? Util.size.width - 140 : Util.size.width - 200* px,
        fontSize: commonFontSize(13),
       
    },
    smsCodeInput:{
        height: 50 * px,
        flex:1,
        fontSize: commonFontSize(15),
    },
    verifyCodeBox:{
        height: 36,
        width: 80,
        justifyContent:'center',
        alignItems:'center',
    },
    smsCodeBox:{
        height: 36 * px,
        width: Util.isIOS ? 120 * px : 110 * px,
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
    verifyCode:{
        height: 34 * px,
        width: 80 * px,
    },
    getSmsButton:{
        height: 30 * px,
        width: 120 * px,
        justifyContent:'center',
        alignItems:'center',
    },
    getSmsButtonTitle:{
        color:'#888889',
        fontSize: commonFontSize(13)
    },
    submitButtonBox:{
        marginTop: 20 * px,
    },
    cancelMB:{
        marginBottom: 0
    },
    remindTitleBox:{
        height: 100 * px,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:"#fff",
        paddingHorizontal: 60 * px,
    },
    remindTitle:{
        color:'#4A4A4A',
        fontSize: commonFontSize(14),
        textAlign:'center',
        lineHeight: Util.lineHeight(20)
    },
    bottomItemBox:{
        flex:1,
        width: Util.size.width,
        alignItems:'center',
        justifyContent:'flex-end',
    },
    bottomItemBoxTitle:{
        marginBottom: 50 * px,
        textAlign:'center',
        paddingHorizontal: 50 * px,
        lineHeight: Util.lineHeight(25),
        color:'#9B9B9B',
        fontSize: commonFontSize(15)
    },
    errorRemindTitleBox:{
        height: 50 * px,
        width: Util.size.width,
        justifyContent:"center",
        paddingLeft: 45 * px,
    },
    errorRemindTitle:{
        color:'#E94639',
        fontSize: commonFontSize(12)
    },
    topRemindTitleBox: {
        height: 120 * px,
        width: Util.size.width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topRemindTitle:{
        color:'#4A4A4A',
        fontSize: commonFontSize(15),
        width: Util.size.width / 3 * 1.8,
        textAlign:'center',
        lineHeight: Util.lineHeight(25)
    },
    inputBox:{
        minHeight: 100 * px,
        width: Util.size.width,
        paddingHorizontal: 20 * px,
    },
    inputItemBox:{
        height: 50 * px,
        width: Util.size.wdith,
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems:'center',

    },
    inputLabelImg:{
        marginRight: 10 * px,
    },
    bottomRemindBox:{
        width: Util.size.width - 90 * px,
        flex:1,
        justifyContent:'flex-end',
        alignItems:'center',
        backgroundColor:'#f6f7fa'
    },
    bottomRemind:{
        textAlign:'center',
        color:'#9B9B9B',
        fontSize: commonFontSize(15),
        lineHeight: Util.lineHeight(25),
        marginBottom: 50 * px,
    },
    hidePwdImg:{
        width: 45 * px,
        height: 45 * px,
        alignItems:'center',
        justifyContent:'center',
    },
    m_Container:{
        height: Util.size.height,
        width: Util.size.width,
        backgroundColor:'rgba(0,0,0,0.5)',
        position:'absolute',
        left:0,
        top: 0,
        zIndex: 99999999999,
        justifyContent:'center',
        alignItems:'center',
    },
    m_ContentBox:{
        height: 240 * px,
        width: (Util.size.width - 100 * px),
        backgroundColor:'#fff',
        borderRadius: 12 * px,
        alignItems:'center',
        paddingHorizontal: 14 * px
    },
    m_TitleBox:{
        height: 50 * px,
        justifyContent:'center',
        alignItems:"center"
    },
    m_Title:{
        fontSize: commonFontSize(17),
        color: '#030303'
    },
    m_RemindTitle:{
        fontSize: commonFontSize(15),
        color: '#888889'
    },
    m_Content:{
        height: 80 * px,
        width: Util.size.width - 100 * px,
        justifyContent:'space-around',
        alignItems:'center',
    },
    m_InputBox:{
        height: 40 * px,
        width:  Util.size.width - 143 * px,
        borderColor: '#979797',
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        marginTop: 20 * px,
        justifyContent:'space-around'
    },
    m_IndentifyInput:{
        height: 40 * px,
        width: Util.size.width - 258 * px,
        marginLeft: 4 * px,
        fontSize: commonFontSize(13),
    },
    m_ShowErrorBox:{
        height: 40 * px,
        width: Util.size.width - 100 * px,
        justifyContent:'center',
        paddingLeft: 30 * px,
    },
    m_ShowErrorText:{
        fontSize: commonFontSize(12),
        color: '#E94639'
    },
    m_ButtonBox:{
        flex:1,
        width: Util.size.width - 100 * px,
        justifyContent:'center',
        alignItems:'center',
        paddingBottom: 20 * px
    },
    m_VerifyCodeBox:{
        height: 40 * px,
        width: 80 * px,
        justifyContent:'center',
        alignItems:'center',
    },
    m_VerifyCode:{
        height: 30 * px,
        width: 90 * px,
    },
	sureImg: {
		position: 'absolute',
		right: 10,
		top: 10,
	}
});
const resetPwdPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff',
    },
    contentBox:{
        marginTop: 15 * px,
        alignItems:'center',
        height: 100
    },
    contentSubBox:{
        backgroundColor:'#fff',
        width: Util.size.width,
    },
    itemBox:{
        height: 45 * px,
        width: Util.size.width,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 21 * px,
        backgroundColor:'#fff',
        marginBottom: 20 * px
    },
    userNameBox:{
        marginLeft: 10 * px,
        height: 50 * px,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:"#fff"
    },
    labelImg:{
        
    },
    labelImgBox:{
        height: 36* px,
        width: 36* px,
        justifyContent:'center',
        alignItems:'center',
        paddingBottom: 5 * px
    },
    input:{
        height: 50 * px,
        width: Util.size.width - 60,
        fontSize: commonFontSize(13)
    },
    verifyCodeInput:{
        height:50 * px,
        width: Util.isIOS ? Util.size.width - 60 : Util.size.width - 90,
        fontSize: commonFontSize(14),
    },
    smsCodeInput:{
        height: 44 * px,
        width: Util.size.width - 160,
        fontSize: commonFontSize(15),
        
    },
    submitButtonBox:{
        marginTop: 20 * px
    },

});
export {
    phoneCertifyPageStyle,
    resetPwdPageStyle
}