package com.stateunion.p2p.etongdai.utils;

import android.annotation.SuppressLint;
import android.content.Context;
import android.support.annotation.NonNull;
import android.text.TextUtils;
import android.view.View.MeasureSpec;

import java.math.BigDecimal;
import java.util.Hashtable;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by admin on 2017/8/2.
 */

public final class Utils {

    @SuppressLint("StaticFieldLeak")
    private static Context context;

    public static Map<Integer,String> months;

    static {
        months = new Hashtable<>();
        months.put(1, "一");
        months.put(2, "二");
        months.put(3, "三");
        months.put(4, "四");
        months.put(5, "五");
        months.put(6, "六");
        months.put(7, "七");
        months.put(8, "八");
        months.put(9, "九");
        months.put(10, "十");
        months.put(11, "十一");
        months.put(12, "十二");
    }

    private Utils() {
        throw new UnsupportedOperationException("u can't instantiate me...");
    }

    /**
     * 初始化工具类
     *
     * @param context 上下文
     */
    public static void init(@NonNull final Context context) {
        Utils.context = context.getApplicationContext();
    }

    /**
     * 获取ApplicationContext
     *
     * @return ApplicationContext
     */
    public static Context getContext() {
        if (context != null) {
            return context;
        }
        throw new NullPointerException("u should init first");
    }

    public static int getSize(int SizeInfoMeasureSpec,int limitSize){

        int mode = MeasureSpec.getMode(SizeInfoMeasureSpec);
        int size = limitSize;
        switch(mode){
            case MeasureSpec.EXACTLY:{
                size = MeasureSpec.getSize(SizeInfoMeasureSpec);
            }break;
            case MeasureSpec.AT_MOST:{
                size = Math.min(size,MeasureSpec.getSize(SizeInfoMeasureSpec));
            }break;
            default:{
                size = limitSize;
            }break;
        }
        return size;
    }

    public static int dip2px(Context context, float dpValue) {

        float scale = context.getResources().getDisplayMetrics().density;

        return (int)(dpValue*scale+0.5f);

    }
    public static int px2dip(Context context,float pxValue) {

        float scale = context.getResources().getDisplayMetrics().density;
        return (int)(pxValue/scale+0.5f);

    }

    public static String getBuild(Object... params){
        StringBuilder stringBuilder = new StringBuilder();
        for(Object str:params){
            stringBuilder.append(str);
        }
        return stringBuilder.toString();
    }

    public static String getChina(int month){
        return months.get(month);
    }

    public static String getDecimalFormat(String str){
        if(TextUtils.isEmpty(str)){
            return "0.00";
        }
        BigDecimal bigDecimal = new BigDecimal(str);
        bigDecimal = bigDecimal.setScale(2,BigDecimal.ROUND_HALF_UP);
        return bigDecimal.toString();
    }
}
