/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <UIKit/UIKit.h>
#import "AppDelegate.h"
#import <tingyunApp/NBSAppAgent.h>

int main(int argc, char * argv[]) {
  @autoreleasepool {
    //  启动听云
//    [NBSAppAgent setHttpEnabled:YES];
//    [NBSAppAgent setRedirectURL:@"tyun.etongdai.com"];
//    [NBSAppAgent startWithAppID:@"f09f30911909461cb2de5ccdd1484f4b"];
    
    return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
  }
}
