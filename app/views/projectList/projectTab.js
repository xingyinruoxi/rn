/**
 * eTongDai React Native App
 * This is project tab view
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
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { projectListStyle } from './../../styles/projectList/projectListStyle';
import BackToTop from './../../commons/backToTop';
import Util from './../../commons/util';
import Fetch from './../../commons/fetch';
import Loading from './../components/loading';
import NoData from './../../commons/noData';
import ListItem from './component/projectItem';
import EAlert from './../components/ealert';
import VLine from './../../commons/vLine';
import SortIcon from './component/sortIcon';
import PullRefreshScrollView from './../components/pullRefreshScrollView/PullRefreshScrollView';
import AdEnter from './../home/component/popupAdEnter';
export default class ProjectTab extends Component {
  constructor(props){
      super(props);
      this.state = {
          itemList: [],
          newItemList:[],
          dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
          }),
          pageIndex: 1,
          hasMoreData: false,
          error: false,
          noData:false,
          scrollHeight: (Util.size.height - Util.pixel * 100) * 3,
          firstLoading: false,
          sortType: 2,  // 1--预期年回报率 2--按期限排序 3--项目进度
          isUp: false,
          pullRefreshText: null,
          adInfos: null,
      };

      this._renderRow = this._renderRow.bind(this);
  };
  componentWillMount(){
      //加载广告悬浮窗入口数据
      this._loadAdInfos();
  };
  componentDidMount(){
      this.setPullRefreshText();
      this.loadData(false);
  };
  loadData(refresh) {
    this.loading.show();
    let start  = Date.now();
    //console.log('refresh end -------',Date.now());
    this.setState({
      error: false
     }, () => {
    //let url = 'investments/list?page='+this.state.pageIndex+'&pageSize=5&useType='+(this.props.type == 'investment' ? 0 : 1);
        let body = {
            page: this.state.pageIndex,
            pageSize: 5,
            useType: this.props.type == 'investment' ? 0 : 1,
            sort: this.state.isUp ? 'asc' : 'desc',   //desc--降序 asc--升序
            orderArgs: this.state.sortType,
        };
        let url = this.props.type == 'investment' ? 'investments/investlist' : 'investments/list'
      Fetch.post(url,body,
          (res) => {
         console.log('refresh end -------',Date.now() - start);
          refresh && refresh.onRefreshEnd && refresh.onRefreshEnd();
          this.loading.hide();
          if (res.success) {
              if(this.props.leadingStatus){
                this.props.showLeading()
              }
              this.state.newItemList = refresh ? res.body.list : this.state.newItemList.concat(res.body.list);
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.state.newItemList),
                hasMoreData: (res.body.pageNum > 1 && res.body.pageNum > res.body.pageId),
                noData: res.body.list.length == 0,
              })
          } else {
              //show network issue warning;
              this.setState({
                error: true
              });
          }
      }, (error) => {
          // show network issue warning
          refresh && refresh.onRefreshEnd && refresh.onRefreshEnd();
          this.loading.hide();
          this.setState({
            error: true,
          });
          //console.log('John get error ',error);
      },null,this)
    })
  };

  onScroll(e) {
    var offsetY = e.nativeEvent.contentOffset.y;
    if (offsetY > this.state.scrollHeight) {
      this.setState({
        showToTop: true
      })
    } else {
      this.setState({
        showToTop: false
      })
    };
  };

  onEndReached() {
    if(!this.state.firstLoading){
        this.setState({
            firstLoading: true,
        });
        return;
    }
    if (this.state.hasMoreData && !this.state.error && this.state.firstLoading) {
      this.setState({
        pageIndex: this.state.pageIndex + 1,
        firstLoading: true,
      }, () => {
        this.loadData()
      });
    }
  };
  _renderRow(row) {
      return(
        <ListItem data={row} type={this.props.type} navigation={this.props.navigation} />
      )
  };

  _onRefresh(refresh) {
    this.setPullRefreshText();
    this.setState({
      pageIndex: 1,
    }, this.loadData(refresh));
      console.log('******|||')
  };
  _renderFooter(){
      return (
          <View style={projectListStyle.footer}>
              {
                  !this.state.hasMoreData && (this.state.newItemList.length < 5 && this.state.newItemList > 0 || this.state.newItemList.length > 4 && this.state.firstLoading) ?
                      <Text allowFontScaling={false} style={projectListStyle.footerText}>没有更多数据了</Text>
                      :
                      this.state.hasMoreData && this.state.firstLoading ?
                          <View style={{justifyContent: 'center',alignItems: 'center'}}>
                              <Text allowFontScaling={false} style={[projectListStyle.footerText,{fontSize:Util.commonFontSize(10)}]}>预期收益不承诺等于实际收益，选择需谨慎</Text>
                              <ActivityIndicator
                                style={projectListStyle.loading}
                                size="large"
                                />
                              <Text allowFontScaling={false} style={projectListStyle.footerText}>加载更多</Text>
                          </View>
                          : null
              }
          </View>
      )
  };
    selectSort(type){
        let isUp = (type === 2 || this.state.sortType !== type) ? false : !this.state.isUp
        this.setState({
            sortType: type,
            isUp: isUp,
            pageIndex: 1,
        },() => {
            this.loadData(true);
        })
    };
    setPullRefreshText(){
        //if(this.view){
        Util.getPullRefreshText((text) => {
            this.setState({
                pullRefreshText: text || '财富结缘，易生相伴'
            })
        })
        //}
    }
    _loadAdInfos(){
        Fetch.post('more/getSuspensionPosition', {}, res => {
            if(res && res.success){
                this.setState({
                    adInfos: res.body
                })
            }
        }, err => {})
    };
  render() {
    return (
      <View ref={ref => this.view = ref} style={projectListStyle.container}>
          
        {
          this.state.error || this.state.noData ?
          <PullRefreshScrollView
              style={{flex: 1}}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              //refreshControl={<RefreshControl onRefresh={this._onRefresh.bind(this)} refreshing={this.state.refreshing}  title="努力加载中..." />}
              onRefresh={(pullRefresh) => {this._onRefresh(pullRefresh)}}
              refreshText={this.state.pullRefreshText}
              refreshedText={this.state.pullRefreshText}
              refreshingText={this.state.pullRefreshText}
              >
              <View style={{height: Util.size.height - Util.pixel*50}}>
                <NoData />
              </View>
          </PullRefreshScrollView>
           :
          <View style={projectListStyle.projectTabList}>
              {
                  this.props.type == 'investment' ?
                      <View style={[projectListStyle.flexRow,{height: Util.pixel*37,backgroundColor: '#ffffff'}]}>
                          <TouchableOpacity activeOpacity={0.8} onPress={this.selectSort.bind(this,2)}>
                              <View style={[projectListStyle.flexRow,projectListStyle.sort,{justifyContent: 'center'}]}>
                                  <Text style={[projectListStyle.sortText,this.state.sortType === 2 && {color: '#025fcc'}]}>默认</Text>
                              </View>
                          </TouchableOpacity>
                          <VLine height={22} color="#d8d8d8" />
                          <TouchableOpacity activeOpacity={0.8} onPress={this.selectSort.bind(this,1)}>
                              <View style={[projectListStyle.flexRow,projectListStyle.sort,{justifyContent: 'center'}]}>
                                  <Text style={[projectListStyle.sortText,this.state.sortType === 1 && {color: '#025fcc'}]}>预期年回报率</Text>
                                  <SortIcon type={this.state.sortType === 1 && (this.state.isUp ? 1 : 2)} />
                              </View>
                          </TouchableOpacity>
                          <VLine height={22} color="#d8d8d8" />
                          <TouchableOpacity activeOpacity={0.8} onPress={this.selectSort.bind(this,3)}>
                              <View style={[projectListStyle.flexRow,projectListStyle.sort,{justifyContent: 'center'}]}>
                                  <Text style={[projectListStyle.sortText,this.state.sortType === 3 && {color: '#025fcc'}]}>项目期限</Text>
                                  <SortIcon type={this.state.sortType === 3 && (this.state.isUp ? 1 : 2)} />
                              </View>
                          </TouchableOpacity>
                      </View>
                  :
                      null
              }
            <ListView
              ref="listview"
              dataSource={this.state.dataSource}
              removeClippedSubviews={false}
              renderRow={this._renderRow.bind(this)}
              onEndReached={this.onEndReached.bind(this)}
              onEndReachedThreshold={25}
              automaticallyAdjustContentInsets={false}
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={true}
              pageSize={5}
              enableEmptySections={true}
              //refreshControl={  <RefreshControl onRefresh={this._onRefresh.bind(this)} refreshing={this.state.refreshing} title="努力加载中..." />}
              onScroll={(e)=>this.onScroll(e)}
              renderFooter={this._renderFooter.bind(this)}
              renderScrollComponent={(props) => <PullRefreshScrollView onRefresh={(pullRefresh) => {this._onRefresh(pullRefresh)}} {...props} />}
              refreshText={this.state.pullRefreshText}
              refreshedText={this.state.pullRefreshText}
              refreshingText={this.state.pullRefreshText}
            />
            {this.state.showToTop?<BackToTop root={this} />:null}
          </View>
        }
        <Loading height={Util.size.height * 0.7} ref={ref => this.loading = ref} />
        <EAlert ref={ref => this.eAlert = ref} />
          {
              this.state.adInfos && this.props.type == 'investment' ?
                  <View style={projectListStyle.adEnter}>
                      <AdEnter navigation={this.props.navigation} data={this.state.adInfos} />
                  </View>
                  : null
          }
      </View>
    );
  }
}
