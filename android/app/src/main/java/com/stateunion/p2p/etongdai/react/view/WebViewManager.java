package com.stateunion.p2p.etongdai.react.view;

import android.annotation.TargetApi;
import android.os.Build;
import android.text.TextUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.stateunion.p2p.etongdai.MainActivity;
import com.stateunion.p2p.etongdai.utils.LogUtils;
import com.stateunion.p2p.etongdai.view.CusWebView;

/**
 * Created by admin on 2017/9/29.
 */

@TargetApi(Build.VERSION_CODES.M)
public class WebViewManager extends SimpleViewManager<CusWebView> implements CusWebView.WebViewOnListener {

    private String REACT_NAME = "ETDWebView";
    private static final String HTML_ENCODING = "UTF-8";
    private static final String HTML_MIME_TYPE = "text/html; charset=utf-8";

    @Override
    public String getName() {
        return REACT_NAME;
    }

    @Override
    protected CusWebView createViewInstance(ThemedReactContext reactContext) {
        CusWebView cusWebView = new CusWebView(reactContext);
        cusWebView.init(MainActivity.getActivity(cusWebView));
        cusWebView.setOnScrollChange(this);
        return cusWebView;
    }

    @ReactProp(name = "url")
    public void loadUrl(CusWebView view, String url) {
        LogUtils.e("--------url:", url);
        if (TextUtils.isEmpty(url)) {
            return;
        }
        if (url.contains("http") || url.contains("https")) {
            view.loadUrl(url);
        } else {
            view.loadData(url, HTML_MIME_TYPE, HTML_ENCODING);
        }
    }

    @Override
    public void OnScrollChanger(CusWebView cusWebView, int scrollX, int scrollY, int oldScrollX, int oldScrollY) {
        LogUtils.e("-------------------cusWebView:", cusWebView, " | scrollX:", scrollX, " | scrollY:", scrollY, " | oldScrollX:", oldScrollX, " | oldScrollY:", oldScrollY);
        WritableMap params = Arguments.createMap();
        params.putInt("scrollX", scrollX);
        params.putInt("scrollY", scrollY);
        params.putInt("oldScrollX", oldScrollX);
        params.putInt("oldScrollY", oldScrollY);
        cusWebView.dispatchEvent("topChange", params);
    }
}
