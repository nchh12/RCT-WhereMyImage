//
//  JSONSafeObject.swift
//  RNCodeBase
//
//  Created by Lam Nguyen on 08/08/2021.
//

import Foundation
class JSONSafeObject: NSObject {
  private var value: [String: Any]?
  init(string: String){
    do {
      guard let data = string.data(using: .utf8) else{
        return
      }
      self.value = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
    } catch {
      print("Cannot parse to JSONObject for: \(string)")
    }
  }
  
  init(dic: [String:Any]){
    self.value = dic
  }
  
  override init(){
    super.init()
    self.value = [String:Any]()
  }
  
  func getInstance() -> [String:Any] {
    return self.value ?? [String:Any]()
  }
  
  func isEmpty() -> Bool{
    return self.value == nil || getListKeys().count == 0
  }
  
  func setValueSafely(field: String!, value: Any?){
    guard self.value == nil else {
      self.value![field] = value
      return
    }
  }
  
  func getValueSafely(field: String) -> Any?{
    if let value = self.value?[field] {
      return value
    }
    return nil;
  }
  
  func toString() -> String{
    guard self.value != nil else{
      return ""
    }
    do {
      let data =  try JSONSerialization.data(withJSONObject:self.value!, options: .prettyPrinted)
      return NSString(data: data, encoding: String.Encoding.utf8.rawValue)! as String
    } catch {
      return ""
    }
  }
  
  public func getListKeys() -> [String]{
    if let keys = self.value?.keys {
      return Array(keys)
    }
    return [String]()
  }
}
