package com.stateunion.p2p.etongdai.update;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Binder;
import android.os.Environment;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.support.v4.app.NotificationCompat;
import android.widget.RemoteViews;

import com.stateunion.p2p.etongdai.R;
import com.stateunion.p2p.etongdai.utils.LogUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by admin on 2017/9/4.
 */

public class UpdateService extends Service {
    public static final String ARG_DOWNLOAD_URL = "downloadUrl";

    private String downloadUrl = "";
    private String filePath, fileName;

    private UpdateBinder binder;

    private NotificationManager notificationManager;
    private NotificationCompat.Builder notificationBuilder;
    private int NOTIFY_ID = 0;

    private final int MESSAGE_DOWNLOAD_FINISH = 0;
    private final int MESSAGE_DOWNLOAD_UPDATE_PROGRESS = 1;
    private final int MESSAGE_DOWNLOAD_CANCEL = 2;
    private final int MESSAGE_DOWNLOAD_NOT_ENOUGH_SPACE = 3;
    private final int MESSAGE_DOWNLOAD_ERROR = 4;
    private final int MESSAGE_RESPONSE_ERROR = 5;
    private final int MESSAGE_INPUTSTREAM_ERROR = 6;

    @Override
    public void onCreate() {
        super.onCreate();
        binder = new UpdateBinder();
        notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);


