package com.stateunion.p2p.etongdai;

import android.app.Activity;
import android.app.Dialog;

import com.stateunion.p2p.etongdai.utils.LogUtils;

import java.lang.ref.WeakReference;

import me.weyye.hipermission.HiPermission;
import me.weyye.hipermission.PermissionCallback;

/**
 * the boot page
 */
public class Splash {

    private static Dialog mSplashDialog;
    private static WeakReference<Activity> mActivity;

    /**
     * the splash is show
     * @param activity
     * @param fullScreen
     */
    public static void show(final Activity activity,final boolean fullScreen) {
        LogUtils.e("activity:",activity," | fullScreen");
        mActivity = new WeakReference<Activity>(activity);
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (!activity.isFinishing()) {

                    mSplashDialog = new Dialog(activity,fullScreen? R.style.SplashScreen_Fullscreen: R.style.SplashScreen_SplashTheme);
                    mSplashDialog.setContentView(R.layout.view_splash);
                    mSplashDialog.setCancelable(false);

                    if (!mSplashDialog.isShowing()) {
                        mSplashDialog.show();
                    }
                }
            }
        });
    }

    /**
     * this splash is show and default the fullscreen
     * @param activity
     */
    public static void show(final Activity activity) {
        HiPermission.create(activity).checkSinglePermission(android.Manifest.permission.SYSTEM_ALERT_WINDOW, new PermissionCallback() {
            @Override
            public void onClose() {
                LogUtils.e("onClose");
            }

            @Override
            public void onFinish() {
                LogUtils.e("onFinish");
            }

            @Override
            public void onDeny(String permission, int position) {
                LogUtils.e("onDeny~permission:",permission," | position:",position);
                hide(activity);
            }

            @Override
            public void onGuarantee(String permission, int position) {
                LogUtils.e("onGuarantee~permission:",permission," | position:",position);
                show(activity,true);
            }
        });
    }

    /**
     * this splash is hide
     * @param activity
     */
    public static void hide(Activity activity) {
        LogUtils.e("activity:",activity);
        activity = mActivity.get();
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (mSplashDialog != null && mSplashDialog.isShowing()) {
                    mSplashDialog.dismiss();
                }
            }
        });
    }
}
