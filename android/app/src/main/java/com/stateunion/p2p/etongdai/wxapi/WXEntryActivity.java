/*
 * 官网地站:http://www.ShareSDK.cn
 * 技术支持QQ: 4006852216
 * 官方微信:ShareSDK   （如果发布新版本的话，我们将会第一时间通过微信将版本更新内容推送给您。如果使用过程中有任何问题，也可以通过微信与我们取得联系，我们将会在24小时内给予回复）
 *
 * Copyright (c) 2013年 ShareSDK.cn. All rights reserved.
 */

package com.stateunion.p2p.etongdai.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import com.stateunion.p2p.etongdai.MainApplication;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;

/**
 * 微信客户端回调activity示例
 */
public class WXEntryActivity extends Activity implements IWXAPIEventHandler {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ((MainApplication) getApplicationContext()).mWxApi.handleIntent(getIntent(), this);
        finish();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        ((MainApplication) getApplicationContext()).mWxApi.handleIntent(intent, this);
    }

    @Override
    public void onReq(BaseReq baseReq) {
    }

    @Override
    public void onResp(BaseResp baseResp) {
        String result;
        switch (baseResp.errCode) {
            case BaseResp.ErrCode.ERR_OK:
                setTitle("分享成功");
                result = "分享成功";//成功
                Toast.makeText(this, result, Toast.LENGTH_SHORT).show();

                break;
            case BaseResp.ErrCode.ERR_USER_CANCEL:
                result = "取消";//取消
                Toast.makeText(this, result, Toast.LENGTH_SHORT).show();

                break;
            case BaseResp.ErrCode.ERR_AUTH_DENIED:
                result = "微信拒绝";//被拒绝
                Toast.makeText(this, result, Toast.LENGTH_SHORT).show();

                break;
            default:
                result = "返回";//返回
                Toast.makeText(this, result, Toast.LENGTH_SHORT).show();
                break;
        }
    }

}
