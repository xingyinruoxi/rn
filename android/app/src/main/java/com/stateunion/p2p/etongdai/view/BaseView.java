package com.stateunion.p2p.etongdai.view;

import android.content.Context;
import android.util.AttributeSet;
import android.view.View;

/**
 * Created by admin on 2017/8/7.
 */

public class BaseView extends View{
    public BaseView(Context context) {
        super(context);
    }

    public BaseView(Context context,AttributeSet attrs){
        super(context, attrs);
    }

    public BaseView(Context context,AttributeSet attributeSet,int defStyle){
        super(context, attributeSet, defStyle);
    }

    public String getStr(int res){
        return getResources().getString(res);
    }
}
