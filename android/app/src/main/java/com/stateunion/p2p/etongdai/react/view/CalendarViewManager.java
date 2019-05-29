package com.stateunion.p2p.etongdai.react.view;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.gson.Gson;
import com.stateunion.p2p.etongdai.bean.CalenderBean;
import com.stateunion.p2p.etongdai.calendar.CalendarView;
import com.stateunion.p2p.etongdai.utils.LogUtils;

/**
 * Created by admin on 2017/8/2.
 */

public class CalendarViewManager extends SimpleViewManager<CalendarView> implements CalendarView.OnCalendarListener {

    private String REACT_NAME = "ETDInvestmentCalendarView";
    private CalendarView mCalendarView;

    @Override
    public String getName() {
        return REACT_NAME;
    }

    @Override
    protected CalendarView createViewInstance(ThemedReactContext reactContext) {
        return mCalendarView = new CalendarView(reactContext, this);
    }

    @ReactProp(name = "currentMonthData")
    public void currentMonthData(CalendarView view, String currentMonthData) {
        LogUtils.e("----currentMonthData:", currentMonthData);
        CalenderBean calenderBean = null;
        try {
            calenderBean = new Gson().fromJson(currentMonthData, CalenderBean.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (calenderBean == null || calenderBean.monthData == null) {
            return;
        }
        view.mMonthCalendarAdapter.setDefaultDate(calenderBean.monthData.dateList);
    }

    @Override
    public void onPagerChanged(CalendarView view, String date) {
        LogUtils.e("date:", date);
        WritableMap params = Arguments.createMap();
        params.putString("date", date);
        view.dispatchEvent("topChange", params);
    }

    @Override
    public void onClickDay(CalendarView view, String date) {
        LogUtils.e("date:", date);
        WritableMap params = Arguments.createMap();
        params.putString("onSelectDate", date);
        view.dispatchEvent("topChange", params);
    }

}
