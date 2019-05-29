/**
 * Created by liuzhenli on 2017/7/6.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var px  = Util.pixel;
var commonFontSize = Util.commonFontSize
const loginPageStyles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
        zIndex: 9999999999
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
        alignItems:'center'
    },
    userNameBox:{
        height: 45 * px,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        width: Util.size.width - 28 * px,
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
        height: 45 * px,
        flex:1,
        fontSize: commonFontSize(15),
    },
    verifyCodeInput:{
        height: 44 * px,
        width: Util.isIOS ? Util.size.width - 150:Util.size.width - 200 ,
        fontSize: commonFontSize(13),
    },
    verifyCodeInputBox:{
        height: 44 * px,
        width: Util.size.width - 135,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    verifyCodeBox:{
        height: 36,
        width: 80,
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
    forgotPwdBox:{
        marginTop: 20* px,
        height: 18 * px,
        width: Util.size.width - 40,
        backgroundColor:'transparent',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    forgotPwdTitle:{
        fontSize: commonFontSize(15),
        color:'#025FCB'
    },
    registerTitle:{
        fontSize: commonFontSize(13),
        color:'#2EA7E0'
    },
    verifyCode:{
        height: 34 * px,
        width: 100*px,//80 * px,
    },
    buttonSubBox:{
        marginTop: 20 *px
    },
    logoBox:{
        height: 100* px,
        justifyContent:'center',
        alignItems:'center'
    },
    remindsBox:{
        height: 50 * px,
        paddingTop: 10 * px,
        paddingLeft: 50 * px,
    },
    remindsText:{
        fontSize: commonFontSize(12),
        color: 'red'
    },
    hidePwdImg:{
        width: 45 * px,
        height: 45 * px,
        alignItems:'center',
        justifyContent:'center',
    },
    hidePwdImgSpace:{
        width: Util.isIOS ? 8 * px : 0,
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
        fontSize: commonFontSize(10),
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
    }
});


export {
    loginPageStyles
};