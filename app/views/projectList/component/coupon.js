/**
 * Created by glzc on 2017/12/22.
 */
import React,{Component} from 'react';
import {
    View
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MessageTabBar from './../../more/component/messageTabBar';
import HeaderBar from './../../../commons/headerBar';
import Util from './../../../commons/util';
import couponStyles from './../../../styles/projectList/couponStyles';
import RedEnvelope from './redEnvelope';
export default class Coupon extends Component{
    static navigationOptions = ({navigation}) => ({
        title: '选择优惠',
        header: null
    });
    constructor(props){
        super(props)
        this.state = {
            tabs: [{
                type: 0,
                name: '可用红包'
            },{
                type: 1,
                name: '可用加息券'
            }],
            page: this.props.navigation.state.params.type,
        }
    }
    back(data){
        let navigation = this.props.navigation;
        //navigation.state.params.checkedRedEnvelope(data, this.state.page);
        navigation.goBack();
    };
    _changeTab({i}){
        this.setState({
            page: i
        })
    }
    render(){
        return (
            <View style={couponStyles.container}>
                <HeaderBar
                    navigation={this.props.navigation}
                    leftCallback={this.back.bind(this,'')}
                    noLine
                    />
                <ScrollableTabView
                    tabBarUnderlineStyle={{height:0}}
                    tabBarActiveTextColor='#025fcc'
                    tabBarInactiveTextColor='#9b9b9b'
                    tabBarTextStyle={{fontSize:Util.commonFontSize(15)}}
                    renderTabBar={() => <MessageTabBar tabStyle={{paddingBottom: 0}} style={{height: Util.pixel*45,paddingTop: 0,borderWidth: 0}} isShowVerticalLine  backgroundColor="#ffffff" />}
                    removeClippedSubviews={false}
                    initialPage={this.props.navigation.state.params.type}
                    onChangeTab={this._changeTab.bind(this)}
                    >
                    {
                        this.state.tabs.map(v => <RedEnvelope tabLabel={v.name} key={v.type} type={v.type} navigation={this.props.navigation} />)
                    }
                </ScrollableTabView>
            </View>
        )
    }
}