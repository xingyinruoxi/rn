//
//  ETDShareInfoObject.m
//  eTongDai
//
//  Created by cn on 2017/8/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDShareInfoObject.h"

@implementation ETDShareInfoObject

- (id)init {
  self = [super init];
  if (self) {

  }
  return self;
}

+ (void)awake:(ETDShareInfoObject *)obj fromData:(id)data {
  obj.imgUrl = [data objectForKey:@"imgUrl"];
  obj.pageUrl = [data objectForKey:@"pageUrl"];
  obj.content = [data objectForKey:@"content"];
  obj.title = [data objectForKey:@"title"];
}

@end
