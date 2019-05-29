/**
 * Created by glzc on 2017/7/6.
 */
import {StyleSheet} from 'react-native';
import Util from './../../commons/util';

const MoreStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    banner: {
        height: Util.isIOS ? Util.pixel*184 : Util.pixel*164,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    space: {
        marginTop: Util.pixel*10,
        backgroundColor: '#ffffff',
    },
    listItem: {
        height: Util.pixel*41,
        paddingLeft: Util.pixel*14,
        paddingRight: Util.pixel*14,
    },
    listItemSpace: {
        height: Util.pixel*41,
        position: 'relative',
    },
    listContent: {
        height: Util.pixel*40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
      color: '#4a4a4a',
      fontSize: Util.commonFontSize(15)
    },
    messageTitle: {
        width: Util.pixel*151,
        color: '#4a4a4a',
        fontSize: Util.commonFontSize(15)
    },
    subTitle: {
        color: '#9b9b9b',
        fontSize: Util.commonFontSize(12)
    },
    myMessagetitle: {
        color: '#999999',
        fontSize: Util.commonFontSize(14),
        lineHeight: Util.lineHeight(22)
    },
    point: {
        width: Util.pixel*8,
        height: Util.pixel*8,
        borderRadius: Util.pixel*8,
        backgroundColor: '#ff0000',
    },
    pointRight: {
        marginRight: Util.pixel*5
    },
    pointPosition:{
        position: 'absolute',
        top: Util.pixel * -5,
        right: Util.pixel * -5,
        zIndex: 10
    },
    icon: {
        width: Util.pixel*8,
        height: Util.pixel*15
    },
    btn: {
        paddingTop: Util.pixel*58,
        paddingBottom: Util.pixel*18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    marginRight: {
        marginRight: Util.pixel*10
    },
    userIcon: {
        width: Util.pixel*13,
        height: Util.pixel*15,
    },
    qrCode: {
        width: Util.pixel*110,
        height: Util.pixel*110,
    },
    topContent: {
        paddingBottom: Util.pixel*15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: Util.pixel*20,
        paddingBottom: Util.pixel*20
    },
    actionIcon: {
        width: Util.pixel*60,
        height: Util.pixel*60,
        marginBottom: Util.pixel*5
    },
    cancel: {
        fontSize: Util.commonFontSize(18),
        color: '#2ea7e0'
    },
    modalStyle: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'relative'
    },
    modalContent: {
        width: Util.size.width,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#ffffff'
    },
    center: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    line: {
        height: Util.pixel*1,
    }
});

export {
    MoreStyles
}