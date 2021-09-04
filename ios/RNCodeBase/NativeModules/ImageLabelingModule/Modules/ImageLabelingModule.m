//
//  ImageLabelingModule.m
//  RNCodeBase
//
//  Created by Lam Nguyen on 07/08/2021.
//
#import <Foundation/Foundation.h>
#import "RNCodeBase-Bridging-Header.h"

@interface RCT_EXTERN_MODULE(ImageLabelingModule, RCTEventEmitter)

RCT_EXTERN_METHOD(test: (int*)a)

RCT_EXTERN_METHOD(startScaningWithFilter: (NSArray*)filters)

RCT_EXTERN_METHOD(stopScanning)

RCT_EXTERN_METHOD(grantPermission: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end

