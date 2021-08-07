//
//  ImageUtils.swift
//  WhereMyImage
//
//  Created by Lam Nguyen on 01/08/2021.
//
import UIKit
import Photos

class ImageUtils {
  static func getFromAsset(asset: PHAsset) -> UIImage {
    let manager = PHImageManager.default()
    let option = PHImageRequestOptions()
    var image = UIImage()
    option.isSynchronous = true
    manager.requestImage(for: asset, targetSize: CGSize(width: asset.pixelWidth, height: asset.pixelHeight), contentMode: .aspectFit, options: option, resultHandler: {(result, info)->Void in
      image = result!
    })
    return image
  }
  
  static func cacheImageLocal(from url: URL?){
    if (url == nil || url?.lastPathComponent == ""){
      return
    }
    getData(from: url!) { data, response, error in
      if let data = data,   error == nil{
        let fileName = self.getImageNameFrom(url: url)
        _ = self.saveImage(image: UIImage(data: data)!, fileName: fileName)
      }
    }
  }
  
  static func loadImageLocal(imageUrl: URL) -> UIImage? {
    let name = self.getImageNameFrom(url: imageUrl)
    if let dir = try? FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false) {
      return UIImage(contentsOfFile: URL(fileURLWithPath: dir.absoluteString).appendingPathComponent(name).path)
    }
    return nil
  }
  
  static func getData(from url: URL, completion: @escaping (Data?, URLResponse?, Error?) -> ()) {
    print("start getting data...")
    URLSession.shared.dataTask(with: url, completionHandler: completion).resume()
  }
  
  static func saveImage(image: UIImage, fileName: String) -> NSURL? {
    guard let data = image.pngData() ?? image.jpegData(compressionQuality: 1) else {
      return nil
    }
    guard let directory = try? FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false) as NSURL else {
      return nil
    }
    do {
      try data.write(to: directory.appendingPathComponent(fileName)!)
      return directory
    } catch {
      return nil
    }
  }
  
  static func getImageNameFrom(url: URL?) -> String{
    return url?.lastPathComponent ?? ""
  }
  
  static func getRandomName() -> String{
    let date = Date()
    return "\(date.currentTimeMillis())_\(Int.random(in: 0...1000)).png"
  }
}
