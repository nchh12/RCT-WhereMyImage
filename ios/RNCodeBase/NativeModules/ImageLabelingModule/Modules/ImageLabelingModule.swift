//
//  ImageLabelingModule.swift
//  RNCodeBase
//
//  Created by Lam Nguyen on 07/08/2021.
//

import Foundation
import React
import Photos

@objc(ImageLabelingModule)
class ImageLabelingModule: RCTEventEmitter{
  public static let IMAGE_LABELING_LISTENER_KEY = "IMAGE_LABELING_LISTENER_KEY"
  private var imageProcessor: ImageProcessor?
  
  override init() {
    super.init()
    self.imageProcessor = ImageProcessor()
    self.imageProcessor?.setEmitter(emitter: {res, status in
      res.setValueSafely(field: "status", value: status)
      self.sendEvent(withName: ImageLabelingModule.IMAGE_LABELING_LISTENER_KEY, body: res.getInstance())
    })
  }
  
  override func supportedEvents() -> [String]! {
    return [ImageLabelingModule.IMAGE_LABELING_LISTENER_KEY];
  }
  
  @objc func test(_ a: Int){
    let dic = NSMutableDictionary()
    dic.setValue("11", forKey: "111")
    self.sendEvent(withName: ImageLabelingModule.IMAGE_LABELING_LISTENER_KEY, body: dic)
    dic.setValue("22", forKey: "222")
    dic.setValue("33", forKey: "333")
    self.sendEvent(withName: ImageLabelingModule.IMAGE_LABELING_LISTENER_KEY, body: dic)
  }
  
  @objc func startScaningWithFilter(_ filters: [String]){
    self.imageProcessor?.setFilters(listFilters: filters)
    self.imageProcessor?.startProcessing(isReset: true)
  }
  
  @objc func stopScanning(){
    self.imageProcessor?.stopProcessing()
  }
  
  @objc func grantPermission(_ resolve: RCTPromiseResolveBlock,rejecter reject: RCTPromiseRejectBlock){
    PermissionHelper.requestPHPhotoLibrary()
    resolve(PermissionConstants.GRANTED)
  }
}
