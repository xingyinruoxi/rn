package com.stateunion.p2p.etongdai.react.module;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.stateunion.p2p.etongdai.react.base.BaseModuls;
import com.stateunion.p2p.etongdai.utils.Constant;
import com.stateunion.p2p.etongdai.utils.LogUtils;

/**
 * Created by admin on 2017/8/21.
 */

public class CalendarModule extends BaseModuls {

    private String REACT_NAME = "ETDInvestmentCalendarAndroidView";

    public CalendarModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_NAME;
    }
    @ReactMethod
    public void changeDisplayMonth(String date) {
        LogUtils.e("date:", date);
        mContext.sendBroadcast(new Intent(Constant.ACTION_CALENDAR_MONTH));
    }
}
