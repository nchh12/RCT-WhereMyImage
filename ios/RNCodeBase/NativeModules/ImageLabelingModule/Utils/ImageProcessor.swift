//
//  ImageProcessor.swift
//  RNCodeBase
//
//  Created by Lam Nguyen on 14/08/2021.
//

import Foundation
import Photos
import MLKit

class ImageProcessor: NSObject{
  private var listGalleryAssets: PHFetchResult<PHAsset>?
  private var currentBufferAsset: PHAsset?
  private var currentBufferIndex: Int = 0
  private var isCanceling: Bool = true
  private var listFilters: [String]?
  private var labeler: ImageLabeler?
  private var emitter: (JSONSafeObject, String) -> () = {_,_  in
  }
  
  override init() {
    super.init()
    
    let options = ImageLabelerOptions()
    options.confidenceThreshold = 0.5
    self.labeler = ImageLabeler.imageLabeler(options: options)
  }
  
  public func setFilters(listFilters: [String]){
    self.listFilters = listFilters
  }
  
  public func setEmitter(emitter: @escaping (JSONSafeObject, String) -> ()){
    self.emitter = emitter
  }
  
  public func stopProcessing(){
    self.isCanceling = true
  }

  public func startProcessing(isReset: Bool){
    if (!self.isCanceling){
      return
    }
    
    let responseToJS = JSONSafeObject()
    self.emitter(responseToJS, "onStart")
    
    if (isReset || self.listGalleryAssets == nil){
      self.listGalleryAssets = PHAsset.fetchAssets(with: .image, options: PHFetchOptions())
      self.currentBufferIndex = 0
    }
    self.isCanceling = false
    
    DispatchQueue.global().async {
      self.onNewThreadProgress()
    }
  }
  
  private func onNewThreadProgress(){
    while (!isInterruptedProgress()){
      if (isInOtherProgress()){
        continue
      }
      print("@@@ start process \(self.currentBufferIndex)     \(self.listGalleryAssets!.count)")
      guard !isInterruptedProgress() else{
        break
      }
      self.currentBufferAsset = listGalleryAssets?.object(at: self.currentBufferIndex)
      
      guard let thumnailImage = self.currentBufferAsset?.getThumnailImage() else{
        onNext()
        continue
      }
      
      self.labeler?.process(VisionImage(image: thumnailImage)){ labels, error in
        guard error == nil, let labels = labels else {
          self.onNext()
          return
        }
        self.emitProgress();
        let mapLabels = self.packagingLabels(listLabels: labels)
        let imageMatching = ImageMatching(filters: self.listFilters, labels: mapLabels)
        if (imageMatching.isMatching()){
          self.emitterImageData(labels: mapLabels)
        }
        print("@@@ End process \(self.currentBufferIndex)    \(self.listGalleryAssets!.count)")
        self.onNext()
      }
    }
    stopProcessing()
    emitProgress()
    emitStopSignal()
  }
  
  private func emitProgress(){
    let responseToJS = JSONSafeObject()
    responseToJS.setValueSafely(field: "currentIndex", value: self.currentBufferIndex)
    responseToJS.setValueSafely(field: "total", value: self.listGalleryAssets?.count ?? 0)
    responseToJS.setValueSafely(field: "percent", value: (self.currentBufferIndex) * 100 / (max((self.listGalleryAssets?.count ?? 0), 1)))
    self.emitter(responseToJS, "onProgress")
  }
  
  private func emitStopSignal(){
    let responseToJS = JSONSafeObject()
    self.emitter(responseToJS, "onFinish")
  }
  
  private func emitterImageData(labels: JSONSafeObject){
    let pixelHeight = self.currentBufferAsset?.pixelHeight ?? 1 //cache for reset bufferAssets
    let pixelWidth = self.currentBufferAsset?.pixelWidth ?? 1
    self.currentBufferAsset?.getFullImageUri(){ imageUri in
      let responseToJS = JSONSafeObject()
      responseToJS.setValueSafely(field: "uri", value: imageUri)
      responseToJS.setValueSafely(field: "pixelHeight", value: pixelHeight)
      responseToJS.setValueSafely(field: "pixelWidth", value: pixelWidth)
      responseToJS.setValueSafely(field: "labels", value: labels.getInstance())
      self.emitter(responseToJS, "onResponse")
    }
  }
  
  private func packagingLabels(listLabels: [ImageLabel]) -> JSONSafeObject{
    let res = JSONSafeObject()
    for label in listLabels{
      print("@@@  \(self.currentBufferIndex)    \(label.text)")
      res.setValueSafely(field: label.text.uppercased(), value: label.confidence)
    }
    return res;
  }
  
  private func onNext(){
    self.currentBufferIndex = self.currentBufferIndex + 1;
    self.currentBufferAsset = nil
  }
  
  private func isInOtherProgress() -> Bool{
    return self.currentBufferAsset != nil
  }
  
  private func isInterruptedProgress() -> Bool {
    return self.listGalleryAssets == nil ||
      self.currentBufferIndex >= self.listGalleryAssets!.count ||
      self.isCanceling
  }
}
