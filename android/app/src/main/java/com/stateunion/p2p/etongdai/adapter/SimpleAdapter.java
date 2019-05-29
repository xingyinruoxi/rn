package com.stateunion.p2p.etongdai.adapter;

import android.widget.BaseAdapter;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by admin on 2017/7/30.
 */

public abstract class SimpleAdapter<T> extends BaseAdapter {
    List<T> list = new ArrayList<>();

    @Override
    public int getCount() {
        return list.size();
    }

    @Override
    public T getItem(int position) {
        if (position < list.size()) {
            return list.get(position);
        }
        return null;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    public void setList(List<T> list) {
        this.list.clear();
        this.list.addAll(list);
        notifyDataSetChanged();
    }

    public void addAll(List<T> list) {
        this.list.addAll(list);
        notifyDataSetChanged();
    }

    public void clear() {
        list.clear();
        notifyDataSetChanged();
    }

    public List<T> getList() {
        return list;
    }
}
