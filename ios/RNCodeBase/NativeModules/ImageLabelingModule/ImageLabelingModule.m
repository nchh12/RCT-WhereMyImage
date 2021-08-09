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

RCT_EXPORT_METHOD(asyncStartScaningWithFilter: (NSArray*)filters{
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
  });
})

@end

