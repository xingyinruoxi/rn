/**
 * Created by liuzhenli on 2017/7/17.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
var width = Util.size.width;
const fundNotesPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f6f7fa'
    },
    contentBox:{
        flex: 1,
        alignItems:'center',
    },
    footerBox:{
        height: 40 * px,
        width: width,
        alignItems:'center',
        justifyContent:'center',
    },
    footerTitle:{
        fontSize:  commonFontSize(13),
        color:'#9d9d9d',
    },
    itemBox:{
        height: 50 * px,
        flexDirection: 'row',
        backgroundColor:'#f6f7fa',
        alignItems:'center'
    },
    itemBoxLeft:{
        flex:1,
        alignItems:'center',
        paddingLeft: 20 * px,
    },
    itemBoxRight:{
        flex:1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'flex-end',
        paddingRight: 14 * px,
    },
    itemTitleBox:{
        height: 30 * px,
        width: width/2,
        justifyContent:"center",
    },
    itemContentBox:{
        height: 20 * px,
        width: width/2,
        flexDirection:'row',
    },
    itemTitle:{
        fontSize: commonFontSize(13),
        color:'#4A4A4A'
    },
    itemContent:{
        fontSize: commonFontSize(11),
        color:'#4A4A4A',
    },
    itemContentBoxTitle:{
        height: 14 *px,
        paddingHorizontal: 2 * px,
        borderRadius: 7 * px,
        justifyContent:'center',
        alignItems:'center'
    },
    itemContentTitle:{
        fontSize: commonFontSize(9),
        color:'#fff',
    },
    itemContentBoxTime:{
        height: 14 *px,
        justifyContent:'center',
        alignItems:'center',
    },
    itemBoxRightTitleBox:{
        
    },
    money:{
        fontSize: commonFontSize(14)
    },
    filterBox:{
        width: Util.size.width,
        position: 'absolute',
        top: 0,
        left:0,
        backgroundColor:"rgba(0,0,0,0.2)",
        overflow:'hidden'
    },
    topBox:{
        height: 50 * px,
        width: Util.size.width,
        backgroundColor:'#fff',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
    },
    filterButton:{
        height: 25 * px,
        width: (Util.size.width -80 * px) / 6,
        justifyContent:'center',
        alignItems:'center',
    },
    filterButtonTitle:{
        fontSize: commonFontSize(14),
        color:'#9B9B9B'
    },
    activeButtonTitle:{
        fontSize: commonFontSize(15),
        color:'#025FCC'
    },
    buttonButton:{
        height: 40 *px,
        alignItems:'center',
        backgroundColor:"rgba(245,245,245,1)",
        flexDirection: 'row',
        paddingVertical: 5 * px,

    },
    button:{
        height: 30 * px,
        width: 100 *px,
        backgroundColor:'#2EA7E0',
        borderRadius: 7 * px,
        marginLeft: (Util.size.width - 100 * px)/2,
        justifyContent:'center',
    },
    buttonText:{
        fontSize:commonFontSize(14),
        textAlign:'center',
        color:"#fff",
        backgroundColor:'transparent'
    },
    clean:{
        fontSize:commonFontSize(12),
        textAlign:'center',
        color:"#2EA7E0",
        backgroundColor:'transparent',
        marginLeft: 20 * px,
        paddingTop: 10 * px,
        lineHeight: Util.lineHeight(30)
    },
    filterSubBox:{
        flex:1,
        width: Util.size.width,
    },
    emptyItemBox:{
        height: Util.size.height *0.7,
        width: Util.size.width,
        justifyContent:"center",
        alignItems:'center',
    },
    emptyItem:{
        marginBottom: 30 * px,
        marginLeft: 15 * px,
    },
    emptyItemText:{
        color:'#3F3A39',
        fontSize: commonFontSize(14),
    },
    footerLoadingBox:{
        flexDirection: 'row',
        alignItems:'center',
    },
    footerLoadingImg:{
        marginRight: 10 * px,
    },
    leftImgBox:{
        height: 50 * px,
        width: 50 * px,
        justifyContent:'center',
        alignItems:'center',
    },
    tabBarUnderlineStyle: {
        height:Util.pixel * 1,
        backgroundColor:'#2ea7e0'
    },
    tabBarTextStyle:{
        fontSize:commonFontSize(14)
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
    menuItem:{
        height: 2 * px,
        backgroundColor:'#025FCC',
        bottom: -1,
    },
});
export {
    fundNotesPageStyle
}