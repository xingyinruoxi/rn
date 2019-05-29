package com.stateunion.p2p.etongdai.calendar;

import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.stateunion.p2p.etongdai.R;
import com.stateunion.p2p.etongdai.calendar.adapter.CalendarAdapter;
import com.stateunion.p2p.etongdai.calendar.adapter.MonthCalendarAdapter;
import com.stateunion.p2p.etongdai.calendar.view.CalendarViewPager;
import com.stateunion.p2p.etongdai.utils.DateUtils;
import com.stateunion.p2p.etongdai.utils.LogUtils;
import com.stateunion.p2p.etongdai.utils.Utils;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

/**
 * Created by admin on 2017/8/18.
 */

public class CalendarView extends LinearLayout implements CalendarAdapter.RefreshListener, View.OnClickListener {

    private ImageView calendarPreImg;
    private TextView calendarTxt;
    private ImageView calendarNextImg;
    private static CalendarViewPager viewPager;
    private List<View> views;
    private ArrayList<String> timeList = new ArrayList<>();

    public MonthCalendarAdapter mMonthCalendarAdapter;

    public static final int change2 = 91;
    public static final int pagerNext = 101;
    public static final int pagerLast = 102;
    public static final int CLICK_DAY = 103;
    private int currentItem = 0;
    private final int YEAR = 1;
    private final int MONTH = 2;

    private OnCalendarListener mOnCalendarListener;

    Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            LogUtils.e("what:", msg.what);
            if (msg.what == 90) {
                //do same thing
            } else if (msg.what == change2) {
            } else if (msg.what == pagerNext) {
                pagerNext();
            } else if (msg.what == pagerLast) {
                pagerLast();
            } else if (msg.what == CLICK_DAY && mOnCalendarListener != null) {
                mOnCalendarListener.onClickDay(CalendarView.this, msg.obj.toString());
            }
        }
    };

    public CalendarView(Context context, OnCalendarListener listener) {
        super(context);
        this.mOnCalendarListener = listener;
        initView();
    }

    public void initView() {
        View view = LayoutInflater.from(getContext()).inflate(R.layout.view_calendar, null);
        initCalendar(view);
        addView(view);
    }

    public void initCalendar(View view) {
        calendarPreImg = view.findViewById(R.id.calendarPreImg);
        calendarTxt = view.findViewById(R.id.calendarTxt);
        calendarNextImg = view.findViewById(R.id.calendarNextImg);
        calendarPreImg.setOnClickListener(this);
        calendarNextImg.setOnClickListener(this);
        viewPager = view.findViewById(R.id.calendar_viewpager);

        viewPager.setListener(this);

        //制造月视图所需view
        views = new ArrayList<>();
        LinearLayout layout = (LinearLayout) View.inflate(getContext(), R.layout.view_calendar_month, null);
        LinearLayout layout1 = (LinearLayout) View.inflate(getContext(), R.layout.view_calendar_month, null);
        LinearLayout layout2 = (LinearLayout) View.inflate(getContext(), R.layout.view_calendar_month, null);
        LinearLayout layout3 = (LinearLayout) View.inflate(getContext(), R.layout.view_calendar_month, null);
        views.add(layout);
        views.add(layout1);
        views.add(layout2);
        views.add(layout3);

        mMonthCalendarAdapter = new MonthCalendarAdapter(views, getContext(), timeList);
        mMonthCalendarAdapter.setHandler(mHandler);

        viewPager.setAdapter(mMonthCalendarAdapter);
        viewPager.setCurrentItem(1200, true);

        //如果是周日，就翻到下一页
        Calendar today = new GregorianCalendar();
        today.setTimeInMillis(System.currentTimeMillis());
        setMonth(today);
        viewPager.setOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
//                LogUtils.e("position", Integer.toString(position));
            }

            @Override
            public void onPageSelected(int position) {
                Calendar today = new GregorianCalendar();
                today.setTimeInMillis(System.currentTimeMillis());
                int month = mMonthCalendarAdapter.getCount() / 2 - position;
                today.add(Calendar.MONTH, -month);
                setMonth(today);
            }

            @Override
            public void onPageScrollStateChanged(int state) {
//                LogUtils.e("onPageScrollStateChanged", state);
            }
        });
    }

    private void setMonth(Calendar today) {
        if (today == null) return;
        int selectedMonth = today.get(MONTH) + 1;
        int selectedYear = today.get(YEAR);
        calendarTxt.setText(Utils.getChina(selectedMonth) + getResources().getString(R.string.month) + "  " + selectedYear);
        if (mOnCalendarListener != null) {
            String monthStr = selectedMonth + "";
            if (selectedMonth < 10) {
                monthStr = Utils.getBuild("0", selectedMonth);
            }
            mOnCalendarListener.onPagerChanged(CalendarView.this, Utils.getBuild(selectedYear, "-", monthStr));
        }
    }

    @Override
    public void refreshListener(final ViewPager viewPager) {
        currentItem = 0;
        mMonthCalendarAdapter.getTimeList(timeList);
        currentItem = getMonthCurrentItem();
        int odl = viewPager.getCurrentItem();
        viewPager.setCurrentItem(currentItem, false);
        if (Math.abs(odl - currentItem) <= 1) {
            mMonthCalendarAdapter.instantiateItem(viewPager, viewPager.getCurrentItem() - 1);

            mMonthCalendarAdapter.instantiateItem(viewPager, viewPager.getCurrentItem());

            mMonthCalendarAdapter.instantiateItem(viewPager, viewPager.getCurrentItem() + 1);
        }
        mMonthCalendarAdapter.notifyDataSetChanged();

    }

    private int getMonthCurrentItem() {
        Calendar today = new GregorianCalendar();
        today.setTimeInMillis(System.currentTimeMillis());
        String time = mMonthCalendarAdapter.getSelectTime();
        Date date = DateUtils.stringToDate(time);
        Calendar sele = new GregorianCalendar();
        sele.setTimeInMillis(date.getTime());
        int aa = sele.get(Calendar.MONTH) - today.get(Calendar.MONTH);
        return mMonthCalendarAdapter.getCount() / 2 + aa;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.calendarPreImg:
                pagerLast();
                break;
            case R.id.calendarNextImg:
                pagerNext();
                break;
        }
    }

    public void pagerNext() {
        if (viewPager != null) {
            viewPager.setCurrentItem(viewPager.getCurrentItem() + 1);
        }
    }

    public void pagerLast() {
        if (viewPager != null) {
            viewPager.setCurrentItem(viewPager.getCurrentItem() - 1);
        }
    }

    public static void setCurrDate() {
        if (viewPager != null)
            viewPager.setCurrentItem(1200, true);
        else
            LogUtils.e("viewPager:",viewPager);
    }

    private final Runnable mLayoutRunnable = new Runnable() {
        @Override
        public void run() {
            measure(MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };

    @Override
    public void requestLayout() {
        super.requestLayout();
        post(mLayoutRunnable);
    }

    public void dispatchEvent(String eventName, WritableMap eventData) {
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                eventName,
                eventData
        );
    }

    public interface OnCalendarListener {
        void onPagerChanged(CalendarView view, String date);

        void onClickDay(CalendarView view, String date);
    }
}
