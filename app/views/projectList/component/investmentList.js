/**
 * eTongDai React Native App
 * This is project info slide two investment and compliance list view
 * @John
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
    RefreshControl,
} from 'react-native';
import { projectInfoSlideTwoStyle } from './../../../styles/projectList/projectInfoSlideTwoStyle';
import Util from './../../../commons/util';
import Fetch from './../../../commons/fetch';
import Line from './../../../commons/line';
import EAlert from './../../components/ealert';

export default class ProjectSliderTwo extends Component {
  constructor(props){
    super(props);
    this.state = {
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
    };
    this._renderRow = this._renderRow.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
  };
  componentDidMount(){
    this.loadData();
  };
  loadData(){
      this.props.root.loading && this.props.root.loading.show();
    let url = '',body={};
    if(this.props.type == 'investment'){
        url = 'investments/getInvestRecord';
        body = {iteId: this.props.iteId}
    }else if(this.props.type == 'repayplan'){
        url = 'investments/repayplan';
        body = {rsbId: this.props.iteId}
    }else{
        url = 'investments/getItemDataCheckInfo';
        body = {userId: this.props.iteId}
    }
    Fetch.post(url,body,
        (res) => {
        this.props.root.loading && this.props.root.loading.hide();
        if (res.success) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(res.body),
            })
        } else {
            //show network issue warning;
            this.eAlert.show.bind(this,'alert',res.info);

        }
    }, (error) => {
        this.props.root.loading && this.props.root.loading.show();
    })
  };

  _renderHeader(){
    return(
      <View style={projectInfoSlideTwoStyle.headerContent}>
        {
            this.props.type == 'repayplan' ?
                <View style={[projectInfoSlideTwoStyle.flexListRow,{justifyContent: 'space-between'}]}>
                  <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoBoldText,{width: (Util.size.width-28)/3,textAlign: 'left'}]}>预期还款时间</Text>
                  <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoBoldText,{width: (Util.size.width-28)/3,textAlign: 'center'}]}>还款金额(元)</Text>
                  <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoBoldText,{width: (Util.size.width-28)/3,textAlign: 'right'}]}>状态</Text>
                </View>
                :
                <View style={[projectInfoSlideTwoStyle.flexListRow,{justifyContent: 'space-between'}]}>
                  <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoBoldText,{paddingLeft: Util.pixel*10,textAlign: 'left'} ]}>{this.props.type == 'investment' ? "出借人" : "审核项目"}</Text>
                  <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.baseInfoBoldText,{paddingRight: Util.pixel*10,textAlign: 'right'}]}>{this.props.type == 'investment' ? "出借时间" : "审核状态"}</Text>
                </View>
        }

        <Line />
      </View>
    )
  };

  _renderRow(row) {
    return(
      <View style={projectInfoSlideTwoStyle.headerContent}>
        {
            this.props.type == 'repayplan' ?
                <View style={projectInfoSlideTwoStyle.flexListRow}>
                  <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.flexListText,{width: (Util.size.width-28)/3,textAlign: 'left'}]}>{Util.getDate(row.rescPlanDate)}</Text>
                  <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.flexListText,{width: (Util.size.width-28)/3}]}>{(Number(row.rescPlanPrincipalYuan)+Number(row.rescPlanInterestYuan)).toFixed(2)}</Text>
                  <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.flexListText,{width: (Util.size.width-28)/3,textAlign: 'right'}]}>{row.rescStateFdName}</Text>
                </View>
                :
                <View style={[projectInfoSlideTwoStyle.flexListRow,{justifyContent: 'space-between'}]}>
                  <Text allowFontScaling={false} style={[projectInfoSlideTwoStyle.flexListText,{paddingLeft: Util.pixel*10,textAlign: 'left'}]}>{this.props.type == 'investment' ? row.claInvestorLoginName : row.info}</Text>
                  {
                    this.props.type == 'investment' ?
                        <Text allowFontScaling={false} allowFontScaling={false} style={[projectInfoSlideTwoStyle.flexListText,{paddingRight: Util.pixel*10,textAlign: 'right'}]}>{Util.getDate(row.claCreateTime,true,true)}</Text>
                        :
                        <View style={[projectInfoSlideTwoStyle.checkedState,{paddingRight: Util.pixel*10,justifyContent: 'flex-end'}]}>
                          <Image style={projectInfoSlideTwoStyle.checkedImg} source={require('./../../../imgs/projectList/checked.png')} />
                          <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.baseInfoText}>审核通过</Text>
                        </View>
                  }
                </View>
        }
        <Line />
      </View>
    )
  };
  _renderFooter(){
      return (
          <View style={projectInfoSlideTwoStyle.footer}></View>
      )
  };
  _refresh(){
    this.setState({
        isRefresh: !this.state.isRefresh
    },this.loadData.bind(this));
  };
  render() {
    return (
      <View ref={ref => this.view=ref} style={{flex:1}}>
      {
        this.state.dataSource._cachedRowCount == 0 ?
        <View style={[projectInfoSlideTwoStyle.checkedState,{paddingTop: Util.pixel*100,alignItems: 'flex-start'}]}>
            <Text allowFontScaling={false} style={projectInfoSlideTwoStyle.noDataText}>暂无记录</Text>
        </View>
         : 
        <View style={{flex:1}}>
          <ListView
            ref="listview"
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            renderHeader={this._renderHeader.bind(this)}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={true}
            pageSize={5}
            enableEmptySections={true}
            //refreshControl={<RefreshControl onRefresh={this._refresh.bind(this)} refreshing={this.state.isRefresh}  title="Loading..." />}
            renderFooter={this._renderFooter.bind(this)}
          />
        </View>
      }
          <EAlert ref={ref => this.eAlert = ref} />
      </View>
    );
  }
}