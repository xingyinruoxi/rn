//
//  ETDBannerView.m
//  eTongDai
//
//  Created by cn on 2017/8/15.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDBannerView.h"
#import "ZYBannerView.h"
#import "ETDBannerObject.h"
#import "AFNetworking.h"
#import "UIImageView+AFNetworking.h"

@interface ETDBannerView () <ZYBannerViewDelegate, ZYBannerViewDataSource>

@property (strong, nonatomic) ETDBannerObject *bannerObject;
@property (weak, nonatomic) IBOutlet ZYBannerView *bannerView;

@end

@implementation ETDBannerView

- (void)awakeFromNib {
  [super awakeFromNib];
  
  [self configData];
  [self configUI];
}

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

#pragma mark - data

- (void)configData {
  self.bannerObject = [[ETDBannerObject alloc] init];
}

#pragma mark - ui

- (void)configUI {
  self.bannerView.frame = self.bounds;
  self.bannerView.dataSource = self;
  self.bannerView.delegate = self;
  
  self.bannerView.shouldLoop = YES;
  self.bannerView.autoScroll = YES;
  
  self.bannerView.pageControlFrame = CGRectMake(0, self.bounds.size.height - 20, self.bounds.size.width, 20);
}

- (void)updateUI {
  [self.bannerView reloadData];
}

#pragma mark - public fun

+ (UIView *)createView {
  NSArray *array = [[NSBundle mainBundle] loadNibNamed:@"ETDBannerView" owner:self options:nil];
  UIView *view = [array objectAtIndex:0];
  return view;
}

- (void)setBannerData:(NSString *)bannerData {
  _bannerData = bannerData;
  
  if (nil != bannerData) {
    id res = [NSJSONSerialization JSONObjectWithData:[bannerData dataUsingEncoding:NSUTF8StringEncoding]
                                             options:NSJSONReadingMutableLeaves
                                               error:nil];
    
    [ETDBannerObject awake:self.bannerObject fromData:res];
    [self updateUI];
  }
}

#pragma mark - ZYBannerViewDelegate

- (void)banner:(ZYBannerView *)banner didSelectItemAtIndex:(NSInteger)index {
  if (self.onItemClick) {
    NSDictionary *itemDic = [self.bannerObject.bannerArray objectAtIndex:index];
    self.onItemClick(itemDic);
  }
}

#pragma mark - ZYBannerViewDataSource

- (NSInteger)numberOfItemsInBanner:(ZYBannerView *)banner {
  NSArray *array = self.bannerObject.bannerArray;
  return [array count];
}

- (UIView *)banner:(ZYBannerView *)banner viewForItemAtIndex:(NSInteger)index {
//  picGoUrl = "http://";
//  picTitle = "wap\U6d4b\U8bd5i1";
//  picUrl = "http://news.cg.etongdai.org/u/cms/www/201707/141751399lai.jpg";
  
  NSDictionary *itemDic = [self.bannerObject.bannerArray objectAtIndex:index];
  
  UIImageView *imgView = [[UIImageView alloc] initWithFrame:banner.bounds];
  imgView.contentMode = UIViewContentModeScaleToFill;
  imgView.clipsToBounds = YES;
  
  [imgView setImageWithURL:[NSURL URLWithString:[itemDic objectForKey:@"picUrl"]]];
  
//  UILabel *label = [[UILabel alloc] initWithFrame:banner.bounds];
//  label.text = [itemDic objectForKey:@"picTitle"];
//  [imgView addSubview:label];
  
  return imgView;
}

@end
