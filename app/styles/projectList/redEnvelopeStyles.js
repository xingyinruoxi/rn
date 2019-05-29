/**
 * Created by glzc on 2017/7/12.
 */
import {StyleSheet} from 'react-native';
import Util from './../../commons/util';

const redEnvelopeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeeee'
    },
    redEnvelope: {
        width: Util.pixel*325,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sort: {
        width: Util.size.width,
        height: Util.isIOS ? Util.size.height - Util.pixel*64 : Util.size.height - Util.pixel*44,
        position: 'absolute',
        top: Util.isIOS ? Util.pixel*64 : Util.pixel*44,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 10
    },
    sortType: {
        height: Util.pixel*50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        height: Util.pixel*50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    view: {
        height: Util.pixel*10,
    },
    text: {
        color: '#9d9d9d',
        fontSize: Util.commonFontSize(12)
    },
});

export {
    redEnvelopeStyles
}