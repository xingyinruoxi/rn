//
//  ETDContactsObject.h
//  eTongDai
//
//  Created by cn on 2017/7/19.
//  Copyright © 2017年 Facebook. All rights reserved.
//
//  通讯录数据建模
//

#import <Foundation/Foundation.h>
#import "ETDPersonContactObject.h"

@interface ETDContactsObject : NSObject

@property (strong, nonatomic) NSMutableDictionary<NSString *, NSMutableArray<ETDPersonContactObject *> *> *contacts;
//@property (strong, nonatomic) NSMutableArray<ETDPersonContactObject *> *contacts;

- (void)addContactItem:(ETDPersonContactObject *)itemObj;

// 获取姓名首字母数组
- (NSArray *)nameFirstLetterArray;

// 跟进首字母获取部分数据
- (NSArray<ETDPersonContactObject *> *)contactsWithFirstLetter:(NSString *)firstLetter;

@end
