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
  AppState,
  NativeModules,
} from 'react-native';
import { projectInfoStyle } from './../../../styles/projectList/projectInfoStyle';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Util from './../../../commons/util';
import ProjectSlideTab from './projectSlideTab';
import HeaderBar from './../../../commons/headerBar';
import MessageTabBar from './../../more/component/messageTabBar';
const ETDGrowingIO = NativeModules.ETDGrowingIO;
export default class ProjectSliderTwo extends Component {
  static navigationOptions = ({navigation}) => ({
    title: '更多信息',
    header: () => <HeaderBar navigation={navigation} />
  });
  constructor(props){
    super(props);
    this.projectData = this.props.navigation.state.params.projectData;
    this.type = this.props.navigation.state.params.type;
    this.state = {
        tabData: (this.type == 0 ? this.projectData.investItemDetailsMdl.iteType : this.projectData.pptItemExtendMdl.iteType) == 1 ? [{
        type: 'baseInfo',
        showName: '基本信息',
      }, {
        type: this.type == 0 ? 'investment' : 'repayplan',
        showName: this.type == 0 ? '出借记录' : '还款计划',
      }, {
        type: 'compliance',
        showName: '合规资料',
      }] : [{
        type: 'baseInfo',
        showName: '基本信息',
      }, {
        type: this.type  == 0 ? 'investment' : 'repayplan',
        showName: this.type == 0 ? '出借记录' : '还款计划',
      }, {
        type: 'compliance',
        showName: '合规资料',
      },{
        type:'riskManagement',
        showName: '风控措施'
      }],
      useId: null,
      sessionId: null,
      appState: AppState.currentState,
    };
    AppState.addEventListener('change',this._handleAppStateChange.bind(this));
  };
  componentDidMount(){
    this.growingIO();
  };
  componentWillUnmount(){
    AppState.removeEventListener('change',this._handleAppStateChange.bind(this));
  };
    growingIO(){
        if(this.props.navigation.state.params.type == 0){
            ETDGrowingIO.track('pg_invest_investdetails_userbrowse',null);
        }else{
            ETDGrowingIO.track('pg_invest_transferdetails_userbrowse',null);
        }
    };
  _handleAppStateChange(nextState){
      if(this.view) {
          this.setState({
              appState: nextState,
          });
      }
  };
  render() {
    let disabled = this.props.navigation.state.params.type == 0 && this.props.navigation.state.params.projectData && this.props.navigation.state.params.projectData.pptItemExtendMdl && this.props.navigation.state.params.projectData.pptItemExtendMdl.iteProgress == 1;
    return (
      <View ref={ref => this.view = ref} style={[projectInfoStyle.container,{backgroundColor: '#fff'}]}>
        {
            this.state.appState == 'active' ?
          <ScrollableTabView
              tabBarUnderlineStyle={{height:Util.pixel  * 2, backgroundColor:'#025fcb',}}
              tabBarActiveTextColor='#025fcb'
              tabBarInactiveTextColor='#9b9b9b'
              tabBarTextStyle={{fontSize:Util.commonFontSize(15)}}
              renderTabBar={() => <MessageTabBar tabStyle={{paddingBottom: 0}} />}
              >
            {
              this.state.tabData.map((item, key) =>
                      <ProjectSlideTab
                          tabLabel={item.showName}
                          key={key}
                          type={item.type}
                          projectData={this.props.navigation.state.params.projectData}
                          navigation={this.props.navigation}
                          />
              )
            }
          </ScrollableTabView>
                :null
        }
        <TouchableOpacity activeOpacity={0.9} disabled={disabled || this.props.navigation.state.params.flag} style={[projectInfoStyle.button,this.props.navigation.state.params.type == 0 && disabled && {backgroundColor: '#9b9b9b'}]} onPress={this.props.navigation.state.params.callback.bind(this)}>
          <Text allowFontScaling={false} style={projectInfoStyle.buttonText}>{this.props.navigation.state.params.type == 0 ? disabled ? '已满标' : '立即出借' : '承接债权'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}