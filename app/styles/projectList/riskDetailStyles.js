/**
 * Created by glzc on 2017/7/11.
 */
import {StyleSheet} from 'react-native';
import Util from './../../commons/util';
const RiskDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    padding: {
        paddingLeft: Util.pixel*10,
        paddingRight: Util.pixel*10,
    },
    headContent: {
        height: Util.pixel*121,
        backgroundColor: '#006eee',
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
    rateText:{
        fontSize: Util.commonFontSize(36),
        color:'#fff',
        marginTop:0,
    },
    rateSymbol:{
        fontSize:Util.commonFontSize(20),
        color:'#fff',
        marginBottom:Util.pixel * -10,
        alignItems: 'flex-end',
    },
    topText:{
        fontSize:Util.commonFontSize(12),
        color:'#d8d8d8',
    },
    title: {
        color: '#4a4a4a',
        fontSize: Util.commonFontSize(15),
    },
    minTitle: {
        color: '#4a4a4a',
        fontSize: Util.commonFontSize(14),
    },
    line: {
        height: Util.pixel *0.5,
        backgroundColor: '#d8d8d8',
    },
    topUpBtn: {
        width: Util.pixel*42,
        height: Util.pixel*26,
        borderWidth: Util.pixel*0.5,
        borderColor: '#e94639',
        borderRadius: Util.pixel*4,
        marginLeft: Util.pixel*10,
    },
    footer: {
        width: Util.size.width,
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    agreementText: {
        fontSize: Util.commonFontSize(12),
        color: '#4a4a4a'
    },
    _submit: {
        height: Util.pixel*55,
        backgroundColor: '#fff',
    },
    submitText: {
        fontSize: Util.commonFontSize(17),
        color: '#4a4a4a',
    },
    submitBtn: {
        width: Util.pixel*86,
        height: Util.pixel*40,
        backgroundColor: '#e94639',
        borderRadius: Util.pixel*8,
    },
    notice: {
        fontSize: Util.commonFontSize(10),
        color: '#9b9b9b',
    },
});

export {
    RiskDetailStyles
}