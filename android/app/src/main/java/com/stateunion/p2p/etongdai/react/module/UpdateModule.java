package com.stateunion.p2p.etongdai.react.module;

import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.stateunion.p2p.etongdai.react.base.BaseModuls;
import com.stateunion.p2p.etongdai.update.UpdateService;

/**
 * Created by admin on 2017/9/4.
 */

public class UpdateModule extends BaseModuls{

    private String REACT_NAME = "ETDUpdateModule";

    public UpdateModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_NAME;
    }


    @ReactMethod
    public void startDownload(String downloadUrl) {
        Context context = getReactApplicationContext();
        Intent intent = new Intent(context, UpdateService.class);
        intent.putExtra(UpdateService.ARG_DOWNLOAD_URL, downloadUrl);

        //Start the update service,
        context.startService(intent);
    }
}
