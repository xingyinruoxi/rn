/**
 * Created by liuzhenli on 2017/7/12.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const stockAccountPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f7fa',
    },
    contentBox:{
        flex: 1,
        backgroundColor:'#f6f6f6',
        alignItems:'center',
        paddingHorizontal: 15 * px,
    },
    bankAccountBox:{
        justifyContent:"center",
        alignItems:'center',
        marginTop: 30 * px,
    },
    remindTitleBox:{
        height: 40 * px,
        justifyContent:"center",
    },
    remindTitle:{
        fontSize: commonFontSize(10),
        color:'#4A4A4A',
        fontWeight: '300',
        lineHeight: Util.lineHeight(17),
    },
    userAccountBox:{
        flex:1,
        width:Util.size.width,
        justifyContent:'flex-end',
        alignItems:'center',
        marginBottom: 50 * px,
    },

    cardBg:{
        height: (Util.size.width - 60* px) * px / 628 * 274,
        width: (Util.size.width - 60* px) * px,
    },
    cardTitleBox:{
        height: 40 * px,
        alignItems:'flex-start',
        justifyContent:'center',
        paddingTop: 10 * px
    },
    cardNoBox:{
        height: 60 * px,
        backgroundColor:'transparent',
        alignItems:'center',
        justifyContent:'center',
    },
    cardInfoBox:{
        flex: 1,
        backgroundColor:'transparent',
        justifyContent:'center',
        paddingLeft: 15 * px,
        paddingBottom: 20 * px,
    },
    userName:{
        lineHeight: Util.lineHeight(18),
        fontSize: commonFontSize(13),
        color:'#A7A7A7',
        fontWeight: '300'
    },
    cardNo:{
        fontSize: commonFontSize(21),
        fontWeight: '300',
        color:'#3F3A39',
        letterSpacing: -0.38 * px,
    },
    cardType:{
        height: 24 * px,
        justifyContent: 'center',
        alignItems:'center',
        flexDirection: 'row',
        paddingLeft: 20  *px,
    },
    cardTypeTitle:{
        color:'#3F3A39',
        fontSize: commonFontSize(15),
        backgroundColor:'transparent'
    },
    bottomRemind:{
        color:'#9B9B9B',
        fontSize: commonFontSize(14),
        lineHeight: Util.lineHeight(20)
    }
});
const bindBankCard =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f7fa',
    },
    contentBox:{
        flex: 1,
        backgroundColor:'#f6f6f6',
        alignItems:'center',

    },
    bankAccountBox:{
        justifyContent:"center",
        alignItems:'center',
        marginVertical: 15 * px,

    },
    remindTitleBox:{
        height: 40 * px,
        justifyContent:"center",
    },
    remindTitle:{
        lineHeight: Util.lineHeight(18),
        fontSize: commonFontSize(13),
        color:'#9D9D9D'
    },
    userAccountBox:{
        marginTop: 15 * px,
        height: 80 * px,
        width: Util.size.width,
        backgroundColor:"#fff",
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row'
    },
    userAccountBoxLeft:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    },
    userAccountNum:{
        color: '#2EA7E0'
    },
    userAccountNumTitle:{
        marginTop: 10 * px,
        fontSize: commonFontSize(14),
        color:'#3F3A39'
    },
    cardBg:{
        height: (Util.size.width - 60* px) * px / 582 * 304,
        width: (Util.size.width - 60* px) * px,
    },
    cardTitleBox:{
        height: 40 * px,
        flexDirection:'row',
        alignItems:'center',
    },
    cardNoBox:{
        height: 80 * px,
        backgroundColor:'transparent',
        alignItems:'center',
        justifyContent:'center',
    },
    cardInfoBox:{
        flex: 1,
        backgroundColor:'transparent',
        justifyContent:'center',
        paddingLeft: 15 * px,
    },
    userName:{
        lineHeight: Util.lineHeight(16),
        fontSize: commonFontSize(14),
        color:'#9D9D9D'
    },
    bankNum:{
        fontSize: commonFontSize(20),
        color: '#9D9D9D'
    },
    bankLogo:{
        marginLeft: 20 * px,
    },
    bankNameTitle:{
        marginLeft: 5 * px,
    },
    itemBox: {
        alignItems: 'center',
        backgroundColor: '#fff',
        width: Util.size.width,
    },
    item: {
        height: 106 * px,
        width: Util.size.width - 30 * px,
        backgroundColor: "#fff",
        marginTop: 15 * px,
        borderBottomLeftRadius: 5 * px,
        borderBottomRightRadius: 5 * px,
        borderBottomWidth: 4,
        borderBottomColor: "#E94639",
        overflow: 'hidden',
        paddingHorizontal: 10 * px,
    },
    itemTop: {
        height: 74 * px,
        flexDirection: 'row',

    },
    itemBottom: {
        height: 31 * px,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemBottomText: {
        flex: 1,
        fontSize: 10 * px,
        color: '#9D9D9D',
        letterSpacing: 0
    },
    itemTopLeft: {
        width: (Util.size.width - 30 * px) / 3 * 2,
        height: 74 * px,
    },
    itemTopRight: {
        height: 74 * px,
        width: (Util.size.width - 30 * px) / 3,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingLeft: 10 * px
    },
    itemTopRightNum: {
        fontSize: commonFontSize(50),
        color: '#E94639'
    },
    itemTopRightUnit: {
        fontSize: commonFontSize(10),
        color: '#E94639',
        paddingBottom: 10 * px,
        marginLeft: 5 * px
    },

    useRequirement: {
        flex: 1,
        fontSize: commonFontSize(14),
        color: '#4a4a4a',
        marginTop: 10 * px,
    },
    remarks: {
        flex: 1,
        fontSize: commonFontSize(10),
        color: '#E94639',
        marginTop: -5 * px,
    },
    userNameBox: {
        height: 50 * px,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: Util.ismulator ? 0 : 14 * px,
    },
    bankInfoBox:{
        width: Util.size.width,
    },
    topRemindBox:{
        height: 50 * px,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topRemindTitle:{
        fontSize: commonFontSize(14),
        color: '#025FCB',
    },
    labelImgBox: {
        height: 36 * px,
        width: 90 * px,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection:'row',
    },
    input: {
        flex:1,
        fontSize: commonFontSize(15),
        color: '#9d9d9d',
        marginLeft: 20 * px,
    },
    limitTitle:{
        flex:1,
        fontSize: commonFontSize(12),
        color: '#9d9d9d',
        marginLeft: 10 * px
    },
    verifyCodeInput: {
        height: 44 * px,
        width: Util.isIOS ? Util.size.width - 170 * px : Util.size.width -180 * px ,
        fontSize: commonFontSize(13),
        paddingRight: 10 * px,
        marginLeft: Util.isIOS ? 8 * px: null
    },
    verifyCodeInputBox: {
        height: 44 * px,
        width:  Util.isIOS ? Util.size.width - 160 * px :  Util.size.width - 160 * px,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
    },
    verifyCodeBox: {
        height: 36 * px,
        width: 100 * px,
        justifyContent: 'center',
        alignItems: 'center',
    },
    getSmsButton: {
        height: 30 * px,
        width: 98 * px,
        backgroundColor: '#2EA7E0',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    getSmsButtonTitle: {
        color: '#fff',
        fontSize: commonFontSize(12)
    },
    forgotPwdBox: {
        height: 18 * px,
        width: Util.size.width - 40 * px,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 3 * px,
    },
    forgotPwdTitle: {
        fontSize: commonFontSize(10),
        color: '#4A4A4A',
        marginLeft: 5 * px
    },
    buttonBox: {
        minHeight: 45 * px,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80 * px,
    },
    buttonTitle: {
        fontSize: commonFontSize(18),
        color: '#fff'
    },
    bankBox: {
        height: 45 * px,
        width: Util.size.width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 21 * px,
    },
    labelTextBox: {
        height: 45 * px,
        width: (Util.size.width - 40 * px) / 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    labelText: {
        fontSize: commonFontSize(15),
        color:"#4A4A4A",
        marginLeft: 10 * px,
    },
    bankSelectedTitle:{
        width: Util.deviceType == '5' || Util.deviceType == '5s' ?null: 110 * px,
        fontSize: commonFontSize(12),
        color:"#4A4A4A",
		marginLeft: 30 * px,
    },
    labelTextBoxRight: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    verifyCode: {
        height: 34 * px,
        width: 80 * px,
    },
    keyboardAvoidingView: {
        paddingBottom: -10 * px,
    },
    bankNumReminder: {
        height: 25 * px,
        backgroundColor: '#f6f7fa',
        width: Util.size.width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bankNumReminderText: {
        color: 'red'
    },
    successfulContainer: {
        minHeight: Util.size.height - 100 * px,
        width: Util.size.width,
        alignItems: 'center',
        paddingTop: 50 * px,
    },
    topUpNum: {
        fontSize: commonFontSize(15),
        color: '#2EA7E0',
        lineHeight: Util.lineHeight(30),
        marginTop: 25 * px,
    },
    topUpNumber: {
        fontSize: commonFontSize(13),
        color: '#9D9D9D',
        lineHeight: Util.lineHeight(30),
        marginTop: 15 * px,
        marginBottom: 25 * px,
    },
    smsCodeInput: {
        height: 44 * px,
        width: Util.size.width - 160,
        fontSize: commonFontSize(13),
    },
    setPwdInputBox: {
        width: Util.size.width,
        marginTop: 15 * px,
    },
    smsCodeBox: {
        height: 36,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textPhone: {
        fontSize: commonFontSize(13),
        color: '#9D9D9D',
    },
    pwdButtonBox:{
        flexDirection: 'row',
        height: 45 * px,
        width: Util.size.width,
        justifyContent: 'space-around',
        alignItems:'center'
    },

    buttonRight:{
        backgroundColor:'#fff',
        borderWidth: 1,
        borderColor: '#2EA7E0'
    },

    buttonTitleRight:{
        color: '#2EA7E0',
        fontSize: commonFontSize(17)
    },
    button:{
        height: 40 * px,
        width: 150 * px,
        backgroundColor:'#2EA7E0',
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 4 * px,
    },
    bottomRemindTitle:{
        color: '#4A4A4A',
        fontSize: commonFontSize(12),
        paddingHorizontal: 25  *px,
        lineHeight: Util.lineHeight(18),
        marginTop: 10  *px,
        textAlign:'center',
    },
    selectedBank:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    provience:{
        flex:1,
        height: 40 * px,
        flexDirection:'row',
        alignItems:'center',
        paddingLeft: 20 * px,
        justifyContent:'space-around',
    },
    cityBox:{
        height: 26 * px,
        width: 90 * px,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor:'#979797',
        backgroundColor:'#f6f7fa',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        overflow:'hidden',
        paddingLeft: 5 * px,
    },
    countryBox:{
        width: Util.deviceType == '5' || Util.deviceType == '5s' ? 85 * px : 115 * px,
    },
    selectButton:{
        height: 26 * px,
        width: 26 * px,
        backgroundColor:'#025FCB',
        justifyContent:'center',
        alignItems:'center',
    },
    cityName:{
        color: '#979797',
        fontSize: Util.deviceType == '5' || Util.deviceType == '5s' ? commonFontSize(12) : commonFontSize(15),
        textAlign:'center',
        width: Util.deviceType == '5' || Util.deviceType == '5s' ? 40 * px : 50 * px,
    },
    countryName:{
        color: '#979797',
        fontSize: Util.deviceType == '5' || Util.deviceType == '5s' ? commonFontSize(12) : commonFontSize(15),
        textAlign:'center',
        width: Util.deviceType == '5' || Util.deviceType == '5s' ? 50 * px : 80 * px,
    },
    selectButtonTop:{
        height: 7 * px,
        width: 7 *px,
        borderTopWidth: 1,
        borderTopColor: '#fff',
        borderRightWidth: 1,
        borderRightColor: "#fff",
        transform:[{rotate: '-45deg'}],
    },
    modal:{
        height: Util.size.height,
        width: Util.size.width,
        position:'absolute',
        top: 0,
        left: 0,
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    m_container:{
        height: Util.size.height,
        width: Util.size.width,
        backgroundColor:'rgba(0,0,0,0.5)',
        justifyContent:'center',
        alignItems:'center'
    },
    m_contentBox:{
        height: 240 * px,
        width: 271 * px,
        backgroundColor:'#fff',
        borderRadius: 4 * px,
        alignItems:'center'
    },
    m_titleBox:{
        height: 50 * px,
        width: 271 * px,
        alignItems:"center",
        justifyContent:'center',
    },
    m_titleImgBox:{
        height: 40 * px,
        width: 40 * px,
        position:'absolute',
        right: 0,
        top: 0,
        justifyContent:"center",
        alignItems:"center",
    },
    m_contentSubBox:{
        height: 100 * px,
        width: 240 * px,
    },
    m_title:{
        color: '#030303',
        fontSize: commonFontSize(17),
    },
    m_content:{
        height: 20 * px,
    },
    m_contentCity:{
       flexDirection:'row',
        width: 180 * px,
    },
    m_contentText:{
        color: '#4A4A4A',
        fontSize: commonFontSize(12),
        lineHeight: Util.lineHeight(20),
    },
    m_remindBox:{
        height: 30 * px,
        width: 271 * px,
        justifyContent:'center',
        alignItems:"center"
    },
    m_remindTitle:{
        color: '#ED5145',
        fontSize: commonFontSize(12),
    }
});
export {
    stockAccountPageStyle,
    bindBankCard
}