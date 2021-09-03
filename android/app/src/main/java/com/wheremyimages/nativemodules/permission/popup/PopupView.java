package com.wheremyimages.nativemodules.permission.popup;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.text.Html;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.drawable.DrawableCompat;

import com.wheremyimages.R;

public class PopupView extends Dialog implements View.OnClickListener {
    TextView textPermission;
    Button btnDeny;
    Button btnAllow;
    OnHandleClickCta handleClickCta;
    ImageView imgOne, imgTwo, imgThree;

    public PopupView(@NonNull Context context) {
        super(context);
    }

    public PopupView(@NonNull Activity activity, OnHandleClickCta handleClickCta) {
        super(activity);
        this.handleClickCta = handleClickCta;
    }

    private void setPermissionText(){
        textPermission.setText(Html.fromHtml(getContext().getResources().getString(R.string.popup_mainText)));
    }

    private void setIconColor(ImageView imageView){
        DrawableCompat.setTint(
                DrawableCompat.wrap(imageView.getDrawable()),
                ContextCompat.getColor(getContext(), R.color.base_3)
        );
    }

    @Override
    public void show() {
        setContentView(View.inflate(getContext(), R.layout.popup_view, null));
        setTitle("Testing");

        try {
            super.show();
        } catch (Exception e) {
            Log.d("@@@ on error", e.getMessage());
        }
    }

    @Override
    public void dismiss() {
        if (super.isShowing() == true) {
            super.dismiss();
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        textPermission = findViewById(R.id.popupMainText);
        btnDeny = findViewById(R.id.btnPopupDeny);
        btnAllow = findViewById(R.id.btnPopupAllow);
        imgOne = findViewById(R.id.popupAltStepOneImage);
        imgTwo = findViewById(R.id.popupAltStepTwoImage);
        imgThree = findViewById(R.id.popupAltStepThreeImage);
        setIconColor(imgOne);
        setIconColor(imgTwo);
        setIconColor(imgThree);
//        setPermissionText();
        btnDeny.setOnClickListener(this);
        btnAllow.setOnClickListener(this);
        getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
    }

    @Override
    public void onClick(View view) {
        switch(view.getId()){
            case R.id.btnPopupDeny:
                Log.d("@@@", "Permission denied");
                break;
            case R.id.btnPopupAllow:
                Log.d("@@@", "Permission granted");
                handleClickCta.onClickCta();
                break;
            default:
                break;
        }
        dismiss();
    }
}
