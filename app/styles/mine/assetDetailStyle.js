/**
 * Created by liuzhenli on 2017/7/12.
 */
import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const assetDetailPageStyle =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f6f7fa'
    },
    contentBox:{
				flex:1,
        alignItems:'center',
    },
    assetBox:{
        width: Util.size.width,
        minHeight: 200 * px,
        backgroundColor:'#006EEE'
    },
    redPacketBox: {
        width: Util.size.width,
        height: 40 * px,
        marginTop: 20 * px,
        backgroundColor:'#fff',
        justifyContent:'center',
    },
    profitBox:{
        width: Util.size.width,
        height: 40 * px,
        backgroundColor:'#fff',
        justifyContent:'center',
        flexDirection: 'row',
    },
    totalAssetBox:{
        height: 160 * px,
        justifyContent:'center',
        alignItems:'center',
    },
    accountMoneyTitle:{
        fontSize: commonFontSize(12),
        color: '#fff',
    },
    accountMoney: {
        fontSize: commonFontSize(28),
        color: '#fff',
        marginTop: 5 * px,
    },
    avaBox:{
        height: 60 * px,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:"center",
        backgroundColor:'#025FCC'
    },
    avaBoxLeft:{
        flex:  1,
        alignItems:'center',
        justifyContent:"center",
        paddingTop: Util.isIOS ? 10 * px : 0,
    },
    userAccountNum:{
        color: '#fff',
        fontSize: commonFontSize(14),
    },
    userAccountNumTitle:{
        fontSize: commonFontSize(14),
        color:'#fff'
    },
    comeInBox:{
        height: 100 * px,
        justifyContent:"center",
    },
    comeInBoxNumTitle:{
        color: '#4A4A4A',
        fontSize: commonFontSize(15),
        flex:1
    },
    comeInBoxNum:{
        color: '#3F3A39',
        fontSize: commonFontSize(15),
        marginLeft: 50 * px
    },
    comeInItemBox:{
        flexDirection:'row',
        alignItems:'center',
        flex:1,
        justifyContent:'flex-start',
        paddingHorizontal: 14 * px,
    },
    principalNumTitle:{
        color: '#9D9D9D',
        fontSize: commonFontSize(11),
        width: Util.size.width / 3,
        textAlign: 'right'
    },
    principalNum:{
        color: '#3F3A39',
        fontSize: commonFontSize(13),
        marginLeft: 50 * px
    },
    packetNum:{
        color: '#4A4A4A',
        fontSize: commonFontSize(15),
        marginLeft: 50 * px
    },
    profitBoxSp:{
        marginTop: 10 * px
    },
		reminderBox: {
			height: 30 * px,
			justifyContent: 'center',
			alignItems: 'center',
		},
		reminder:{
			fontSize: Util.commonFontSize(10),
			color: '#898989'
		}
});
export {
    assetDetailPageStyle
}