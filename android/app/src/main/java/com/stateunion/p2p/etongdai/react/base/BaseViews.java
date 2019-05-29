package com.stateunion.p2p.etongdai.react.base;

import android.view.View;
import android.widget.RelativeLayout;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by admin on 2017/8/2.
 */

public abstract class BaseViews<T extends View> extends SimpleViewManager<View> {

    private ReactContext mContext;

    public BaseViews(ReactContext context) {
        this.mContext = context;
    }

    public void dispatchEvent(View view, String eventName, WritableMap eventData) {
        mContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                view.getId(),
                eventName,
                eventData
        );
    }
}
