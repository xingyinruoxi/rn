/**
 * eTongDai React Native App
 * This define projectList view used css
 * @John
 */

import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize

const projectListStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    ScrollableTabBar: {

    },
    flexRow: {
        flexDirection:'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    sort: {
        height: Util.pixel*37,
        paddingLeft: Util.pixel*15,
        paddingRight: Util.pixel*15,
    },
    sortText: {
        fontSize: Util.commonFontSize(14),
        color: '#9b9b9b',
    },
    projectTabList:{
		//marginBottom: Util.isIOS ? Util.lineHeight(49) : 0
        flex: 1,
    },
    footer: {
        paddingTop: Util.pixel*10,
        paddingBottom: Util.pixel*10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#9b9b9b',
        fontSize: commonFontSize(12),
    },
    loading: {
        marginTop: Util.pixel*5,
        marginBottom: Util.pixel*5,
    },
    l_content:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.7)',
        alignItems:"center",
        justifyContent:'center',
        flexDirection:'row'
    },
    l_justRegiste:{
        position:'absolute',
        right: Util.isIOS ? Util.deviceType == '5' || Util.deviceType == '5s' ? null : 10 * Util.pixel : null,
        top: Util.isIOS ? Util.deviceId.indexOf('iPhone10') > -1 ? Util.pixel*115 : Util.isPlus ?   53 * Util.pixel : Util.deviceType == '5' || Util.deviceType == '5s' ? 50 * Util.pixel : 50 * Util.pixel :  40 * Util.pixel,
    },
    l_justRegiste4:{
        position:'absolute',
        right: Util.isIOS ? Util.deviceType == '5' || Util.deviceType == '5s' ? null : 10 * Util.pixel : null,
        top: Util.isIOS ? Util.deviceId.indexOf('iPhone10') > -1 ? Util.pixel*255 : (Util.isPlus ?   188 * Util.pixel : 185 * Util.pixel) :  175 * Util.pixel,
    },
    l_justRegiste3:{
        position:'absolute',
        left: 20 * Util.pixel,
        top: 400 * Util.pixel,
    },
    l_justRegiste2:{
        position:'absolute',
        
        top: 270 * Util.pixel,
    },
    iKnow:{
        alignSelf:'flex-end',
        marginBottom: 100 * Util.pixel,
    },
    iKnow3:{
        alignSelf:'flex-end',
        marginBottom: 50 * Util.pixel,
    },
    iKnowImg:{
        width: Util.deviceType == '5' || Util.deviceType == '5s' ? 80* Util.pixel : null,
        height: Util.deviceType == '5' || Util.deviceType == '5s' ? 80* Util.pixel /242 * 100 : null
    },
    loadingView: {
        height: Util.pixel*90,
        width: Util.pixel*90,
        backgroundColor:'rgba(0,0,0,0.9)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems:'center',
    },
    adEnter: {
        width: Util.pixel*60,
        height: Util.pixel*60,
        position: 'absolute',
        top: Util.pixel*229,
        right: 0,
    }
});
export {
    projectListStyle
}