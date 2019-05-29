/**
 * eTongDai React Native App
 * This is project info view
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
} from 'react-native';
import { projectInfoStyle } from './../../styles/projectList/projectInfoStyle';
import Util,{Grow} from './../../commons/util';
import ProjectSlideOne from './component/projectSlideOne';
import Loading from './../components/loading';
import Fetch from './../../commons/fetch';
import HeaderBar from './../../commons/headerBar';
import EAlert from './../components/ealert';
const Storage = require('./../../commons/storage');
const StorageKeys = require('./../../commons/storageKey');
//const EventEmitter = require('RCTDeviceEventEmitter');

export default class ProjectInfo extends Component {
  static navigationOptions = ({navigation}) => ({
      title: '项目详情',
      header: () => <HeaderBar navigation={navigation} />
  });
  constructor(props){
      super(props);
      this.state = {
          projectInfo:[],
          type: this.props.navigation.state.params.useType,
          sessionId: null,
          useId: null,
          pageOne: true,
          clickNum: 0,
      };
  };
  componentWillUnmount(){
      //this.eventEmit.remove();
  };
  componentDidMount(){
      this.getUserInfo(this.loadData.bind(this),false);
      this.growingIO(0);
      //this.eventEmit = EventEmitter.addListener('checkLogin',this.getUserInfo.bind(this));
  };
    growingIO(n){
        switch (n){
            case 0:
                if(this.state.type == 0){
                    Grow.track('pg_invest_investdetails_userbrowse',{'pg_invest_investdetails_userbrowse':'出借项目详情页浏览用户量'});
                }else{
                    Grow.track('pg_invest_transferdetails_userbrowse',{'pg_invest_transferdetails_userbrowse':'债权转让项目详情页浏览用户量'});
                }
                break;
            case 1:
                if(this.state.type == 0){
                    Grow.track('elbn_invest_investdetails_goinvest_click',{'elbn_invest_investdetails_goinvest_click':'立即出借按钮点击量'});
                }else{
                    Grow.track('elbn_invest_transferdetails_gotransfer_click',{'elbn_invest_transferdetails_gotransfer_click':'承接债权按钮点击量'});
                }
                break;
            default :
                break;
        }
    };
  getUserInfo(cb,flag){
    if(this.view){
        Storage.getItem(StorageKeys.eTD_USERINFO).then(res => {
            if(res && res.sessionId){
                this.setState({
                    sessionId: res.sessionId,
                    useId: res.sftUserMdl.useId
                },() => {
                    if(flag && res.sftUserMdl && res.sftUserMdl.useAuthRealName != 1){
                        this.eAlert.show('confirm','尚未实名，'+ (this.state.type == 0 ? '出借前' : '承接前') +'请先完成实名认证',() => {

                            this.setState({
                                clickNum: 0,
                            },() => {
                                this.props.navigation.navigate('createRealNameAccount',{haveCertify: false});
                            })
                        },null,() => {
                            this.setState({
                                clickNum: 0,
                            })
                        });
                        return;
                    }
                    cb && cb(flag);
                });
            }else{
                if(flag){
                    global.forbidTransition = true;
                    this.loadPage('login',{callback: () => {
                        this.setState({
                            clickNum: 0,
                        })
                    }});
                }else{
                    this.setState({
                        sessionId: null,
                        useId: null
                    },() => {
                        cb && cb(flag);
                    });
                }
            }
        });
    }
  };
  loadData(flag){
      this.loading.show();
      let item = this.props.navigation.state.params;
      let body= (flag && this.state.useId) ? item.useType == 0 ? {
          useType:item.useType,
          iteId: item.iteId,
          useId:this.state.useId,
          sessionId: this.state.sessionId,
      } : {
          useType:item.useType,
          useId:this.state.useId,
          sessionId: this.state.sessionId,
          claId: item.claId,
          iteId: item.iteId,
      } : item.useType == 0 ? {
          useType:item.useType,
          iteId: item.iteId,
      } : {
          useType:item.useType,
          iteId: item.iteId,
          claId: item.claId,
      };
      //investments/detail
      let url = item.useType == 0 ? 'invest/detail' : 'investments/detail';
      Fetch.post(url ,body,
          (res) => {
          this.loading.hide();
          if(flag){
              setTimeout(() => {
                  this.setState({
                      clickNum: 0,
                  })
              });
          }
          if (res.success) {
              this.setState({
                  projectData : res.body,
              },() => {
                  if(flag){
                      let pageName = this.state.type == 0 ? 'investDetail' : 'riskDetail';
                      this.loadPage(pageName,{data: this.state.projectData,title: this.state.type == 0 ? '输入出借金额' : '确定承接金额'});
                  }
              })
          }else if(res && res.code == 'ppc260'){     //非新手投资新手标异常提示
              this.eAlert.show('alert',res.info,() => {
                  this.props.navigation.goBack();
              });
          }else{

          }
      }, (error) => {
          // show network issue warning
          //console.log('John get error ',error);
          this.setState({
              clickNum: 0,
          });
          this.loading.hide();
      },null,this, () => {
              this.setState({
                  clickNum: 0,
              })
          });
  };
  loadPage(routeName,props){
      this.props.navigation.navigate(routeName,props);
  };
  _submit(){
      if(this.state.clickNum > 0){
          return;
      }else{
          this.growingIO(1);
          this.setState({
              clickNum: this.state.clickNum + 1,
          });
          this.getUserInfo(this.loadData.bind(this),true);
      };
  };
  render() {
    let disabled = this.state.type == 0 && this.state.projectData && this.state.projectData.investItemDetailsMdl && (this.state.projectData.investItemDetailsMdl.iteProgress == 1)  ? true : false;
    return (
      <View ref={ref => this.view=ref} style={projectInfoStyle.container}>
          <ScrollView
              contentContainerStyle={projectInfoStyle.scrollViewHeight}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              >
              {
                  this.state.projectData ?
                        <ProjectSlideOne navigation={this.props.navigation} projectData={this.state.projectData} type={this.state.type} iteId={this.props.navigation.state.params.iteId} callback={this._submit.bind(this,disabled)} flag={this.state.clickNum > 0} />
                      : <View></View>
              }
          </ScrollView>
          {
              this.state.projectData ?
              <TouchableOpacity activeOpacity={0.9} disabled={disabled}
                                style={[projectInfoStyle.button,this.state.type == 0 && disabled && {backgroundColor: '#9b9b9b'}]}
                                onPress={this._submit.bind(this,(disabled))}>
                  <Text allowFontScaling={false} style={projectInfoStyle.buttonText}>{this.state.type == 0 ? disabled ? '已满标' : '立即出借' : '承接债权'}</Text>
              </TouchableOpacity>
                  :<View></View>
          }
          <EAlert ref={(ref) => this.eAlert = ref}/>
          <Loading ref={ ref => this.loading = ref} />
      </View>
    );
  }
}