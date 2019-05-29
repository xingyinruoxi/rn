/**
 * eTongDai React Native App
 * This is project info slide two view
 * @John
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  WebView,
} from 'react-native';
import { projectInfoSlideTwoStyle } from './../../../styles/projectList/projectInfoSlideTwoStyle';
import Util from './../../../commons/util';
import Fetch from './../../../commons/fetch';
import Loading from './../../../commons/loading';
const Config = require('./../../../commons/config');

export default class ProjectSliderTwo extends Component {
  constructor(props){
    super(props);
    this.state = {
        itemList: null,
    };
  };
  componentDidMount(){
    this.loadData();
  };

  loadData(){
    this.props.root.loading && this.props.root.loading.show();
    Fetch.post('investments/getColInfo',{iteId:this.props.iteId},
        (res) => {
        this.props.root.loading && this.props.root.loading.hide();
        if (res.success && res.body.length > 0) {
            this.setState({
                itemList : res.body[0],
            })
        }
    }, (error) => {
        this.props.root.loading && this.props.root.loading.hide();
    });
  };
  loadPage(routeName,params){
      this.props.navigation.navigate(routeName,params);
  }
  render() {
      let content = this.state.itemList ? this.state.itemList.colDesc.indexOf('style=') > -1 ? '<div style="word-wrap: break-word;width: 94%;margin: 0 auto;margin-left:-10px;border: none;padding-bottom: 40px;font-size: 12px">'+this.state.itemList.colDesc.replace(/\n/g,'<br />')+'</div>' : '<div style="word-wrap: break-word;width: 94%;margin: 0 auto;margin-left: 15px;border: none;padding-bottom: 40px;font-size: 12px">'+this.state.itemList.colDesc.replace(/\n/g,'<br />')+'</div>' : '';
      return (
      <View style={{height: Util.size.height}}>
      {
        !this.state.itemList ?
            <View style={[projectInfoSlideTwoStyle.checkedState,{paddingTop: Util.pixel*100,alignItems: 'flex-start'}]}>
                <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.noDataText}>暂无记录</Text>
            </View>
        :
            <View style={{height: Util.size.height,}}>
                <View style={[projectInfoSlideTwoStyle.flexRow,{alignItems: 'center',paddingLeft: Util.pixel*14}]}>
                    <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>抵押物名称: </Text>
                    <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>{this.state.itemList.colName}</Text>
                </View>
                <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText,{marginTop:Util.pixel * 10,marginBottom:Util.pixel * 6,paddingLeft: Util.pixel*14}]}>抵押物信息: </Text>
                <View style={{width: Util.size.width,height: Util.size.height - Util.pixel*300}}>
                    <WebView style={{flex:1}} automaticallyAdjustContentInsets={true} scrollEnabled={true} source={{html: content}} />
                </View>
                <View style={[projectInfoSlideTwoStyle.flexRow,{justifyContent: 'center',alignItems: 'center'}]}>
                    <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>风险告知  查看</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.loadPage.bind(this,'webview',{source: {uri: ((this.props.url && this.props.url !== '') ? this.props.url + '?rct=true' : Config.systemInfos.risk_disclosure_url)},title: '风险揭示书',h5Page: true})}>
                        <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText,{color: '#EA6240'}]}>《风险提示书》</Text>
                    </TouchableOpacity>
                </View>
            </View>
      }
      </View>
    );
  }
}