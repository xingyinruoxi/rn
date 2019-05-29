//
//  ETDRepaymentDateOfMonthObject.m
//  eTongDai
//
//  Created by cn on 2017/7/21.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDRepaymentDateOfMonthObject.h"

@implementation ETDRepaymentDateOfMonthObject

- (id)init {
  self = [super init];
  if (self) {
    self.list = [[NSMutableArray alloc] initWithCapacity:10];
  }
  return self;
}

#pragma mark - public fun

+ (void)awake:(ETDRepaymentDateOfMonthObject *)obj fromData:(id)data {
  [obj.list removeAllObjects];
  
  id bodyObj = [data objectForKey:@"body"];
  
  obj.planSumYuanMonth = [[bodyObj objectForKey:@"planSumYuanMonth"] floatValue];
  obj.actualSumYuanMonth = [[bodyObj objectForKey:@"actualSumYuanMonth"] floatValue];
  
  id listObj = [bodyObj objectForKey:@"list"];
  for (id temp in listObj) {
    [obj.list addObject:temp];
  }
}

@end
