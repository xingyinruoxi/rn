package com.stateunion.p2p.etongdai.react.module;

import android.text.TextUtils;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeMap;
import com.growingio.android.sdk.collection.GrowingIO;
import com.stateunion.p2p.etongdai.react.base.BaseModuls;
import com.stateunion.p2p.etongdai.utils.SharedPrefsUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by admin on 2017/10/20.
 */

public class GrowingIOModule extends BaseModuls {

    private String REACT_NAME = "ETDGrowingIO";
    private String GROWINGIO_KEY = "storyKey";

    public GrowingIOModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_NAME;
    }

    @ReactMethod
    public void track(String eventName, ReadableMap map) {
        JSONObject props = new JSONObject();
        if (map != null) {
            ReadableNativeMap nativeMap = (ReadableNativeMap) map;
            HashMap<String, Object> hashMap = nativeMap.toHashMap();
            Iterator iterator = hashMap.entrySet().iterator();
            while (iterator.hasNext()) {
                Map.Entry entry = (Map.Entry) iterator.next();
                try {
                    props.put((String) entry.getKey(), entry.getKey());
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        GrowingIO.getInstance().track(eventName, props);
    }

    @ReactMethod
    public void setCS1Value(String key, String value) {
        if (!TextUtils.isEmpty(key) && !TextUtils.isEmpty(value)) {
            GrowingIO.getInstance().setCS1(key, value);
        }
    }

    @ReactMethod
    public void setCS2Value(String key, String value) {
        if (!TextUtils.isEmpty(key) && !TextUtils.isEmpty(value)) {
            GrowingIO.getInstance().setCS2(key, value);
        }
    }

    @ReactMethod
    public void setCS3Value(String key, String value) {
        if (!TextUtils.isEmpty(key) && !TextUtils.isEmpty(value)) {
            GrowingIO.getInstance().setCS3(key, value);
        }
    }

    @ReactMethod
    public void setCS4Value(String key, String value) {
        if (!TextUtils.isEmpty(key) && !TextUtils.isEmpty(value)) {
            GrowingIO.getInstance().setCS4(key, value);
        }
    }

    @ReactMethod
    public void setCS5Value(String key, String value) {
        if (!TextUtils.isEmpty(key) && !TextUtils.isEmpty(value)) {
            GrowingIO.getInstance().setCS5(key, value);
        }
    }

    @ReactMethod
    public void setCacheString(String value) {
        if (!TextUtils.isEmpty(value)) {
            SharedPrefsUtils.putValue(mContext, GROWINGIO_KEY, value);
        }
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        HashMap<String, Object> constants = new HashMap<String, Object>();
        String value = SharedPrefsUtils.getValue(mContext, GROWINGIO_KEY, "production");
        constants.put("mode", value);
        return constants;
    }

    @ReactMethod
    public void getDeviceId(Callback callback) {
        callback.invoke(GrowingIO.getInstance().getDeviceId());
    }

    @ReactMethod
    public void getSessionId(Callback callback) {
        callback.invoke(GrowingIO.getInstance().getSessionId());
    }

}

