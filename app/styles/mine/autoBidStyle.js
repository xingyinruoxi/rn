/**
 * Created by liuzhenli on 2017/7/12.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const autoBidPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f6f7fa'
    },
    settingBox:{
        flex: 1,
        marginTop: 10 * px,
    },
    itemBox:{
        height: 45 * px,
        width: Util.size.width,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 21 * px,
        backgroundColor:'#fff',
        overflow:'hidden'
    },
    autoStatus:{
        height: 45 * px,
        width: Util.size.width,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal: 21 * px,
    },
    labelTextBox:{
        height: 30 * px,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
    },
    labelText:{
        fontSize: commonFontSize(15),
        color:'#4A4A4A'
    },
    labelTextRight:{
        fontSize: commonFontSize(13),
        color:'#4A4A4A',
        marginLeft: Util.isIOS ? 5 * px : 0,
    },
    labelTextBoxRight:{
        justifyContent:'flex-end',
        alignItems:'center',
        flexDirection:'row',
    },
    labelTextBoxWithBorder:{
        borderBottomWidth: 1,
        borderBottomColor:'#ccc',
        height: 45 * px,
    },
    accountBox:{
        marginTop: 15 * px,
        backgroundColor:"#fff",
    },
    labelTextRightRepayData:{
        fontSize: commonFontSize(12),
        color:'#888889'
    },
    repayDataBox:{
        minHeight: 50 * px,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor:'#f6f7fa',
        alignItems:'center',
        justifyContent:'center',
        paddingTop: 10 * px,
        paddingHorizontal: Util.isIOS ? 5 * px : 0,
    },
    repayDataItem:{
        height: 40 * px,
        width: (Util.size.width - 50 * px) / 3,
        backgroundColor:'#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#025FCB',
        borderStyle: 'solid',
        borderRadius: 4 * px,
        justifyContent:'center',
        alignItems:"center",
        marginVertical: 5 * px,
        marginHorizontal: 4 * px,
    },
    repayDataItemSure:{
        height: 30 * px,
        width: 70,
        backgroundColor:'#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#025FCB',
        borderStyle: 'solid',
        borderRadius: 4 * px,
        justifyContent:'center',
        alignItems:"center",
        marginVertical: 5 * px,
        marginHorizontal: 4 * px,
    },
    repayDataItemText:{
        color:'#025FCB',
        backgroundColor:'transparent',
        textAlign:'center',
        fontSize: commonFontSize(15)
    },
    repayDataItemTextActive:{
        color:'#fff',
    },

    repayDataItemActive:{
        backgroundColor:'#025FCB',
    },
    buttonBox:{
        minHeight: 45 * px,
        justifyContent:'space-around',
        alignItems:'center',
        marginTop: 30 * px,
        flexDirection:'row',
        width: Util.size.width,
    },
    buttonSubBox:{
        height: 100 * px,
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
        height: 18 * px,
        backgroundColor:'transparent',
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        marginBottom: 10 * px,
    },
    forgotPwdTitle:{
        fontSize: commonFontSize(10),
        color:'#4A4A4A',
        marginLeft: 5 * px
    },
    input:{
        height: Util.isIOS ? 30 * px: 45 * px,
        width: (Util.size.width - 40 * px)/2 * 0.91,
        fontSize:  Util.isIOS ? commonFontSize(15) : commonFontSize(12),
        textAlign:'center',
        marginRight: 5  * px,
    },
    inputStart:{
        width: 50 * px,
        fontSize: Util.isIOS ? commonFontSize(15) : commonFontSize(12),
        marginLeft: 5  * px,
        color:'#c5c5c5',
        textAlign:'center'
    },
    inputEnd:{
        width: 50 * px,
        fontSize: Util.isIOS ? commonFontSize(15) : commonFontSize(12),
        marginLeft: 5  * px,
        color:'#c5c5c5',
        textAlign:'center'
    },
    modalPicker:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.3)'
    },
    modalPickerContent:{
        height: 200 * px,
        width: Util.size.width,
        backgroundColor:'#fff',
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    modalPickerItem:{
        height: 50 * px,
        width: Util.size.width,
        justifyContent:'center',
        alignItems:'center',
    },
    cancelButton:{
        height: 45 * px,
        width: (Util.size.width - 80 * px) / 2,
        backgroundColor:'#f6f7fa',
        borderRadius: 4,
        borderWidth: 1 * px,
        borderColor: '#025FCB',
        alignItems:'center',
        justifyContent:'center'
    },
    sureButton:{
        height: 45 * px,
        width: (Util.size.width - 80 * px) / 2,
        backgroundColor:'#025FCB',
        borderRadius: 4,
        borderWidth: 1 * px,
        borderColor: '#025FCB',
        alignItems:'center',
        justifyContent:'center'
    },
    cancelButtonText:{
        fontSize: commonFontSize(17),
        color: '#025FCB'
    },
    sureButtonText:{
        fontSize: commonFontSize(17),
        color: '#fff'
    },
    agreementBox:{
        height: 60 * px,
        alignItems:'center',
        justifyContent:'flex-end',
    },
    repayDataRemind:{
        height: 30 * px,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'flex-start',
        paddingLeft: Util.deviceType == '5' ||Util.deviceType == '5s' ? (Util.size.width - 50 * px) / 2 : (Util.size.width - 80 * px) / 2
    },
    repayDataRemindText:{
        fontSize: commonFontSize(12),
        color:'#888889'
    },
    autoTimeItem:{
        height: 40 * px,
        width: 60 * px,
        backgroundColor: '#025FCB',
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 4 * px,
        marginLeft: 5 * px,
        flexDirection:'row'
    },
    autoTimeItemText:{
        fontSize: commonFontSize(15),
        color:'#fff'
    },

    m_TopBox:{
        height: 40 * px,
        backgroundColor:'#F9F9F9',
        
    },
    selectedItemBox:{
        height: 45 * px,
        backgroundColor:'red',
        alignItems:'center',
        justifyContent:'center'
    },
    limitsTime:{
        minHeight: 60 * px,
    },
    modal:{
        height: Util.size.height,
        width: Util.size.width,
        position:'absolute',
        top: 0,
        left: 0,
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    m_container:{
        height: Util.size.height,
        width: Util.size.width,
        backgroundColor:'rgba(0,0,0,0.5)',
        justifyContent:'center',
        alignItems:'center'
    },
    m_contentBox:{
        height: 280 * px,
        width: 271 * px,
        backgroundColor:'#fff',
        borderRadius: 4 * px,
        alignItems:'center'
    },
    m_titleBox:{
        height: 50 * px,
        alignItems:"center",
        justifyContent:'center',
    },
    m_contentSubBox:{
        minHeight: 100 * px,
        width: 240 * px,
    },
    m_title:{
        color: '#030303',
        fontSize: commonFontSize(17),
    },
    m_content:{
        height: 20 * px,
        paddingHorizontal: 14 * px,
        width: 240 * px,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    m_contentCity:{
        flexDirection:'row',
        width: 240 * px,
        minHeight: 50 * px,
        justifyContent:'center',
        alignItems:'center'
    },
    m_contentText:{
        color: '#4A4A4A',
        fontSize: commonFontSize(12),
    },
    m_buttonBox:{
        width: 271 * px,
        height: 50 * px,
        position: 'absolute',
        bottom: 20 * px,
        left:0,
        flexDirection:'row',
        justifyContent:'space-around'
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
	}
});
export {
    autoBidPageStyle
}