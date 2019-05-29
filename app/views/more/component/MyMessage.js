/**
 * Created by glzc on 2017/7/13.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    WebView,
} from 'react-native';
import Fetch from './../../../commons/fetch';
import HeaderBar from './../../../commons/headerBar';
import Line from './../../../commons/line';
import Util from './../../../commons/util';
import Loading from './../../components/loading';
import EAlert from './../../components/ealert';
const Storage = require('./../../../commons/storage');
const StorageKeys = require('./../../../commons/storageKey');

export default class MyMessage extends Component{
    static navigationOptions = ({navigation}) => ({
        title: '我的消息',
        header: () => <HeaderBar navigation={navigation} />
    });
    constructor(props){
        super(props);
        this.state = {
            useId: null,
            sessionId: null,
        }
    };
    componentDidMount(){
        Storage.getItem(StorageKeys.eTD_USERINFO).then(res => {
            if(res && res.sessionId){
                this.setState({
                    useId: res.sftUserMdl.useId,
                    sessionId: res.sessionId,
                },() => {
                    this._loadData();
                })
            }
        });
    };
    _loadData(){
        this.loading && this.loading.show();
        let data={
            mesId: this.props.navigation.state.params.mesId,
            useId: this.state.useId,
            sessionId: this.state.sessionId,
        };
        Fetch.post('more/messageDetails',data,res => {
            this.loading.hide();
            if(res && res.success){
                this.setState({
                    data: res.body
                });
            }
        },err => {
            this.loading.hide();
        },null,this);
    };
    render(){
        if(this.state.data){
            let time = Util.getDate(this.state.data.mesSendTime,true,true);
            let iteContent = this.state.data.mesContent;
            //let content = iteContent.indexOf('style=') > -1 ? '<div style="word-wrap: break-word;width: 95%;margin: 0 auto;border-right: none">'+iteContent+'</div>' : '<div style="word-wrap: break-word;width: 95%;margin: 0 auto;border-right: none">'+iteContent+'</div>';
            return (
                <View style={MyMesStyles.container}>
                    <View style={MyMesStyles.title}>
                        <Text allowFontScaling={false} style={[MyMesStyles.textStyle,{fontSize: Util.pixel*16}]}>{this.state.type == 0 ? this.state.data.artTitle : this.state.data.mesTitle}</Text>
                        <Text allowFontScaling={false} style={[MyMesStyles.textStyle,{fontSize: Util.pixel*12}]}>{time}</Text>
                    </View>
                    <Line full={true} />
                    <Text>34567890</Text>
                    <View style={MyMesStyles.mesContent}>
                        <WebView
                            style={{flex: 1}}
                            javaScriptEnabled={true}
                            automaticallyAdjustContentInsets={true}
                            dataDetectorTypes={'none'}
                            source={{html: '<div style="word-wrap: break-word;width: 93%;margin: 0 auto;border-right: none">'+iteContent+'</div>'}}
                        />
                    </View>
                    <Loading ref={(ref) => {this.loading=ref}} />
                    <EAlert ref={ref => this.eAlert = ref} />
                </View>
            )
        }else{
            return (
                <View style={MyMesStyles.container}>
                    <Loading ref={(ref) => {this.loading=ref}} />
                    <EAlert ref={ref => this.eAlert = ref} />
                </View>
            )
        }
    }
};

const MyMesStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    title: {
        paddingTop: Util.pixel*10,
        paddingBottom: Util.pixel*2,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: Util.commonFontSize(14),
        color: '#000000',
        lineHeight: Util.lineHeight(20),
    },
    mesContent: {
        flex: 1,
    }
});