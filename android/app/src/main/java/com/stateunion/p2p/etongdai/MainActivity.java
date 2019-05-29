package com.stateunion.p2p.etongdai;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.RequiresApi;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.ReactActivity;
import com.stateunion.p2p.etongdai.calendar.CalendarView;
import com.stateunion.p2p.etongdai.update.UpdateService;
import com.stateunion.p2p.etongdai.utils.Constant;
import com.stateunion.p2p.etongdai.utils.ImageFilePath;
import com.stateunion.p2p.etongdai.utils.LogUtils;
import com.stateunion.p2p.etongdai.view.CusWebView;

import cn.jpush.android.api.JPushInterface;
public class MainActivity extends ReactActivity {

    public static Activity mActivity;
    private CalendarReceiver mCalendarReceiver;

    public static float deny;

    public static CusWebView mCusWebView;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "eTongDai";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Splash.show(this);
        super.onCreate(savedInstanceState);
        mActivity = this;
        ((MainApplication)getApplication()).initTingyun();
        registReceiver();

        JPushInterface.init(this);
        deny = getResources().getDisplayMetrics().density;
    }

    public static Activity getActivity(CusWebView cusWebView){
        mCusWebView = cusWebView;
        return mActivity;
    }

    @Override
    protected void onDestroy() {
        unRegisterReceiver();
        super.onDestroy();

    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
    }
    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
    }

    private void registReceiver(){
        if(mCalendarReceiver == null){
            mCalendarReceiver = new CalendarReceiver();
        }
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(Constant.ACTION_CALENDAR_MONTH);
        this.registerReceiver(mCalendarReceiver,intentFilter);
    }

    private void unRegisterReceiver(){
        if(mCalendarReceiver != null){
            unregisterReceiver(mCalendarReceiver);
        }
    }

    class CalendarReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            CalendarView.setCurrDate();
        }
    }

    @Override
    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (mCusWebView != null && requestCode == CusWebView.FILECHOOSER_RESULTCODE) {
            if (null == mCusWebView.mUploadMessage) {
                return;
            }
            Uri result = data == null || resultCode != RESULT_OK ? null
                    : data.getData();
            if (result != null) {
                String imagePath = ImageFilePath.getPath(this, result);
                if (!TextUtils.isEmpty(imagePath)) {
                    result = Uri.parse("file:///" + imagePath);
                }
            }
            mCusWebView.mUploadMessage.onReceiveValue(result);
            mCusWebView.mUploadMessage = null;
        } else if (mCusWebView != null && requestCode == CusWebView.INPUT_FILE_REQUEST_CODE && mCusWebView.mFilePathCallback != null) {
            // 5.0的回调
            Uri[] results = null;

            // Check that the response is a good one
            if (resultCode == Activity.RESULT_OK) {
                if (data == null) {
                    // If there is not data, then we may have taken a photo
                    if (mCusWebView.mCameraPhotoPath != null) {
                        LogUtils.d("camera_photo_path",mCusWebView.mCameraPhotoPath);
                        results = new Uri[]{Uri.parse(mCusWebView.mCameraPhotoPath)};
                    }
                } else {
                    String dataString = data.getDataString();
                    LogUtils.d("camera_dataString", dataString);
                    if (dataString != null) {
                        results = new Uri[]{Uri.parse(dataString)};
                    }
                }
            }

            mCusWebView.mFilePathCallback.onReceiveValue(results);
            mCusWebView.mFilePathCallback = null;
        } else {
            super.onActivityResult(requestCode, resultCode, data);
            return;
        }
    }
}
