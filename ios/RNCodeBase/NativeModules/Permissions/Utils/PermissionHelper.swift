//
//  PHPhotoLibraryPermission.swift
//  RNCodeBase
//
//  Created by Lam Nguyen on 07/08/2021.
//

import Foundation
import Photos

class PermissionHelper{
  public static func requestPHPhotoLibrary(){
    PHPhotoLibrary.requestAuthorization { status in
      print("@@@ \(status.rawValue)")
      switch status {
      case .authorized:
        print("@@@ authorized")
        return
      case .denied:
        print("@@@ denied")
        UIApplication.shared.open(URL(string: UIApplication.openSettingsURLString)!, options: [:], completionHandler: nil)
        return
      case .restricted:
        print("@@@ restricted")
        return
      case .notDetermined:
        // Should not see this when requesting
        print("@@@ Not determined yet")
        return
      case .limited:
        print("@@@ limited")
        return
      default:
        print("@@@ default")
      }
    }
  }
}
