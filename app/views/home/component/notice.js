/**
 * Created by glzc on 2017/8/21.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
    Image,
    TouchableOpacity,
		Dimensions
} from 'react-native';
import Util, { Grow } from './../../../commons/util';
import Swiper from 'react-native-swiper';
const EventEmitter = require('RCTDeviceEventEmitter');
const {url} = require('./../../../commons/config');
let {  width }= Dimensions.get('window')
export default class Notices extends Component{
    constructor(props){
        super(props);
        this.state={
            opacity: new Animated.Value(0),
            right: new Animated.Value(10),
            showSwiper: null,
        };
        EventEmitter.addListener('isHome',()=>{
            this.startAnimated();
        });
    };
    componentDidMount(){
        this.startAnimated();
    };
    loadPage(routeName,params){
			Grow.track('elbn_home_messagecenter_click',{"elbn_home_messagecenter_click": '首页消息中心按钮'})
        if(routeName == 'messageCenter'){
            this.props.root.growingIO(6);
            if(!global.__isLogin || global.__isLogin == undefined){
                this.props.navigation.navigate('login',{});
                return;
            }
        }
        this.props.navigation.navigate(routeName,params);
    };
    startAnimated(){
        if(this.view && !Util.isIOS){
            this.setState({
                showSwiper: false
            },() => {
                this.timeId = setTimeout(() => {
                    this.setState({
                        showSwiper: true
                    },() => {
                        clearTimeout(this.timeId);
                    })
                },200);
            });
        }
        Animated.sequence([
            Animated.timing(this.state.opacity,{toValue: 0,easing: Easing.linear,duration: 0}),
            Animated.timing(this.state.right,{toValue: 10,easing: Easing.linear,duration: 0}),
            Animated.timing(this.state.opacity,{toValue: 1,easing: Easing.linear,duration: 80}),
            Animated.timing(this.state.right,{toValue: 35,easing: Easing.out(Easing.exp),duration: 300})
        ]).start();
    };
	_renderItem({item, index}) {
		return (
			<TouchableOpacity activeOpacity={0.8} key={key} onPress={this.loadPage.bind(this,'webview',{source:{uri: url.activeServer+'helpCenter/help_context_detail/'+ item.artId +'?u=1'},h5Page: true,title: '网站公告'})}>
				<View  style={noticeStyles.content}>
					<Text allowFontScaling={false} style={noticeStyles.text} numberOfLines={1}>{ item.artTitle }</Text>
				</View>
			</TouchableOpacity>
		)
	}
    render(){
        if(Util.isIOS){
            return (
						<View style={noticeStyles.textContent}>

								{
										this.props.root.state.homeData && this.props.root.state.homeData.ggList
                                        && this.props.root.state.homeData.ggList.length > 0 ?
												<Swiper
														style={{overflow: 'hidden'}}
														showsButtons={false}
														autoplay={true}
														height={Util.pixel*14}
														width={width - 40}
														autoplayTimeout={7}
														showsPagination={false}
														removeClippedSubviews={false}
														index={0}
														horizontal={false}
														>
														{
																this.props.root.state.homeData.ggList.slice(0,3).map((item, key) =>{
																		return (
																			<TouchableOpacity activeOpacity={0.8} key={key} onPress={this.loadPage.bind(this,'webview',{source:{uri: url.activeServer+'helpCenter/help_context_detail/'+ item.artId +'?u=1'},h5Page: true,title: '网站公告'})}>
																				<View  style={noticeStyles.content}>
																					<Text allowFontScaling={false} style={noticeStyles.text} numberOfLines={1}>{ item.artTitle }</Text>
																				</View>
																			</TouchableOpacity>
																		)
																})
														}
												</Swiper>
												:
												<View style={noticeStyles.content}>
														<Text allowFontScaling={false} style={noticeStyles.text} numberOfLines={1}>暂无公告</Text>
												</View>
								}
						</View>
            )
        }else{
            return (
						<View style={noticeStyles.textContent}>
								{
										this.props.root.state.homeData && this.props.root.state.homeData.ggList && this.props.root.state.homeData.ggList.length > 0  ?
												<Swiper
														style={{overflow: 'hidden'}}
														showsButtons={false}
														autoplay={true}
														height={Util.pixel*14}
														width={width - 40}
														autoplayTimeout={8}
														showsPagination={false}
														removeClippedSubviews={false}
														index={0}
														horizontal={false}
														loop={true}
														>
														{
																this.props.root.state.homeData.ggList.slice(0,3).map((item, key) =>
																				<TouchableOpacity activeOpacity={0.8} key={key} onPress={this.loadPage.bind(this,'webview',{source:{uri: url.activeServer+'helpCenter/help_context_detail/'+ item.artId +'?u=1'},h5Page: true,title: '网站公告'})}>
																						<View  style={noticeStyles.content}>
																								<Text allowFontScaling={false} style={noticeStyles.text} numberOfLines={1}>{ item.artTitle }</Text>
																						</View>
																				</TouchableOpacity>
																)
														}
												</Swiper>
												:
												<View style={noticeStyles.content}>
														<Text allowFontScaling={false} style={noticeStyles.text} numberOfLines={1}>暂无公告</Text>
												</View>
								}
						</View>
            )
        }
    }
};

const noticeStyles=StyleSheet.create({
    container:{
        height: Util.pixel*30,
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    animatedView:{
        height: Util.pixel*14,
        position: 'absolute',
        top: Util.pixel*8,
    },
    textContent:{
        height: Util.pixel*14,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0)',
    },
    text:{
        width: Util.size.width - 60,
        color: '#9D9D9D',
        fontSize: Util.commonFontSize(12),
        paddingLeft: Util.pixel*2,
        paddingRight: Util.pixel*2,
				marginLeft: 5,
    },
    content: {
        height: Util.pixel*15,
    }
});