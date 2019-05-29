package com.stateunion.p2p.etongdai.contract;

import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;

import com.stateunion.p2p.etongdai.MainApplication;
import com.stateunion.p2p.etongdai.R;
import com.stateunion.p2p.etongdai.contract.adapter.ContractAdapter;
import com.stateunion.p2p.etongdai.contract.bean.ContractBean;
import com.stateunion.p2p.etongdai.contract.thread.ContractThread;
import com.stateunion.p2p.etongdai.contract.utils.CharacterParser;
import com.stateunion.p2p.etongdai.contract.utils.PinyinComparator;
import com.stateunion.p2p.etongdai.view.SideBarView;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by admin on 2017/8/7.
 */

public class ContractView extends LinearLayout implements View.OnClickListener, AdapterView.OnItemClickListener, SideBarView.OnTouchingLetterChangedListener, ContractAdapter.OnReadConteactListener {

    private ListView sortListView;
    private TextView mTips;
    private ContractAdapter adapter;

    private CharacterParser characterParser;

    private SideBarView mSideBar;
    private PinyinComparator pinyinComparator;
    private CheckBox mSelectedAll;
    private TextView mSelectedState;
    private LinearLayout mSmsLoadingLayout;
    private ImageView mSmsLoadingImg;
    private TextView mSmsLoadingTxt;

    private LinearLayout mReadPermissionTipsL;
    private TextView mReadPermissionTipsTxt;
    private Button mReadPermissionTipBtn;

    private String mMsg;

    private List<ContractBean> mDataList;

    public ContractView(Context context) {
        super(context);
        mDataList = ((MainApplication) getContext().getApplicationContext()).getContractList();
        initView();
    }

    public void initView() {
        View view = LayoutInflater.from(getContext()).inflate(R.layout.view_contract, null);
        mSideBar = view.findViewById(R.id.sidrbar);
        mTips = view.findViewById(R.id.tips);
        sortListView = view.findViewById(R.id.country_lvcountry);
        mSelectedAll = view.findViewById(R.id.all_selsect);
        (view.findViewById(R.id.sms_invitation)).setOnClickListener(this);
        mSelectedState = view.findViewById(R.id.select_state);
        mSmsLoadingLayout = view.findViewById(R.id.sms_loading_layout);
        mSmsLoadingImg = view.findViewById(R.id.sms_loading_img);
        mSmsLoadingTxt = view.findViewById(R.id.sms_loading_txt);
        mReadPermissionTipsL = view.findViewById(R.id.readPermissionTipsL);
        mReadPermissionTipsTxt = view.findViewById(R.id.readPermissionTipsTxt);
        mReadPermissionTipBtn = view.findViewById(R.id.readPermissionTipsBtn);
        mReadPermissionTipBtn.setOnClickListener(this);
        addView(view);
        mSideBar.setOnTouchingLetterChangedListener(this);
        mSideBar.setTextView(mTips);
        mSelectedAll.setOnClickListener(this);
        sortListView.setOnItemClickListener(this);
        if (mDataList == null || mDataList.size()==0) {
            mDataList = new ArrayList<>();
            initContractData();
        }
        adapter = new ContractAdapter(getContext(), mDataList);
        sortListView.setAdapter(adapter);
        characterParser = CharacterParser.getInstance();
        pinyinComparator = new PinyinComparator();
        adapter.initData(this);
    }


    public void initContractData() {
        new ContractThread(getContext(), new Handler() {
            @Override
            public void handleMessage(Message msg) {
                super.handleMessage(msg);
                switch (msg.what) {
                    case ContractThread.CONTRACT_SUCCESS:
                        mDataList = (List<ContractBean>) msg.obj;
                        ((MainApplication) getContext().getApplicationContext()).setContractList(mDataList);
                        mReadPermissionTipsL.setVisibility(View.GONE);
                        adapter.setList(mDataList);
                        mSideBar.setTure(true);
                        break;
                    case ContractThread.CONTRACT_FALSE:
                        mReadPermissionTipsTxt.setText("请开启读取联系人权限,步骤如下:\n 1.点击'去设置'按钮 \n 2.进入页面后点击'权限'选项 \n 3.在新的页面点击'通讯录'开启 \n 备注:开启权限未获取联系人,请检查SIM卡");
                        mReadPermissionTipsL.setVisibility(View.VISIBLE);
                        mSideBar.setTure(false);
                        break;
                }
            }
        }).start();
    }

    public void setMsg(String msg) {
        this.mMsg = msg;
    }

    @Override
    public void onTouchingLetterChanged(String s) {
        int position = adapter.getPositionForSection(s.charAt(0));
        if (position != -1) {
            sortListView.setSelection(position);
        }
    }

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        ContractAdapter.ViewHolder h = (ContractAdapter.ViewHolder) view.getTag();
        h.ck.setChecked(!h.ck.isChecked());
        adapter.getList().get(position).isSelected = h.ck.isChecked();
        mSelectedState.setText(adapter.getSelectedCount() + "/" + adapter.getCount());
    }

    @Override
    public void onClick(View v) {
        if (adapter == null){
            return;
        }
        switch (v.getId()) {
            case R.id.all_selsect:
                adapter.selectedAll(mSelectedAll, mSelectedState);
                break;
            case R.id.sms_invitation:
                adapter.sendSms(mMsg);
                break;
            case R.id.readPermissionTipsBtn:
                adapter.showInstalledAppDetails(getContext(), getContext().getPackageName());
                break;
        }
    }

    @Override
    public void onReadResult(boolean isSuccess, List<ContractBean> dataList) {
        if (isSuccess) {
            mSelectedState.setText("0/" + dataList.size());
            mSmsLoadingLayout.setVisibility(View.GONE);
        } else {
            mSmsLoadingImg.setVisibility(View.GONE);
            mSmsLoadingTxt.setText(getResources().getString(R.string.data_no));
        }
    }

    private final Runnable mLayoutRunnable = new Runnable() {
        @Override
        public void run() {
            measure(MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY), MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };

    @Override
    public void requestLayout() {
        super.requestLayout();
        post(mLayoutRunnable);
    }
}
