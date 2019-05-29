package com.stateunion.p2p.etongdai.react.module;

import android.graphics.Bitmap;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.gson.Gson;
import com.stateunion.p2p.etongdai.MainApplication;
import com.stateunion.p2p.etongdai.contract.bean.SmsInfoBean;
import com.stateunion.p2p.etongdai.utils.Constant;
import com.stateunion.p2p.etongdai.utils.ImgUtils;
import com.stateunion.p2p.etongdai.utils.LogUtils;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.openapi.IWXAPI;

/**
 * Created by admin on 2017/8/8.
 */

public class WeChatModule extends ReactContextBaseJavaModule {

    private String REACT_NAME = "ETDWechatManager";
    private IWXAPI mWxApi;

    private final static String NOT_REGISTERED = "registerApp required.";
    private final static String INVOKE_FAILED = "WeChat API invoke returns false.";
    private final static String INVALID_ARGUMENT = "invalid argument.";

    public WeChatModule(ReactApplicationContext context) {
        super(context);
        mWxApi = ((MainApplication) context.getApplicationContext()).mWxApi;
    }

    @Override
    public String getName() {
        return REACT_NAME;
    }

    @ReactMethod
    public void inviteWechatFriend(final String scene, String msg) {
        LogUtils.e("scene:", scene, " | msg:", msg);
        SmsInfoBean smsInfoBean = null;
        if (TextUtils.isEmpty(scene) || TextUtils.isEmpty(msg)) {
            return;
        }
        try {
            smsInfoBean = new Gson().fromJson(msg, SmsInfoBean.class);
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append(smsInfoBean.title)
                    .append(smsInfoBean.content)
                    .append(smsInfoBean.pageUrl);
        } catch (Exception e) {
            e.printStackTrace();
            LogUtils.e("e:", e.getMessage());
        }
        if (smsInfoBean == null) {
            return;
        }
        final SmsInfoBean finalSmsInfoBean = smsInfoBean;
        new ImgUtils(smsInfoBean.imgUrl, new Handler() {
            @Override
            public void handleMessage(Message msg) {
                super.handleMessage(msg);
                Bitmap bitmap = null;
                switch (msg.what) {
                    case Constant.SUCCESS:
                        bitmap = (Bitmap) msg.obj;
                        break;
                    case Constant.FALSE:
                        LogUtils.e("img~false:");
                        break;
                }
                wxScene(Integer.parseInt(scene), finalSmsInfoBean.pageUrl, finalSmsInfoBean.title, finalSmsInfoBean.content, bitmap);
            }
        }).start();
    }

    @ReactMethod
    public void isWXAppInstalled(Callback callback) {
        if (mWxApi == null) {
            callback.invoke(NOT_REGISTERED);
            return;
        }
        callback.invoke(mWxApi.isWXAppInstalled());
    }

    @ReactMethod
    public void isWXAppSupportApi(Callback callback) {
        if (mWxApi == null) {
            callback.invoke(NOT_REGISTERED);
            return;
        }
        callback.invoke(mWxApi.isWXAppSupportAPI());
    }

    @ReactMethod
    public void openWXApp(Callback callback) {
        if (mWxApi == null) {
            callback.invoke(NOT_REGISTERED);
            return;
        }
        callback.invoke(mWxApi.openWXApp());
    }

    public void wxScene(int scene, String url, String title, String description, Bitmap bitmap) {
        WXWebpageObject webpage = new WXWebpageObject();
        webpage.webpageUrl = url;
        WXMediaMessage msg = new WXMediaMessage(webpage);
        msg.title = title;
        msg.description = description;
        msg.setThumbImage(bitmap);
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("webpage");
        req.message = msg;
        req.scene = scene;
        mWxApi.sendReq(req);
    }

    /**
     * 生成唯一ID
     *
     * @param type
     * @return
     */
    private String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }
}
