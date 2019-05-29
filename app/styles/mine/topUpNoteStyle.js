/**
 * Created by liuzhenli on 2017/7/13.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
var width = Util.size.width;
const topUpNotesPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f6f7fa'
    },
    contentBox:{
        flex: 1,
        alignItems:"center"
    },
    titleBox:{
        height: 42 * px,
        width: width,
        backgroundColor:'#fff',
        flexDirection:'row',
        paddingHorizontal: 12 * px
    },
    titleBoxItem:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    },
    titleItem:{
        fontSize: commonFontSize(12),
        color: '#9D9D9D'
    },
    contentItemBox:{
        flex: 1,
        width: width,
        
    },
    itemBox:{
        height: 30 * px,
        flexDirection: 'row',
        paddingHorizontal: 14 * px,
        paddingBottom: 5 * px
    },
    itemBoxTop:{
        height: 30 * px,
        flexDirection: 'row',
        paddingHorizontal: 14 * px,
        paddingTop: 5 * px,
    },
    itemDateBox:{
        flex: 1,
        justifyContent:'center',
    },
    itemDateBoxRight:{
        flex: 1.5,
        justifyContent:'center',
        alignItems:'flex-end'
    },
    itemText:{
        fontSize:commonFontSize(12),
        color:'#36972C',
    },
    itemTextStatus:{
        fontSize:commonFontSize(15),
        color:'#9B9B9B',
    },
    itemTextDate:{
        fontSize:commonFontSize(12),
        color:'#9B9B9B',
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
    orderText:{
        width: 110 * px,
        paddingLeft: 0,
        paddingRight: 20 * px,
        fontSize:  commonFontSize(11),
    },
    emptyItemBox:{
        height: Util.size.height - 100* px,
        width: Util.size.width,
        justifyContent:"center",
        alignItems:'center',
    },
    footerLoadingBox:{
        flexDirection: 'row',
        alignItems:'center',
    },
    footerLoadingImg:{
        marginRight: 10 * px,
    },
    emptyItem:{
        marginBottom: 30 * px,

    },
    emptyItemText:{
        color:'#3F3A39',
        fontSize: commonFontSize(14),
    },


    w_titleBox:{
        height: 42 * px,
        width: width,
        backgroundColor:'#fff',
        flexDirection:'row',
        paddingHorizontal: 12 * px
    },
    w_titleBoxItem:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    },
    w_titleItem:{
        fontSize: commonFontSize(12),
        color: '#9D9D9D'
    },
    w_contentItemBox:{
        flex: 1,
        width: width,

    },
    w_itemBox:{
        height: 50 * px,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
    },
    w_itemDateBox:{
        flex: 1.5,
        justifyContent:'center',
        alignItems:'center',
    },
    w_itemText:{
        fontSize:commonFontSize(12),
        color:'#3F3A39',
        textAlign:'center',
        paddingHorizontal: 5 * px,
    },

});
export {
    topUpNotesPageStyle
}