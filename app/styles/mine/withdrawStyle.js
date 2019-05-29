/**
 * Created by liuzhenli on 2017/7/13.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const withdrawPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f7fa'
    },
    contentBox: {
        flex: 1,
        marginTop: 15 * px,
        backgroundColor: '#f6f7fa',
    },
	topSwiper: {
		height: 25 * px,
		width: Util.size.wdith,
		backgroundColor: '#FFE9DB',
		alignItems: 'center',
		overflow: 'hidden',
		position: 'absolute',
		left:0,
		top:0,
		zIndex: 10000
	},
	wrapper: {
		alignItems: 'center',
		backgroundColor: '#FFE9DB',
		paddingRight: 25 * px,
	},
	slide1:{
		height: 25 * px,
		width: Util.size.width,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 14 * px
	},
	closeButton:{
		height: 15 * px,
		width: 15 * px,
		position: 'absolute',
		right: 10 * px,
		top: 5 * px,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text:{
		fontSize: 10* px,
		color: '#FF894A'
	},
    dataBox: {
        minHeight: 80 * px,
        marginBottom: 20 * px,
        width: Util.size.width,
        paddingHorizontal: 24 * px,
				alignItems: 'center'
    },
    bankBox: {
        height: (Util.size.width - 60 * px) * 128 / 668,
				width: (Util.size.width - 60 * px) * px,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        paddingHorizontal: 12 * px,
        paddingVertical: 5 * px,
				marginVertical: 5 * px
    },
    bankLogoBox: {
        height: 18 * px,
        width: 18 * px,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    bankNameBox: {
        height: 45 * px,
        width: 90 * px,
        justifyContent: 'center',
    },
    titleLabelBankName: {
        marginLeft: 5 * px
    },
    bankNoBox: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        color: '#3F3A39',
        fontSize: commonFontSize(13),
        textAlign: 'left',
        marginLeft: 10 * px,
				backgroundColor: '#fff',
    },
    nb_input: {
        flex: 1,
        color: '#3F3A39',
        fontSize: commonFontSize(15),
        textAlign: 'left',
        marginLeft: 10 * px,
        width: Util.size.width - 110 * px,
    },
    moneyInput: {
        height: Util.isIOS ? 30 * px : 40 * px,
        width: Util.size.width / 1.78,
        justifyContent: 'center',
        backgroundColor: '#fff',
	},
    bankNo: {
        alignSelf: 'flex-end',
        color: '#3F3A39',
    },
    bankNum: {
        color: "#4A4A4A",
        alignSelf: 'flex-end',
				backgroundColor: 'transparent'
    },
    userNameBox: {
        height: 44 * px,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20 * px,
    },
    labelImg: {},
    labelImgBox: {
        height: 36 * px,
        width: 90 * px,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifyCodeInput: {
        height: 44 * px,
        width: 190 * px,
        fontSize: commonFontSize(13),
        marginLeft: 10 * px,
    },
    verifyCodeInputBox: {
        height: 44 * px,
        width: 190 * px,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        borderRadius: 5 * px,
    },
    verifyCodeBox: {
        height: 36 * px,
        width: 80 * px,
        justifyContent: 'center',
        alignItems: 'center',
    },
    getSmsButton: {
        height: 34 * px,
        width: 65 * px,
        backgroundColor: '#2EA7E0',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',

    },
    verifyCode: {
        height: 34 * px,
        width: 66 * px,
    },
    titleLabel: {
        color: '#4A4A4A',
        fontSize: commonFontSize(14),
				backgroundColor: 'transparent'
    },
    getSmsButtonTitle: {
        color: '#fff',
        fontSize: commonFontSize(12),
    },
    explainBox: {
        height: 60 * px,
        width: Util.size.width,
        justifyContent: 'center',
        paddingHorizontal: 20 * px,
        flexDirection: 'row',
        marginTop: 20 * px,
    },
    explainTitle: {
        fontSize: commonFontSize(12),
        color: 'red',
        fontWeight: '200',
        lineHeight: Util.lineHeight(15),
    },
    explainBoxLeft: {
        width: 90 * px,
    },
    explainBoxRight: {
        flex: 2.7,

    },
    bankAccountBox: {
        justifyContent: "center",
        alignItems: 'center',
        marginTop: 15 * px,
    },
    cardBg: {
        height: (Util.size.width - 60 * px) * px / 668 * 274,
        width: (Util.size.width - 60 * px) * px,
    },
    cardTitleBox: {
        height: 40 * px,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    cardNoBox: {
        height: 50 * px,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardNoEdit:{
        height: 13 * px,
        width: 28  * px,
        backgroundColor:"#888889",
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 8 * px,
        position:'absolute',
        top:10 * px,
        right: Util.size.width / 6
    },
    cardNoEditText:{
        backgroundColor:"transparent",
        fontSize: commonFontSize(8),
        color:'#fff'
    },
    cardNoInput:{
        height: 40 *px,
        width: 250 * px,
        alignSelf:'center',
        textAlign:'center',
        color:'#FFFFFF',
		},
    cardInfoBox: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10 * px,
        paddingBottom: 20 * px,
    },
    userName: {
        lineHeight: Util.lineHeight(18),
        fontSize: commonFontSize(13),
        color: '#A7A7A7',
        fontWeight: '300'
    },
    cardNo: {
        fontSize: commonFontSize(21),
        fontWeight: '300',
        color: '#FFFFFF',
        letterSpacing: -0.38 * px,
        width: Util.size.width - 100 * px,
        textAlign:'center'
    },
    cardType: {
        height: 20 * px,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 20 * px,
        backgroundColor: 'transparent',

    },
    cardTypeTitle: {
        color: '#FFFFFF',
        fontSize: commonFontSize(15),
        backgroundColor: 'transparent'
    },
    limitRemind: {
        color: '#E5E6E6',
        fontSize: commonFontSize(12),
    },
    buttonBox: {
        height: 50 * px,
        width: Util.size.width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#025FCB',
    },
	buttonBoxouter: {
		height: 90 * px,
		width: Util.size.width,
		position: 'absolute',
		bottom: 0,
		left:0,
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#f6f7fa'
	},
    buttonText: {
        fontSize: commonFontSize(17),
        color: '#fff'
    },
    inputText: {
        color: '#4A4A4A',
        fontSize: commonFontSize(14),
        marginRight: 10 * px,
				backgroundColor: 'transparent'
    },
    limitTextBox: {
        height: 20 * px,
        alignItems: 'center',
        paddingLeft: (Util.deviceType == '5' ||  Util.deviceType == '5s') ?56 * px : 16 * px
    },
    limitTextBoxText: {
        fontSize: commonFontSize(12),
        color: '#888889',
        marginLeft: 16 * px,
    },
    checkLimit: {
        height: 40 * px,
        width: Util.size.width,
        paddingRight: 13 * px
    },
    checkLimitTitle: {
        color: '#9B9B9B',
        fontSize: commonFontSize(14),
        marginRight: 10 * px,
    },
    checkLimitBox: {
        height: 40 * px,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
    },
    m_Container: {
        height: Util.size.height,
        width: Util.size.width,
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 99999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    m_Content: {
        width: Util.size.width - 80 * px,
        height: 240 * px,
        backgroundColor: '#fff',
        borderRadius: 5 * px,
        alignItems: 'center',
        marginBottom: 50 * px,
    },
    m_TopTitleBox: {
        height: 40 * px,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10 * px
    },
    m_TopMoneyTitleBox: {
        height: 30 * px,
        alignItems: 'center',
        justifyContent: 'center'
    },
    m_TopMessageTitleBox: {
        height: 30 * px,
        alignItems: 'center',
        justifyContent: 'center'
    },
    m_TopTitle: {
        color: '#030303',
        fontSize: commonFontSize(17),
    },
    m_TopMoneyTitle: {
        color: '#4A4A4A',
        fontSize: commonFontSize(15),
    },
    m_TopMessageTitle: {
        color: '#9B9B9B',
        fontSize: commonFontSize(12),
        textAlign: 'center',
        lineHeight: Util.lineHeight(18)
    },
    m_msgInputBox: {
        height: 50 * px,
        width: Util.size.width - 120 * px,
        marginTop: 10 * px,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#979797',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    m_msgInputSubBox: {
        flex: 1,
        height: 50 * px,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    m_msgInputButtonBox: {
        flex: 1,
        height: 50 * px,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#025FCC'
    },
    m_msgInputButtonTitle: {
        color: '#fff',
        fontSize: commonFontSize(12),
    },
    m_msgRemindBox: {
        height: 30 * px,
        width: Util.size.width - 100 * px,
        justifyContent: 'center',
        paddingLeft: 30 * px
    },
    m_msgRemindBoxTitle: {
        color: '#ED5145',
        fontSize: commonFontSize(12),
    },
    m_buttonBox: {
        flex: 1,
        width: Util.size.width - 80 * px,
        backgroundColor: 'transparent',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(169,169,169,0.8)',
        flexDirection: 'row'
    },
    m_sureButton: {
        flex: 1,
        width: (Util.size.width - 100 * px) / 2,
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: 'rgba(169,169,169,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    m_cancelButton: {
        flex: 1,
        width: (Util.size.width - 100 * px) / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    m_sureButtonText: {
        color: '#ED5145',
        fontSize: commonFontSize(17),
    },
    m_cancelButtonText: {
        color: '#025FCC',
        fontSize: commonFontSize(17),
    },
    withdrawRemind: {
        height: 50 * px,
        alignItems: 'center',
        paddingHorizontal: 30 * px,
    },
    withdrawRemindText: {
        color: '#025FCB',
        fontSize: commonFontSize(12),
        textAlign: 'center',
        lineHeight: Util.lineHeight(20)
    },
    nb_contentBox: {
			flex: 1,
        backgroundColor: '#f6f7fa',
        alignItems: 'center',
			marginTop: 15 * px,
    },
    nb_itemBox: {
        minHeight: 50 * px,
        width: Util.size.width,
        backgroundColor: '#fff',
        paddingHorizontal: 14 * px,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',

    },
    nb_topRemindTitle: {
        color: "#025FCB",
        fontSize: commonFontSize(14),
    },
    nb_itemTitleBox: {
        width: 80 * px,
        height: 50 * px,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    nb_itemTitle: {
        color: "#4A4A4A",
        fontSize: commonFontSize(15),
    },
    nb_cardNoInputBox: {
        flex: 1,
        height: 50 * px,
        justifyContent: 'center',
        borderBottomColor: '#C5C5C5',
        borderBottomWidth: StyleSheet.hairlineWidth,
        alignItems: 'flex-end'
    },
    nb_centerRemindTitle: {
        color: "#888889",
        fontSize: commonFontSize(12),
    },
    nb_bottomRemindTitle: {
        color: "#888889",
        fontSize: commonFontSize(12),
        marginTop: 20 * px
    },
    nb_InputBox: {
        flex: 1,
        height: 50 * px,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    showErrorBox: {
		width: Util.size.width,
		alignItems: Util.deviceType == '5' || Util.deviceType == '5s' ? 'center' : 'flex-start'
    },
    showErrorText:{
        color: "red",
		textAlign:'center',
        fontSize: commonFontSize(12),
		
    },
    cardNoEdit:{
        position: 'absolute',
        top:0,
        right:0,
        width:40 * px,
        height: 40 * px,
        alignItems:"center",
        justifyContent:"center"
    },
	topReminderBox:{
		paddingHorizontal: 35 * px,
		justifyContent:'center',
		alignItems:'center',
		marginTop: 10 * px
	},
	topReminder:{
		lineHeight: Util.lineHeight(16),
		fontSize: commonFontSize(10),
		color: "#888889",
		textAlign:'center'
	},
    keyboardControll:{
        height: 40 * px,
        width: Util.size.width,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(169,169,169,0.5)',
        alignItems: 'flex-end',
        paddingRight: 14,
        justifyContent: 'center'
    },
	keyboardControllText: {
		fontSize: 16,
		color: '#4f4f4f'
	},
    keyboardControllBox:{
        height: 45 * px,
        width: Util.size.width,
    },
	bigReminder: {
		paddingHorizontal: 14 * px,
	},
	bigReminderWithoutBind:{
		flex:1,
		width: Util.size.width,
		paddingHorizontal: 14 * px,
		backgroundColor: 'red'
	},
	bigReminderText: {
		lineHeight: 20 * px,
		fontSize: Util.deviceType == 'Simulator' ? 9 : 10,
		color: '#888889',
		textAlign: 'center',
	},
	textBox: {
		width: Util.size.width - 25,
		height: 25,
		alignItems: 'center',
		justifyContent: 'center'
	}
});
export {
    withdrawPageStyle
}