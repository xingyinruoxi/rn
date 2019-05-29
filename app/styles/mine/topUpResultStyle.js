/**
 * Created by liuzhenli on 2017/7/13.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
var width = Util.size.width;
const topUpResultPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f6f7fa'
    },
    contentBox:{
        flex: 1,
        backgroundColor:'#f6f7fa',
        alignItems:'center',
    },
    contentTopBox:{
        height: 200 * px,
        marginTop: Util.deviceType == '5' || Util.deviceType == '5s' ? 30 * px : 50 * px,
        width: width,
        justifyContent:'center',
        alignItems:'center',
    },
    contentImgBox:{
        paddingTop: 30 * px,
    },
    topUpNum:{
        fontSize:commonFontSize(15),
        color: '#025FCB',
        lineHeight: Util.lineHeight(30),
        paddingHorizontal: 30 * px,
        textAlign:'center',
        marginTop: 10 * px
    },
    bindCard:{
        fontSize:commonFontSize(17),
        color: '#025FCB',
        lineHeight: Util.lineHeight(30),
        paddingHorizontal: 30 * px,
        textAlign:'center',
        marginTop: 20 * px
    },
    topUpNumber:{
        fontSize: commonFontSize(11) ,
        color: '#9D9D9D',
        lineHeight: Util.lineHeight(20)
    },
    topUpNumberService:{
        fontSize:commonFontSize(11),
        lineHeight: Util.lineHeight(30),
        color: '#9D9D9D',
    },
    buttonBox:{
        height: 100 * px,
        width: width,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:"center",
    },
    actualWithdrawalAmount:{
        marginTop: 0,
        fontSize: commonFontSize(16)
    },
    bottomRemindBox:{
        flex:1,
        width:Util.size.width,
        paddingHorizontal: 14 * px,
        justifyContent:'flex-end',
        paddingBottom: 30 * px,
    },
    bottomServiceBox:{
        alignItems:'center',
    }
});
export {
    topUpResultPageStyle
}