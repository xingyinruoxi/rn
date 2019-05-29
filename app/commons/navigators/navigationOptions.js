/**
 * eTongDai React Native App
 * This define UI routers options information
 * Such as title, headerStyle, tabBarIcon and so on
 * @John
 */

import React from 'react';
import { Image,Text } from 'react-native';
import { tabNavigatorStyles } from './../../styles/common/navigationStyles';
const homePage = {
    //title: '首页',
    headerLeft: null,
    header: null,
    tabBarIcon: (obj) => {
        var url = obj.focused ? require('./../../imgs/home/active_home_icon.png') : require('./../../imgs/home/home_icon.png')
        return (
            <Image  style={tabNavigatorStyles.tabIcon} source={url}/>
        )
    },
    tabBarLabel: (obj) => {
        return (
            <Text allowFontScaling={false} style={[tabNavigatorStyles.label,obj.focused && tabNavigatorStyles.activeLabel]}>首页</Text>
        )

    }
};
const listPage = {
    header: null,
    title: '项目列表',
    tabBarIcon: (obj) => {
        var url = obj.focused ? require('./../../imgs/home/active_projectList_icon.png') : require('./../../imgs/home/projectList_icon.png')
        return (
            <Image style={tabNavigatorStyles.tabIcon} source={url}/>
        )
    },
    tabBarLabel: (obj) => {
        return (
            <Text allowFontScaling={false} style={[tabNavigatorStyles.label,obj.focused && tabNavigatorStyles.activeLabel]}>项目列表</Text>
        )

    }
};
const minePage = {
    header: null,
    title: '我的账户',
    tabBarIcon: (obj) => {
        var url = obj.focused ? require('./../../imgs/home/active_mine_icon.png') : require('./../../imgs/home/mine_icon.png')
        return (
            <Image style={tabNavigatorStyles.tabIcon} source={url}/>
        )
    },
    tabBarLabel: (obj) => {
        return (
            <Text allowFontScaling={false} style={[tabNavigatorStyles.label,obj.focused && tabNavigatorStyles.activeLabel]}>我的账户</Text>
        )

    }
};
const morePage = {
    title: '更多',
    header: null,
    tabBarIcon: (obj) => {
        var url = obj.focused ? require('./../../imgs/home/active_more_icon.png') : require('./../../imgs/home/more_icon.png')
        return (
            <Image style={tabNavigatorStyles.tabIcon} source={url}/>
        )
    },
    tabBarLabel: (obj) => {
        return (
            <Text allowFontScaling={false} style={[tabNavigatorStyles.label,obj.focused && tabNavigatorStyles.activeLabel]}>更多</Text>
        )

    }
};
module.exports = {
    get homePage(){return homePage},
    get listPage(){return listPage},
    get minePage(){return minePage},
    get morePage(){return morePage},
}