#import <Foundation/Foundation.h>
#import "RNCodeBase-Bridging-Header.h"

@interface RCT_EXTERN_MODULE(PermissionModule, NSObject)

RCT_EXTERN_METHOD(grantPermission: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end

