/**
 * Created by glzc on 2017/8/17.
 */
import React,{Component} from 'react';
import {
    Modal,
    View,
    Text,
    Image,
    TouchableOpacity,
    NativeModules,
    StyleSheet,
} from 'react-native';
var Storage = require('./../../../commons/storage');
var StorageKey = require('./../../../commons/storageKey');
import Util from './../../../commons/util';
import Line from './../../../commons/line';
import Fetch from './../../../commons/fetch';
import QRCode from 'react-native-qrcode';
export default class InviteFriends extends Component{
    constructor(props){
        super(props);
        this.state={
            showModal: false,
            shareInfos: '',
            useId: null,
            sessionId: null,
            shareUrl: null,
            userInfo: null,
        }
    };
    hideModal(){
        this.setState({
            showModal:false,
        });
    };
    showModal(){
        this.setState({
            showModal: true,
        },() => {
            this.loadShareInfos();
        })
    };
    loadShareInfos(){
        Storage.getItem(StorageKey.eTD_USERINFO).then((userInfo) => {
            this.setState({
                userInfo: userInfo
            });
            setTimeout(() => {

            })
        });

        let data = {
            userId: this.props.root.state.useId,
            sessionId: this.props.root.state.sessionId,
        };
        Fetch.post('more/shareInformation',data,res => {
            if(res.success){
                this.setState({
                    shareInfos: JSON.stringify(res.body),
                    shareUrl: res.body.pageUrl,
                })
            }
            // console.log('more/shareInformation',JSON.stringify(res.body))
        },err => {
            // console.log('more/shareInformation',err);
        });
    };
    toContactsSelect(){
        this.hideModal();
        this.props.navigation.navigate('contactsSelect',{infos: this.state.shareInfos});
    };
    inviteByWechatFriend(scene,shareInfos){
        this.hideModal();
        // scene:0 = 好友列表 1 = 朋友圈
        let wechatManager = NativeModules.ETDWechatManager;
        wechatManager.isWXAppInstalled((res) => {
            if(!res){
                this.props.root.eAlert.show('alert','请您先安装微信！');
            }else{
                wechatManager.isWXAppSupportApi((res) => {
                    if(!res){
                        this.props.root.eAlert.show('alert','请升级您的微信版本！');
                    }else{
                        wechatManager.openWXApp((res) => {
                            if(!res){
                                this.props.root.eAlert.show('alert','微信启动失败！');
                            }else{
                                let _shareInfos = shareInfos || this.state.shareInfos;
                                // this.state.infos
                                // console.log("this.state.userInfo.sftUserMdl.useName：", this.state.userInfo.sftUserMdl.useName);
                                if (this.state.userInfo && this.state.userInfo.sftUserMdl.useAuthRealName == '1') {
                                    _shareInfos = JSON.parse(_shareInfos);
                                    _shareInfos.pageUrl = _shareInfos.pageUrl + "&nikename=" + this.state.userInfo.sftUserMdl.useName[0];
                                    _shareInfos = JSON.stringify(_shareInfos);
                                }
                                console.log("this.state.shareInfos:", _shareInfos);
                                wechatManager.inviteWechatFriend(scene && scene.toString(),_shareInfos);
                            }
                        })
                    }
                })
            }
        });
    };
    render(){
        return (
            <Modal animationType={'slide'} transparent={true} visible={this.state.showModal} onRequestClose={() => {}}>
                <TouchableOpacity activeOpacity={1} onPress={ this.hideModal.bind(this) } style={inviteFriendsStyle.modalStyle}>
                    <View style={inviteFriendsStyle.modalContent}>
                        <View style={inviteFriendsStyle.topContent}>
                            <View style={[inviteFriendsStyle.listContent,{width: Util.size.width - Util.pixel*28,alignSelf: 'center'}]}>
                                <View style={inviteFriendsStyle.btn}></View>
                                <View style={[inviteFriendsStyle.listContent,{justifyContent: 'center'}]}>
                                    <Image style={[inviteFriendsStyle.userIcon,inviteFriendsStyle.marginRight]} source={require('./../../../imgs/more/user_icon.png')}/>
                                    <Text allowFontScaling={false} style={[inviteFriendsStyle.title,{marginTop: 0}]}>{this.props.root.state.userPhone ? this.props.root.state.userPhone.replace(this.props.root.state.userPhone.slice(3,7),'****') : '136****7658'}</Text>
                                </View>
                                <TouchableOpacity style={inviteFriendsStyle.btn} activeOpacity={0.8} onPress={this.hideModal.bind(this)}>
                                    <View>
                                        <Image source={require('./../../../imgs/more/cancel_icon.png')} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {
                                this.state.shareUrl ?
                                    <QRCode value={this.state.shareUrl} size={143} />
                                :
                                    <Image style={inviteFriendsStyle.qrCode} source={require('./../../../imgs/more/qr_code.png')} />
                            }

                        </View>
                        <Line full={true} />
                        <View style={inviteFriendsStyle.actions}>
                            <TouchableOpacity activeOpacity={0.8} onPress={this.toContactsSelect.bind(this)}>
                                <View style={inviteFriendsStyle.center}>
                                    <Image source={require('./../../../imgs/more/Message.png')} />
                                    <Text allowFontScaling={false} style={inviteFriendsStyle.title}>短信邀请</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={this.inviteByWechatFriend.bind(this, '0', null)}>
                                <View style={inviteFriendsStyle.center}>
                                    <Image source={require('./../../../imgs/more/wechat.png')} />
                                    <Text allowFontScaling={false} style={inviteFriendsStyle.title}>微信邀请</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={this.inviteByWechatFriend.bind(this, '1', null)}>
                                <View style={inviteFriendsStyle.center}>
                                    <Image source={require('./../../../imgs/more/pyq.png')} />
                                    <Text allowFontScaling={false} style={inviteFriendsStyle.title}>朋友圈邀请</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    };
};

const inviteFriendsStyle=StyleSheet.create({
    modalStyle: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'relative'
    },
    modalContent: {
        width: Util.size.width,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#ffffff'
    },
    center: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancel: {
        fontSize: Util.commonFontSize(18),
        color: '#2ea7e0'
    },
    btn: {
        width: Util.pixel*20,
        height: Util.pixel*40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#3f3a39',
        fontSize: Util.commonFontSize(15),
        marginTop: Util.pixel*5,
    },
    center: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        height: Util.pixel*40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    topContent: {
        paddingBottom: Util.pixel*15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    marginRight: {
        marginRight: Util.pixel*10
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: Util.pixel*20,
        paddingBottom: Util.pixel*20
    },
});