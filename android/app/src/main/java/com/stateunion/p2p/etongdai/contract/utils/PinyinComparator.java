package com.stateunion.p2p.etongdai.contract.utils;


import com.stateunion.p2p.etongdai.contract.bean.ContractBean;

import java.util.Comparator;

/**
 * Created by admin on 2017/7/28.
 */

public class PinyinComparator implements Comparator<ContractBean> {
    @Override
    public int compare(ContractBean o1, ContractBean o2) {
        if (o1.sortLetters.equals("@")
                || o2.sortLetters.equals("#")) {
            return -1;
        } else if (o1.sortLetters.equals("#")
                || o2.sortLetters.equals("@")) {
            return 1;
        } else {
            return o1.sortLetters.compareTo(o2.sortLetters);
        }
    }
}
