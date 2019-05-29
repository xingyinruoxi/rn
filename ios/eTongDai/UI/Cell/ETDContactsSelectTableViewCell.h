//
//  ETDContactsSelectTableViewCell.h
//  eTongDai
//
//  Created by cn on 2017/7/19.
//  Copyright © 2017年 Facebook. All rights reserved.
//
//  短信邀请cell
//

#import <UIKit/UIKit.h>

@interface ETDContactsSelectTableViewCell : UITableViewCell

- (void)setName:(NSString *)name phone:(NSString *)phone;

- (void)setIsSelect:(BOOL)isSelected;

@end
