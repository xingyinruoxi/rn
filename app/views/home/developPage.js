/**
 * Created by liuzhenli on 2017/12/20.
 */
import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	NativeModules
} from 'react-native'
var Storage = require('./../../commons/storage');
var StorageKeys = require('./../../commons/storageKey');
import Button from './../components/button';
import RNRestart from 'react-native-restart';
export  default class DevelopPage extends Component{
	static navigationOptions = {
		headerTitle: '开发工具'
	};
	constructor(props){
		super(props);
		this.state = {
			active: "production"
		}
	}
	componentWillMount() {
		this.setState({
			active: NativeModules.ETDGrowingIO.mode
		})
	}
	toRestart(arg) {

		NativeModules.ETDGrowingIO.setCacheString(arg);

		Storage.setItem(StorageKeys.eTD_LASTLOGINPHONE,null);

		global.forbidTransition = true;

		Storage.setItem(StorageKeys.eTD_GESTUREPWD,{hide: false});

		Storage.removeItem(StorageKeys.eTD_USERINFO);

		global.forbidTransition = true;

		setTimeout(() => {
			RNRestart.Restart()
		},100)
	}
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.buttonBox}>
					<Button buttonName="测试stage1" color={this.state.active === 'stage1' ? "#025FCB" : "#ccc"} onPress={this.toRestart.bind(this,'stage1')} width={180}/>
				</View>
				<View style={styles.buttonBox}>
					<Button buttonName="测试stage2"  color={this.state.active === 'stage2'? "#025FCB" : "#ccc"}  onPress={this.toRestart.bind(this,'stage2')} width={180}/>
				</View>
				<View style={styles.buttonBox}>
					<Button buttonName="测试stage3"  color={this.state.active === 'stage3' ? "#025FCB" : "#ccc"}  onPress={this.toRestart.bind(this,'stage3')} width={180}/>
				</View>
				<View style={styles.buttonBox}>
					<Button buttonName="准生产环境"  color={this.state.active === 'preproduction' ? "#025FCB" : "#ccc"}  onPress={this.toRestart.bind(this,'preproduction')} width={180}/>
				</View>
				<View style={styles.buttonBox}>
					<Button buttonName="生产环境"  color={this.state.active === 'production' ? "#025FCB" : "#ccc"}  onPress={this.toRestart.bind(this,'production')} width={180}/>
				</View>
				<View style={styles.buttonBox}>
					<Button buttonName="3元包"  color={this.state.active == '3' ? "#025FCB" : "#ccc"}  width={180}/>
				</View>
				<View style={styles.buttonBox}>
					<Button buttonName="100元包"  color={this.state.active == '100' ? "#025FCB" : "#ccc"}   width={180}/>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor: '#fff',
		alignItems: 'center',
		paddingTop: 20
	},
	buttonBox: {
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20
	}
})