/**
 * Created by liuzhenli on 2017/7/11.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const repayCalenderPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
    contentBox:{
        minHeight: 100* px,
        marginTop: 15 * px,
        backgroundColor:'#fff',
        alignItems:'center',

    },
    dataBox:{
        minHeight: 100* px,
        marginBottom: 40 * px,
    },
    bankBox:{
        height: 45 * px,
        flexDirection: 'row',
        justifyContent:'space-between',
        paddingHorizontal: 6 * px,
    },
    bankLogoBox:{
        height: 18 * px,
        width: 18 * px,
        alignSelf: 'center',
        backgroundColor:'red'
    },
    bankNameBox: {
        height: 45 * px,
        width: 100 * px,
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
        height: 44 * px,
       
        fontSize: commonFontSize(13),
        textAlign:'right'
    },
    bankNo:{
        alignSelf: 'flex-end'
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
        height: 36,
        width: 80,
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
        color:'#3F3A39',
        fontSize: commonFontSize(15),
    },
    getSmsButtonTitle:{
        color:'#fff',
        fontSize: commonFontSize(12),
    },
    
});
export {
    repayCalenderPageStyle
}