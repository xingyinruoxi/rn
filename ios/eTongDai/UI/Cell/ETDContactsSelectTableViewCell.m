//
//  ETDContactsSelectTableViewCell.m
//  eTongDai
//
//  Created by cn on 2017/7/19.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDContactsSelectTableViewCell.h"

@interface ETDContactsSelectTableViewCell ()

@property (weak, nonatomic) IBOutlet UIButton *selectButton;
@property (weak, nonatomic) IBOutlet UILabel *nameLabel;
@property (weak, nonatomic) IBOutlet UILabel *phoneLabel;

@end

@implementation ETDContactsSelectTableViewCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

#pragma mark - public fun

- (void)setName:(NSString *)name phone:(NSString *)phone {
  self.nameLabel.text = name;
  self.phoneLabel.text = phone;
}

- (void)setIsSelect:(BOOL)isSelected {
  if (isSelected) {
    [self.selectButton setBackgroundImage:[UIImage imageNamed:@"common_selected"] forState:UIControlStateNormal];
  }
  else {
    [self.selectButton setBackgroundImage:[UIImage imageNamed:@"common_unselect"] forState:UIControlStateNormal];
  }
}

@end
