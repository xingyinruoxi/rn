/**
 * Created by liuzhenli on 2017/7/10.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import Util, {Grow} from './../../commons/util';

var px = Util.pixel;
export default class RightIcon extends Component {
    render() {
        let {style, right, bold, size, color, height} = this.props;
        //

        return (
            <View style={[styles.container, height && {height: height * px}]}>
                <Image style={styles.buttonImg} source={require('./../../imgs/more/left_icon.png')}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonImg: {
        height: 15 * px,
        width: 8 * px,
    },
    container: {
        height: 45 * px,
        width: 10 * px,
        justifyContent: 'center',
        alignSelf: 'flex-end'
    }
});