//
//  Date+Extension.swift
//  RNCodeBase
//
//  Created by Lam Nguyen on 07/08/2021.
//

import Foundation

extension Date {
  func currentTimeMillis() -> Int64 {
    return Int64(self.timeIntervalSince1970 * 1000)
  }
}
