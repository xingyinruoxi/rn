/**
 * Created by liuzhenli on 2017/7/11.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const accountManagePageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f6f7fa'
    },
    userInfoBox:{
        flex: 1,
    },
    itemBox:{
        height: 45 * px,
        width: Util.size.width,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 21 * px,
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
        color:'#3F3A39'
    },
    labelTextRight:{
        fontSize: commonFontSize(13),
        color:'#9D9D9D',
        paddingRight: 6 * px,
    },
    labelTextBoxRight:{
        justifyContent:'flex-end',
        alignItems:'center',

    },
    accountBox:{
        marginTop: 10 * px,
        backgroundColor:"#fff",
    },
    headerImgBox:{
        height: 110 * px,
        width: Util.size.width,
        backgroundColor:'#006EEE',
        alignItems:'center',
        paddingTop: 10 * px,
    },
    headerImg:{
        height: 70 * px,
        width: 70* px,
        borderRadius:50,
        backgroundColor:'#006EEE'
    },
    buttonBox:{
        height: 50 * px,
        width: Util.size.width,
        alignItems:"center",
        justifyContent:'center',
        marginTop: 30* px,
    }
});
export {
    accountManagePageStyle
}