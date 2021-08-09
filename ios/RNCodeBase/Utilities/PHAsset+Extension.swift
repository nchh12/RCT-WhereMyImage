//
//  PHAsset+Extension.swift
//  RNCodeBase
//
//  Created by Lam Nguyen on 09/08/2021.
//

import Foundation
import Photos

extension PHAsset{
  func getThumnailImage() -> UIImage {
    let manager = PHImageManager.default()
    let option = PHImageRequestOptions()
    var image = UIImage()
    option.isSynchronous = true
    manager.requestImage(for: self, targetSize: ImageUtils.getThumnailSize(asset: self), contentMode: .aspectFit, options: option, resultHandler: {(result, info)->Void in
      image = result!
    })
    return image
  }
  
  func getFullImage() -> UIImage {
    let manager = PHImageManager.default()
    let option = PHImageRequestOptions()
    var image = UIImage()
    option.isSynchronous = true
    manager.requestImage(for: self, targetSize: CGSize(width: self.pixelWidth, height: self.pixelHeight), contentMode: .aspectFit, options: option, resultHandler: {(result, info)->Void in
      image = result!
    })
    return image
  }
}
