//
//  ETDBannerObject.m
//  eTongDai
//
//  Created by cn on 2017/8/16.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDBannerObject.h"

@implementation ETDBannerObject

- (id)init {
  self = [super init];
  if (self) {
    self.bannerArray = [[NSMutableArray alloc] initWithCapacity:10];
  }
  return self;
}

+ (void)awake:(ETDBannerObject *)obj fromData:(id)data {
  [obj.bannerArray removeAllObjects];
  
  for (id temp in data) {
    if (temp != nil) {
      [obj.bannerArray addObject:temp];
    }
  }
}

@end
