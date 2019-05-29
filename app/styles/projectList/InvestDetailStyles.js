/**
 * Created by glzc on 2017/7/11.
 */
import { StyleSheet,PixelRatio } from 'react-native';
import Util from './../../commons/util';

const InvestDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#f7f7f7',
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
        backgroundColor: '#e8e8e8',
    },
    topUpBtn: {
        width: Util.pixel*42,
        height: Util.pixel*26,
        borderWidth: Util.pixel*0.5,
        borderColor: '#e94639',
        borderRadius: Util.pixel*4,
        marginLeft: Util.pixel*10,
    },
    inputFrameContent: {
        backgroundColor: '#fff',
        paddingTop: Util.pixel*13,
        marginTop: Util.pixel*9,
        marginBottom: Util.pixel*9,
    },
    addReduceFrame: {
        width: Util.pixel*(Util.size.width <= 320 ? 224 : (!Util.isIOS && PixelRatio.get() > 2.5 || Util.isSMG7508Q) ? 266 : 280),
        height: Util.pixel*(Util.size.width <= 320 ? 32 : (!Util.isIOS && PixelRatio.get() > 2.5 || Util.isSMG7508Q) ? 38 : 40),
        position: 'relative',
    },
    addReduceFrameIn: {
        width: Util.pixel*(Util.size.width <= 320 ? 224 : (!Util.isIOS && PixelRatio.get() > 2.5 || Util.isSMG7508Q) ? 266 : 280),
        height: Util.pixel*(Util.size.width <= 320 ? 32 : (!Util.isIOS && PixelRatio.get() > 2.5 || Util.isSMG7508Q) ? 38 : 40),
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
    },
    reduceBtn: {
        width: Util.pixel*(Util.size.width <= 320 ? 32 : (!Util.isIOS && PixelRatio.get() > 2.5 || Util.isSMG7508Q) ? 38 : 40),
        height: Util.pixel*(Util.size.width <= 320 ? 32 : (!Util.isIOS && PixelRatio.get() > 2.5 || Util.isSMG7508Q) ? 38 : 40),
        position: 'relative',
    },
    input: {
        height: Util.pixel*(Util.size.width <= 320 ? 32 : (!Util.isIOS && PixelRatio.get() > 2.5 || Util.isSMG7508Q) ? 38 : 40),
        width: Util.pixel*(Util.size.width <= 320 ? 125 : (!Util.isIOS && PixelRatio.get() > 2.5 || Util.isSMG7508Q) ? 157 : 166),
        padding: 0,
    },
    reduce: {
        width: Util.pixel*(Util.size.width <= 320 ? 22.4 : (!Util.isIOS && PixelRatio.get() > 2.5 || Util.isSMG7508Q) ? 26.6 : 28),
        height: Util.pixel*3,
        backgroundColor: '#006eee',
    },
    add: {
        width: Util.pixel*3,
        height: Util.pixel*(Util.size.width <= 320 ? 22.4 : (!Util.isIOS && PixelRatio.get() > 2.5 || Util.isSMG7508Q) ? 25.2 : 28),
        position: 'absolute',
        top: Util.pixel*6,
        backgroundColor: '#fff',
        zIndex: 10,
    },
    allInBtn: {
        width: Util.pixel*(Util.size.width <= 320 ? 51.2 : (!Util.isIOS && PixelRatio.get() > 2.5 || Util.isSMG7508Q) ? 60.8 : 64),
        height: Util.pixel*(Util.size.width <= 320 ? 32 : (!Util.isIOS && PixelRatio.get() > 2.5 || Util.isSMG7508Q) ? 38 : 40),
        marginLeft: Util.pixel*10,
        borderWidth: Util.pixel*0.5,
        borderColor: '#025fcb',
        borderRadius: Util.pixel*4,
    },
    notices: {
        height: Util.pixel*20,
        justifyContent: 'flex-start',
    },
    noticesText: {
        fontSize: Util.commonFontSize(12),
        color: '#e94639',
    },
    noticesTextPadding: {
        paddingLeft: Util.pixel * (Util.size.width <= 320 ? 38 : (!Util.isIOS && PixelRatio.get() > 2.5 || Util.isSMG7508Q) ? 44 : 46 ),
    },
    redPacketsNum: {
        height: Util.pixel*25,
        paddingLeft: Util.pixel*5,
        paddingRight: Util.pixel*5,
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
        fontSize: Util.commonFontSize(Util.size.width <= 320 ? 15 : 17),
        color: '#4a4a4a',
    },
    submitBtn: {
        width: Util.pixel*86,
        height: Util.pixel*40,
        backgroundColor: '#e94639',
        borderRadius: Util.pixel*8,
    },
	keyboardControll:{
		height: 40 * Util.pixel,
		width: Util.size.width,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: 'rgba(169,169,169,0.5)',
		alignItems: 'flex-end',
		paddingRight: 14,
		justifyContent: 'center',
		marginBottom: Util.isIOS ? 30 : 0,
	},
	keyboardControllText: {
		fontSize: 16,
		color: '#4f4f4f'
	},
	keyboardControllBox:{
		height: 45 * Util.pixel,
		width: Util.size.width,
		position: 'absolute',
		bottom: 0,
		left: 0,
	}
});

export {
    InvestDetailStyles
}