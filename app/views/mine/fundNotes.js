/**
 * Created by liuzhenli on 2017/7/17.
 */
import React, { Component } from 'react';
import {
    Animated,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import {fundNotesPageStyle} from './../../styles/mine/fundNotesStyle';
var Storage = require('./../../commons/storage');
var StorageKey = require('./../../commons/storageKey');
var Fetch = require('./../../commons/fetch');
var Util = require('./../../commons/util');
import { Grow } from './../../commons/util';
import EAlert from './../components/ealert';
import RightIcon from './../components/rightIcon';
import Line from './../../commons/line';
import Loading from './../components/loading';
import MineHeader from '../components/commonHeader';
import FundNotesItem from './fundNotesItem';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DefaultTabBar from './../more/component/messageTabBar';
export default class FundNotes extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    constructor(props){
        super(props);
        this.state = {
            tabs:[{label: '全部',value:''},{label: '投资',value:'4'},{label: '充值',value:'1'},{label: '提现',value:'7'},{label: '回款',value:'6'},{label: '其他',value:'other'}]
        }
    };
    componentWillMount(){

    };
    renderTabBar = (name) =>{
        return(
            <DefaultTabBar activeTextColor='#025FCC'
                           inactiveTextColor='#9B9B9B'
                           tabStyle={fundNotesPageStyle.tabBarStyle}
                           textStyle={fundNotesPageStyle.tabBarTextStyle}
                           underlineStyle={fundNotesPageStyle.menuItem}
            />
        )
    };
    render() {
        return (
            <View style={fundNotesPageStyle.container}>
                <MineHeader title="资金记录" leftButton leftIcon goBack navigation={this.props.navigation} root={this}/>
                {
                    this.state.tabs ?
                        <ScrollableTabView
                            ref={(tabView) => { this.tabView = tabView; }}
                            style={fundNotesPageStyle.ScrollableTabBar}
                            removeClippedSubviews={false}
                            renderTabBar={this.renderTabBar}
                        >
                            {
                                this.state.tabs.map((item,index) => {
                                    return (
                                        <FundNotesItem tabLabel={item.label} root={this} value={item.value} key={index} navigation={this.props.navigation}/>
                                    )
                                })
                            }
                        </ScrollableTabView>
                        :
                        null
                }

                <EAlert ref={(ref) => this.eAlert = ref}/>
                <Loading ref={(ref) => this.loading = ref}/>
            </View>
        );
    }
}