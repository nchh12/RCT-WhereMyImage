package com.wheremyimages.nativemodules.permission.utils;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Process;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;

public class PermissionHelper {

    public static String checkPermission(Activity activity, final String permission) {
        if (!isSupportedPermission(permission)) {
            return PermissionConstants.UNAVAILABLE;
        }
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return (activity.getApplicationContext().checkPermission(permission, Process.myPid(), Process.myUid())
                    == PackageManager.PERMISSION_GRANTED
                    ? PermissionConstants.GRANTED
                    : PermissionConstants.BLOCKED);
        }
        if (activity.getApplicationContext().checkSelfPermission(permission) == PackageManager.PERMISSION_GRANTED) {
            return PermissionConstants.GRANTED;
        } else {
            return PermissionConstants.DENIED;
        }
    }

    public static void checkPermission(Activity activity, final String permission, final Promise promise) {
        promise.resolve(checkPermission(activity, permission));
    }

    public static boolean isGranted(Activity activity, final String permission) {
        return checkPermission(activity, permission).equals(PermissionConstants.GRANTED);
    }

    public static void requestPermission(Activity activity, final String permission, final Promise promise) {
        if (activity == null || !isSupportedPermission(permission)) {
            promise.resolve(PermissionConstants.UNAVAILABLE);
            return;
        }
        PermissionAwareActivity permissionAwareActivity = ((PermissionAwareActivity) activity);
        if (!permissionAwareActivity.shouldShowRequestPermissionRationale(permission)){
            //when user clicked "do not show again"
            promise.resolve(PermissionConstants.BLOCKED);
            return;
        }
        permissionAwareActivity.requestPermissions(new String[]{permission}, 1, new PermissionListener() {
            @Override
            public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
                int result = grantResults.length > 0 ? grantResults[0] : -1;
                promise.resolve(getOnResultStatus(result));
                return false;
            }
        });
    }

    public static void openSettings(ReactApplicationContext reactContext) {
        try {
            final Intent intent = new Intent();
            final String packageName = reactContext.getPackageName();

            intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.setData(Uri.fromParts("package", packageName, null));
            reactContext.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String getOnResultStatus(int result) {
        switch (result) {
            case PackageManager.PERMISSION_GRANTED:
                return PermissionConstants.GRANTED;
            case PackageManager.PERMISSION_DENIED:
                return PermissionConstants.DENIED;
            default:
                return PermissionConstants.UNAVAILABLE;
        }
    }

    public static boolean isSupportedPermission(String permission) {
        switch (permission) {
            case Manifest.permission.READ_EXTERNAL_STORAGE:
//                add more here
//            case Manifest.permission.WRITE_EXTERNAL_STORAGE:
                return true;
            default:
                return false;
        }
    }
}