        LogUtils.e("update", "Service created");
    }

    @Override
    public int onStartCommand(Intent intent, int flag, int startId) {
        if (downloadTask != null && downloadTask.getStatus() == AsyncTask.Status.RUNNING) {
            return super.onStartCommand(intent, flag, startId);
        }
        if (intent != null) {
            String tempUrl = intent.getStringExtra(ARG_DOWNLOAD_URL);
            if (tempUrl != null) {
                downloadUrl = tempUrl;
            }

            setDownloadDir();
            File file = new File(filePath);
            if (!file.exists()) {
                file.mkdir();
            }
            setUpNotification();
            downloadTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
        }

        LogUtils.e("update", "Service started");
        return super.onStartCommand(intent, flag, startId);
    }

    @Override
    public boolean onUnbind(Intent intent) {
        LogUtils.e("update", "Service unBind");
        return super.onUnbind(intent);
    }

    @Override
    public void onRebind(Intent intent) {
        super.onRebind(intent);
        LogUtils.e("update", "Service bind");
    }

    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        cancelNotification();
        LogUtils.e("update", "Service destroyed");
    }

    private void setDownloadDir() {
        //The sd card available or not
        boolean sdCardExist = Environment.getExternalStorageState().equals(Environment
                .MEDIA_MOUNTED);

        if (sdCardExist) {
            filePath = Environment.getExternalStorageDirectory().getPath() + "/download";
        } else {
            filePath = Environment.getDownloadCacheDirectory().getPath();
        }
    }

    public class UpdateBinder extends Binder {

        public void start() {
            if (downloadTask.getStatus() == AsyncTask.Status.PENDING) {

                LogUtils.e("update", "download service started");
                setUpNotification();
                downloadTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
            }
        }

        public void cancel() {
            if (downloadTask.getStatus() == AsyncTask.Status.RUNNING) {
                LogUtils.e("update", "download cancelled");
                downloadTask.cancel(true);
            }
        }

    }

    /**
     * If the repository file exists, delete it and create new to accept file input from remote,
     * otherwise, create a new file directly.
     *
     * @return the new file exists or not.
     */
    private boolean createFilePath() {
        String apkName;
        if (downloadUrl.indexOf("/") >= 0) {
            apkName = downloadUrl.substring(downloadUrl.lastIndexOf('/'),
                    downloadUrl.length());
        } else {
            apkName = downloadUrl;
        }
        fileName = filePath + apkName;
        LogUtils.e("update", "download file path:" + filePath);
        File file = new File(filePath + apkName);
        if (file.exists()) {
            file.delete();
            try {
                file.createNewFile();
                return file.exists();
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            try {
                file.createNewFile();
                return file.exists();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    private void installApk() {
        File apkFile = new File(fileName);
        if (!apkFile.exists()) {
            return;
        }
        LogUtils.e("---------file:", fileName, " | apkFile:", apkFile.getAbsoluteFile());
        Intent i = new Intent(Intent.ACTION_VIEW);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        i.setDataAndType(Uri.parse("file://" + apkFile.toString()),
                "application/vnd.android.package-archive");
        startActivity(i);

    }

    private void setUpNotification() {
        RemoteViews contentView = new RemoteViews(getPackageName(),
                R.layout.download_notification_layout);
        notificationBuilder = new NotificationCompat.Builder(this)
                .setContentTitle(getString(R.string.app_update_notification_title))
                .setContentText("").setSmallIcon(R.mipmap.ic_launcher)
                .setContent(contentView);

        notificationManager.notify(NOTIFY_ID, notificationBuilder.build());
    }

    public void cancelNotification() {
        notificationManager.cancel(NOTIFY_ID);
    }

    private Handler handler = new Handler() {

        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);

            switch (msg.what) {

                case MESSAGE_DOWNLOAD_FINISH:
                    //Downloading finished. Dismiss the notification.

                    //Download finished, Change the notification
                    notificationBuilder.setAutoCancel(true);
                    notificationManager.cancel(NOTIFY_ID);

                    //Stop the service
                    stopSelf();

                    installApk();
                    break;

                case MESSAGE_DOWNLOAD_UPDATE_PROGRESS:
                    //Update download progress
                    int rate = msg.arg1;
                    Notification notification = notificationBuilder.build();
                    RemoteViews contentView = notification.contentView;
                    contentView.setTextViewText(R.id.tv_progress, rate + "%");
                    contentView.setProgressBar(R.id.progressbar, 100, rate, false);

                    if (rate == 100) {
                        Intent intent = new Intent(Intent.ACTION_VIEW);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        intent.setDataAndType(Uri.parse("file://" + (new File(fileName)).toString()),
                                "application/vnd.android.package-archive");
                        PendingIntent notifyIntent = PendingIntent.getActivity(UpdateService
                                        .this, 0, intent,
                                PendingIntent.FLAG_UPDATE_CURRENT);
                        notificationBuilder.setContentIntent(notifyIntent);
                    }

                    notificationManager.notify(NOTIFY_ID, notification);
                    break;

                case MESSAGE_DOWNLOAD_CANCEL:
                    //User cancelled the downloading
                    notificationManager.cancel(NOTIFY_ID);

                    //Stop the service self.
                    stopSelf();

                    break;

                case MESSAGE_DOWNLOAD_NOT_ENOUGH_SPACE:
                    //Not enough space available in sd card, stop the service and notify the
                    // error to user
                    notificationBuilder.setAutoCancel(true);
                    notificationBuilder.setContent(null);
                    notificationBuilder.setContentText(getString(R.string
                            .app_update_space_not_enough));
                    notificationManager.notify(NOTIFY_ID, notificationBuilder.build());

                    //Stop the service self.
                    stopSelf();

                    break;

                case MESSAGE_DOWNLOAD_ERROR:
                    //Download error, stop the service and notify user the error.
                    notificationBuilder.setAutoCancel(true);
                    notificationBuilder.setContent(null);
                    notificationBuilder.setContentText(getString(R.string.app_update_notify_error));
                    notificationManager.notify(NOTIFY_ID, notificationBuilder.build());

                    //Stop the service self.
                    stopSelf();

                    break;
                case MESSAGE_RESPONSE_ERROR:
                    notificationBuilder.setAutoCancel(true);
                    notificationBuilder.setContent(null);
                    notificationBuilder.setContentText(getString(R.string.app_update_http_code));
                    notificationManager.notify(NOTIFY_ID, notificationBuilder.build());
                    stopSelf();
                    break;
                case MESSAGE_INPUTSTREAM_ERROR:
                    notificationBuilder.setAutoCancel(true);
                    notificationBuilder.setContent(null);
                    notificationBuilder.setContentText(getString(R.string.app_update_inputstram_error));
                    notificationManager.notify(NOTIFY_ID, notificationBuilder.build());
                    stopSelf();
                    break;
                default:
                    break;
            }
        }
    };

    AsyncTask downloadTask = new AsyncTask<Object, Integer, String>() {
        @Override
        protected String doInBackground(Object... params) {
            boolean fileExists = createFilePath();
            if (!fileExists) {
                LogUtils.e("update", "File not exists, finish the downloading");
                return null;
            }
            InputStream inputStream = null;
            OutputStream outputStream = null;
            HttpURLConnection httpURLConnection = null;
            try {
                URL url = new URL(downloadUrl);
                httpURLConnection = (HttpURLConnection) url.openConnection();
                httpURLConnection.setRequestMethod("GET");
                httpURLConnection.setConnectTimeout(10 * 1000);
                httpURLConnection.connect();
                if (httpURLConnection.getResponseCode() == 200) {
                    inputStream = httpURLConnection.getInputStream();
                    if (inputStream != null) {
                        if (isCancelled()) {
                            handler.sendEmptyMessage(2);
                        }
                        long contentLen = httpURLConnection.getContentLength();
                        LogUtils.e("update", "file size: " + contentLen + " b");
                        //Write to file System
                        byte[] bytes = new byte[1024];
                        outputStream = new FileOutputStream(fileName);

                        int len;
                        long num = 0;
                        long progress = 0;
                        while ((len = inputStream.read(bytes)) != -1) {
                            outputStream.write(bytes, 0, len);
                            num += len;
                            final long l = num * 100 / contentLen;
                            if (l > progress) {
                                progress = l;
                                publishProgress((int) progress);
                                LogUtils.e("update", "downloading progress : " + num + "(b)");
                            }

                            if (isCancelled()) {
                                LogUtils.e("update", "download stream reading cancelled.");

                                if (isCancelled()) {
                                    handler.sendEmptyMessage(MESSAGE_DOWNLOAD_CANCEL);
                                }
                                break;
                            }
                        }
                        outputStream.flush();
                        LogUtils.e("update", "download finish");
                        return fileName;
                    } else {
                        handler.sendEmptyMessage(MESSAGE_INPUTSTREAM_ERROR);
                    }
                } else {
                    handler.sendEmptyMessage(MESSAGE_RESPONSE_ERROR);
                }
            } catch (IOException ioe) {
                ioe.printStackTrace();
                if (ioe.getMessage() != null && ioe.getMessage().startsWith("No space left on device")) {
                    // java.io.IOException: No space left on device
                    handler.sendEmptyMessage(MESSAGE_DOWNLOAD_NOT_ENOUGH_SPACE);
                } else {
                    handler.sendEmptyMessage(MESSAGE_DOWNLOAD_ERROR);
                }

                LogUtils.e("update", "download exception : " + ioe);
            } catch (Exception e) {
                e.printStackTrace();

                handler.sendEmptyMessage(MESSAGE_DOWNLOAD_ERROR);

                LogUtils.e("update", "download exception : " + e);
            } finally {
                try {
                    if (inputStream != null) {
                        inputStream.close();
                    }
                    if (outputStream != null) {
                        outputStream.close();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
                if (httpURLConnection != null) {
                    httpURLConnection.disconnect();
                }
                if (isCancelled()) {
                    handler.sendEmptyMessage(MESSAGE_DOWNLOAD_CANCEL);
                }
            }
            return null;
        }

        @Override
        protected void onProgressUpdate(Integer... values) {
            if (values != null) {
                int progress = values[0];
                Message msg = handler.obtainMessage();
                msg.what = MESSAGE_DOWNLOAD_UPDATE_PROGRESS;
                msg.arg1 = progress;
                handler.sendMessage(msg);

            }
        }

        @Override
        protected void onPostExecute(String result) {
            if (result != null) {
                //download success.
                handler.sendEmptyMessage(MESSAGE_DOWNLOAD_FINISH);
            }
        }
    };
}
