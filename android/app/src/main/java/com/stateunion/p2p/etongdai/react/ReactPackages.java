package com.stateunion.p2p.etongdai.react;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.stateunion.p2p.etongdai.react.module.CalendarModule;
import com.stateunion.p2p.etongdai.react.module.DeviceModule;
import com.stateunion.p2p.etongdai.react.module.GrowingIOModule;
import com.stateunion.p2p.etongdai.react.module.SplashModule;
import com.stateunion.p2p.etongdai.react.module.UpdateModule;
import com.stateunion.p2p.etongdai.react.module.UserModule;
import com.stateunion.p2p.etongdai.react.module.WeChatModule;
import com.stateunion.p2p.etongdai.react.view.CalendarViewManager;
import com.stateunion.p2p.etongdai.react.view.ContractViewManager;
import com.stateunion.p2p.etongdai.react.view.UnlockViewManager;
import com.stateunion.p2p.etongdai.react.view.WebViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by admin on 2017/8/2.
 */

public class ReactPackages implements ReactPackage {


    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(new SplashModule(reactContext),
                new WeChatModule(reactContext),
                new UserModule(reactContext),
                new UpdateModule(reactContext),
                new CalendarModule(reactContext),
                new GrowingIOModule(reactContext),
                new DeviceModule(reactContext));
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(new ContractViewManager(),
                new CalendarViewManager(),
                new UnlockViewManager(),
                new WebViewManager());
    }
}
