//
//  ImageMatching.swift
//  RNCodeBase
//
//  Created by Lam Nguyen on 08/08/2021.
//

import Foundation

class ImageMatching: NSObject{
  
  private let filters: [String]?
  private let labels: JSONSafeObject?
  
  init(filters: [String]?, labels: JSONSafeObject?){
    self.filters = filters
    self.labels = labels
  }
  
  public func isMatching() -> Bool {
    return true
    
    for index in 0..<(filters?.count ?? 0){
      let filter = filters![index].uppercased()
      guard filter != "" else {
        continue
      }
      if let _ = labels?.getValueSafely(field: filter){
        return true
      }
    }
    return false
  }
  
}
