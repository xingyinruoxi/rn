/**
 * Created by liuzhenli on 2018/1/15.
 */


import React, {Component} from 'react'

import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native'

var Storage = require('./../../../commons/storage');
var StorageKey = require('./../../../commons/storageKey');
import Loading from './../../components/loading'
import Header from '../../components/commonHeader'
import Util from '../../../commons/util'
import Line from './../../../commons/line'
import Button from '../../components/button'
import RightIcon from './../../components/rightIcon'
import Fetch from './../../../commons/fetch'
import EAlert from './../../components/ealert'
import SinglePicker from './../../components/picker';

var dismissKeyboard = require('dismissKeyboard')
const EventEmitter = require('RCTDeviceEventEmitter');

let px = Util.pixel
export default class AddressManger extends Component<{}> {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            provincesList: null,
            province: null,
            defaultPickerData: null,
            countrySide: null,
            options: [],
            type: null,
            userInfo: props.navigation.state.params.userInfo,
            showModal: false,
            addressObj: props.navigation.state.params.addressObj,
            formData: {
                userName: null,
                phone: null,
                recommend: null
            }
        },
            this.save = this.save.bind(this)
        this.checkFormData = this.checkFormData.bind(this)
        this.deleteAddress = this.deleteAddress.bind(this)
    }

    componentDidMount() {
        let {addressObj} = this.props.navigation.state.params
        console.log('this.props', this.props.navigation)
        this.getCountryData()
        if (addressObj) {
            this.setFormData('phone', addressObj.contactPhone || this.state.userInfo.useMobilePhones)
            this.setFormData('userName', addressObj.receiverName || this.state.userInfo.useName)
            addressObj && this.setFormData('recommend', addressObj.detailedAddr)
            addressObj && this.setState({countrySide: addressObj.area, province: addressObj.province})
        } else {
            this.setFormData('phone', this.state.userInfo.useMobilePhones || this.state.userInfo.sftUserMdl.useMobilePhones)
            this.setFormData('userName', this.state.userInfo.useName || this.state.userInfo.sftUserMdl.useName)
        }
    }

    getCountryData() {
        Fetch.post('withdrawal/getProvince', {}, res => {
            console.log('getProvince', res)
            if (res.success) {
                this.setState({
                    provincesList: res.body.provincesList
                });
                Storage.setItem(StorageKey.eTD_CITYARR, res.body.provincesList);
            } else {
                Storage.getItem(StorageKey.eTD_CITYARR).then((data) => {
                    console.log('res.body.provincesList', data)
                    if (data) {
                        this.setState({
                            provincesList: data
                        })
                    }
                });
            }
        }, error => {
            console.log('getProvince error', error)
            Storage.getItem(StorageKey.eTD_CITYARR).then((data) => {
                if (data) {
                    this.setState({
                        provincesList: data
                    })
                }
            });
        })
    };

    getCountry(type) {
        if (this.state.province) {
            if (this.state.provincesList) {
                let data = [];
                let countryArr = [];
                for (let i = 0; i < this.state.provincesList.length; i++) {
                    if ((this.state.provincesList[i].pcName == this.state.province) || (this.state.provincesList[i].pcName.slice(0, this.state.provincesList[i].pcName.length - 1) == this.state.province)) {
                        countryArr = this.state.provincesList[i].cityArea
                        this.setState({
                            defaultPickerData: this.state.provincesList[i].cityArea[0].pcName
                        })
                    }
                }
                countryArr.map((item, index) => {
                    data.push({key: item.pcName, value: item.pcName})
                });
                setTimeout(() => {
                    this.createPicker(data, type)
                }, 100)
            } else {
                this.eAlert.show('alert', "获取城市列表失败，请重试")
            }

        } else {
            this.eAlert.show('alert', "请先选择所在省市")
        }
    };

    getProvince(type) {
        console.log('provincesList', this.state.provincesList)
        if (this.state.provincesList) {
            if (!this.state.province) {
                this.setState({
                    province: this.state.provincesList[0].pcName,
                    countrySide: this.state.provincesList[0].cityArea[0].pcName,
                    defaultPickerData: this.state.provincesList[0].cityArea[0].pcName
                })
            }

            let data = [];
            this.state.provincesList.map((item, index) => {
                data.push({key: item.pcName, value: item.pcName})
            });
            setTimeout(() => {
                this.createPicker(data, type)
            }, 100)

        }
    }

    createPicker(data, type) {
        this.setState({
            options: data,
            type: type,
            showModal: true
        }, () => {
            this.singlePicker.show()
        });

    };

    selectedData(data) {
        let type = this.state.type;
        if (type == 'city') {
            for (let i = 0; i < this.state.provincesList.length; i++) {
                if (this.state.provincesList[i].pcName == data.value) {
                    this.setState({countrySide: this.state.provincesList[i].cityArea[0].pcName})
                }
            }
            this.setState({province: data.value})
        } else {
            this.setState({countrySide: data.value})
        }

    }

    checkFormData() {
        let formData = this.state.formData;
        let reg = /^([\u4e00-\u9fa5])*$/
        if (!formData.userName || !reg.test(formData.userName)) {
            this.eAlert.show('alert', '请输入正确的收货人姓名')
            return
        }
        if (!formData.phone || !formData.phone.length) {
            this.eAlert.show('alert', '请输入手机号')
            return
        }
        if (!formData.recommend) {
            this.eAlert.show('alert', '请输入详细地址')
            return
        }
        if (formData.recommend.length < 5) {
            this.eAlert.show('alert', '详细地址最少输入5个汉字')
            return
        }
        if (!this.state.countrySide) {
            this.eAlert.show('alert', '请选择所在省市和地区')
            return
        }
        this.save()
    }

    save() {
        dismissKeyboard()
        this.loading.show()
        let {type} = this.props.navigation.state.params
        let data = {
            "area": this.state.countrySide,
            "contactPhone": this.state.formData.phone,
            "detailedAddr": this.state.formData.recommend,
            "province": this.state.province,
            "receiverName": this.state.formData.userName,
            "userId": this.state.userInfo.useId || this.state.userInfo.sftUserMdl.useId
        }
        type == 'edit' && (data.id = this.state.addressObj.id)
        console.log('updateAddr data', data)
        Fetch.postT(`addr/${type == 'edit' ? 'updateAddr' : 'saveAddr'}`, data, (res) => {
            console.log('updateAddr', res)
            if (res == 1) {
                this.loading.show('loading', type == 'edit' ? '修改成功' : '保存成功', 550, () => {
                    EventEmitter.emit('getAddress')
                    this.props.navigation.goBack()
                });
            } else {
                this.loading.show('loading', type == 'edit' ? '修改失败' : '保存失败', 550);
            }


        }, (error) => {
            this.loading.hide()
            console.log('saveAddr error', error)
        })
    }

    setFormData(arg, val) {
        let formData = this.state.formData;
        formData[arg] = val.replace(/\./, "")
        this.setState({
            formData
        })
    }

    deleteAddress() {
        this.eAlert.show('confirm', "地址删除后，发放奖品时会影响奖品发放，确定删除吗？", () => {
            let data = {
                userId: this.state.userInfo.useId || this.state.userInfo.sftUserMdl.useId,
                id: this.state.addressObj.id
            }
            console.log('removeAddr', data)
            this.loading.show()
            Fetch.postT('addr/remAddr', data, (res) => {
                this.loading.hide()
                console.log('removeAddr', res)
                EventEmitter.emit('getAddress')
                this.props.navigation.goBack()
            }, (data) => {
                console.log('remosveAddr error', res)
            })
        })
    }

    render() {
        let {navigation} = this.props
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => dismissKeyboard()} style={styles.container}>
                <Header leftButton leftIcon title={navigation.state.params.type == 'edit' ? "编辑地址" : "添加新地址"} goBack
                        rightButton='保存' navigation={navigation} rightButtonCallback={this.checkFormData}/>
                <ScrollView contentContainerStyle={{flex: 1}}>
                    <View style={styles.contentBox}>
                        <View style={styles.itemBox}>
                            <View style={styles.itemLabelBox}><Text style={styles.itemLabelText}>收货人</Text></View>
                            <View style={styles.itemInputBox}>
                                <TextInput style={styles.itemInputText}
                                           placeholder="请输入收货人姓名"
                                           maxLength={10}
                                           numberOfLines={1}
                                           underlineColorAndroid="transparent"
                                           onChangeText={this.setFormData.bind(this, 'userName')}
                                           value={this.state.formData.userName}
                                /></View>
                        </View>
                        <Line/>
                        <View style={styles.itemBox}>
                            <View style={styles.itemLabelBox}><Text style={styles.itemLabelText}>联系电话</Text></View>
                            <View style={styles.itemInputBox}>
                                <TextInput style={styles.itemInputText}
                                           placeholder="请输入联系电话"
                                           keyboardType="numeric"
                                           underlineColorAndroid="transparent"
                                           onChangeText={this.setFormData.bind(this, 'phone')}
                                           value={this.state.formData.phone}
                                           maxLength={11}
                                /></View>
                        </View>
                        <Line/>
                        <TouchableOpacity style={[styles.itemBox]} onPress={this.getProvince.bind(this, 'city')}>
                            <View style={styles.itemLabelBox}><Text style={styles.itemLabelText}>所在省市</Text></View>
                            <View style={[styles.selectedBox]}>
                                <Text style={styles.ItemText}>{this.state.province ? this.state.province : '请选择'}</Text>
                                <View style={[styles.selectButton]}>
                                    <RightIcon/>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Line/>
                        <TouchableOpacity style={styles.itemBox} onPress={this.getCountry.bind(this, 'country')}>
                            <View style={styles.itemLabelBox}><Text style={styles.itemLabelText}>所在地区</Text></View>
                            <View style={[styles.selectedBox]}>
                                <Text style={styles.ItemText}
                                      numberOfLines={1}>{this.state.countrySide ? this.state.countrySide : '请选择'}</Text>
                                <View style={[styles.selectButton]}>
                                    <RightIcon/>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Line/>
                        <View style={[styles.itemBox, styles.widthBoard]}>
                            <TextInput style={styles.itemInputTextArea}
                                       multiline={true}
                                       underlineColorAndroid="transparent"
                                       placeholder="请填写详细地址，不少于5个字"
                                       maxLength={100}
                                       numberOfLines={10}
                                       onChangeText={this.setFormData.bind(this, 'recommend')}
                                       value={this.state.formData.recommend}/>
                        </View>
                    </View>
                    {
                        navigation.state.params.type == 'edit' ?
                            <TouchableOpacity activeOpacity={0.75} style={[styles.itemBox, styles.deleteButton]}
                                              onPress={this.deleteAddress}>
                                <View style={styles.itemLabelBox}><Text
                                    style={[styles.itemLabelText, styles.deleteButtonText]}>删除该地址</Text></View>
                            </TouchableOpacity>
                            :
                            null
                    }

                </ScrollView>
                <SinglePicker
                    lang="zh-CN"
                    defaultSelectedValue={this.state.defaultPickerData}
                    ref={ref => this.singlePicker = ref}
                    onConfirm={(option) => {
                        this.setState({showModal: false})
                        this.selectedData(option)
                    }}
                    onCancel={() => {
                        this.setState({showModal: false})
                    }}
                    onSelect={(option) => {
                        this.selectedData(option)
                    }}
                    options={this.state.options}
                >
                </SinglePicker>
                <EAlert ref={eAlert => this.eAlert = eAlert}/>
                <Loading ref={loading => this.loading = loading}/>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f7fa',
    },
    contentBox: {
        minHeight: 100 * px,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 14 * px,
        paddingTop: 10 * px
    },
    withOutAddress: {
        minHeight: 100 * px,
        width: 250 * px,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    withOutAddressText: {
        fontSize: Util.commonFontSize(14),
        lineHeight: Util.lineHeight(18)
    },
    itemBox: {
        height: 45 * px,
        width: Util.size.width - 28 * px,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemLabelBox: {
        width: 80 * px,
    },
    itemLabelText: {
        fontSize: Util.commonFontSize(15),
        color: '#4f4f4f'
    },
    itemInputBox: {
        flex: 1,
        justifyContent: 'center',
    },
    selectButton: {
        marginLeft: 10 * px
    },
    selectedBox: {
        minWidth: 40 * px,
        height: 30 * px,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ItemText: {
        textAlign: 'right',
        fontSize: Util.commonFontSize(16),
        color: '#888889',
        maxWidth: Util.size.width - 150 * px
    },
    itemInputText: {
        flex: 1,
        textAlign: 'right',
        fontSize: Util.commonFontSize(16),
        color: '#4A4A4A'
    },
    itemInputTextArea: {
        flex: 1,
        fontSize: Util.commonFontSize(14),
        lineHeight: Util.lineHeight(18),
        minHeight: 20,
        paddingBottom: 10,
        color: '#4A4A4A'
    },
    widthBoard: {
        backgroundColor: '#fff',
        height: 100 * px,
        marginTop: 10 * px,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    deleteButton: {
        marginTop: 20 * px,
        height: 45 * px,
        backgroundColor: '#fff',
        width: Util.size.width,
        paddingLeft: 14 * px
    },
    deleteButtonText: {
        color: '#E94639',
        fontSize: 15 * px
    }

})