/**
 * eTongDai React Native App
 * This is AsyncStorage, it replace LocalStorage in react native
 * Use defaul setting, Expires is null, enableCache is true, size is 1000
 * @John
 */

import {
	AsyncStorage
} from 'react-native';

module.exports = {
	getItem: function(key) {
		return AsyncStorage.getItem(key).then(value => {
			return JSON.parse(value);
		});
	},
	// to do check the vaule is exist then call setItem method will 
	//   update old value or add new value to old value
	setItem: function(key, value='') {
		return AsyncStorage.setItem(key,JSON.stringify(value));
	},

	removeItem: function(key) {
		return AsyncStorage.removeItem(key);
	}
}