/**
 * Created by liuzhenli on 2017/7/7.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Image
} from 'react-native';
import Util from './../../commons/util';
let px  = Util.pixel;
let fontSize  = Util.commonFontSize;
export default class Loading extends Component {
    constructor(props){
        super(props)
        this.state =  {
            visible: false,
            title: null,
            type: ''
        }
    };
    hide(callback){
        this.setState({
            visible: false
        });
        callback && callback();
    };
    show(type,title,time,callback){
        this.setState({
            visible: true,
            title: title,
            type: type,
        });
        if(time && callback){
            setTimeout(() => {
                this.hide();
                callback && callback();
            },time)
        }else if(callback){
            callback();
        }else if(time){
            setTimeout(() => {
                this.hide();
            },time)
        }
    };
    render() {
        if(this.state.visible){
            return (
                <View style={[styles.container,this.props.notFull && {height: Util.size.height - 128 * px},this.props.height && {height: this.props.height}]}>
                    {
                        this.state.type == 'loading' ?
                            <View style={styles.contentBox}>
                                <View style={styles.imgBox}>
                                    <ActivityIndicator
                                        style={styles.loading}
                                        size="large"
                                    />
                                </View>
                                <View style={styles.loadingTextBox}>
                                    <Text allowFontScaling={false} style={styles.loadingText}>{
                                        this.state.title ?
                                            this.state.title
                                            :
                                            '加载中...'
                                    }</Text>
                                </View>

                            </View>
                            :
                            this.state.type == 'netFail' ?
                                <View style={styles.contentBox}>
                                    <View style={styles.imgBox}>
                                        <Image source={require('./../../imgs/commons/netFail.png')}/>
                                    </View>
                                    <View style={styles.loadingTextBox}>
                                        <Text allowFontScaling={false} style={styles.loadingText}>{
                                            this.state.title ?
                                                this.state.title
                                                :
                                                '网络错误'
                                        }</Text>
                                    </View>

                                </View>
                                :
                                <View style={styles.contentBox}>
                                    <View style={styles.imgBox}>
                                        <ActivityIndicator
                                            style={styles.loading}
                                            size="large"
                                        />
                                    </View>
                                    <View style={styles.loadingTextBox}>
                                        <Text allowFontScaling={false} style={styles.loadingText}>{
                                            this.state.title ?
                                                this.state.title
                                                :
                                                '加载中...'
                                        }</Text>
                                    </View>

                                </View>
                    }

                </View>
            );
        }else{
            return null
        }
    }
}

const styles = StyleSheet.create({
    container: {
        height:Util.size.height - 64 * px,
        width: Util.size.width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999999999999
    },
    contentBox:{
        height: 90* px,
        width: 90* px,
        backgroundColor:'rgba(0,0,0,0.9)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems:'center',
    },
    loadingText:{
        color:'#fff',
        fontSize: fontSize(11),
    },
    imgBox:{
        width: 90* px,
        height: 50 * px,
        justifyContent:'center',
        alignItems:'center'
    },
    loadingTextBox:{
        width: 90* px,
        height: 20 * px,
        justifyContent:'center',
        alignItems:'center'
    }
});