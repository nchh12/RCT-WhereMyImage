//
//  PHPhotoLibraryPermission.swift
//  RNCodeBase
//
//  Created by Lam Nguyen on 07/08/2021.
//

import Foundation
import Photos

class PermissionRequest{
  public static func requestPHPhotoLibrary(){
    PHPhotoLibrary.requestAuthorization { status in
      switch status {
      case .authorized:
//        callback(true)
        return;
      //        let fetchOptions = PHFetchOptions()
      //        let allPhotos = PHAsset.fetchAssets(with: .image, options: fetchOptions)
      //        print("Found \(allPhotos.count) assets")
      //
      //        let image = ImageUtils.getAssetThumbnail(asset: allPhotos.firstObject!)
      //
      //        let dir =  ImageUtils.saveImage(image: image, fileName: "test1.png")
      //
      //        var res = [[String: Any]]()
      //        print("@@ dir \(dir?.absoluteString ?? "")")
      //        let item = [
      //          "dir": (dir?.absoluteString)!  + "test1.png"
      //        ] as [String : Any]
      //        res.append(item)
      //        callback([res])
      case .denied, .restricted:
        print("Not allowed")
      case .notDetermined:
        // Should not see this when requesting
        print("Not determined yet")
      case .limited:
        print("limited")
      default:
        print("default")
      }
    }
//    callback(false)
  }
}
