//
//  TestModule.swift
//  RNCodeBase
//
//  Created by Lam Nguyen on 03/08/2021.
//

import Foundation
import React
import MLKit

@objc(TestModule)
class TestModule: NSObject{
  
  @objc func add(_ a: Int, b: Int, callback: @escaping RCTResponseSenderBlock) {
    callback([[
      "ans": a+b
    ]])
  }
  
  @objc func labelImage(_ urlString: String, callback: @escaping RCTResponseSenderBlock) {
    guard urlString != "" else {
      callback(nil)
      return
    }
    let url = URL(string: urlString)
    ImageUtils.getData(from: url!){ data, response, error in
      guard error == nil, let data = data else {
        return
      }
      let image = UIImage(data: data)
      
      //label
      let options = ImageLabelerOptions()
      options.confidenceThreshold = 0.5
      
      let labeler = ImageLabeler.imageLabeler(options: options)
      
      labeler.process(VisionImage(image: image!)){ labels, error in
        guard error == nil, let labels = labels else {
          return
        }
        var res = [[String: Any]]()
        for label in labels{
          print("label: \(label.index): \(label.confidence) - \(label.text)")
          //          res.setValue(label.confidence, forKey: "\(label.index)")
          //          res.setValue(label.text, forKey: "text \(label.index)")
          //          res.setValue(label.confidence, forKey: "confidence \(label.index)")
          let item = [
            "text": label.text,
            "confidence": label.confidence,
            "index": label.index
          ] as [String : Any]
          
          res.append(item)
        }
        
        callback([res])
        
      }
      
    }
  }
}
