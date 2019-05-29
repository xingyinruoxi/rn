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
  ScrollView,
  WebView
} from 'react-native';
import { projectInfoSlideTwoStyle } from './../../../styles/projectList/projectInfoSlideTwoStyle';
import Util from './../../../commons/util';
import RiskManagement from './riskManagement';
import InvestmentList from './investmentList';
import Loading from './../../components/loading';
export default class ProjectSliderTwo extends Component {
  constructor(props){
    super(props);
    this.state = {
      isScroll: true
    };
  };
  componentDidMount(){

  };
  render() {
    let isInvest = this.props.navigation.state.params.type === 0 ? true : false;
    let url = isInvest ? this.props.projectData.riskUrl : '';
    let itemDetail = isInvest ? this.props.projectData.investItemDetailsMdl : this.props.projectData.pptItemExtendMdl;
    let borrowerDetail = isInvest ? this.props.projectData.investBorrowerDetailMdl : this.props.projectData;
    let itemDescList = isInvest ? borrowerDetail.itemDescList : borrowerDetail.pptItemExtendMdl.itemDescList;
    let itdContent = (itemDescList && itemDescList.length > 0 && itemDescList[0].itdContent && itemDescList[0].itdContent != '') ? itemDescList[0].itdContent : '';
    let content = itdContent.indexOf('style=') > -1 ? '<div style="word-wrap: break-word;width: 94%;margin: 0 auto;margin-left: -8px;border: none;padding-bottom: 50px;font-size: 12px;">'+itdContent+'</div>' : '<div style="word-wrap: break-word;width: 94%;margin: 0 auto;padding-left: 15px;border: none;padding-bottom: 50px">'+itdContent+'</div>';
    let _height = Util.size.height - (!isInvest && borrowerDetail.itemInfo ? Util.isIOS ? Util.pixel*405 : Util.pixel*380 : Util.isIOS ? Util.pixel*310 : Util.pixel*285);
    return (
      <View style={[{flex: 1,paddingBottom: Util.pixel*40}]}>
        {
          this.props.type == 'baseInfo' ?
          <ScrollView
              style={{flex: 1}}
              scrollEnabled={Util.isIOS ? true : false}
              ref={ref => this.scrollview = ref}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
            <View style={projectInfoSlideTwoStyle.flexColumn}>
              <View style={{height:Util.pixel * 35,alignItems: 'flex-start', justifyContent: 'center',paddingTop: Util.pixel*10}}>
                <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoBoldText}>借款人资料</Text>
              </View>
              <View style={projectInfoSlideTwoStyle.baseLineInfo}></View>
              <View style={[projectInfoSlideTwoStyle.flexRow, {paddingRight: Util.pixel*10}]}>
                <View style={[projectInfoSlideTwoStyle.flexRow, {width: (Util.size.width - Util.pixel*20)/2 - Util.pixel*10, flex: 0}]}>
                  <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText]}>借款人姓名: </Text>
                  <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>{isInvest ? borrowerDetail.useName : borrowerDetail.borrowerName}</Text>
                </View>
                <View style={[projectInfoSlideTwoStyle.flexRow,{flex: 0}]}>
                  <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText]}>身份证号码: </Text>
                  <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>{ borrowerDetail[isInvest ? "idCard" : "borrowerIdentityNum"] }</Text>
                </View>
              </View>
              <View style={[projectInfoSlideTwoStyle.flexRow, {paddingRight: Util.pixel*10}]}>
                <View style={projectInfoSlideTwoStyle.flexRow}>
                  <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText]}>性别: </Text>
                  <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText]}>{borrowerDetail[isInvest ? "sex" : "borrowerSex"]}</Text>
                </View>
                {
                  borrowerDetail.itemInfo ?
                      <View style={[projectInfoSlideTwoStyle.flexRow,{marginLeft: Util.pixel*30}]}>
                        <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText]}>历史逾期次数: </Text>
                        <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>{ borrowerDetail.itemInfo.overdueNum }次</Text>
                      </View>
                  : null
                }
                <View style={[projectInfoSlideTwoStyle.flexRow,{marginLeft: Util.pixel*30}]}>
                  <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>年龄: </Text>
                  <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>{ borrowerDetail[isInvest ? "age" : "borrowerAge" ] }</Text>
                </View>
              </View>
              <View style={[projectInfoSlideTwoStyle.flexRow,{paddingRight: Util.pixel*10}]}>
                <View style={[projectInfoSlideTwoStyle.flexRow, {width: (Util.size.width - Util.pixel*20)/2 - Util.pixel*10,flex: 0}]}>
                  <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText]}>联系电话: </Text>
                  <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>{ borrowerDetail[isInvest ? "mobile" : "borrowerMobilePhones"] }</Text>
                </View>
                {
                    borrowerDetail.itemInfo ?
                        <View style={[projectInfoSlideTwoStyle.flexRow, {flex: 0}]}>
                          <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText]}>重大负债状况: </Text>
                          <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>{ borrowerDetail.itemInfo.majorDebt }</Text>
                        </View>
                    : null
                }
              </View>
              {
                borrowerDetail.itemInfo ?
                    <View style={projectInfoSlideTwoStyle.flexRow}>
                      <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText]}>在其他网贷平台的借款情况: </Text>
                      <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>{ borrowerDetail.itemInfo.otherLoan }</Text>
                    </View>
                :null
              }
              <View style={projectInfoSlideTwoStyle.flexRow}>
                <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText]}>户籍所在地: </Text>
                <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>{ borrowerDetail[isInvest ? "nativePlace" : "borrowerHousehold" ] }</Text>
              </View>
              {
                  !isInvest && borrowerDetail.itemInfo ?
                      <View>
                        <View style={{height:Util.pixel * 35,alignItems: 'flex-start', justifyContent: 'center',paddingTop: Util.pixel*10}}>
                          <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoBoldText}>项目信息披露</Text>
                        </View>
                        <View style={projectInfoSlideTwoStyle.baseLineInfo}></View>
                        <View style={[projectInfoSlideTwoStyle.flexRow,{paddingRight: Util.pixel*10}]}>
                          <View style={[projectInfoSlideTwoStyle.flexRow,{width: (Util.size.width - Util.pixel*20)/2 - Util.pixel*10, flex: 0}]}>
                            <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText]}>借款资金运用情况: </Text>
                            <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>{ borrowerDetail.itemInfo.iteFundUse}</Text>
                          </View>
                          <View style={projectInfoSlideTwoStyle.flexRow}>
                            <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText]}>经营及财务状况: </Text>
                            <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>{ borrowerDetail.itemInfo.iteBorrowerBizFin }</Text>
                          </View>
                        </View>
                        <View style={[projectInfoSlideTwoStyle.flexRow,{paddingRight: Util.pixel*10}]}>
                          <View style={[projectInfoSlideTwoStyle.flexRow,{width: (Util.size.width - Util.pixel*20)/2 - Util.pixel*10, flex: 0}]}>
                            <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText]}>还款能力变化情况: </Text>
                            <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>{ borrowerDetail.itemInfo.iteRepayability }</Text>
                          </View>
                          <View style={projectInfoSlideTwoStyle.flexRow}>
                            <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText]}>涉诉情况: </Text>
                            <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>{ borrowerDetail.itemInfo.iteLitigation }</Text>
                          </View>
                        </View>
                        <View style={projectInfoSlideTwoStyle.flexRow}>
                          <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoText]}>受行政处罚情况: </Text>
                          <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>{ borrowerDetail.itemInfo.itePunish }</Text>
                        </View>
                      </View>
                  : null
              }
                <View style={{height:Util.pixel * 35,alignItems: 'flex-start', justifyContent: 'center',paddingTop: Util.pixel*10}}>
                  <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoBoldText}>项目描述</Text>
                </View>
                <View style={projectInfoSlideTwoStyle.baseLineInfo}></View>
                <View style={{height: _height,width: Util.size.width}}>
                    <WebView ref={ref => this.webview = ref} style={{flex:1}} automaticallyAdjustContentInsets={true} scrollEnabled={true} source={{html: content}} />
                </View>
              </View>
          </ScrollView>
           : 
          this.props.type == 'riskManagement' ? 
          <RiskManagement iteId={itemDetail.iteId} navigation={this.props.navigation} url={url} root={this} />
           : 
          <InvestmentList root={this} iteId={this.props.type == 'repayplan' ? borrowerDetail.pptClaimExtendMdl.claScheduleAssignor : this.props.type == 'investment' ? itemDetail.iteId : itemDetail.iteBorrowerUseId} type={this.props.type} />
        }
        <Loading ref={ ref => this.loading = ref} />
      </View>
    );
  }
}