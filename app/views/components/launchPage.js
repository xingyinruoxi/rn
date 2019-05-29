/**
 * Created by liuzhenli on 2017/9/4.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    NativeModules
} from 'react-native';
import Swiper from 'react-native-swiper';
import * as launchImage from 'react-native-launch-image';

var Util = require('./../../commons/util');
export default class LaunchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };

    componentDidMount() {
        Util.isIOS ? launchImage.hide() : NativeModules.Splash.hide();
    }

    render() {
        return (
            <View style={styles.container}>
                <Swiper style={styles.wrapper}
                        showsButtons={false}
                        showsPagination={false}
                        loop={false}
                >
                    <View style={styles.slide1}>
                        <Image source={require('./../../imgs/commons/leading1.png')} resizeMode='contain'
                               style={styles.image}/>
                        <TouchableOpacity activeOpacity={0.7} style={[styles.skipBtn]} onPress={this.props.callback}>
                            <Image style={styles.jumpImg} source={require('./../../imgs/commons/jump.png')}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.slide1}>
                        <Image source={require('./../../imgs/commons/leading2.png')} resizeMode='contain'
                               style={styles.image}/>
                        <TouchableOpacity activeOpacity={0.7} style={[styles.skipBtn]} onPress={this.props.callback}>
                            <Image style={styles.jumpImg} source={require('./../../imgs/commons/jump.png')}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.slide1}>
                        <Image source={require('./../../imgs/commons/leading3.png')} resizeMode='contain'
                               style={styles.image}/>
                        <View style={[styles.goBtn, {width: Util.size.width}]}>
                            <TouchableOpacity activeOpacity={0.7} onPress={this.props.callback}>
                                <Image source={require('./../../imgs/commons/justExp.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {
                                global.__toLogin = true;
                                global.__fromLaunch = true;
                                this.props.callback()
                            }}>
                                <Image source={require('./../../imgs/commons/launchLogin.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Swiper>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red'
    },
    modal: {
        position: 'absolute',
        left: 0, top: 0
    },
    slide1: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        color: '#fff',
        fontSize: Util.pixel * 30,
        fontWeight: 'bold'
    },
    image: {
        width: Util.size.width,
        height: Util.size.height - 35,
    },
    goBtn: {
        position: 'absolute',
        bottom: Util.pixel * 70,
        left: null,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: Util.pixel * 30,
    },
    goBtnText: {
        width: Util.pixel * 100,
        height: Util.pixel * 30,
        textAlign: 'center',
        color: '#636f83',
        fontSize: Util.pixel * 15,
        backgroundColor: 'transparent',
        borderColor: '#636F83',
        borderWidth: 0.5,
        borderRadius: Util.pixel * 15,
        paddingTop: Util.pixel * (Util.isIOS ? 8 : 0),
        textAlignVertical: 'center'

    },
    skipBtn: {
        position: 'absolute',
        top: Util.pixel * 30,
        right: Util.pixel * 10,
        flexDirection: 'row',
        height: Util.pixel * 30,
    },
    skipBtnText: {
        width: Util.pixel * 60,
        height: Util.pixel * 25,
        textAlign: 'center',
        color: '#81e0e4',
        backgroundColor: 'transparent',
        borderColor: '#81e0e4',
        borderWidth: 1,
        borderRadius: Util.pixel * 12,
        paddingTop: Util.pixel * (Util.isIOS ? 6 : 0),
        textAlignVertical: 'center'
    },
    jumpImg: {
        height: 30 * Util.pixel,
        width: 30 * Util.pixel,
    }
})