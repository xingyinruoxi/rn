/**
 * Created by liuzhenli on 2017/12/7.
 */
import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet
} from 'react-native';
import util from './../../commons/util';
let px = util.pixel;
let width = util.width;
export  default class XHeader extends Component{
	render() {
		if(util.deviceId.indexOf('iPhone10') != -1){
			return (
				<View style={styles.container}>

				</View>
			)
		}else{
			return null
		}

	}
}

const styles = StyleSheet.create({
	container: {
		height: 44 * px,
		width: width,
		backgroundColor:'#F6F6F6'
	}
});