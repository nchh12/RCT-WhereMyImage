package com.rncodebase.nativemodules.imagelabeling.utils;

import android.app.Activity;
import android.graphics.Bitmap;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.label.ImageLabel;
import com.google.mlkit.vision.label.ImageLabeler;
import com.google.mlkit.vision.label.ImageLabeling;
import com.google.mlkit.vision.label.defaults.ImageLabelerOptions;
import com.rncodebase.helpers.GalleryHelper;
import com.rncodebase.utilities.BitmapUtils;

import java.util.List;

import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class ImageProcessor {

    final private ImageLabeler labeler = ImageLabeling.getClient(ImageLabelerOptions.DEFAULT_OPTIONS);
    private List<String> listGalleryImagesUrls = null;
    final private EmitterInterface imageEmitter;
    private Bitmap currentBufferBitmap = null;
    private List<String> listFilters = null;
    private int currentBufferIndex = 0;
    private boolean isCanceling = true;

    public ImageProcessor(EmitterInterface imageEmitter) {
        this.imageEmitter = imageEmitter;
    }

    public void addFilters(List<String> listFilter) {
        this.listFilters = listFilter;
    }

    public void stopProcessing() {
        this.isCanceling = true;
        emitStopProcessing();
    }

    public void startProcessing(Activity currentActivity, boolean isReset) {
        if (!this.isCanceling) {
            return;
        }

        if (isReset || listGalleryImagesUrls == null) {
            this.listGalleryImagesUrls = GalleryHelper.fetchGalleryImages(currentActivity);
            this.currentBufferIndex = 0;
        }
        this.isCanceling = false;

        Observable.just(1)
                .subscribeOn(Schedulers.newThread())
                .subscribe(this::onNewThreadProgress);
    }

    private void onNewThreadProgress(Integer integer) {
        while (!isInterruptedProgress()) {
            if (isInOtherProgress()) { //other image is in progress
                continue;
            }
            String imageUrl = listGalleryImagesUrls.get(this.currentBufferIndex);
            this.currentBufferBitmap = BitmapUtils.loadBitmap(imageUrl);
            if (this.currentBufferBitmap == null) {
                onNext();
                continue;
            }
//                        Log.d("@@@ start process", this.currentBufferIndex + "");
            labeler.process(InputImage.fromBitmap(this.currentBufferBitmap, 0))
                    .addOnSuccessListener(this::onLabelSuccess)
                    .addOnFailureListener(this::onLabelFail);

        }
        stopProcessing();
    }

    private void onLabelFail(Exception e) {
        onNext();
    }

    private void onLabelSuccess(List<ImageLabel> listLabels) {
        WritableMap mapLabels = packagingLabels(listLabels);
        if (isMatching(mapLabels)) {
            emitterImageData(mapLabels);
        }
        onNext();
        Log.d("@@@ end process", this.currentBufferIndex + "");
    }

    private void emitterImageData(WritableMap mapLabels) {
        WritableMap map = Arguments.createMap();
        map.putString("uri", listGalleryImagesUrls.get(this.currentBufferIndex));
        map.putInt("pixelHeight", this.currentBufferBitmap.getHeight());
        map.putInt("pixelWidth", this.currentBufferBitmap.getWidth());
        map.putMap("label", mapLabels);
        imageEmitter.emitToJs(map,"onResult");
    }

    private void emitStopProcessing(){
        WritableMap map = Arguments.createMap();
        map.putString("status", "done");
        imageEmitter.emitToJs(map, "onStatus");
    }

    private boolean isMatching(WritableMap mapLabels) {
        for (String filter : listFilters) {
            if (mapLabels.hasKey(filter.toUpperCase())) return true;
        }
        return false;
    }

    private void onNext() {
        this.currentBufferBitmap = null;
        this.currentBufferIndex++;
    }

    private boolean isInOtherProgress() {
        return this.currentBufferBitmap != null;
    }

    private boolean isInterruptedProgress() {
        return this.listGalleryImagesUrls == null ||
                this.currentBufferIndex >= listGalleryImagesUrls.size() ||
                this.imageEmitter == null ||
                this.isCanceling;
    }

    private WritableMap packagingLabels(List<ImageLabel> listLabels) {
        WritableMap mapLabel = Arguments.createMap();
        for (ImageLabel label : listLabels) {
            mapLabel.putDouble(label.getText().toUpperCase(), label.getConfidence());
            Log.d("@@           ", label.getText());
        }
        return mapLabel;
    }
}
