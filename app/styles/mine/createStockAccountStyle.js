/**
 * Created by liuzhenli on 2017/7/11.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const manageAccountPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f7fa',
    },
    contentBox: {
        flex: 1,
        backgroundColor: '#f6f7fa',
        alignItems: 'center',
    },
    tabMenuBox: {
        height: 42 * px,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8'
    },
    menuBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    active: {
        borderBottomWidth: 2,
        borderBottomColor: "#2EA7E0"
    },
    tabMenuTitle: {
        fontSize: commonFontSize(14),
        color: '#9d9d9d'
    },
    activeTitle: {
        color: "#2EA7E0"
    },
    itemBox: {

        alignItems: 'center',
        marginTop: 15 * px,
        backgroundColor: '#fff',
        width: Util.size.width
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
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#fff",
        height: 45 * px,
        paddingHorizontal: 12 * px,
    },

    labelImgBox: {
        height: 36 * px,
        width: 36 * px,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex:1,
        fontSize: commonFontSize(13),
        color: '#9d9d9d',
    },
    verifyCodeInput: {
        height: 44 * px,
        width: Util.isIOS ? Util.size.width - 160 * px : Util.size.width - 190 * px,
        fontSize: commonFontSize(13),
        paddingRight: 10 * px,
    },
    verifyCodeInputBox: {
        height: 44 * px,
        width: Util.size.width - 160 * px,

    },
    verifyCodeBox: {
        height: 36* px,
        width: 100* px,
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
        marginBottom: 15 * px,

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
        marginTop: 30 * px,
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
        fontSize: commonFontSize(13),
        marginRight: 10 * px
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
    keyboardBox:{
        height: 300 * px,
        width: Util.size.width,
    }
});
export {
    manageAccountPageStyle
}