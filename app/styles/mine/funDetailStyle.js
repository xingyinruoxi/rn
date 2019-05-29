/**
 * Created by liuzhenli on 2017/7/17.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const fundDetailPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f6f7fa',
    },
    contentBox:{
        flex: 1,
        alignItems:'center',
    },
    contentSubBox:{
        backgroundColor:'#fff',
        width: Util.size.width,
    },
    itemBox:{
        minHeight: 50 * px,
        width: Util.size.width,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 14 * px,
        backgroundColor:'#fff',
    },
    itemBoxRemark:{
        minHeight: 50 * px,
        width: Util.size.width,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal: 14 * px,
        backgroundColor:'#fff',
        paddingBottom: 10 * px
    },
    labelTextBox:{
        height: 40 * px,
        flex:1,
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection:'row',

    },
    labelTextBoxRemarks:{
        paddingTop: 10 *px,
        height: 50 * px,
    },
    labelText:{
        fontSize: commonFontSize(15),
        color:'#4A4A4A',
        marginLeft: 5 * px,
    },
    labelTextRight:{
        fontSize: commonFontSize(15),
        color:'#4A4A4A',
        textAlign:'right'
    },
    remarks:{
        textAlign:"right",
    },
    remarksBox:{
        alignItems:'flex-start',
        paddingTop: 10 * px,
    },
    labelTextBoxRight:{
        minHeight: 45 * px,
        width: (Util.size.width -28* px)/3 * 2,
        justifyContent:'flex-end',
        alignItems:'center',
    },
    labelTextBoxRightRemarks:{
        minHeight: 50 * px,
        width: (Util.size.width -28* px)/3 * 2,
        alignItems:'flex-start',
        paddingTop: 6 * px
    },
    accountBox:{
        marginTop: 15 * px,
        backgroundColor:"#fff",
    },
    userNameBox:{
        height: 44 * px,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:"#fff"
    },
    labelImg:{

    },
    labelImgBox:{
        height: 36* px,
        width: 36* px,
        justifyContent:'center',
        alignItems:'center',
    },
});
const investmentDetail =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f6f7fa',
    },
    contentBox:{
        flex: 1,
        alignItems:'center',
        justifyContent:'center'
    },
    contentSubBox:{
        backgroundColor:'#fff',
        width: Util.size.width,
    },
    itemBox:{
        height: 40 * px,
        width: Util.size.width,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 14 * px,
        backgroundColor:'#fff',
    },
    itemBoxItemList:{
        height: 40 * px,
        width: Util.size.width,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 10 * px,
        backgroundColor:'#fff',
    },
    labelTextBox:{
        height: 40 * px,
        width: (Util.size.width -20* px)/2,
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection:'row',
       
    },
    labelTitleBoxLeft:{
        height: 40 * px,
        width: (Util.size.width -20* px)/3,
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection:'row',
        paddingLeft: 5 * px,
    },
    labelTitleBoxCenter:{
        height: 40 * px,
        width: (Util.size.width -20* px)/3,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
    },
    labelTitleBoxRight:{
        height: 40 * px,
        width: (Util.size.width -20* px)/3,
        justifyContent:'flex-end',
        alignItems:'center',
        flexDirection:'row',
        paddingRight: 5 *px,
    },
    labelText:{
        fontSize: commonFontSize(14),
        color:'#3F3A39',
        marginLeft: 5 * px,
    },
    labelTextItemRight:{
        fontSize: commonFontSize(11),
        color:'#3F3A39',
    },
    labelTextRight:{
        fontSize: commonFontSize(14),
        color:'#3F3A39',
        textAlign:'right',
        paddingRight: 5 *px,
        width: Util.isIOS ? null : Util.size.width - 180 * px,
    },
    labelTextBoxRight:{
        width: (Util.size.width -28* px)/2,
        justifyContent:'flex-end',
        alignItems:'center',
    },
    accountBox:{
        marginTop: 15 * px,
        backgroundColor:"#fff",
    },
    userNameBox:{
        height: 44 * px,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:"#fff"
    },
    labelImg:{

    },
    labelImgBox:{
        height: 36* px,
        width: 36* px,
        justifyContent:'center',
        alignItems:'center',
    },
    listBox:{
       flex:1,
        marginTop: 10 * px,
        backgroundColor:'#fff',
        width: Util.size.width
    }
});
export{
    fundDetailPageStyle,
    investmentDetail
}