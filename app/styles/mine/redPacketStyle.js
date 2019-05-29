/**
 * Created by liuzhenli on 2017/7/11.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
var width = Util.size.width;
const redPacketPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f7fa',
    },
    contentBox:{
        flex: 1,
        backgroundColor:'#f6f6f6',
    },
    tabMenuBox:{
        height: 42 * px,
        flexDirection:'row',
        borderBottomWidth: 1,
        borderBottomColor:'#e8e8e8'
    },
    menuBox:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    active:{
        borderBottomWidth: 2,
        borderBottomColor:"#2EA7E0"
    },
    tabMenuTitle:{
        fontSize: commonFontSize(14),
        color: '#9d9d9d'
    },
    activeTitle:{
        color:"#2EA7E0"
    },
    itemBox:{
        flex: 1,
        alignItems:'center',
        backgroundColor:'#f6f7fa',
        width: Util.size.width,
        justifyContent:'center',
    },
    itemTop:{
        height: 74 * px,
        flexDirection: 'row',

    },
    itemBottom:{
        height: 31 * px,
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    itemBottomText:{
        flex: 1,
        fontSize: 10 * px,
        color: '#9D9D9D',
        backgroundColor:'transparent',
        width: 300
    },
    itemTopLeft:{
        width: (Util.size.width - 60 * px)/ 10*6,
        height: 74 * px,
    },
    itemTopRight:{
        height: 74 * px,
        width: (Util.size.width - 30 * px)/10*4,
        flexDirection: 'row',
        alignItems:'flex-end',
    },
    itemTopRightNum:{
        fontSize: commonFontSize(40),
        color:'#E94639'
    },
    itemTopRightUnit:{
        fontSize: commonFontSize(10),
        color:'#E94639',
        paddingBottom: 10 * px,
        marginLeft: 5 * px
    },

    useRequirement:{
        flex: 1,
        fontSize: commonFontSize(14),
        color:'#4a4a4a',
        marginTop: 10 * px,
    },
    remarks:{
        flex: 1,
        fontSize: commonFontSize(10),
        color:'#E94639',
        marginTop: -5 * px,
    },
    footerBox:{
        height: 40 * px,
        width: Util.size.width,
        alignItems:'center',
        justifyContent:'center',
    },
    footerTitle:{
        fontSize:  commonFontSize(13),
        color:'#9d9d9d',
    },
    emptyItemBox:{
        height: Util.size.height *0.7,
        width: width,
        justifyContent:"center",
        alignItems:'center',
    },
    endDate:{
        textAlign:'center'
    },
    emptyItem:{
        marginBottom: 10 * px,
    },
    emptyItemText:{
        color:'#9d9d9d',
        fontSize: commonFontSize(14),
    },
    ScrollableTabBar:{
        height: 42 * px,
    },
    tabBarStyle:{
        
        justifyContent:"center",
        alignItems:'center',
        paddingBottom: 0,
        backgroundColor:'#fff'
    },
    tabBarTextStyle:{
        fontSize:commonFontSize(14)
    },
    menuItem:{
        height: 2 * px,
        backgroundColor:'#025FCC',
        bottom: -1
    }
});
export {
    redPacketPageStyle
}