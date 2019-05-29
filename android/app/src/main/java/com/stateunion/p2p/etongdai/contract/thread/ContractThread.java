package com.stateunion.p2p.etongdai.contract.thread;

import android.Manifest;
import android.content.Context;
import android.database.Cursor;
import android.os.Handler;
import android.os.Message;
import android.provider.ContactsContract;

import com.stateunion.p2p.etongdai.contract.bean.ContractBean;
import com.stateunion.p2p.etongdai.contract.utils.CharacterParser;
import com.stateunion.p2p.etongdai.contract.utils.PinyinComparator;
import com.stateunion.p2p.etongdai.utils.LogUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import me.weyye.hipermission.HiPermission;
import me.weyye.hipermission.PermissionCallback;

/**
 * Created by admin on 2017/8/7.
 */

public class ContractThread extends Thread implements Runnable {

    private Context mContext;
    private Handler mHandler;

    public static final int CONTRACT_SUCCESS = 1;
    public static final int CONTRACT_FALSE = -1;

    public ContractThread(Context context, Handler handler) {
        this.mContext = context;
        this.mHandler = handler;
    }

    @Override
    public void run() {
        super.run();
        final Message message = new Message();
        HiPermission.create(mContext).checkSinglePermission(Manifest.permission.READ_CONTACTS, new PermissionCallback() {
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
                LogUtils.e("permission:", permission, " | position:", position);
                message.what = -1;
                mHandler.sendMessage(message);
            }

            @Override
            public void onGuarantee(String permission, int position) {
                LogUtils.e("permission:", permission, " | position:", position);
                List<ContractBean> datas = getSortData(mContext);
                if (datas == null || datas.size() == 0) {
                    message.what = -1;
                } else {
                    message.what = 1;
                    message.obj = datas;
                }
                mHandler.sendMessage(message);
            }
        });

    }

    public List<ContractBean> getSortData(Context context) {
        Map<String, String> callRecords = getAllCallRecords(context);
        List<ContractBean> sourceDateList = turnToSortMode(callRecords);
        Collections.sort(sourceDateList, new PinyinComparator());
        return sourceDateList;
    }

    private List<ContractBean> turnToSortMode(Map<String, String> callRecords) {
        List<ContractBean> list = new ArrayList<>();
        for (Map.Entry<String, String> en : callRecords.entrySet()) {
            if (en.getKey() == null) {
                continue;
            }
            ContractBean sortModel = new ContractBean();
            sortModel.isSelected = false;
            sortModel.name = en.getKey();
            sortModel.phoneNum = en.getValue();
            String pinyin = CharacterParser.getInstance().getSelling(en.getKey());
            String sortString = pinyin.substring(0, 1).toUpperCase();
            if (sortString.matches("[A-Z]")) {
                sortModel.sortLetters = sortString.toUpperCase();
            } else {
                sortModel.sortLetters = ("#");
            }
            list.add(sortModel);
        }
        return list;
    }

    public Map<String, String> getAllCallRecords(Context context) {
        Map<String, String> temp = new HashMap<String, String>();
        Cursor c = null;
        try {
            c = context.getContentResolver().query(
                    ContactsContract.Contacts.CONTENT_URI,
                    null,
                    null,
                    null,
                    ContactsContract.Contacts.DISPLAY_NAME
                            + " COLLATE LOCALIZED ASC");
        } catch (Exception e) {
            LogUtils.e("e:", e);
            return temp;
        }
        if (c != null && c.moveToFirst()) {
            do {

                String contactId = c.getString(c
                        .getColumnIndex(ContactsContract.Contacts._ID));

                String name = c
                        .getString(c
                                .getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME));

                int phoneCount = c
                        .getInt(c
                                .getColumnIndex(ContactsContract.Contacts.HAS_PHONE_NUMBER));
                String number = null;
                if (phoneCount > 0) {
                    Cursor phones = null;
                    try {
                        phones = context.getContentResolver().query(
                                ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                                null,
                                ContactsContract.CommonDataKinds.Phone.CONTACT_ID
                                        + " = " + contactId, null, null);
                        if (phones.moveToFirst()) {
                            number = phones
                                    .getString(phones
                                            .getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER));
                        }
                    } catch (Exception e) {
                        if (phones != null) {
                            phones.close();
                            phones = null;
                        }
                        e.printStackTrace();
                    }
                    if (phones != null) {
                        phones.close();
                    }
                }
                temp.put(name, number);
            } while (c.moveToNext());
        }
        if (c != null) {
            c.close();
        }
        return temp;
    }

}
