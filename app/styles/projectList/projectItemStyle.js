/**
 * eTongDai React Native App
 * This define project itme component used css
 * @John
 */

import { StyleSheet } from 'react-native';
import Util from './../../commons/util';
var commonFontSize = Util.commonFontSize;

const projectItemStyle =  StyleSheet.create({
    container: {
        paddingTop: Util.pixel*11,
    },
    content: {
        height: Util.pixel*130,
        paddingLeft: Util.pixel*14,
        paddingRight: Util.pixel*14,
        paddingBottom: Util.pixel*10,
        backgroundColor: '#fff',
    },
    header: {
        height: Util.pixel*33,
        borderBottomWidth: Util.pixel*0.5,
        borderColor: '#d8d8d8'
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tag: {
        width: Util.pixel*20,
        height: Util.pixel*20,
        borderRadius: Util.pixel*10,
        backgroundColor: '#025fcc',
    },
    tagText: {
        color: '#fff',
        fontSize: Util.commonFontSize(12)
    },
    itemName: {
        color: '#3F3A39',
        fontSize: Util.pixel*12,
        marginLeft: Util.pixel*10,
        maxWidth: Util.pixel*246,
    },
    creditLevel: {
        color: '#025fcb',
        fontSize: Util.commonFontSize(12),
    },
    productItem: {
        height: Util.pixel*90,
    },
    rateFontSize: {
        color: '#e94639',
        fontSize: Util.commonFontSize(30),
    },
    rateUnit: {
        color: '#e94639',
        fontSize: Util.commonFontSize(13),
    },
    minFontSize: {
        color: '#9b9b9b',
        fontSize: Util.commonFontSize(14),
        marginTop: Util.pixel*8,
    },
    progressOut: {
        height: Util.pixel*20,
        position: 'relative',
    },
    progress: {
        width: Util.size.width - Util.pixel*28,
        height: Util.pixel*1,
        backgroundColor: '#d8d8d8',
        position: 'absolute',
        top: Util.pixel*15,
        left: 0,
    },
    progressText: {
        position: 'absolute',
        top: Util.pixel*8,
        right: 0,
        zIndex: 15,
    },
    progressTextFont: {
        color: '#9b9b9b',
        fontSize: Util.commonFontSize(10),
    },
    toTransfer: {
        width: Util.pixel*87,
        height: Util.pixel*35,
        borderRadius: Util.pixel*8,
        backgroundColor: '#E94639',
    },
    toTransferText: {
        color: '#fff',
        fontSize: Util.commonFontSize(15),
    },
    footer: {
        height: Util.pixel*35,
        borderTopWidth: 1,
        borderColor: '#d8d8d8',
        marginTop: Util.pixel*15,
    },
    footerText: {
        fontSize: Util.commonFontSize(14),
        color: '#3f3a39',
    },
    newItem: {
        height: Util.pixel*20,
        borderColor: '#E94639',
        borderWidth: Util.pixel*1,
        borderRadius: Util.pixel*5,
        paddingLeft: Util.pixel*5,
        paddingRight: Util.pixel*5,
    },
    newItemText: {
        color: '#E94639',
        fontSize: Util.commonFontSize(12)
    },
});
export {
    projectItemStyle
}