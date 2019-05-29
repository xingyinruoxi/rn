/**
 * eTongDai React Native App
 * This is project info slide one view
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
} from 'react-native';
import { projectInfoStyle } from './../../../styles/projectList/projectInfoStyle';
import Line from './../../../commons/line';
import Util from './../../../commons/util';

export default class ProjectSliderOne extends Component {
  constructor(props){
    super(props);
  };
  loadPage(routeName,params){
    this.props.navigation.navigate(routeName,params);
  };
  render() {
    let isRisk = this.props.type == 0 ? false : true,
        progressWidth= 0,
        left= 0;
    let projectData = isRisk ? this.props.projectData.pptItemExtendMdl : this.props.projectData.investItemDetailsMdl;
    let pptClaim = isRisk ? this.props.projectData.pptClaimExtendMdl : null;
    let borrowerDetail = isRisk ? null : this.props.projectData.investBorrowerDetailMdl;
    let title = projectData.iteTitle.indexOf('(') > -1 ? projectData.iteTitle.split('(') : projectData.iteTitle.split('（');
    if(!isRisk){
      progressWidth= Util.size.width* projectData.iteProgress,
      left=Util.size.width* projectData.iteProgress - Util.pixel*70 > 0 ? Util.size.width* projectData.iteProgress - Util.pixel*70 : 0 ;
    };
    return (
      <View>
        <View style={projectInfoStyle.slideOneTop}>
          <View style={[projectInfoStyle.flexRow,{marginTop: Util.pixel * 16}]}>
            {
              !isRisk && projectData.newUserItem && projectData.newUserItem !== "NORMAL" ?
                    <View style={[projectInfoStyle.flexRow,projectInfoStyle.newItem]}>
                      <Text allowFontScaling={false} style={projectInfoStyle.newItemText}>新手专享</Text>
                    </View>
                    :
                    <View style={[projectInfoStyle.tag,projectInfoStyle.flexRow]}>
                      <Text allowFontScaling={false} style={projectInfoStyle.tagText}>{isRisk ? '转' : projectData.iteType === "COLLATERAL" ? '抵' : '信'}</Text>
                    </View>
            }
            <Text allowFontScaling={false} style={[projectInfoStyle.projectName,{maxWidth: Util.size.width - 90,paddingRight: Util.pixel*5}]} numberOfLines={1}>{title[0]}</Text>
          </View>
          <View style={[projectInfoStyle.flexRow,{marginTop: Util.pixel*2}]}>
            <Text allowFontScaling={false} style={[projectInfoStyle.projectName,{fontSize: Util.commonFontSize(10)}]}>{title.length > 1 ? title[1].indexOf(')') > -1 ? ('('+ title[1].split(')')[0] + ')') : ('（' + title[1].split('）')[0] + '）') : ''}</Text>
          </View>
          <View style={[projectInfoStyle.padding,projectInfoStyle.flexRow,{marginTop: Util.pixel*30}]}>
            <View style={[projectInfoStyle.flexColumn,{width: (Util.size.width-Util.pixel*20)/2}]}>
              <View style={projectInfoStyle.flexRow}>
                <Text allowFontScaling={false} style={projectInfoStyle.rateText}>{(projectData.iteYearRate * 100).toFixed(2)}</Text>
                <Text allowFontScaling={false} style={projectInfoStyle.rateSymbol}>%</Text>
              </View>
              <View>
                <Text allowFontScaling={false} style={projectInfoStyle.topText}>{isRisk ? '原始预期年回报率' : '预期年回报率'}</Text>
              </View>
            </View>
            <View style={[projectInfoStyle.flexColumn,{width: (Util.size.width-Util.pixel*20)/2}]}>
              <View style={projectInfoStyle.flexRow}>
                <Text allowFontScaling={false} style={projectInfoStyle.rateText}>{isRisk ? pptClaim.surplusTotalNo : projectData.iteRepayDate}</Text>
                <Text allowFontScaling={false} style={projectInfoStyle.rateSymbol}>{(projectData.iteRepayIntervalName || projectData.iteRepayIntervalDesc) || (projectData.iteRepayInterval === "MONTH" ? '个月' : '天')}</Text>
              </View>
              <View>
                <Text allowFontScaling={false} style={projectInfoStyle.topText}>{isRisk ? '剩余期限' : '期限'}</Text>
              </View>
            </View>
          </View>
          {
            isRisk ?
                <View style={[projectInfoStyle.flexRow,{height: Util.pixel*30,backgroundColor: '#025fcc',marginTop: Util.pixel*20}]}>
                  <Text allowFontScaling={false} style={projectInfoStyle.originLend}>原始出借金额：{Util.numberFormat(pptClaim.iteLimitYuan)}元</Text>
                </View>
              :
                <View style={{position: 'relative',marginTop: Util.pixel*49}}>
                  <View style={[projectInfoStyle.lendedDescribe,{left: left}]}>
                    <Text allowFontScaling={false} style={projectInfoStyle.lendedText}>已出借{Math.floor(projectData.iteProgress*100)}%</Text>
                  </View>
                  <View style={{backgroundColor: '#025fcc'}}>
                    <View style={[projectInfoStyle.progress,{width:progressWidth}]}/>
                    <View style={[projectInfoStyle.flexRow,{marginTop: Util.pixel * 10,paddingBottom: Util.pixel*10}]}>
                      <View style={[projectInfoStyle.flexColumn,{width: (Util.size.width-Util.pixel*20)/2}]}>
                        <View style={projectInfoStyle.flexRow}>
                          <Text allowFontScaling={false} style={[projectInfoStyle.rateText,{fontSize: Util.commonFontSize(18)}]}>{Util.numberFormat(isRisk ? pptClaim.iteBorrowAmountYuan : (projectData.iteBorrowAmount/100))}</Text>
                          <Text allowFontScaling={false} style={[projectInfoStyle.rateSymbol,{fontSize: Util.commonFontSize(13),marginBottom: Util.pixel*-2}]}>元</Text>
                        </View>
                        <View>
                          <Text allowFontScaling={false} style={projectInfoStyle.topText}>剩余可出借金额</Text>
                        </View>
                      </View>
                      <View style={projectInfoStyle.line}/>
                      <View style={[projectInfoStyle.flexColumn,{width: (Util.size.width-Util.pixel*20)/2}]}>
                        <View style={projectInfoStyle.flexRow}>
                          <Text allowFontScaling={false} style={[projectInfoStyle.rateText,{fontSize: Util.commonFontSize(18)}]}>{projectData.iteBidMinYuan || 100}</Text>
                          <Text allowFontScaling={false} style={[projectInfoStyle.rateSymbol,{fontSize: Util.commonFontSize(13),marginBottom: Util.pixel*-2}]}>元</Text>
                        </View>
                        <View>
                          <Text allowFontScaling={false} style={projectInfoStyle.topText}>起投金额</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
          }

        </View>
        <View style={{flexDirection:'column',}}>
          {
            isRisk ?
                <View style={projectInfoStyle.flexSpaceAround}>
                  <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{marginLeft:Util.pixel * 14}]}>剩余本息</Text>
                  <View style={[projectInfoStyle.flexRow,{marginRight: Util.pixel * 14}]}>
                    <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{marginRight: Util.pixel * 2,color: '#025fcc'}]}>{Util.numberFormat(pptClaim.claTransClaimSumYuan)}</Text>
                    <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{fontSize: Util.commonFontSize(14)}]}>元</Text>
                  </View>
                </View>
                :
                <View style={projectInfoStyle.flexSpaceAround}>
                  <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{marginLeft:Util.pixel * 14}]}>借款金额</Text>
                  <Text allowFontScaling={false} style={[projectInfoStyle.infoNumber,{marginRight: Util.pixel * 14,color: '#025fcc'}]}>{Util.numberFormat(projectData.iteLimit/100)}元</Text>
                </View>
          }
          <View style={{backgroundColor: '#fff'}}>
            <Line />
          </View>
          {
              isRisk ?
                  <View >
                    <View style={projectInfoStyle.flexSpaceAround}>
                      <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{marginLeft:Util.pixel * 14}]}>转让价格</Text>
                      <View style={[projectInfoStyle.flexRow,{marginRight: Util.pixel * 14}]}>
                        <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{marginRight: Util.pixel * 2,color: '#E94639'}]}>{Util.numberFormat(pptClaim.claTransSumYuan)}</Text>
                        <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{fontSize: Util.commonFontSize(14)}]}>元</Text>
                      </View>
                    </View>
                    <View style={{backgroundColor: '#fff'}}>
                      <Line />
                    </View>
                    <View style={projectInfoStyle.flexSpaceAround}>
                      <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{marginLeft:Util.pixel * 14}]}>原始期限</Text>
                      <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{marginRight: Util.pixel * 14,fontSize: Util.commonFontSize(14)}]}>{pptClaim.iteRepayDate + pptClaim.iteRepayIntervalName}</Text>
                    </View>
                    <View style={{backgroundColor: '#fff',height: Util.pixel*1}}>
                      <Line />
                    </View>
                  </View>
                  :null
          }
          <View style={projectInfoStyle.flexSpaceAround}>
            <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{marginLeft:Util.pixel * 14}]}>还款方式</Text>
            <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{marginRight: Util.pixel * 14,fontSize: Util.commonFontSize(14)}]}>{ isRisk ? projectData.iteRepayTypeName : projectData.iteRepayTypeDesc}</Text>
          </View>
          <View style={{backgroundColor: '#fff'}}>
            <Line />
          </View>
          {
              !isRisk ?
                  <View>
                      <View style={projectInfoStyle.flexSpaceAround}>
                        <Text allowFontScaling={false}
                              style={[projectInfoStyle.infoTitle,{marginLeft:Util.pixel * 14}]}>起息日</Text>
                        <Text allowFontScaling={false}
                              style={[projectInfoStyle.infoTitle,{marginRight: Util.pixel * 14,fontSize: Util.commonFontSize(14)}]}>满标审核通过之日</Text>
                      </View>
                      < View style={{backgroundColor: '#fff'}}>
                      <Line />
                      </View>
                  </View>
              : null
          }
          {
              !isRisk && projectData.newUserItem && projectData.newUserItem !== "NORMAL" ?
                  <View>
                    <View style={projectInfoStyle.flexSpaceAround}>
                      <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{marginLeft:Util.pixel * 14}]}>限制条件</Text>
                      <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{marginRight: Util.pixel * 14,fontSize: Util.commonFontSize(14)}]}>新手专享，最高出借金额{projectData.newUserItemCapAmt}元</Text>
                    </View>
                    <View style={{backgroundColor: '#fff',height: Util.pixel*1}}>
                      <Line />
                    </View>
                  </View>
                  :null
          }
          <View style={projectInfoStyle.flexSpaceAround}>
            <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{marginLeft:Util.pixel * 14}]}>信用等级</Text>
            <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{marginRight: Util.pixel * 14}]}>{isRisk ? projectData.borrowLevelName : borrowerDetail && borrowerDetail.borrowingLevel}</Text>
          </View>
          <View style={{backgroundColor: '#fff'}}>
            <Line />
          </View>
          <View style={projectInfoStyle.flexSpaceAround}>
            <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{marginLeft:Util.pixel * 14}]}>项目特点</Text>
            <View style={{flexDirection:'row',marginRight: Util.pixel * 14}}>
              {
                projectData.itemSafeguardList.map((data,index) => {
                  return(
                    <View style={[projectInfoStyle.guaranteeView,projectData.itemSafeguardList.length - 1 == index && {marginRight: 0}]} key={index}>
                      <Text allowFontScaling={false} style={projectInfoStyle.guaranteeText}>{data.itsTypeName}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={[projectInfoStyle.flexSpaceAround,{marginTop: Util.pixel*10}]} onPress={this.loadPage.bind(this,'projectSliderTwo',{title: '更多信息',projectData: this.props.projectData,type: this.props.type,iteId: this.props.iteId,callback:this.props.callback,flag: this.props.flag})}>
            <Text allowFontScaling={false} style={[projectInfoStyle.infoTitle,{marginLeft:Util.pixel * 14}]}>更多信息</Text>
            <Image style={{marginRight:Util.pixel * 14}} source={require('./../../../imgs/more/left_icon.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}