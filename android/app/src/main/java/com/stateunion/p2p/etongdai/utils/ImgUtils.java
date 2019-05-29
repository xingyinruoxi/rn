package com.stateunion.p2p.etongdai.utils;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

/**
 * Created by admin on 2017/8/8.
 */

public class ImgUtils extends Thread implements Runnable{

    private String mUrl;
    private Handler mHandler;

    public ImgUtils(String url, Handler handler){
        this.mUrl = url;
        this.mHandler = handler;
    }

    @Override
    public void run() {
        super.run();
        Bitmap bitmap = null;
        if(!TextUtils.isEmpty(mUrl)){
            bitmap = getBitmap(mUrl);
        }
        Message message = new Message();
        if(bitmap != null){
            message.what = Constant.SUCCESS;
            message.obj = bitmap;
        }else{
            message.what = Constant.FALSE;
        }
        mHandler.sendMessage(message);
    }

    public static Bitmap getBitmap(String url) {
        Bitmap bitmap = null;
        InputStream in = null;
        BufferedOutputStream out = null;
        try {
            in = new BufferedInputStream(new URL(url).openStream(), Constant.IO_BUFFER_SIZE);
            final ByteArrayOutputStream dataStream = new ByteArrayOutputStream();
            out = new BufferedOutputStream(dataStream, Constant.IO_BUFFER_SIZE);
            copy(in, out);
            out.flush();
            byte[] data = dataStream.toByteArray();
            bitmap = BitmapFactory.decodeByteArray(data, 0, data.length);
            data = null;
            return bitmap;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public static void copy(InputStream in, BufferedOutputStream out) throws IOException {
        byte[] buff = new byte[1024];
        int end = -1;
        while ((end = in.read(buff)) != -1) {
            out.write(buff, 0, end);
        }
    }
}
