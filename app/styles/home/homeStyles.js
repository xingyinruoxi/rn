/**
 * eTongDai React Native App
 * This define home view used css
 * @John
 */

import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const homePageStyle =  StyleSheet.create({
    topLevelContainer:{
        flex:1,
    },
    refresh:{
        position: 'absolute',
        top: 0,
        left: 0,
        width: Util.size.width,
        //backgroundColor: '#f7f7f7',
        paddingTop: Util.pixel*40,
        paddingBottom: Util.pixel*20,
    },
    refreshText:{
        fontSize: Util.commonFontSize(12),
        color: '#9b9b9b',
        alignSelf : 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    swiper: {
        height: Util.size.width/750 * 400,
        width:Util.size.width,
        alignItems:'center',
        justifyContent:'center',
    },
    swiperDoc:{
        width: Util.pixel * 4, 
        height: Util.pixel * 4,
        borderRadius: Util.pixel * 2, 
        marginLeft: Util.pixel * 3, 
        marginRight: Util.pixel * 3, 
        marginTop: Util.pixel * 3
    },
    flexRow:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flexColumn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    padding: {
        paddingLeft: Util.pixel*14,
        paddingRight: Util.pixel*14,
    },
    productLists: {
        backgroundColor: '#fff',
        marginTop: Util.pixel*10,
    },
    minFontSize: {
        color: '#9b9b9b',
        fontSize: Util.commonFontSize(12),
        marginTop: Util.pixel*8,
    },
    midFontSize: {
        color: '#9b9b9b',
        fontSize: Util.commonFontSize(13),
    },
    maxFontSize: {
        color: '#4a4a4a',
        fontSize: Util.commonFontSize(15),
        marginLeft: Util.pixel*10,
    },
    header: {
        height: Util.pixel*35,
    },
    moreBtn: {
        height: Util.pixel*35,
        width: Util.pixel*50,
    },
    productItem: {
        height: Util.pixel*90,
    },
    rateFontSize: {
        height: Util.pixel*36,
        paddingTop: 0,
        color: '#e94639',
        fontSize: Util.commonFontSize(30),
    },
    rateUnit: {
        height: Util.pixel*36,
        paddingTop: Util.pixel*13,
        color: '#e94639',
        fontSize: Util.commonFontSize(16),
    },
    lendBtn: {
        width: Util.pixel*87,
        height: Util.pixel*35,
        borderWidth: Util.pixel*1,
        borderRadius: Util.pixel*5,
        borderColor: '#e94639',
    },
    operatingData: {
        height: Util.pixel*28,
        paddingTop: Util.pixel*2,
        fontSize: Util.commonFontSize(20),
        color: '#025FCC'
    },
    minOperatingData: {
        height: Util.pixel*28,
        paddingTop: Util.pixel*9,
        fontSize: Util.commonFontSize(13),
        color: '#025FCC',
    },
    footerNotice: {
        fontSize: Util.commonFontSize(10),
        paddingBottom: Util.pixel*8,
        color: '#4a4a4a',
    },
    flowRedPicket: {
        position: 'absolute',
        bottom: Util.pixel*50,
        right: 0,
    },
    redPicket: {
        width: Util.pixel*107,
        height: Util.pixel*107,
    },
    noticeContent: {
        width: Util.size.width,
        position: 'absolute',
        top: Util.isIOS ?Util.deviceId.indexOf('iPhone10') != -1 ?  Util.pixel*5 : Util.pixel*20: Util.pixel*10,
        right: Util.pixel*14,
    },
    m_container:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.7)',
        alignItems:"center",
        justifyContent:'center',

    },
    m_contentBox:{
        height: 371 * Util.pixel,
        width: 264 * Util.pixel,
        alignItems:"center",
        marginTop: 50 * Util.pixel,
    },
    m_ButtonBox:{
        height: 80 * Util.pixel,
        width: Util.size.width,
        alignItems:'center',
        justifyContent:'center',
    },
    m_button:{
        height: 30 * Util.pixel,
        width: 30 * Util.pixel,
        borderRadius: 50,
        borderWidth: 1,
        borderColor:'#fff',
        justifyContent:'center',
        alignItems:"center",
    },
    m_buttonTitle:{
        color:'#fff',
        fontSize: commonFontSize(25),
        lineHeight: Util.lineHeight(26),
        backgroundColor:'transparent',
        fontWeight:'200',
        transform: [{rotate: '-45deg'}]
    },
    m_content:{
        flex:1,
        width: 264 * Util.pixel,
        paddingHorizontal: 14 *  Util.pixel,
        marginTop: 50 * Util.pixel,
        alignItems:'center'
    },
    m_contentTitle:{
        marginTop: 20 * Util.pixel,
        flex:0.7,
        backgroundColor:'transparent',
        color:'#fff',
        fontSize: commonFontSize(20)
    },
    m_contentItem:{
        color: '#4A4A4A',
        fontSize: commonFontSize(14),
        lineHeight: Util.lineHeight(20)
    },
    m_updateButton:{
        height: 35 * Util.pixel,
        width: 160,
        marginBottom: 20 * Util.pixel,
        backgroundColor:"#E94639",
        borderRadius: 56,
        justifyContent:'center',
        alignItems:'center'
    },
    m_updateButtonText:{
        color:'#fff',
        fontSize: commonFontSize(15)
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
        left: 10 * Util.pixel,
        top: Util.deviceId.indexOf('iPhone10') > -1 ? Util.pixel*285 : Util.isPlus ?  240 * Util.pixel : Util.deviceType == '5' || Util.deviceType == '5s' ? 210 * Util.pixel : 230 * Util.pixel,
    },
    iKnow:{
        alignSelf:'flex-end',
        marginBottom: 50 * Util.pixel,

    },
    iKnowImg:{
        width: Util.deviceType == '5' || Util.deviceType == '5s' ? 80* Util.pixel : null,
        height: Util.deviceType == '5' || Util.deviceType == '5s' ? 80* Util.pixel /242 * 100 : null
    },
	a_content:{
		flex: 1,
		backgroundColor:"#fff",
		alignItems:'center'
	},
	a_timeDownBox:{
		height: 26 *px,
		width: 64 * px,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#fff',
		borderRadius: 20 * px,
		position: 'absolute',
		right: 10 * px,
		top: 30 * px,
		justifyContent: 'center',
		alignItems:'center',
	},
	a_timeDownTitle:{
		backgroundColor:"transparent",
		textAlign: 'center',
		fontSize: 14 * px,
		color: '#fff'
	},
	a_bottomLogoBox:{
		height: 100 * px,
		width: Util.size.width,
		backgroundColor: '#fff',
		position: 'absolute',
		bottom: 0,
		left: 0,
		alignItems:'center',
		justifyContent: 'center'
	},
	debugButton: {
		height: 80 * px,
		width: 80 * px,
		backgroundColor: 'red',
		position: 'absolute',
		bottom: 20 * px,
		right: 10 * px,
		justifyContent:'center',
		alignItems: 'center',
		paddingHorizontal: 10
	},
	debugButtonText: {
		color: '#fff',
		fontSize: 20,
		textAlign: 'center'
	},
    adEnter: {
        width: Util.pixel*60,
        height: Util.pixel*60,
        position: 'absolute',
        top: Util.pixel*289,
        right: 0,
    },
	safeAndInfoContainer: {
		height: 80 * px,
		width: Util.size.width,
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#fff'
	},
	safeImageContainer: {
		flexDirection: 'row',
		width: (Util.size.width - 30)/2,
		height: ((Util.size.width - 30)/2)/346 * 130
	},
	safeImageContent: {
		flex:2,
		alignItems: 'flex-end',
		justifyContent: 'center',
		paddingRight: 10
	},
	safeTextContent: {
		flex:3,
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	safeText: {
		backgroundColor: 'transparent',
		fontSize: 13,
		color: '#fff',
		textAlign: 'center',
		width: 80,
		marginLeft: -10
	},
	marqueenContainer: {
		height: 30,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 14
	},

});
export {
    homePageStyle
}