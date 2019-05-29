/**
 * eTongDai React Native App
 * This is project list view
 * @John
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AppState,
  Modal,
  Image,
  ActivityIndicator,
  NativeModules,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ProjectTab from './projectTab';
import { projectListStyle } from './../../styles/projectList/projectListStyle';
import Util,{Grow} from './../../commons/util';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
import MessageTabBar from './../more/component/messageTabBar';
const EventEmitter = require('RCTDeviceEventEmitter');
export default class ProjectList extends Component {
  constructor(props){
      super(props);
      this.navigation = this.props.navigation;
      this.state = {
          tabData: [{
              type: 'investment',
              showName: '出借项目',
            }, {
              type: 'transfer',
              showName: '债权转让',
          }],
          noBack: null,
          appState: AppState.currentState,
          showLeading: false,
          step: 1,
          page: (this.props.navigation.state.params && this.props.navigation.state.params.page) || 0,
          leadingStatus: true,
          loadingSuccess: false,
      };
      AppState.addEventListener('change',this._handleAppStateChange.bind(this));
      EventEmitter.addListener('isList',() => {
          setTimeout(() => {this.changePage();},100);
      });
  };
  componentWillMount(){

  };
  componentDidMount(){
      this.changePage();
      //this.setPullRefreshText();
  };

  _handleAppStateChange(nextState){
      if(this.view) {
          this.setState({
              appState: nextState,
          });
      }
  };
  growingIO(){
      if(this.state.page == 0){
          Grow.track('pg_invest_investlist_userbrowse',{'pg_invest_investlist_userbrowse':'出借项目页浏览用户量'});
      }else{
          Grow.track('pg_invest_transferlist_userbrowse',{'pg_invest_transferlist_userbrowse':'债权转让页面浏览用户量'});
      }
  };
    showLeading(){
        if(__scenes.length == 1) {
            this.setState({
                showLeading: global.__firstComeList
            });
        }
    }
    hideLeading(){
        if(this.state.step < 3){
            this.setState({
                step: this.state.step + 1
            })
        }else{
            this.setState({
                showLeading: false,
                leadingStatus: false
            });
            global.__firstComeList = false;
            Storage.setItem(StorageKey.eTD_FIRSTCOMELIST,true)
        }
    };
    changePage(){
        if(this.view){
            if(Util.isIOS){
                this.setState({
                    page: (this.props.navigation.state.params && this.props.navigation.state.params.page) || 0,
                },() => {
                    this.growingIO();
                });
            }else{
                this.setState({
                    page: (this.props.navigation.state.params && this.props.navigation.state.params.page) || 0,
                    loadingSuccess: false,
                },() => {
                    this.growingIO();
                    setTimeout(() => {
                        if(this.view){
                            this.setState({
                                loadingSuccess: true,
                            })
                        }
                    }, 1500);
                })
            }
        }
    };
    changeTab(arg){
        this.setState({
            page: arg.i,
        },() => {
            this.growingIO();
        })
    };
  render() {
        return (
            <View ref={ref => this.view = ref} style={projectListStyle.container}>
                {
                    Util.isIOS || (this.state.appState == 'active' && this.state.loadingSuccess) ?
                        <ScrollableTabView
                            page={this.state.page}
                            locked={true}
                            tabBarUnderlineStyle={{height:0}}
                            tabBarActiveTextColor='#ffffff'
                            tabBarInactiveTextColor='#9b9b9b'
                            tabBarTextStyle={{fontSize:Util.commonFontSize(17)}}
                            onChangeTab={this.changeTab.bind(this)}
                            style={projectListStyle.ScrollableTabBar}
                            renderTabBar={() => <MessageTabBar tabStyle={{paddingBottom: 0}} style={{height: Util.isIOS ? Util.deviceId.indexOf('iPhone10') != -1 ? 88* Util.pixel : Util.pixel*57 : Util.pixel*45,paddingTop: Util.isIOS ? Util.deviceId.indexOf('iPhone10') != -1 ? 44 * Util.pixel :Util.pixel*20 : 0,}}  backgroundColor="#025fcc" />}
                            removeClippedSubviews={false}>
                            {
                                this.state.tabData.map((item, key) =>
                                        <ProjectTab
                                            tabLabel={item.showName}
                                            key={key}
                                            type={item.type}
                                            navigation={this.navigation}
                                            showLeading={this.showLeading.bind(this)}
                                            leadingStatus={this.state.leadingStatus}
                                            />
                                )
                            }
                        </ScrollableTabView>
                        :
                        <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
                            <View style={projectListStyle.loadingView}>
                                <ActivityIndicator size="large" />
                            </View>
                        </View>
                }
                {
                    this.state.showLeading ?
                        <Modal visible={this.state.showLeading}
                               animationType="fade"
                               transparent={true}
                               onRequestClose={() => {}}
                            >
                            <View style={projectListStyle.l_content}>
                                {this.state.step == 1 && <Image
                                    style={[projectListStyle.l_justRegiste,{width: Util.size.width - (10 * Util.pixel),marginTop: Util.deviceId.indexOf('iPhone10') != -1 ? 46 * Util.pixel : 0,height: (Util.size.width-(10 * Util.pixel)) /728 * 468}]}
                                    source={require('./../../imgs/commons/leading/checkNewDetail.png')}/> }
                                {this.state.step == 2 && <Image
                                    style={[projectListStyle.l_justRegiste4,{width: Util.size.width - (10 * Util.pixel),marginTop: Util.deviceId.indexOf('iPhone10') != -1 ? 51 * Util.pixel : 0,height: (Util.size.width-(10 * Util.pixel)) /728 * 468}]}
                                    source={require('./../../imgs/commons/leading/checkDetial.png')}/> }
                                {this.state.step == 3 && <Image style={projectListStyle.l_justRegiste2}
                                                                source={require('./../../imgs/commons/leading/diffentRe.png')}/> }
                                <TouchableOpacity activeOpacity={0.7} style={[projectListStyle.iKnow]}
                                                  onPress={this.hideLeading.bind(this)}>
                                    <Image
                                        style={(Util.deviceType == '5' || Util.deviceType == '5s') && projectListStyle.iKnowImg}
                                        source={require('./../../imgs/commons/leading/IKnow.png')}/>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                        :
                        null
                }
            </View>
        );
  }
}