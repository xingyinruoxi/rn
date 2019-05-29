package com.stateunion.p2p.etongdai.react.module;

import android.os.Build;

import com.facebook.react.bridge.ReactApplicationContext;
import com.stateunion.p2p.etongdai.react.base.BaseModuls;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Nullable;

/**
 * Created by etongdai on 2018/3/7.
 */

public class DeviceModule extends BaseModuls {

    private String REACT_NAME = "ETDDevice";

    public DeviceModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_NAME;
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        HashMap<String, Object> constants = new HashMap<String, Object>();
        constants.put("uuid", getUniqueID());
        return constants;
    }

    /**
     * API >=9:通过“Build.SERIAL”这个属性来保证ID的独一无二。API 9 以上的Android设备目前市场占有率在99.5%
     * API < 9:我们可以通过读取设备的ROM版本号、厂商名、CPU型号和其他硬件信息来组合出一串15位的号码
     *
     * @return
     */
    public String getUniqueID() {
        String serial = null;

        String m_szDevIDShort = "35" +
                Build.BOARD.length() % 10 + Build.BRAND.length() % 10 +

                Build.CPU_ABI.length() % 10 + Build.DEVICE.length() % 10 +

                Build.DISPLAY.length() % 10 + Build.HOST.length() % 10 +

                Build.ID.length() % 10 + Build.MANUFACTURER.length() % 10 +

                Build.MODEL.length() % 10 + Build.PRODUCT.length() % 10 +

                Build.TAGS.length() % 10 + Build.TYPE.length() % 10 +

                Build.USER.length() % 10; //13 位

        try {
            serial = android.os.Build.class.getField("SERIAL").get(null).toString();
            //API>=9 使用serial号
            return new UUID(m_szDevIDShort.hashCode(), serial.hashCode()).toString();
        } catch (Exception exception) {
            //serial需要一个初始化
            serial = "serial"; // 随便一个初始化
        }
        //使用硬件信息拼凑出来的15位号码
        return new UUID(m_szDevIDShort.hashCode(), serial.hashCode()).toString();
    }
}
