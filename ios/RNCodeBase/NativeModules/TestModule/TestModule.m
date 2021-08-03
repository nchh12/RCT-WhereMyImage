//
//  TestModule.m
//  RNCodeBase
//
//  Created by Lam Nguyen on 03/08/2021.
//
#import <Foundation/Foundation.h>
#import "RNCodeBase-Bridging-Header.h"

@interface RCT_EXTERN_MODULE(TestModule, NSObject)

RCT_EXTERN_METHOD(add: (int*)a
                  b: (int*)b
                  callback: (RCTResponseSenderBlock)callback)
@end

