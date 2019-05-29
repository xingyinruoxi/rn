/**
 * Created by liuzhenli on 2017/7/7.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var px  = Util.pixel;
var commonFontSize = Util.commonFontSize
const registerPageStyles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    },
    headerStyle:{
        backgroundColor:"#2EA7E0"
    },
    headerTitleStyle:{
        color:'#fff',
        fontWeight: '400'
    },
    inputBox:{
        minHeight: 50 * px,
        width: Util.size.width,
        paddingHorizontal: 14 * px
    },
    userNameBox:{
        height: 44 * px,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',

    },
    remindsBox:{
        height: 40 * px,
        paddingTop: 10 * px,
        paddingHorizontal: 50 * px
    },
    remindsText:{
        fontSize: commonFontSize(12),
        color: 'red',
        lineHeight: Util.lineHeight(15),

    },
    labelImgBox:{
        height: 50* px,
        width: 36* px,
        justifyContent:'center',
        alignItems:'center',
    },
    input:{
        height: 50 * px,
        flex:1,
        fontSize: commonFontSize(15)
    },
    verifyCodeInput:{
        height: 44 * px,
        width: Util.isIOS ? Util.size.width - 130: Util.size.width - 200,
        fontSize: commonFontSize(13),
    },
    verifyCodeBox:{
        height: 36,
        width: 80,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonBox:{
        minHeight: 45 * px,
        justifyContent:'center',
        alignItems:'center',
        marginTop: 10 * px,
    },
    buttonSubBox:{
        marginTop: 20 * px,
    },
    button: {
        height: 45 * px,
        width: Util.size.width - 40,
        backgroundColor:'#2EA7E0',
        borderRadius: 5 * px,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonTitle:{
        fontSize: commonFontSize(18),
        color:'#fff'
    },
    forgotPwdBox:{
        height: 50 * px,
        width: Util.size.width - 40,
        backgroundColor:'transparent',
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        marginBottom: 30 * px,
    },
    forgotPwdTitle:{
        fontSize: commonFontSize(12),
        color:'#9B9B9B',
        marginLeft: 5 * px
    },
    registerTitle:{
        fontSize: commonFontSize(13),
        color:'#2EA7E0'
    },
    verifyCode:{
        height: 34 * px,
        width: 80 * px,
    },
    bannerBox:{
        justifyContent:'center',
        alignItems:'center',
        height: 100 * px,
        width: Util.size.width,
        backgroundColor:"#fff"
    },
    getSmsButton:{
        height: 34 * px,
        width: 68 * px,
        backgroundColor:'#2EA7E0',
        borderRadius: 5,
        justifyContent:'center',
        alignItems:'center',
    },
    getSmsButtonTitle:{
        color:'#fff',
        fontSize: commonFontSize(12)
    },
    servicesBox:{
        flex: 1,
        width:  Util.size.width,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        marginTop: 20 * px,
    },
    services:{
        fontSize: commonFontSize(15),
        color:'#4A4A4A',
        marginLeft: 5 * px
    },
    banner:{
        width: Util.size.width
    },
    scrollViewContainer:{
      flex:1
    },
	m_container: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		alignItems:'center',
		justifyContent:'center',
	},
	m_contentBox: {
		minHeight: 160 * px,
		width: Util.size.width - 80* px,
		backgroundColor: '#fff',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
	m_titleBox:{
		height: 50 * px,
		width: Util.size.width - 80* px,
		alignItems: 'center',
		justifyContent: 'center',

	},
	m_inputBox: {
		height: 35 * px,
		width: Util.size.width - 150* px,
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingHorizontal: 12,
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: 'rgba(169,169,169,0.5)',

	},
	m_input: {
		height: 45 * px,
		width: 150 * px,
		alignItems: 'center',
		justifyContent: 'center',

		paddingLeft: 5
	},
	m_inputImgBox: {
		height: 35 * px,
		width: 100 * px,

		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f6f7fa'
	},
	m_inputImg: {
		height: 35 * px,
		width: 100 * px,
	},
	m_buttonBox: {
		height: 50 * px,
		width: Util.size.width - 80* px,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		overflow: 'hidden',

	},
	m_button: {
		height: 40 * px,
		width: (Util.size.width - 82* px) /2,
		alignItems:'center',
		justifyContent:'center',
		backgroundColor:'#025FCB',
		borderRadius: 7
	},
	m_buttonText: {
		fontSize: 18,
		color: '#fff'
	},
	m_waringTitleBox: {
		height: 12 * px,
		width: Util.size.width - 82* px,
		marginBottom: 10,
		paddingLeft: 18,
	},
	m_waringTitle: {
		fontSize: 12,
		color: 'red'
	},
	sureImg: {
		position: 'absolute',
		right: 10,
		top: 10,
	}
});


export {
    registerPageStyles
};