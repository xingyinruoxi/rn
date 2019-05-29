/**
 * Created by liuzhenli on 2017/7/13.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const myInvestmentPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f6f7fa'
    },
    contentBox:{
        flex:1,
    },
    topMenuBox:{
        height: 42  * px,
        width: Util.size.width,
        flexDirection: 'row',
        justifyContent:'center',

    },
    menuItem:{
        height: 2* px,
        backgroundColor:'#025FCC',
        bottom: -1,
    },
    active:{
        borderBottomWidth: 1,
        borderBottomColor:"#2EA7E0"
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
	buttonBox: {
		height: 50 * px,
		width: Util.size.width,
		backgroundColor: '#025FCB',
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontSize: 17,
		color: '#fff'

	}
});
export {
    myInvestmentPageStyle
}