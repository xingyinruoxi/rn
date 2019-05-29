//
//  ETDHomepageView.m
//  eTongDai
//
//  Created by cn on 2017/12/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDHomepageView.h"
#import "UIScrollView+MJRefresh.h"
#import "MJRefreshNormalHeader.h"

@implementation ETDHomepageView

RCT_EXPORT_MODULE();

- (void)awakeFromNib {
  [super awakeFromNib];
  
  //声明tableView的位置 添加下面代码
  if (@available(iOS 11.0, *)) {
    self.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
    //        self.homeTableView.contentInset = UIEdgeInsetsMake(0, 0, 0, 0);
    //        self.homeTableView.scrollIndicatorInsets = self.homeTableView.contentInset;
  }
  
  // 下拉刷新
  MJRefreshNormalHeader *mj_header = [MJRefreshNormalHeader headerWithRefreshingTarget:self
                                                    refreshingAction:@selector(refreshTable)];
//  mj_header.arrowView.image = nil;
//  mj_header.stateLabel.hidden = YES;
  mj_header.lastUpdatedTimeLabel.hidden = YES;
  [mj_header setTitle:self.refreshTitle forState:MJRefreshStateIdle];
  [mj_header setTitle:@"" forState:MJRefreshStatePulling];
  [mj_header setTitle:@"" forState:MJRefreshStateRefreshing];
  [mj_header setTitle:@"" forState:MJRefreshStateWillRefresh];
  [mj_header setTitle:@"" forState:MJRefreshStateNoMoreData];
  self.mj_header = mj_header;
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(refreshFinished)
                                               name:@"onPullRefreshFinished"
                                             object:nil];
}

/*
 // Only override drawRect: if you perform custom drawing.
 // An empty implementation adversely affects performance during animation.
 - (void)drawRect:(CGRect)rect {
 // Drawing code
 }
 */

- (void)refreshTable {
  if (self.onPullRefresh) {
    self.onPullRefresh(nil);
  }
}

- (void)refreshFinished {
  [self.mj_header endRefreshing];
}

- (void)setContentHeight:(NSString *)contentHeight {
  _contentHeight = contentHeight;
  
  if (nil != contentHeight) {
    self.contentSize = CGSizeMake([UIScreen mainScreen].bounds.size.width,
                                  [contentHeight floatValue]);
  }
}

- (void)setRefreshTitle:(NSString *)refreshTitle {
  _refreshTitle = refreshTitle;
  
  [(MJRefreshNormalHeader *)self.mj_header setTitle:_refreshTitle forState:MJRefreshStatePulling];
  [(MJRefreshNormalHeader *)self.mj_header setTitle:_refreshTitle forState:MJRefreshStateRefreshing];
  [(MJRefreshNormalHeader *)self.mj_header setTitle:_refreshTitle forState:MJRefreshStateIdle];
}

RCT_EXPORT_METHOD(onPullRefreshFinished) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [[NSNotificationCenter defaultCenter] postNotificationName:@"onPullRefreshFinished" object:nil];
    });
}


+ (UIView *)createView {
  NSArray *array = [[NSBundle mainBundle] loadNibNamed:@"ETDHomepageView" owner:self options:nil];
  UIView *view = [array objectAtIndex:0];
  NSArray *subViews = [view subviews];
  return [subViews objectAtIndex:0];
}

@end
