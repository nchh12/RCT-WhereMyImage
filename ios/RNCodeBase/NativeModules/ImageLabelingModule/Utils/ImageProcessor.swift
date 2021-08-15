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
  private var emitter: ([String:Any]) -> () = {_ in
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
  
  public func setEmitter(emitter: @escaping ([String:Any]) -> ()){
    self.emitter = emitter
  }
  
  public func stopProcessing(){
    self.isCanceling = true
    //emit
  }
  
  public func startProcessing(isReset: Bool){
    if (!self.isCanceling){
      return
    }
    
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
      self.currentBufferAsset = listGalleryAssets?.object(at: self.currentBufferIndex)
      
      guard let image = self.currentBufferAsset?.getFullImage(), let thumnailImage = self.currentBufferAsset?.getThumnailImage() else{
        onNext()
        continue
      }
      print("@@@ start process \(self.currentBufferIndex)")
      
      self.labeler?.process(VisionImage(image: thumnailImage)){ labels, error in
        self.onNext()
        guard error == nil, let labels = labels else {
          return
        }
        let mapLabels = self.packagingLabels(listLabels: labels)
        let imageMatching = ImageMatching(filters: self.listFilters, labels: mapLabels)
        if (imageMatching.isMatching()){
          self.emitterImageData(labels: mapLabels, image:thumnailImage)
          print("@@@ End process \(self.currentBufferIndex)    \(self.listGalleryAssets!.count)")
        }
      }
    }
    stopProcessing()
  }
  
  private func emitterImageData(labels: JSONSafeObject, image: UIImage){
    let responseToJS = JSONSafeObject()
    responseToJS.setValueSafely(field: "uri", value: self.getUriImage(image: image))
    //    responseToJS.setValueSafely(field: "uriThumnail", value: self.getUriImage(image: thumnailImage))
    responseToJS.setValueSafely(field: "pixelHeight", value: self.currentBufferAsset?.pixelHeight ?? 1)
    responseToJS.setValueSafely(field: "pixelWidth", value: self.currentBufferAsset?.pixelWidth ?? 1)
    responseToJS.setValueSafely(field: "labels", value: labels.getInstance())
    responseToJS.setValueSafely(field: "event", value: "onResult")
    
      self.emitter(responseToJS.getInstance())
//    DispatchQueue.main.async {
//    }
  }
  
  private func getUriImage(image: UIImage) -> String{
    let imageName = ImageUtils.getRandomName()
    let dir =  ImageUtils.saveImage(image: image, fileName: imageName)
    
    if (dir?.absoluteString != nil){
      return (dir?.absoluteString)! + imageName
    }
    return ""
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
