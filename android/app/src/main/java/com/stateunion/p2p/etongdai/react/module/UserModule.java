package com.stateunion.p2p.etongdai.react.module;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.growingio.android.sdk.collection.GrowingIO;
import com.networkbench.agent.impl.NBSAppAgent;
import com.stateunion.p2p.etongdai.MainApplication;
import com.stateunion.p2p.etongdai.react.base.BaseModuls;
import com.stateunion.p2p.etongdai.utils.LogUtils;

/**
 * Created by admin on 2017/8/15.
 */

public class UserModule extends BaseModuls {

    private String REACT_NAME = "ETDThirdService";

    public UserModule(ReactApplicationContext reactContext) {
        super(reactContext);

    }

    @Override
    public String getName() {
        return REACT_NAME;
    }

    @ReactMethod
    public void setUserID(String userId) {
        LogUtils.e("userId:", userId);
        GrowingIO.getInstance().setCS1("userId", userId);//针对GrowingIO设置userId
        NBSAppAgent.setUserIdentifier(userId);//针对TingYun设置userId
    }

    @ReactMethod
    public void getFriendId(Callback callback) {
        callback.invoke(((MainApplication) mContext.getApplicationContext()).getMetaStr("FRIEND_ID"));
    }
}
