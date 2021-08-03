//
//  TestModule.swift
//  RNCodeBase
//
//  Created by Lam Nguyen on 03/08/2021.
//

import Foundation
import React

@objc(TestModule)
class TestModule: NSObject{
  
  @objc func add(_ a: Int, b: Int, callback: @escaping RCTResponseSenderBlock) {
    callback([[
      "ans": a+b
    ]])
  }
}
