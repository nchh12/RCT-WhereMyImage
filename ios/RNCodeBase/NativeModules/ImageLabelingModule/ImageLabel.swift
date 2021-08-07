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
  
  public func process(callback:@escaping (NSMutableDictionary) -> Void){
    guard self.asset != nil else{
      return
    }
    
    let image = ImageUtils.getFromAsset(asset: self.asset!)
    
    print("start process")

    label(image: image){ mapResult in
      
      let info = NSMutableDictionary()
      info.setValue(self.getUriImage(image: image), forKey: "uri")
      info.setValue(self.asset!.pixelHeight, forKey: "pixelHeight")
      info.setValue(self.asset!.pixelWidth, forKey: "pixelWidth")
      info.setValue(mapResult, forKey: "labels")
      
      print("start callback...")
      callback(info)
//      callback(res.first ?? NSMutableDictionary())
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
  
  private func label(image: UIImage, callback:@escaping ([String:Any]) -> Void ){
    let options = ImageLabelerOptions()
    options.confidenceThreshold = 0.5
    
    let labeler = ImageLabeler.imageLabeler(options: options)

    labeler.process(VisionImage(image: image)){ labels, error in
      guard error == nil, let labels = labels else {
        return
      }
      var res = [String:Any]()
      for label in labels{
//        print("label: \(label.index): \(label.confidence) - \(label.text)")
//        let tmp = NSMutableDictionary()
//        tmp.setValue(label.text, forKey: "text")
//        tmp.setValue(label.confidence, forKey: "confidence")
//        tmp.setValue(label.index, forKey: "index")
//        res.append(tmp)
        res[label.text] = label.confidence
      }
      callback(res)
    }
  }
}
