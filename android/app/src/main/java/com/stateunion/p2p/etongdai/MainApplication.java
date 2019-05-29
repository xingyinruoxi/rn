package com.stateunion.p2p.etongdai;

import android.app.Application;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;

import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.beefe.picker.PickerViewPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.growingio.android.sdk.collection.Configuration;
import com.growingio.android.sdk.collection.GrowingIO;
import com.heng.wheel.WheelPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.networkbench.agent.impl.NBSAppAgent;
import com.stateunion.p2p.etongdai.contract.bean.ContractBean;
import com.stateunion.p2p.etongdai.contract.thread.ContractThread;
import com.stateunion.p2p.etongdai.react.ReactPackages;
import com.stateunion.p2p.etongdai.utils.Constant;
import com.stateunion.p2p.etongdai.utils.ErrorLog;
import com.stateunion.p2p.etongdai.utils.LogUtils;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import java.util.Arrays;
import java.util.List;

import cn.jpush.reactnativejpush.JPushPackage;
import cn.shuzilm.core.Main;

public class MainApplication extends Application implements ReactApplication, ErrorLog.ExeceptionHandler {

    private boolean SHUTDOWN_TOAST = true;
    private boolean SHUTDOWN_LOG = true;

    private List<ContractBean> mContractDataList;
    public IWXAPI mWxApi;

    private Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what) {
                case ContractThread.CONTRACT_SUCCESS:
                    mContractDataList = (List<ContractBean>) msg.obj;
                    break;
                case ContractThread.CONTRACT_FALSE:
                    LogUtils.e("read contract false!");
                    break;
            }
        }
    };

    public List<ContractBean> getContractList() {
        return mContractDataList;
    }

    public void setContractList(List<ContractBean> list) {
        this.mContractDataList = list;
    }

    private void initContractData() {
        new ContractThread(this, mHandler).start();
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.asList(
                    new MainReactPackage(),
                    new ReactNativeRestartPackage(),
                    new CodePush(getMetaStr("CODEPUSH_KEY"), getApplicationContext(), BuildConfig.DEBUG),
                    new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
                    new PickerViewPackage(),
                    new RNDeviceInfo(),
                    new ReactPackages(),
                    new WheelPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        /**
         * 运行时异常捕获,可防止发生运行时异常时进程不被杀死
         */
        ErrorLog.install(this);
        SoLoader.init(this, /* native exopackage */ false);
        init();
    }

    private void init() {

        final String channelName = getMetaStr("UMENG_CHANNEL");
        if (channelName != null) {
            /**
             * gio
             */
            GrowingIO.startWithConfiguration(this, new Configuration()
                    .useID()
                    .trackAllFragments()
                    .setChannel(channelName)
                    .setDebugMode(BuildConfig.DEBUG));
            /**
             * 数盟(DU DNA)
             */
            new Handler().post(new Runnable() {
                @Override
                public void run() {
                    try {
                        Main.go(getApplicationContext(), channelName, null);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        }


        /**
         * 初始化读取联系人信息
         */
        initContractData();

        /**
         * 微信注册
         */
        String pkg = getPackageName();
        if (pkg.equals("com.stateunion.p2p.etongdai")) {
            mWxApi = WXAPIFactory.createWXAPI(this, Constant.WECHAT_APPID);
        } else if (pkg.equals("com.stateunion.p2p.etongdai.vest")) {
            mWxApi = WXAPIFactory.createWXAPI(this, Constant.WECHAT_APPID_VEST);
        }

        /**
         *tingyun
         */
        initTingyun();
    }

    public void initTingyun() {
        NBSAppAgent nbsAppAgent = NBSAppAgent.setLicenseKey(Constant.TINGYUN_APPID).setRedirectHost("tyun.etongdai.com").withLocationServiceEnabled(true);
        nbsAppAgent.setHttpEnabled(true);
        nbsAppAgent.start(this.getApplicationContext());
    }

    public String getMetaStr(String metaStr) {
        ApplicationInfo appInfo = null;
        try {
            appInfo = getPackageManager()
                    .getApplicationInfo(getPackageName(),
                            PackageManager.GET_META_DATA);
            return appInfo.metaData.getString(metaStr);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return "";
    }

    @Override
    public void handlerException(final Thread thread, final Throwable throwable) {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                try {
                    throwable.printStackTrace();
                    LogUtils.e("exception~thread:", thread, " | throwable:", throwable);
                } catch (Throwable t) {
                    throwable.printStackTrace();
                }
            }
        });
    }
}
