/**
 * Credit Life React Native App
 * This is fetch used to get data with API method
 * @John
 */

import {
	AsyncStorage,
	Platform,
	Alert,
	NativeModules
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Storage from './storage';
import * as StorageKeys from './storageKey';
import Util from './util';
import Product from './config';

let ApiUrl = Product.url.ApiUrl;
let androidApiUrl = Product.url.androidApiUrl;
let deadline = 20000; // 30 m

let lngA = "116.4074";
let latA = "39.9042";
let cityA = "";
let channelID = null;
// var UmClickManager = require('react-native').NativeModules.UmClickManager;
// Storage.getItem(StorageKeys.CL_USERSTATION).then((location) => {
// 	if (location) {
// 		cityA = location.city;
// 		lngA = location.lng == undefined ? lngA : location.lng;
// 		latA = location.lat == undefined ? latA : location.lat;
// 	}
// });
// var channelID = Platform.OS == 'ios' ? "appstore" : UmClickManager.getChannel((data) => {
// 	channelID = data;
// });

module.exports = {
	/**
	 * 基于fetch的get方法
	 * @param {string} url
	 * @param {function} successCallback 请求成功回调
	 * @param {function} failCallback 请求失败回调
	 * @param {int} timeOut 请求超时时间 默认为 30m
	 */
	get: function(url, successCallback, failCallback, timeOut) {
			var reg = /^(http\:\/\/|https\:\/\/)/;
			reg.test(url) ? url : url = ApiUrl + url;

			var p = Promise.race([
				fetch(url, {
					headers: this._getRequestHeader("")
				}),
				new Promise(function(resolve, reject) {
					setTimeout(() => reject(new Error('request timeout')), deadline)
				})
			])
			p.then(this._handleError)
				.then((responseText) => {
					let newResponese = {};
					try {
						newResponese = responseText ? JSON.parse(responseText.replace(/null/g, '""')) : {}
					} catch (e) {
						newResponese = responseText
					}
					successCallback(newResponese);

				})
			p.catch(error => failCallback(error))
	},
	getLog: function(url, successCallback, failCallback, timeOut) {
		var p = Promise.race([
			fetch(url, {
				headers: this._getRequestHeader("")
			}),
			new Promise(function(resolve, reject) {
				setTimeout(() => reject(new Error('request timeout')), deadline)
			})
		])
		p.then(this._handleError)
			.then((responseText) => {
				let newResponese = {};
				try {
					newResponese = responseText ? JSON.parse(responseText.replace(/null/g, '""')) : {}
				} catch (e) {
					newResponese = responseText
				}
				successCallback(newResponese);
				
			})
		p.catch(error => failCallback(error))
	},
	/**
	 * 基于fetch的post方法
	 * @param {string} url
	 * @param {json} params
	 * @param {function} successCallback 请求成功回调
	 * @param {function} failCallback 请求失败回调
	 * @param {int} timeOut 请求超时时间 默认为 30m
	 */
	post: function(url, params, successCallback, failCallback, timeOut,module,loginCallback) {
		url = ApiUrl + url;
        
		fetchOptions = {
			method: 'POST',
			headers: this._getRequestHeader(''),
			body: this._serializeJSON(params.body ? params.body : params),
		}
		var p = Promise.race([
			fetch(url, fetchOptions),
			new Promise(function(resolve, reject) {
				setTimeout(() => reject(new Error('request timeout')), !timeOut ? deadline : timeOut)
			})
		]);

		p.then((response) => {return response.text()})
			.then((responseText) => {
                // Alert.alert('statusText',responseText)
				let newResponese = {};
				try {
					newResponese = responseText ? JSON.parse(responseText) : {}
                    // Alert.alert(' try responseText',responseText)
                    // Alert.alert(' try newResponese',newResponese)
				} catch (e) {
					newResponese = responseText
                    // Alert.alert(' try newResponese',newResponese)
				}
                // Alert.alert('statusText',JSON.stringify(newResponese))
                if(newResponese.code && (newResponese.code == '800001' || newResponese.code == '800000') && module){
                    //console.log('url',url)
                    // Alert.alert('statusText',JSON.stringify(newResponese))
					global.__isLogin = null;
					global.__sessionId = null;
					global.__useId = null;
					Storage.removeItem(StorageKeys.eTD_USERINFO)
                    global.forbidTransition = true;
					module.loading && module.loading.hide();
					module.inputTradePsw && module.inputTradePsw.hide();
                    module.eAlert.show('alert',newResponese.info,() => {module.props.navigation.navigate('login',{callback:loginCallback,dispatch: true})})
                }else if(newResponese.code && newResponese.code == '30001' && module){
					//拦截前往开通存管账户页面
                    // Alert.alert('statusText','2')
					module.loading && module.loading.hide();
					module.inputTradePsw && module.inputTradePsw.hide();
					module.eAlert.show('confirm',newResponese.info,() => {module.props.navigation.navigate('createStockAccount',{})})
				}else if(newResponese.code && newResponese.code == '60001' && module){
					//拦截前往设置交易密码页面
                    // Alert.alert('statusText','3')
					module.loading && module.loading.hide();
					module.inputTradePsw && module.inputTradePsw.hide();
					module.eAlert.show('alert',newResponese.info,() => {module.props.navigation.navigate('createStockAccount',{active: 'password'})})
				}else{
                    // Alert.alert('statusText','4')
					successCallback(newResponese);
				}
			})
		p.catch(error => failCallback(error))

	},
	/**
	 * 基于fetch的put方法
	 * @param {string} url
	 * @param {json} params
	 * @param {function} successCallback 请求成功回调
	 * @param {function} failCallback 请求失败回调
	 * @param {int} timeOut 请求超时时间 默认为 30m
	 */
	put: function(url, params, successCallback, failCallback, timeOut) {
		console.log('PUT', url);
		console.log('channelID', channelID);
		Storage.getItem(StorageKeys.CL_USERINFO).then((data) => {
			url = ApiUrl + url;
			var fetchOptions = null;
			//console.log(data)
			if (data && data.token) {
				fetchOptions = {
					method: 'PUT',
					headers: this._getRequestHeader(data.token),
					body: JSON.stringify(params)
				}
			} else {
				fetchOptions = {
					method: 'PUT',
					headers: this._getRequestHeader(''),
					body: JSON.stringify(params.body ? params.body : params)
				}
				if (params.header) {
					for (item in params.header) {
						fetchOptions.headers[item] = params.header[item];
					}
				}
			}
			var p = Promise.race([
				fetch(url, fetchOptions),
				new Promise(function(resolve, reject) {
					setTimeout(() => reject(new Error('request timeout')), !timeOut ? deadline : timeOut)
				})
			])
			p.then((response) => {
					if (response.status == "200") {
						return "200"
					} else {
						return response.text()
					}
				})
				.then((responseText) => {
					console.log(responseText);
					let newResponese = {};
					try {
						newResponese = responseText ? JSON.parse(responseText) : {}
					} catch (e) {
						newResponese = responseText
					}
					successCallback(responseText.indexOf("code:") ? JSON.parse(responseText) : responseText);
				})
			p.catch(error => failCallback(error))
		});

	},

	/**
	 * 基于fetch的delete方法
	 * @param {string} url
	 * @param {json} params
	 * @param {function} successCallback 请求成功回调
	 * @param {function} failCallback 请求失败回调
	 * @param {int} timeOut 请求超时时间 默认为 30m
	 */
	delete: function(url, params, successCallback, failCallback, timeOut) {
		Storage.getItem(StorageKeys.CL_USERINFO).then((data) => {
			url = ApiUrl + url;
			var fetchOptions = null;
			if (data && data.token) {
				fetchOptions = {
					method: 'DELETE',
					headers: this._getRequestHeader(data.token),
					body: JSON.stringify(params)
				}
			} else {
				fetchOptions = {
					method: 'DELETE',
					headers: this._getRequestHeader(''),
					body: JSON.stringify(params.body ? params.body : params)
				}
				if (params.header) {
					for (item in params.header) {
						fetchOptions.headers[item] = params.header[item];
					}
				}
			}
			var p = Promise.race([
				fetch(url, fetchOptions),
				new Promise(function(resolve, reject) {
					setTimeout(() => reject(new Error('request timeout')), !timeOut ? deadline : timeOut)
				})
			])
			p.then(this._handleError)
				.then((responseText) => {
					var newResponese = JSON.parse(responseText || '{}');
					successCallback(newResponese);
				})
			p.catch(error => failCallback(error))
		});

	},
	// serialize object to from data
	// like a=b&c+d
	_serializeJSON: function(data) {
	  data['terminalType'] =  Util.isIOS ? '2' : '3';
	  data['appVersion'] = Util.isIOS ? Product.appVersion : Product.appAndroidVersion;
	  //data['idfa'] = DeviceInfo.getUniqueID();
	  return Object.keys(data).map(function (keyName) {
	    // return keyName + '=' + data[keyName]
	    return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
	  }).join('&');
	},
	// handle with error
	_handleError: function(response) {
        // Alert.alert('statusText',response._bodyText)
		if (response.status >= 500) {
			// it means server side have issue
			//Alert.alert('提醒', '加载失败');
		}
        // Alert.alert(' try response.text()',response)
		return response.text()
	},
	// get request header
	_getRequestHeader: function(token) {
		if (token == "") {
			return {
				'Accept': '*/*',
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		} else {
			return {
				"Accept": '*/*',
				"Authorization": token,
				"Content-Type":"application/x-www-form-urlencoded",
			}
		}
	},
	
	getT: function(url, successCallback, failCallback, timeOut) {
		Storage.getItem(StorageKeys.eTD_USERINFO).then((userInfo) => {
			var reg = /^(http\:\/\/|https\:\/\/)/;
			// url = "http://10.20.9.164:8886/app/server/" + url; //http://app-api.rc.etongdai.org/app/server/
			url = "http://app-api.etongdai.com/app/server/" + url;		//http://app-api.rc.etongdai.org/app/server/
			if(userInfo){
				var p = Promise.race([
					fetch(url, {
						headers: this._getRequestHeader(userInfo.user_token)
					}),
					new Promise(function(resolve, reject) {
						setTimeout(() => reject(new Error('request timeout')), deadline)
					})
				])
			}else{
				var p = Promise.race([
					fetch(url, {
						headers: this._getRequestHeader("")
					}),
					new Promise(function(resolve, reject) {
						setTimeout(() => reject(new Error('request timeout')), deadline)
					})
				])
			}
			p.then(this._handleError)
				.then((responseText) => {
					let newResponese = {};
					try {
						newResponese = responseText ? JSON.parse(responseText.replace(/null/g, '""')) : {}
					} catch (e) {
						newResponese = responseText
					}
					successCallback(newResponese);

				})
			p.catch(error => failCallback(error))
		})

	},

	postT: function(url, params, successCallback, failCallback, timeOut,module,loginCallback) {
		Storage.getItem(StorageKeys.eTD_USERINFO).then((userInfo) => {
			// url = "http://10.20.9.164:8886/app/server/" + url;
			url = "http://app-api.etongdai.com/app/server/" + url;
			fetchOptions = {
				method: 'POST',
				headers: this._getRequestHeader(userInfo.user_token || ""),
				body: this._serializeJSON(params.body ? params.body : params),
			}
			var p = Promise.race([
				fetch(url, fetchOptions),
				new Promise(function(resolve, reject) {
					setTimeout(() => reject(new Error('request timeout')), !timeOut ? deadline : timeOut)
				})
			]);

			p.then((response) => {return response.text()})
				.then((responseText) => {
					// Alert.alert('statusText',responseText)
					let newResponese = {};
					try {
						newResponese = responseText ? JSON.parse(responseText) : {}
						// Alert.alert(' try responseText',responseText)
						// Alert.alert(' try newResponese',newResponese)
					} catch (e) {
						newResponese = responseText
						// Alert.alert(' try newResponese',newResponese)
					}
					// Alert.alert('statusText',JSON.stringify(newResponese))
					if(newResponese.code && (newResponese.code == '800001' || newResponese.code == '800000') && module){
						//console.log('url',url)
						// Alert.alert('statusText',JSON.stringify(newResponese))
						global.forbidTransition = true;
						module.loading && module.loading.hide();
						module.inputTradePsw && module.inputTradePsw.hide();
						module.eAlert.show('alert',newResponese.info,() => {module.props.navigation.navigate('login',{callback:loginCallback,dispatch: true})})
					}else if(newResponese.code && newResponese.code == '30001' && module){
						//拦截前往开通存管账户页面
						// Alert.alert('statusText','2')
						module.loading && module.loading.hide();
						module.inputTradePsw && module.inputTradePsw.hide();
						module.eAlert.show('confirm',newResponese.info,() => {module.props.navigation.navigate('createStockAccount',{})})
					}else if(newResponese.code && newResponese.code == '60001' && module){
						//拦截前往设置交易密码页面
						// Alert.alert('statusText','3')
						console.log('newResponese.code',newResponese)
						module.loading && module.loading.hide();
						module.inputTradePsw && module.inputTradePsw.hide();
						module.eAlert.show('alert',newResponese.info,() => {module.props.navigation.navigate('createStockAccount',{active: 'password'})})
					}else{
						// Alert.alert('statusText','4')
						successCallback(newResponese);
					}
				})
			p.catch(error => failCallback(error))
		})


	},
}

