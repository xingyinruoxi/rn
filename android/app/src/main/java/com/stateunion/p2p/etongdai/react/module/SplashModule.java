package com.stateunion.p2p.etongdai.react.module;

import android.content.pm.PackageManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.stateunion.p2p.etongdai.MainApplication;
import com.stateunion.p2p.etongdai.Splash;
import com.stateunion.p2p.etongdai.react.base.BaseModuls;

/**
 * Created by admin on 2017/7/31.
 */

public class SplashModule extends BaseModuls {

    private String REACT_NAME = "Splash";

    public SplashModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_NAME;
    }

    @ReactMethod
    public void getEnvironment(Callback callback) {
        String versionName = "";
        try {
            versionName = mContext.getPackageManager().getPackageInfo(mContext.getPackageName(), 0).versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        String environment = ((MainApplication) mContext.getApplicationContext()).getMetaStr("ENVIRONMENT");
        callback.invoke(environment, versionName);
    }

    @ReactMethod
    public void show() {
        Splash.show(getCurrentActivity());
    }

    @ReactMethod
    public void hide() {
        Splash.hide(getCurrentActivity());
    }
}
