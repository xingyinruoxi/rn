/**
 * eTongDai React Native App
 * This is project config
 * Such as version number, api url and so on
 * @John
 */
import React from 'react';
import {
    NativeModules
} from 'react-native';

let mode = __DEV__ ? NativeModules.ETDGrowingIO.mode : 'production';
// const mode = 'production';
const channelId = "appstore"; //appstore,appsmalls
const urlConfig = {
    production: {
        ApiUrl: 'https://api.etongdai.com/service/', // this is online api server
        androidApiUrl: 'https://api.etongdai.com/service/', // this is local api server  http://10.10.2.114:7003/api/
        server: 'https://www.etongdai.com/',     // this is online h5 server
        activeServer: 'https://m.etongdai.com/',  // this is online activity server
        wxServer: 'https://www.h5.etongdai.com/',    // this is weChat activity server
    },
    preproduction: {
        // ApiUrl: 'https://api2.etongdai.com/service/', // this is local api server  http://10.10.2.114:7003/api/  https://api.cg.etongdai.org/V1/api/
        // androidApiUrl: 'http://api2.etongdai.com/service/', // this is local api server  http://10.10.2.114:7003/api/
        ApiUrl: 'https://api.nowpre.etongdai.org/service/', // this is local api server  http://10.10.2.114:7003/api/  https://api.cg.etongdai.org/V1/api/
        androidApiUrl: 'http://api.nowpre.etongdai.org/service/', // this is local api server  http://10.10.2.114:7003/api/
        server: 'https://www.nowpre.etongdai.org/',  // this is local h5 server
        activeServer: 'https://m.nowpre.etongdai.org/',
        wxServer: 'https://h5.rc.etongdai.org/',
    },
    stage3: {
        ApiUrl: 'http://api3.beta.etongdai.org/service/',
        androidApiUrl: 'http://api3.beta.etongdai.org/service/', // this is local api server  http://10.10.2.114:7003/api/
        // ApiUrl: 'https://api.etong.dai:9090/service/',
        // androidApiUrl: 'http://api.etong.dai:9090/service/',
        //androidApiUrl: 'http://api2.etongdai.com/seervice/', // this is local api server  http://10.10.2.114:7003/api/
        server: 'http://www3.beta.etongdai.org/',
        activeServer: 'http://m3.beta.etongdai.org/',
        wxServer: 'http://h3.beta.etongdai.org/',
    },
    stage2: {
        ApiUrl: 'https://api2.etongdai.com/service/',
        androidApiUrl: 'http://api2.etongdai.com/service/', // this is local api server  http://10.10.2.114:7003/api/
        //androidApiUrl: 'http://api2.etongdai.com/seervice/', // this is local api server  http://10.10.2.114:7003/api/
        server: 'http://test2.etongdai.com/',
        activeServer: 'https://m2.etongdai.com/',
        wxServer: 'http://h2.etongdai.com/',
    },
    stage1: {    //不上线的测试环境
        // ApiUrl: 'http://10.20.7.131:8080/service/',
        ApiUrl: 'https://api1.beta.etongdai.org/service/',
        server: 'http://www1.beta.etongdai.org/',
        activeServer: 'https://m1.beta.etongdai.org/',
        wxServer: 'http://h1.beta.etongdai.org/',
    }
};

const systemInfos = {
    customer_service_tel_num: "400-064-5156",   //客服电话
    risk_measurement_url: urlConfig[mode].activeServer + 'account/assessment?rct=true',   //我的---风险测评s
    registration_agreement_content_url: urlConfig[mode].server + "p2p/help/protocol/20170518/7686.html?rct=true", //注册协议
    risk_disclosure_url: urlConfig[mode].server + "p2p/help/risk/2017052710867.html?rct=true", //风险揭示书
    sign_in_url: mode == 'test' ? 'http://sandbox.dev.etongdai.org/apps/clockin?rct=true' : urlConfig[mode].activeServer + 'static/clockin?rct=true',  // 首页签到
    help_center_url: urlConfig[mode].activeServer + 'helpCenter/eGuide?u=1',   //更多--帮助中心
    about_us_url: urlConfig[mode].activeServer + 'aboutUs.html?rct=true',    //更多---关于我们
    online_webchat_url: mode == 'production' ? 'http://im.etongdai.com/webchat.html' : 'http://10.100.0.98/WebChatAPP/webchat.html',     //更多---在线客服
    invest_agreement_url: urlConfig[mode].activeServer + '02A--etongdaijiekuanxieyi.html?rct=true',     //出借协议
    transfer_agreement_url: urlConfig[mode].activeServer + '03--etongdaizhaiquanzhuanrangxieyi.html?rct=true',       //债权转让协议
    middle_agreement_url: urlConfig[mode].activeServer + '05--etongdaitouzirenjujian.html?rct=true',              //居间服务协议
    accredit_agreement_url: urlConfig[mode].activeServer + '02E--etongdaishouquanweituoshu.html?rct=true',        // 授权委托书
    e_signature_agreement_url: urlConfig[mode].activeServer + '02F--yonghushenqingquerenhan.html?rct=true',        // 电子签名数字证书用户申请确认函
    topUp_limit: urlConfig[mode].activeServer + 'payment/bankListPage',        // 电子签名数字证书用户申请确认函
    risk_letter_url: urlConfig[mode].wxServer + 'risk',                  //投资风险揭示书
    run_report_url: urlConfig[mode].activeServer + 'static/transfer-page/runReports.html', //运营报告,
    infomation_announce_url: urlConfig[mode].activeServer + 'static/protocol/informationDisclosure.html',
    develop_history_url: urlConfig[mode].activeServer + 'static/protocol/developmentProcess.html',
    safety_Guarantee: urlConfig[mode].activeServer + 'static/protocol/safetyGuaranteeNew.html',
};

const storeConfig = {
    appsmall: {
        ios: 'itms-apps://itunes.apple.com/app/id1146683974',
        android: 'market://details?id=com.creditease.creditlife'
    },
    appstore: {
        ios: 'itms-apps://itunes.apple.com/app/id888174458',
        // android: 'market://details?id=com.creditease.creditlife',
        // samsung: 'http://www.samsungapps.com/appquery/appDetail.as?appId=com.creditease.creditlife'
    }
};

const config = {
    appVersion: '3.0.14', //app
    appAndroidVersion: '3.0.0.14', //android app
    version: '4.0', //H5
    channelId,
    url: urlConfig[mode],
    appstore: storeConfig[channelId],
};
config.themesUrl = config.url.server + 'app-embed/v' + config.version + '/collection.html';
config.promotionUrl = config.url.server + 'app-embed/v' + config.version + '/promotion.html';
config.mode = mode;
config.systemInfos = systemInfos;
module.exports = config;

