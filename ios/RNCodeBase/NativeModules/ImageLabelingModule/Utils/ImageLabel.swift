//
//  ImageLabel.swift
//  RNCodeBase
//
//  Created by Lam Nguyen on 07/08/2021.
//

import Foundation
import Photos
import MLKit

class ImageLabel: NSObject{
  private var criterion: [String]?
  private var asset: PHAsset?
  
  init(asset: PHAsset, criterion: [String]){
    super.init()
    self.asset = asset
    self.criterion = criterion
  }
  
  public func process(callback:@escaping ([String:Any]) -> Void){
    guard self.asset != nil else{
      return
    }
    
    print("@@ start processing... ")
    
    DispatchQueue.global().async {
      
      let imagePercent: CGFloat = 0.1;
      guard let image = self.asset?.getFullImage(), let thumnailImage = self.asset?.getThumnailImage() else{
        return
      }
      
      self.label(image: thumnailImage){ labels in
        let imageMatching = ImageMatching(filters: self.criterion, labels: labels)
        if (imageMatching.isMatching()){
          let responseToJS = JSONSafeObject()
//          responseToJS.setValueSafely(field: "uri", value: self.getUriImage(image: image))
          responseToJS.setValueSafely(field: "uriThumnail", value: self.getUriImage(image: thumnailImage))
          responseToJS.setValueSafely(field: "pixelHeight", value: Int(CGFloat(self.asset!.pixelHeight) * imagePercent))
          responseToJS.setValueSafely(field: "pixelWidth", value: Int(CGFloat(self.asset!.pixelWidth) * imagePercent))
          responseToJS.setValueSafely(field: "labels", value: labels.getInstance())

          DispatchQueue.main.async {
            callback(responseToJS.getInstance())
          }
        }
      }
    }
  }
  
  private func getUriImage(image: UIImage) -> String{
    let imageName = ImageUtils.getRandomName()
    let dir =  ImageUtils.saveImage(image: image, fileName: imageName)
    
    if (dir?.absoluteString != nil){
      return (dir?.absoluteString)! + imageName
    }
    return ""
  }
  
  private func label(image: UIImage, callback:@escaping (JSONSafeObject) -> Void ){
    let options = ImageLabelerOptions()
    options.confidenceThreshold = 0.5
    
    let labeler = ImageLabeler.imageLabeler(options: options)

    labeler.process(VisionImage(image: image)){ labels, error in
      guard error == nil, let labels = labels else {
        return
      }
      let res = JSONSafeObject()
      for label in labels{
        res.setValueSafely(field: label.text.uppercased(), value: label.confidence)
      }
      callback(res)
    }
  }
}
