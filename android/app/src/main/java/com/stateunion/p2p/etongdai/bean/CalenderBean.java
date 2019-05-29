package com.stateunion.p2p.etongdai.bean;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

/**
 * Created by admin on 2017/8/3.
 */

public class CalenderBean implements Serializable{

    @SerializedName("time")
    public long time;

    @SerializedName("success")
    public boolean success;

    @SerializedName("body")
    public MonthData monthData;

    public class MonthData implements Serializable{

        @SerializedName("planSumYuanMonth")
        public String planSumYuanMonth;

        @SerializedName("actualSumYuanMonth")
        public String actualSumYuanMonth;

        @SerializedName("list")
        public String[] dateList;
    }
}
