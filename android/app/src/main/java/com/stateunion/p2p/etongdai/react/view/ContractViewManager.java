package com.stateunion.p2p.etongdai.react.view;

import android.text.TextUtils;
import android.view.View;

import com.stateunion.p2p.etongdai.contract.ContractView;
import com.stateunion.p2p.etongdai.contract.bean.SmsInfoBean;
import com.stateunion.p2p.etongdai.utils.LogUtils;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.gson.Gson;

/**
 * Created by admin on 2017/7/31.
 * 需要重写
 */

public class ContractViewManager extends SimpleViewManager<View> {

    private String REACT_NAME = "ETDContactsSelectView";

    private ContractView mContractView;

    @Override
    public String getName() {
        return REACT_NAME;
    }

    @Override
    protected View createViewInstance(ThemedReactContext reactContext) {
        return mContractView = new ContractView(reactContext);
    }

    @ReactProp(name = "shareInfos")
    public void sendMsg(View view, String msg) {
        LogUtils.e("msg:",msg);
        if (!TextUtils.isEmpty(msg)) {
            try {
                SmsInfoBean smsInfoBean = new Gson().fromJson(msg, SmsInfoBean.class);
                StringBuilder stringBuilder = new StringBuilder();
                stringBuilder.append(smsInfoBean.title)
                        .append(smsInfoBean.content)
                        .append(smsInfoBean.pageUrl);
                mContractView.setMsg(stringBuilder.toString());
            } catch (Exception e) {
                e.printStackTrace();
                LogUtils.e("e:",e.getMessage());
            }
        }
    }

}
