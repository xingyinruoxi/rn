package com.stateunion.p2p.etongdai.react.base;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * Created by admin on 2017/8/2.
 */

public abstract class BaseModuls extends ReactContextBaseJavaModule{

    protected static ReactApplicationContext mContext;

    public BaseModuls(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    protected  static void dispatchEvent(String event, WritableMap eventData) {
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(event, eventData);
    }
}
