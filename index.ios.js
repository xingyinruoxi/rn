/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    View,
    NativeModules
} from 'react-native';

import MainNavigation from './app/commons/navigators/mainNavigator';

var Storage = require('./app/commons/storage');
var StorageKey = require('./app/commons/storageKey');
var Fetch = require('./app/commons/fetch');
import JPushModule from 'jpush-react-native';
import LaunchPage from './app/views/components/launchPage';

import Md5 from './app/commons/Md5';
import * as launchImage from 'react-native-launch-image';

export default class eTongDai extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstCome: false,
            showHome: false,
            _OpenScreenAd: null
        };
    }

    componentWillMount() {

        global.__canCheck = true;
        global.__resetGesturePwd = false;
        Storage.getItem(StorageKey.eTD_FIRSTCOME).then((data) => {
            if (!data) {
                this.setState({
                    firstCome: true
                });
            }
            setTimeout(() => this.setState({showHome: true}))
        });
        Storage.getItem(StorageKey.eTD_FIRSTCOMEHOME).then((data) => {
            if (!data) {
                global.__firstComeHome = true;
            }
        });
        Storage.getItem(StorageKey.eTD_USEID).then((data) => {
            if (data) {
                global.__preUseId = data;
            }
        });
        Storage.getItem(StorageKey.eTD_FIRSTCOMEMINE).then((data) => {
            if (!data) {
                global.__firstComeMine = true;
            }
        });
        Storage.getItem(StorageKey.eTD_FIRSTCOMELIST).then((data) => {
            if (!data) {
                global.__firstComeList = true;
            }
        });
        Storage.getItem(StorageKey.eTD_USERINFO).then((data) => {
            if (data) {
                global.__isLogin = data;
            }
        });
        Storage.getItem(StorageKey.eTD_PRESESSIONID).then((data) => {
            if (data) {
                global.__sessionId = data
            }
        });

        Storage.getItem(StorageKey.eTD_USEID).then((data) => {
            if (data) {
                global.__useId = data
            }
        });
        this.getOpenScreenAd();
        this.getPullRefreshTexts();
    }

    getOpenScreenAd() {
        Fetch.post('more/getOpenScreeAd', {}, (res) => {
            if (res) {
                global._OpenScreenAd = res.body;
                this.setState({
                    _OpenScreenAd: res
                });
            }
        }, (error) => {
            this.setState({
                _OpenScreenAd: true
            });
            launchImage.hide()
        })
    }

    goHome() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'tab'})
            ],
        });
        this.props.navigation.dispatch(resetAction)
    };

    componentDidMount() {
        global.__registerId = '';

        JPushModule.getRegistrationID((registerId) => {
            console.log('registerID', registerId)
            global.__registerId = registerId;
        });
        JPushModule.setBadge(0, (messageContent) => {
        });


        NativeModules.ETDDevice.idfa((data) => {
            let IDdata = {
                idfaMd5: Md5.hex_md5('etongdai' + data),
                idfa: data,
            };
            Fetch.post('more/addIDFA', IDdata, res => {
            }, error => {
            })

        });

    };

    callback(toLogin) {
        this.setState({
            firstCome: false,
        });
        Storage.setItem(StorageKey.eTD_FIRSTCOME, 1);
    }

    getPullRefreshTexts() {
        //console.log('======= reLoading')
        Fetch.post('more/getPositionWords', {}, res => {
            if (res && res.success) {
                let desc = res.body.split(';');     //['下拉刷新', '数据加载中', '易通理财值得拥有', '财富创造平台', '赚取人生第一桶金', '赚钱快又稳', '利率高风险低', '理财的首选', '168一路发', '前面都是吹牛']
                Storage.setItem(StorageKey.eTD_DOWNPULLTEXTS, desc.slice(0, 10))
            } else {
                Storage.removeItem(StorageKey.eTD_DOWNPULLTEXTS);
            }
        }, err => {

        })
    };

    render() {
        if (this.state._OpenScreenAd) {
            return (
                <View style={{flex: 1}}>
                    {
                        this.state.firstCome ?
                            <LaunchPage callback={this.callback.bind(this)}/>
                            :
                            this.state.showHome ?
                                <MainNavigation/>
                                :
                                null
                    }

                </View>
            );
        } else {
            return null
        }


    }
}

AppRegistry.registerComponent('eTongDai', () => eTongDai);
