package com.stateunion.p2p.etongdai.contract.bean;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

/**
 * Created by admin on 2017/8/1.
 */

public class SmsInfoBean implements Serializable{

    @SerializedName("imgUrl")
    public String imgUrl;

    @SerializedName("title")
    public String title;

    @SerializedName("content")
    public String content;

    @SerializedName("pageUrl")
    public String pageUrl;

}
