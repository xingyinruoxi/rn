//
//  ETDContactsObject.m
//  eTongDai
//
//  Created by cn on 2017/7/19.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDContactsObject.h"

@interface ETDContactsObject ()

@property (strong, nonatomic) NSMutableArray *cacheFirstLetterArray;

@end

@implementation ETDContactsObject

- (id)init {
  self = [super init];
  if (self) {
//    self.contacts = [[NSMutableArray alloc] initWithCapacity:10];
    self.contacts = [[NSMutableDictionary alloc] initWithCapacity:10];
  }
  return self;
}

#pragma mark - public fun

- (void)addContactItem:(ETDPersonContactObject *)itemObj {
  if ([[self.contacts allKeys] containsObject:itemObj.nameFirstLetter]) {
    NSMutableArray *tempArray = [self.contacts objectForKey:itemObj.nameFirstLetter];
    [tempArray addObject:itemObj];
  }
  else {
    NSMutableArray *tempArray = [NSMutableArray arrayWithObject:itemObj];
    [self.contacts setObject:tempArray forKey:itemObj.nameFirstLetter];
  }
}

// 获取姓名首字母数组
- (NSArray *)nameFirstLetterArray {
  if (nil != self.cacheFirstLetterArray && [self.cacheFirstLetterArray count] > 0) {
    return self.cacheFirstLetterArray;
  }
  
  self.cacheFirstLetterArray = [NSMutableArray arrayWithArray:[self.contacts allKeys]];
  
//  NSMutableArray *tempArray = [[NSMutableArray alloc] initWithCapacity:10];
//  
//  for (int i = 0; i < [self.contacts count]; i++) {
//    ETDPersonContactObject *obj = [self.contacts objectAtIndex:i];
//    
//    if (![tempArray containsObject:obj.nameFirstLetter]) {
//      [tempArray addObject:obj.nameFirstLetter];
//    }
//  }
  
  [self.cacheFirstLetterArray sortUsingComparator:^NSComparisonResult(id  _Nonnull obj1, id  _Nonnull obj2) {
    NSString *str1 = (NSString *)obj1;
    NSString *str2 = (NSString *)obj2;
    if ([str1 isEqualToString:@"#"] || [str2 isEqualToString:@"#"]) {
      return [str2 compare:str1];
    }
    
    return [str1 compare:str2];
  }];

  return self.cacheFirstLetterArray;
}

// 跟进首字母获取部分数据
- (NSArray<ETDPersonContactObject *> *)contactsWithFirstLetter:(NSString *)firstLetter {
  NSMutableArray *tempArray = [self.contacts objectForKey:firstLetter];
  
//  for (int i = 0; i < [self.contacts count]; i++) {
//    ETDPersonContactObject *obj = [self.contacts objectAtIndex:i];
//    
//    if ([obj.nameFirstLetter isEqualToString:firstLetter]) {
//      [tempArray addObject:obj];
//    }
//  }
//  
//  [tempArray sortUsingComparator:^NSComparisonResult(id  _Nonnull obj1, id  _Nonnull obj2) {
//    ETDPersonContactObject *_obj1 = (ETDPersonContactObject *)obj1;
//    ETDPersonContactObject *_obj2 = (ETDPersonContactObject *)obj2;
//    return [_obj1.name compare:_obj2.name];
//  }];
  
  return [NSArray arrayWithArray:tempArray];
}

@end
