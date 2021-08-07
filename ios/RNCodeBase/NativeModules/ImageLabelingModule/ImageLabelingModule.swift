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
    let fetchOptions = PHFetchOptions()
    let allPhotos = PHAsset.fetchAssets(with: .image, options: fetchOptions)
    print("Found \(allPhotos.count) assets")
    
    for index in 0..<allPhotos.count {
      let asset = allPhotos.object(at: index)
      
      let imageName = "\(index).png"
      let image = ImageUtils.getAssetThumbnail(asset: asset)
      let dir =  ImageUtils.saveImage(image: image, fileName: imageName)
      print("@@asset.description \(asset.description)")
      
      let res = NSMutableDictionary()
      if (dir?.absoluteString != nil) {
        res.setValue(((dir?.absoluteString)!)  + imageName, forKey: "uri")
      }
      res.setValue(asset.pixelHeight, forKey: "pixelHeight")
      res.setValue(asset.pixelWidth, forKey: "pixelWidth")
      
      self.sendEvent(withName: ImageLabelingModule.IMAGE_LABELING_LISTENER_KEY, body: res)
    }
    
    
  }
  
}
