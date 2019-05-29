/**
 * eTongDai React Native App
 * This is project item view
 * @John
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import {projectItemStyle} from './../../../styles/projectList/projectItemStyle';
import Util from './../../../commons/util';

export default class ProjectItem extends Component {
    constructor(props) {
        super(props);
    };

    toProjectInfo(id, cId, n) {
        this.props.navigation.navigate('projectInfo', {iteId: id, claId: cId, useType: n, title: '项目详情', noLine: true});
    };

    render() {
        let item = this.props.data;
        let isInvest = this.props.type == 'investment' ? true : false;
        let width = Util.size.width - Util.pixel * 28 - Util.pixel * 40;
        let progressWidth = parseInt((item.progress == 1 ? width : item.progress * width));
        let isWan = item.remainMoneyYuan / 10000 > 1;
        return (
            <TouchableOpacity activeOpacity={0.8}
                              onPress={this.toProjectInfo.bind(this, item.iteId, isInvest ? '' : item.claId, isInvest ? 0 : 1)}>
                <View style={projectItemStyle.container}>
                    <View style={[projectItemStyle.content, !isInvest && {height: Util.pixel * 150}]}>
                        <View style={[projectItemStyle.header, projectItemStyle.flexRow]}>
                            <View style={[projectItemStyle.flexRow, {justifyContent: 'flex-start'}]}>
                                {
                                    (item.isNewItem && item.isNewItem == 1) ?
                                        <View style={[projectItemStyle.flexRow, projectItemStyle.newItem]}>
                                            <Text allowFontScaling={false}
                                                  style={projectItemStyle.newItemText}>新手专享</Text>
                                        </View>
                                        :
                                        <View
                                            style={[projectItemStyle.tag, projectItemStyle.flexRow, {justifyContent: 'center'}]}>
                                            <Text
                                                allowFontScaling={false}
                                                style={projectItemStyle.tagText}
                                            >
                                                {isInvest ? (item.iteType == 1 ? '信' : '抵') : '转'}
                                            </Text>
                                        </View>
                                }
                                <Text allowFontScaling={false} style={projectItemStyle.itemName}
                                      numberOfLines={1}>{isInvest ? item.title : item.iteTitle}</Text>
                            </View>
                            <View style={[projectItemStyle.flexRow, {
                                justifyContent: 'center',
                                alignItems: 'flex-start'
                            }]}>
                                <Text allowFontScaling={false}
                                      style={projectItemStyle.creditLevel}>{item.borrowLevelName}</Text>
                            </View>
                        </View>
                        <View style={projectItemStyle.flexRow}>
                            <View flex={0.4}>
                                <View style={{flexDirection: 'row', alignItems: 'flex-end', height: Util.pixel * 42}}>
                                    <Text allowFontScaling={false} style={[projectItemStyle.rateFontSize, {
                                        height: Util.pixel * 42,
                                        paddingTop: Util.pixel * 6
                                    }, item.iteProgress == 1 && {color: '#9b9b9b'}]}>{isInvest ? (item.yearRate * 100).toFixed(2) : (item.iteYearRate * 100).toFixed(2)}</Text>
                                    <Text allowFontScaling={false} style={[projectItemStyle.rateUnit, {
                                        height: Util.pixel * 42,
                                        paddingTop: Util.pixel * 22
                                    }, item.iteProgress == 1 && {color: '#9b9b9b'}]}>%</Text>
                                </View>
                                <Text allowFontScaling={false}
                                      style={projectItemStyle.minFontSize}>{isInvest ? '预期年回报率' : '原始预期年回报率'}</Text>
                            </View>
                            <View flex={0.2}>
                                <View style={{flexDirection: 'row', alignItems: 'flex-end', height: Util.pixel * 42}}>
                                    <Text allowFontScaling={false} style={[projectItemStyle.rateFontSize, {
                                        height: Util.pixel * 42,
                                        paddingTop: Util.pixel * 12
                                    }, {
                                        color: item.iteProgress == 1 ? '#9b9b9b' : '#4a4a4a',
                                        fontSize: Util.commonFontSize(24)
                                    }]}>{isInvest ? item.repayDate : item.surplusTotalNo}</Text>
                                    <Text allowFontScaling={false} style={[projectItemStyle.rateUnit, {
                                        height: Util.pixel * 42,
                                        paddingTop: Util.pixel * 22
                                    }, {color: item.iteProgress == 1 ? '#9b9b9b' : '#4a4a4a'}]}>{item.iteRepayIntervalName || ((item.repayInterval == 1 || item.iteRepayInterval == 1) ? '个月' : '天')}</Text>
                                </View>
                                <Text allowFontScaling={false}
                                      style={projectItemStyle.minFontSize}>{isInvest ? '期限' : '剩余期限'}</Text>
                            </View>
                            <View flex={0.4} style={[projectItemStyle.flexRow, {justifyContent: 'flex-end'}]}>
                                {
                                    isInvest ?

                                        <View style={{alignItems: 'flex-end'}}>
                                            {
                                                item.iteProgress == 1 ?
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'flex-end',
                                                        height: Util.pixel * 42
                                                    }}>
                                                        <Text allowFontScaling={false} style={{
                                                            color: '#9b9b9b',
                                                            height: Util.pixel * 42,
                                                            paddingTop: Util.pixel * 16,
                                                            fontSize: Util.commonFontSize(20)
                                                        }}>已满标</Text>
                                                    </View>
                                                    :
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'flex-end',
                                                        height: Util.pixel * 42
                                                    }}>
                                                        <Text allowFontScaling={false}
                                                              style={[projectItemStyle.rateFontSize, {
                                                                  height: Util.pixel * 42,
                                                                  paddingTop: Util.pixel * 6
                                                              }, {color: '#025fcc'}]}>{isWan ? (Math.floor(item.remainMoneyYuan / 100) / 100).toFixed(2) : item.remainMoneyYuan}</Text>
                                                        <Text allowFontScaling={false}
                                                              style={[projectItemStyle.rateUnit, {
                                                                  height: Util.pixel * 42,
                                                                  paddingTop: Util.pixel * 22
                                                              }, {color: '#025fcc'}]}>{isWan ? '万元' : '元'}</Text>
                                                    </View>
                                            }
                                            <Text allowFontScaling={false}
                                                  style={projectItemStyle.minFontSize}>剩余金额</Text>
                                        </View>
                                        :
                                        <View
                                            style={[projectItemStyle.toTransfer, projectItemStyle.flexRow, {justifyContent: 'center'}]}>
                                            <Text allowFontScaling={false}
                                                  style={projectItemStyle.toTransferText}>去承接</Text>
                                        </View>

                                }
                            </View>
                        </View>
                        {
                            isInvest ?
                                <View style={projectItemStyle.progressOut}>
                                    <View style={[projectItemStyle.progress, {width: width}]}></View>
                                    <View style={[projectItemStyle.progress, {
                                        zIndex: 10,
                                        width: progressWidth,
                                        backgroundColor: '#025fcb'
                                    }]}></View>
                                    <View style={projectItemStyle.progressText}>
                                        <Text allowFontScaling={false}
                                              style={projectItemStyle.progressTextFont}>{(item.progress * 100).toFixed(2)}%</Text>
                                    </View>
                                </View>
                                :
                                <View
                                    style={[projectItemStyle.footer, projectItemStyle.flexRow, {justifyContent: 'flex-start'}]}>
                                    <Text allowFontScaling={false} style={projectItemStyle.footerText}>转让价格：</Text>
                                    <Text allowFontScaling={false}
                                          style={[projectItemStyle.footerText, {color: '#E94639'}]}>{Util.numberFormat(item.claTransSumYuan)}</Text>
                                    <Text allowFontScaling={false} style={projectItemStyle.footerText}>元</Text>
                                </View>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}