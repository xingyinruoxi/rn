/**
 * eTongDai React Native App
 * This define project info view used css
 * @John
 */

import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize

const projectInfoStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    slideOneTop: {
        backgroundColor: '#006eee',
        flexDirection:'column',
    },
    padding: {
        paddingLeft: Util.pixel*14,
        paddingRight: Util.pixel*14,
    },
    flexRow:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flexColumn:{
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tag: {
        width: Util.pixel*20,
        height: Util.pixel*20,
        borderRadius: Util.pixel*10,
        backgroundColor: '#ffffff',
        marginRight: Util.pixel*3,
    },
    tagText: {
        color: '#025fcb',
        fontSize: Util.commonFontSize(12),
    },
    originLend:{
        fontSize: Util.commonFontSize(12),
        color: '#eeefef',
    },
    projectName:{
        fontSize:commonFontSize(14),
        color:'#fff',
    },
    projectNameImg:{
        height:Util.pixel * 13,
        width:Util.pixel * 12,
    },
    rateText:{
        fontSize:commonFontSize(36),
        color:'#fff',
        marginTop:0,
    },
    rateSymbol:{
        fontSize:commonFontSize(20),
        color:'#fff',
        marginBottom:Util.pixel * -10,
        alignItems: 'flex-end',
    },
    line:{
        height: Util.pixel * 30,
        backgroundColor:'#fff',
        width:Util.pixel * 1,
        marginRight:Util.pixel * 20,
        marginLeft:Util.pixel * 20,
    },
    topText:{
        fontSize:commonFontSize(12),
        color:'#d8d8d8',
    },
    progress: {
        height: Util.pixel*2,
        backgroundColor: '#92d0fb',
        position: 'relative',
        top: -1,
    },
    lendedDescribe: {
        width: Util.pixel*70,
        position: 'absolute',
        top: Util.pixel*-18,
        backgroundColor: 'transparent'
    },
    lendedText: {
        fontSize: Util.commonFontSize(10),
        color: '#fff',
    },
    flexSpaceAround:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height:Util.pixel * 45,
        backgroundColor: '#fff',
    },
    infoTitle:{
        fontSize:commonFontSize(15),
        color:'#3f3a39',
    },
    infoNumber:{
        fontSize:commonFontSize(14),
        color:'#2ea7e0',
    },
    guaranteeImg:{
        height:Util.pixel * 14,
        width:Util.pixel * 14,
        marginRight:Util.pixel * 6,
    },
    guaranteeView:{
        height:Util.pixel * 25,
        paddingLeft: Util.pixel*3,
        paddingRight: Util.pixel*3,
        borderWidth: 1,
        borderColor:'#4990E2',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#fff',
        marginRight:Util.pixel * 5,
    },
    guaranteeText:{
        fontSize:commonFontSize(12),
        color:'#4990E2',
    },
    upMoveImg:{
        height:Util.pixel * 18,
        width:Util.pixel * 18,
        marginRight:Util.pixel * 15,
    },
    upMoveText:{
        fontSize:commonFontSize(16),
        color:'#9d9d9d',
    },
    button:{
        height:Util.pixel * 50,
        backgroundColor: '#025fcc',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
        position:'absolute',
        bottom:0,
        width:Util.size.width,
    },
    buttonText:{
        fontSize:commonFontSize(18),
        color:'#fff',
    },
    scrollViewHeight:{
        paddingBottom: Util.pixel*55,
    },
    space: {
        height: Util.pixel*10,
        backgroundColor: '#d8d8d8',
    },
    newItem: {
        height: Util.pixel*20,
        borderColor: '#E94639',
        borderWidth: Util.pixel*1,
        borderRadius: Util.pixel*5,
        paddingLeft: Util.pixel*1,
        paddingRight: Util.pixel*1,
        backgroundColor: '#E94639',
        marginRight: Util.pixel*5,
    },
    newItemText: {
        color: '#fff',
        fontSize: Util.commonFontSize(12)
    },
});
export {
    projectInfoStyle
}