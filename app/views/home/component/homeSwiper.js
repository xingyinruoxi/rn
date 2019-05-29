/**
 * eTongDai React Native App
 * This is home swiper view
 * @John
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    AppState,
		Dimensions
} from 'react-native';
let { width, height } = Dimensions.get('window')
import { homePageStyle } from './../../../styles/home/homeStyles';
import Util from './../../../commons/util';
var Swiper = require('react-native-swiper')
import Carousel, { Pagination }from 'react-native-snap-carousel';
export default class HomeSwiper extends Component {
    constructor(props){
        super(props);
        this.navigation = this.props.navigation;
        this.state = {
            banner: false,
            appState: AppState.currentState,
            loop: false,
					activeSlide: 0
        };
        AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    };
    componentDidMount(){
        this.setState({
            banner: true
        });
        if(Util.isIOS){
            this.swiper.scrollBy(0);
        };
    }
    _handleAppStateChange(nextAppState){
        if(this.view) {
            this.setState({appState: nextAppState});
        }
    }
    // access to h5 address
    _accessToDetail(htmlUrl,title){
			console.log('htmlUrl', htmlUrl)
        this.props.navigation.navigate('webview',{source: {uri: htmlUrl},title: title,h5Page: false});
    };
	_renderItem({item, index}) {
		console.log('item', item)
		return (
			<TouchableOpacity activeOpacity={0.7} disabled={(!item.picGoUrl || item.picGoUrl == '')} onPress={this._accessToDetail.bind(this,item.picGoUrl.indexOf('?') > -1 ? item.picGoUrl.trim()+'&rct=true' : item.picGoUrl.trim()+'?rct=true',item.picTitle)}>
				{/* console.log('item.picUrl',item.picUrl) */}
				{
					item.picUrl.indexOf('http') > -1 ?
						<View style={homePageStyle.swiper}>
							<Image
								defaultSource={require('./../../../imgs/home/banner_loading.png')}
								source={{uri:item.picUrl.trim()}}
								resizeMode={'cover'}
								style={[homePageStyle.swiper,{resizeMode: 'cover'}]}/>
						</View>
						:
						<View style={homePageStyle.swiper}>
							<Image style={homePageStyle.swiper} source={require('./../../../imgs/home/banner_loading.png')} resizeMode={'cover'} />
						</View>
				}
			</TouchableOpacity>
		)
	}
    render() {
			let { activeSlide} = this.state
        if(Util.isIOS){
            return (
                <View ref={ref => this.view = ref} style={homePageStyle.swiper}>

                    <Swiper
                        ref={ref => this.swiper = ref}
                        style={{overflow: 'hidden'}}
                        showsButtons={false}
                        autoplay={true}
                        height={Util.size.width / 750 * 400}
                        width={Util.size.width}
                        autoplayTimeout={5}
                        paginationStyle={{bottom:5}}
                        dot={<View style={[homePageStyle.swiperDoc, {backgroundColor:'rgba(255,255,255,0.5)' }]} />}
                        activeDot={<View style={[homePageStyle.swiperDoc, {backgroundColor: '#fff'}]} />}
                        removeClippedSubviews={false}
                        index={0}
                        >
                        {
                            this.props.picList.map((item, key) =>
																			<TouchableOpacity activeOpacity={0.7} key={key} disabled={(!item.picGoUrl || item.picGoUrl == '')} onPress={this._accessToDetail.bind(this,item.picGoUrl.indexOf('?') > -1 ? item.picGoUrl.trim()+'&rct=true' : item.picGoUrl.trim()+'?rct=true',item.picTitle)}>
                                        {/* console.log('item.picUrl',item.picUrl) */}
                                        {
                                            item.picUrl.indexOf('http') > -1 ?
                                                <View style={homePageStyle.swiper}>
                                                    <Image
                                                        defaultSource={require('./../../../imgs/home/banner_loading.png')}
                                                        source={{uri:item.picUrl.trim()}}
                                                        resizeMode={'cover'}
                                                        style={[homePageStyle.swiper,{resizeMode: 'cover'}]}/>
                                                </View>
                                                :
                                                <View style={homePageStyle.swiper}>
                                                    <Image style={homePageStyle.swiper} source={require('./../../../imgs/home/banner_loading.png')} resizeMode={'cover'} />
                                                </View>
                                        }
                                    </TouchableOpacity>
                            )
                        }
                    </Swiper>
                </View>
            )
        }else{
            return (
                <View ref={ref => this.view = ref} style={homePageStyle.swiper}>
									{
										this.state.appState === 'active' && this.state.banner ?
											<Swiper
												style={{overflow: 'hidden'}}
												showsButtons={false}
												autoplay={true}
												height={Util.size.width / 750 * 400}
												width={Util.size.width}
												autoplayTimeout={5}
												paginationStyle={{bottom:5}}
												dot={<View style={[homePageStyle.swiperDoc, {backgroundColor:'rgba(255,255,255,0.5)' }]} />}
												activeDot={<View style={[homePageStyle.swiperDoc, {backgroundColor: '#fff'}]} />}
												removeClippedSubviews={false}
											>

												{
													this.props.picList.map((item, key) =>
														<TouchableOpacity activeOpacity={0.7} key={key} disabled={(!item.picGoUrl || item.picGoUrl == '')} onPress={this._accessToDetail.bind(this,item.picGoUrl.indexOf('?') > -1 ? item.picGoUrl.trim()+'&rct=true' : item.picGoUrl.trim()+'?rct=true',item.picTitle)}>
															{/*console.log('item.picUrl',item.picGoUrl)*/}
															{
																item.picUrl.indexOf('http') > -1 ?
																	<View style={homePageStyle.swiper}>
																		<Image
																			defaultSource={require('./../../../imgs/home/banner_loading.png')}
																			source={{uri:item.picUrl.trim()}}
																			resizeMode={'cover'}
																			style={[homePageStyle.swiper,{resizeMode: 'cover'}]}/>
																	</View>
																	:
																	<View style={homePageStyle.swiper}>
																		<Image style={homePageStyle.swiper} source={require('./../../../imgs/home/banner_loading.png')} resizeMode={'cover'} />
																	</View>
															}
														</TouchableOpacity>
													)
												}
											</Swiper>
											:

											null
									}


                </View>
            )
        }
    }
}

