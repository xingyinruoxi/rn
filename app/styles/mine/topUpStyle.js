/**
 * Created by liuzhenli on 2017/7/12.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const topUpPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f6f7fa'
    },
    contentBox:{
        flex: 1,
        marginTop: 15 * px,
        backgroundColor:'#f6f7fa',
        alignItems:'center',
    },
    dataBox:{
        minHeight: 100* px,
        marginBottom: 40 * px,
        backgroundColor:'#fff',
        width: Util.size.width,
        paddingHorizontal: 24 * px,
    },
    bankBox:{
        minHeight: 35 * px,
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:"center",
        paddingHorizontal: 6 * px,
        paddingVertical: 5 * px,
    },
    bankLogoBox:{
        height: 18 * px,
        width: 18 * px,
        alignSelf: 'center',
        justifyContent:'center',
    },
    bankNameBox: {
        height: 45 * px,
        width: 90 * px,
        justifyContent:'center',
    },
    titleLabelBankName:{
        marginLeft: 5 * px
    },
    bankNoBox:{
        flex:1,
        justifyContent:'center',
    },
    input:{
        flex:1,
        color:'#3F3A39',
        fontSize: commonFontSize(13),
        textAlign:'left',
        marginLeft: 10 * px,
    },
    moneyInput:{
        height: 30* px,
        width: Util.size.width/1.8,
        justifyContent:'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#979797',
        backgroundColor:'#F7F7F7'
    },
    bankNo:{
        alignSelf: 'flex-end',
        color:'#3F3A39',
    },
    bankNum:{
        color:"#4A4A4A",
        alignSelf: 'flex-end',
    },
    userNameBox:{
        height: 44 * px,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:  20 * px,
    },
    labelImg:{

    },
    labelImgBox:{
        height: 36* px,
        width: 90* px,
        justifyContent:'center',
        alignItems:'center',
    },
    verifyCodeInput:{
        height: 44 * px,
        width: 190 * px,
        fontSize: commonFontSize(13),
        marginLeft: 10 * px,
    },
    verifyCodeInputBox:{
        height: 44 * px,
        width: 190 * px,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor:'#ccc',
        borderRadius: 5 * px,
    },
    verifyCodeBox:{
        height: 36* px,
        width: 80* px,
        justifyContent:'center',
        alignItems:'center',
    },
    getSmsButton:{
        height: 34 * px,
        width: 65 * px,
        backgroundColor:'#2EA7E0',
        borderRadius: 5,
        justifyContent:'center',
        alignItems:'center',

    },
    verifyCode:{
        height: 34 * px,
        width: 66 * px,
    },
    titleLabel:{
        color:'#9B9B9B',
        fontSize: commonFontSize(14),
    },
    getSmsButtonTitle:{
        color:'#fff',
        fontSize: commonFontSize(12),
    },
    explainBox:{
        height: 60 * px,
        width: Util.size.width,
        justifyContent:'center',
        paddingHorizontal:20 * px,
        flexDirection:'row',
        marginTop: 20 * px,
    },
    explainTitle:{
        fontSize: commonFontSize(12),
        color:'red',
        fontWeight: '200',
        lineHeight: Util.lineHeight(15),
    },
    explainBoxLeft:{
        width: 90 * px,
    },
    explainBoxRight:{
        flex:2.7,

    },
    bankAccountBox:{
        justifyContent:"center",
        alignItems:'center',
        marginTop: 15 * px,
    },
    cardBg:{
        height: (Util.size.width - 60* px) * px / 582 * 304,
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
        alignItems:'center',
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
        width: 91 * px,
        marginRight: 20 * px,
        borderRadius: 2 * px,
        justifyContent: 'center',
        alignItems:'center',
        flexDirection: 'row'
    },
    cardTypeTitle:{
        color:'#3F3A39',
        fontSize: commonFontSize(15),
        backgroundColor:'red'
    },
    limitRemind:{
        color:'#9B9B9B',
        fontSize: commonFontSize(12),
    },
    buttonBox:{
        position: 'absolute',
        bottom:0,
        left:0,
        height: 50 * px,
        width: Util.size.width,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:'#025FCB'
    },
    buttonText:{
        fontSize: commonFontSize(17),
        color:'#fff'
    },
    inputText:{
        color:'#4A4A4A',
        fontSize: commonFontSize(14),
        marginRight: 10 * px,
    },
    limitTextBox:{
        height: 20 *px,
        paddingLeft: 120 * px
    },
    limitTextBoxText:{
        fontSize:commonFontSize(10),
        color:'#888889'
    },
    checkLimit:{
        height: 40 * px,
        width: Util.size.width,
        paddingRight: 28 * px
    },
    checkLimitTitle:{
        color:'#4A4A4A',
        fontSize: commonFontSize(14),
        marginRight: 10 * px,
    },
    checkLimitBox:{
        height: 40 * px,
        justifyContent:'flex-end',
        alignItems:'center',
        flexDirection:'row',
    }
});
export {
    topUpPageStyle
}