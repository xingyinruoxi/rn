package com.stateunion.p2p.etongdai.contract.adapter;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Message;
import android.provider.Settings;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.TextView;
import android.widget.Toast;

import com.stateunion.p2p.etongdai.R;
import com.stateunion.p2p.etongdai.adapter.SimpleAdapter;
import com.stateunion.p2p.etongdai.contract.bean.ContractBean;
import com.stateunion.p2p.etongdai.contract.thread.ContractThread;
import com.stateunion.p2p.etongdai.utils.LogUtils;

import java.util.List;

/**
 * Created by admin on 2017/8/7.
 */

public class ContractAdapter extends SimpleAdapter<ContractBean> {

    private Context mContext;
    private List<ContractBean> mDataList;


    public ContractAdapter(Context context,List<ContractBean> dataList) {
        super();
        this.mContext = context;
        this.mDataList = dataList;

    }

    @Override
    public View getView(final int position, View view, ViewGroup arg2) {
        final ViewHolder viewHolder;
        final ContractBean mContent = getItem(position);
        if (view == null) {
            viewHolder = new ViewHolder();
            view = LayoutInflater.from(mContext).inflate(R.layout.view_contract_item, null);
            viewHolder.tvTitle = view.findViewById(R.id.title);
            viewHolder.tvLetter = view.findViewById(R.id.catalog);
            viewHolder.ck = view.findViewById(R.id.icon);
            viewHolder.num = view.findViewById(R.id.num);
            viewHolder.ck.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                    int position = (int) buttonView.getTag();
                    getItem(position).isSelected = isChecked;
                }
            });
            view.setTag(viewHolder);
        } else {
            viewHolder = (ViewHolder) view.getTag();
        }
        viewHolder.ck.setTag(position);
        int section = getSectionForPosition(position);
        if (position == getPositionForSection(section)) {
            viewHolder.tvLetter.setVisibility(View.VISIBLE);
            viewHolder.tvLetter.setText(mContent.sortLetters);
        } else {
            viewHolder.tvLetter.setVisibility(View.GONE);
        }

        viewHolder.ck.setChecked(getItem(position).isSelected);
        viewHolder.ck.setChecked(getItem(position).isSelected);
        viewHolder.tvTitle.setText(getItem(position).name);
        viewHolder.num.setText(getItem(position).phoneNum);
        return view;

    }

    public void initData(final OnReadConteactListener listener) {
        if (mContext == null || listener == null){
            return;
        }
        setList(mDataList);
        listener.onReadResult(true, mDataList);
    }

    public void showInstalledAppDetails(Context context, String packageName) {
        Intent intent = new Intent();
        final int apiLevel = Build.VERSION.SDK_INT;
        if (apiLevel >= 9) { // 2.3（ApiLevel 9）以上，使用SDK提供的接口
            intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            Uri uri = Uri.fromParts("package", packageName, null);
            intent.setData(uri);
        } else { // 2.3以下，使用非公开的接口（查看InstalledAppDetails源码）
            // 2.2和2.1中，InstalledAppDetails使用的APP_PKG_NAME不同。
            final String appPkgName = (apiLevel == 8 ? "pkg"
                    : "com.android.settings.ApplicationPkgName");
            intent.setAction(Intent.ACTION_VIEW);
            intent.setClassName("com.android.settings",
                    "com.android.settings.InstalledAppDetails");
            intent.putExtra(appPkgName, packageName);
        }
        context.startActivity(intent);

    }

    public void selectedAll(CheckBox checkBox, TextView selectedState) {
        if (checkBox == null || selectedState == null) {
            return;
        }
        for (int i = 0; i < getCount(); i++) {
            getItem(i).isSelected = checkBox.isChecked();
        }
        if (checkBox.isChecked()) {
            selectedState.setText(getCount() + "/" + getCount());
        } else {
            selectedState.setText(0 + "/" + getCount());
        }
        notifyDataSetChanged();
    }

    public int getSelectedCount() {
        int selectedNubs = 0;
        for (ContractBean sortModel : getList()) {
            if (sortModel.isSelected) {
                selectedNubs++;
            }
        }
        return selectedNubs;
    }

    public void sendSms(String msg) {
        if (mContext == null) {
            return;
        }
        if (getSelectedCount() != 0) {
            String toNumbers = "";
            for (ContractBean s : getList()) {
                if (s.isSelected) {
                    toNumbers = toNumbers + s.phoneNum + ";";
                }
            }
            toNumbers = toNumbers.substring(0, toNumbers.length() - 1);
            Uri sendSmsTo = Uri.parse("smsto:" + toNumbers);
            Intent intent = new Intent(
                    Intent.ACTION_SENDTO, sendSmsTo);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.putExtra("sms_body", msg);
            mContext.startActivity(intent);
        } else {
            Toast.makeText(mContext, mContext.getResources().getString(R.string.persion_no), Toast.LENGTH_SHORT).show();
        }
    }

    public final class ViewHolder {
        public TextView tvLetter;
        public TextView tvTitle;
        public CheckBox ck;
        public TextView num;
    }

    public int getSectionForPosition(int position) {
        return getItem(position).sortLetters.charAt(0);
    }

    public int getPositionForSection(int section) {
        for (int i = 0; i < getCount(); i++) {
            String sortStr = getItem(i).sortLetters;
            char firstChar = sortStr.toUpperCase().charAt(0);
            if (firstChar == section) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 提取英文的首字母，非英文字母用#代替。
     *
     * @param str
     * @return
     */
    private String getAlpha(String str) {
        String sortStr = str.trim().substring(0, 1).toUpperCase();
        // 正则表达式，判断首字母是否是英文字母
        if (sortStr.matches("[A-Z]")) {
            return sortStr;
        } else {
            return "#";
        }
    }

    public interface OnReadConteactListener {
        void onReadResult(boolean isSuccess, List<ContractBean> dataList);
    }
}
