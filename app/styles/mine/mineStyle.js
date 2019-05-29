/**
 * Created by liuzhenli on 2017/7/6.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const minePageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f7fa',
    },
    scrollView:{
        flex: 1,
    },
    userInfoBox:{
        paddingTop: 10 * px,
        height: 60 * px,
        backgroundColor:"#006EEE",
        alignItems:'center',
        justifyContent:'flex-start',
    },
    numBox:{
        width: Util.size.width,
        height: 30* px,
        justifyContent:'center',
        alignItems:'center',

    },
    totalAssetTitle:{
        width: Util.size.width,
        height: 20* px,
        justifyContent:'center',
        alignItems:'center',
        marginTop: 8* px,
    },
    userName:{
        textAlign:'center',
        color:'#fff',
        fontSize: commonFontSize(11)
    },
    num:{
        fontSize: commonFontSize(30),
        color:'#fff',
        textAlign:'center',
    },
    assetTitle:{
        textAlign:'center',
        color:'#fff',
        fontSize: commonFontSize(12)
    },
    leftMoneyBox:{
        height: 80*px,
        backgroundColor:"#006EEE",
        flexDirection:'row',
        alignItems:'center',

    },
    totalProfitBox:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',

    },
    totalProfitNum:{
        minWidth: 50 * px,
        textAlign:'center',
        color:'#fff',
        fontSize: commonFontSize(24),
        backgroundColor:'transparent',
        marginBottom: Util.isIOS ?5 * px : null,
    },
    leftMoneyNum:{
        fontSize: commonFontSize(18),
        backgroundColor:'transparent',
        marginTop: 10 * px,
    },
    totalProfitTitle:{
        textAlign:'center',
        color:'#fff',
        fontSize: commonFontSize(12),
        marginBottom:  10 * px,
    },
    menuBox:{
        height: 80 * px,
        backgroundColor:"#fff",
    },
    menuBoxTop:{
        height: 40 * px,
        flexDirection:'row'
    },
    menuBoxBottom:{
        height: 40 * px,
        flexDirection:'row',
    },
    leftBox:{
        height: 40 * px,
        width: Util.size.width / 2,
        justifyContent:'center',
        alignItems:'flex-start',
        paddingLeft: 47 * px
    },
    menuTitle:{
        marginLeft: 10 * px,
        color:'#3f3a39',
        fontSize: commonFontSize(16),
    },
    menuListBox:{
        minHeight: Util.isIOS ? 260* px : 250* px,
        backgroundColor:"#fff",
        marginTop: 9 * px
    },
    menuItem:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
    },
    menuLogo:{
        marginLeft: 18 * px,
    },
    menuListTitle:{
        fontSize: commonFontSize(16),
        color: '#3f3a39',
        marginLeft: 10 * px,
    },
    rightButton:{
        flex:1,
        paddingRight: 14 * px
    },
    header:{
        height: Util.isIOS ? Util.deviceId.indexOf('iPhone10') != -1 ? 88 * px : 64 * px: 42 * px,
        backgroundColor:'#006EEE'
    },
    headerContent:{
        height: 42 * px,
        width: Util.size.width,
        position: 'absolute',
        bottom: 0,
        left: 0,
        alignItems:'center',
        justifyContent:'flex-end',
        flexDirection:'row',
    },
    messageControl:{
        height: 42 * px,
        width: 35 * px,
        alignItems:'flex-end',
        justifyContent:'center',
        paddingRight: 6 * px,
        marginRight: 8  * px
    },
    messageControlLeft:{
        height: 42 * px,
        width: 40 * px,
        alignItems:'flex-end',
        justifyContent:'center',
    },
    leftMoney:{
        minHeight: 49 * px,
        backgroundColor:'#025FCC',
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems:'center',

    },
    topupButtonBox:{
        width: Util.size.width / 2,
        minHeight: 49 * px,
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems:'center',
        paddingLeft: 10 * px,
    },
    withdrawButton:{
        height: 29 * px,
        width: 62  * px,
        backgroundColor:'#fff',
        borderRadius: 4,
        justifyContent:'center',
        alignItems:'center',
    },
    topUpButton:{
        height: 29 * px,
        width: 62  * px,
        backgroundColor:'#E94639',
        borderRadius: 4,
        justifyContent:'center',
        alignItems:'center',
    },
    withdrawButtonText:{
        fontSize: commonFontSize(18),
        color: '#025FCB',
        backgroundColor:'transparent',
    },
    topUpButtonText:{
        fontSize: commonFontSize(18),
        color: '#fff',
        backgroundColor:'transparent',
    },
    userHeaderBox:{
        height: 40 * px,
        width: Util.size.width,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
    },
    userHeader:{
        height: 40 * px,
        width:40 * px,
     
        borderRadius: 50,
        alignItems:'center',
        justifyContent:'center',
    },
    infoBox:{
        height: 40 * px,
        alignItems:'flex-start',
        justifyContent:'center',
    },
    realNameBox:{
        height: 20 * px,
        marginLeft:10 * px,
        justifyContent:'flex-start',
        flexDirection: 'row',
        alignItems:'center',
    },
    infoBoxPhone:{
        fontSize: commonFontSize(9),
        color:'#fff',
        marginRight: 10 * px,
    },
    infoBoxPhoneName:{
        fontSize: commonFontSize(15),
        color:'#fff',
        marginRight: 10 * px,
    },
    infoBoxPhoneBox:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between',
        width: 90 * px,
    },
    eyeBox:{
        height: 30 * px,
        width: 30 * px,
        alignItems:'center',
        justifyContent:'center'
    },
    infoBoxSafe:{
        color: '#fff',
        fontSize: commonFontSize(9),
    },
    infoBoxSafeBox:{
        paddingHorizontal: 5 * px,
        backgroundColor:'#025FCB',
        marginTop: 5 * px,
        paddingVertical: 2 * px,
        borderRadius: 8,
        marginLeft: 10 * px
    },
    phoneBox:{

        marginTop: 5 * px,
        paddingVertical: 2 * px,
        borderRadius: 8,
        marginLeft: 10 * px
    },
    calendarTitle:{
        fontSize: commonFontSize(12),
        color:'#4A4A4A',
        marginBottom: 5 * px
    },
    calendarNum:{
        fontSize: commonFontSize(12),
        color:'#025FCB'
    },
    redpack:{
        marginLeft: 19 * px
    },
    settingImg:{
        height: Util.isIOS ? null : 21 * px,
        width: Util.isIOS ? null : 21.5* px,
    },
    msgImg:{
        height: Util.isIOS ? null : 18 * px,
        width: Util.isIOS ? null : 21 * px,
    },
    redCircl:{
        height:9 * px,
        width: 9 * px,
        backgroundColor:'red',
        position:'absolute',
        top: -5,
        right: -10,
        borderRadius:50
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
        right: Util.deviceType == '5' || Util.deviceType == '5s' ? 5 * Util.pixel : 10 * Util.pixel,
        top: Util.isIOS ? Util.deviceType == '5' || Util.deviceType == '5s' ? 200 * Util.pixel : 180 * Util.pixel : 180 * Util.pixel,
		marginTop: Util.deviceId.indexOf('iPhone10') != -1? 12 * Util.pixel : 0
    },
    l_justRegiste2:{
        position:'absolute',
        left: 8 * Util.pixel,
        top: Util.isIOS ? Util.deviceType == '5' || Util.deviceType == '5s' ? 170 * Util.pixel :Util.isPlus ?   165 * Util.pixel : 155 * Util.pixel : 135 * Util.pixel,
		marginTop: Util.deviceId.indexOf('iPhone10') != -1? 20 * Util.pixel : 0
    },
    l_justRegiste3:{
        position:'absolute',
        left: Util.deviceType == '5' || Util.deviceType == '5s' ? 15 * Util.pixel : 10 * Util.pixel,
        top: Util.isIOS ? Util.deviceType == '5' || Util.deviceType == '5s' ? 275 * Util.pixel :Util.isPlus ?   270 * Util.pixel : 257 * Util.pixel : 240 * Util.pixel,
		marginTop: Util.deviceId.indexOf('iPhone10') != -1? 16 * Util.pixel : 0
    },
    l_justRegiste4:{
        position:'absolute',
        left: 10 * Util.pixel,
        top:  Util.isIOS ? Util.deviceType == '5' || Util.deviceType == '5s' ?  325 * Util.pixel : Util.isPlus ?   328 * Util.pixel :315 * Util.pixel :  295 * Util.pixel,
		marginTop: Util.deviceId.indexOf('iPhone10') != -1? 16 * Util.pixel : 0
    },
    iKnow:{
        alignSelf:'flex-end',
        marginBottom: 100 * Util.pixel,
    },
    iKnow3:{
        alignSelf:'flex-end',
        marginBottom:  Util.deviceType == '5' || Util.deviceType == '5s' ? 20 * Util.pixel : 50 * Util.pixel,
    },
    l_justRegisteSize:{
        width: 200* Util.pixel,
        height: 200* Util.pixel /554 * 370
    },
    iKnowImg:{
        width: Util.deviceType == '5' || Util.deviceType == '5s' ? 90* Util.pixel : null,
        height: Util.deviceType == '5' || Util.deviceType == '5s' ? 90* Util.pixel /242 * 100 : null
    }
});
export {
    minePageStyle
}