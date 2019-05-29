/**
 * eTongDai React Native App
 * This define project info slide two view used css
 * @John
 */

import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;

const projectInfoSlideTwoStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    flexRow:{
        flexDirection:'row',
        height:Util.pixel * 20,
    },
    flexColumn:{
        flexDirection:'column',
        justifyContent: 'center',
        marginLeft:Util.pixel * 10,
    },
    baseInfoBoldText:{
        fontSize:commonFontSize(13),
        color:'#3f3a39',
        fontWeight:'bold',
        marginBottom: Util.pixel * 1,
    },
    baseLineInfo:{
        borderStyle:'dashed',
        borderColor: Util.isIOS ? '#c5c5c5' : '#e8e8e8',
        borderWidth: Util.isIOS ? 0.5 : StyleSheet.hairlineWidth,
        width:Util.size.width - Util.pixel * 20,
        marginBottom: Util.pixel *5,
    },
    baseInfoText:{
        fontSize:commonFontSize(12),
        color:'#3f3a39',
    },
    flexListRow:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height:Util.pixel * 40,
    },
    flexListText:{
        fontSize:commonFontSize(12),
        color:'#3f3a39',
        textAlign:'center',
    },
    checkedState:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedImg:{
        marginRight: Util.pixel*3
    },
    headerContent: {
        width: Util.size.width - 28,
        alignSelf: 'center',
        flexDirection: 'column',
    },
    noDataText: {
        fontSize: commonFontSize(14),
        color: '#9d9d9d'
    },
    footer: {
        height: Util.pixel*55,
    }
});
export {
    projectInfoSlideTwoStyle
}