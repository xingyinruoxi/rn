package com.stateunion.p2p.etongdai.react.view;

import android.view.View;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.stateunion.p2p.etongdai.MainActivity;
import com.stateunion.p2p.etongdai.view.UnLockView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.LinkedHashSet;

/**
 * Created by admin on 2017/8/3.
 */

public class UnlockViewManager extends SimpleViewManager<UnLockView> implements UnLockView.OnGestureDoneListener {

    private String REACT_NAME = "ETDGestureUnlockView";

    @Override
    public String getName() {
        return REACT_NAME;
    }

    @Override
    protected UnLockView createViewInstance(ThemedReactContext reactContext) {
        UnLockView unLockView = new UnLockView(reactContext);
        unLockView.setOnGestureDoneListener(this);
        float density = MainActivity.deny;
        if(density < 1.5){
            unLockView.setCircles(10);
        }else if(density >= 1.5 && density < 2.0){
            unLockView.setCircles(15);
        }else if(density >= 2.0 && density < 2.5){
            unLockView.setCircles(20);
        }else if(density >= 2.5 && density < 3.0){
            unLockView.setCircles(25);
        }else if(density >= 3.0 && density <= 3.5){
            unLockView.setCircles(30);
        }else{
            unLockView.setCircles(35);
        }
        return unLockView;
    }
    @Override
    public void inputOK(UnLockView view, String psw) {
        WritableMap params = Arguments.createMap();
        params.putString("onGestureUnlockFinished", psw);
        view.dispatchEvent("topChange", params);
    }

    @Override
    public boolean isValidGesture(int pointCount) {
        return true;
    }

//    @ReactProp(name = "circleRadius")
//    public void circleRadius(UnLockView view,int smallRadius,int bigRadius){
//        view.setCircles(smallRadius,bigRadius);
//    }
}
