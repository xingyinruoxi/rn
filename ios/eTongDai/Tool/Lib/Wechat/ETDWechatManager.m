//
//  ETDWechatManager.m
//  eTongDai
//
//  Created by cn on 2017/7/26.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDWechatManager.h"
#import "WXApi.h"
#import "ETDShareInfoObject.h"
#import "UIImageView+AFNetworking.h"

@interface ETDWechatManager ()

@property (nonatomic, strong) UIImageView * imgView;

@end

@implementation ETDWechatManager

RCT_EXPORT_MODULE();

//RCT_EXPORT_METHOD(registerApp:(NSString *)AppKey activePlatforms:(NSArray *)activePlatforms TotalPlatforms : (NSDictionary *)TotalPlatforms)

RCT_EXPORT_METHOD(isWXAppInstalled:(RCTResponseSenderBlock)callback)
{
  callback(@[[NSNumber numberWithBool:[WXApi isWXAppInstalled]]]);
}

RCT_EXPORT_METHOD(isWXAppSupportApi:(RCTResponseSenderBlock)callback)
{
  callback(@[[NSNumber numberWithBool:[WXApi isWXAppSupportApi]]]);
}

RCT_EXPORT_METHOD(openWXApp:(RCTResponseSenderBlock)callback)
{
  callback(@[[NSNumber numberWithBool:[WXApi openWXApp]]]);
}

RCT_EXPORT_METHOD(inviteWechatFriend:(NSString *)scene shareInfos:(NSString *)shareInfos)
{
  if (![WXApi isWXAppInstalled])
  {

    return;
  }
  
  SendMessageToWXReq* req = [[SendMessageToWXReq alloc] init];
  //发送消息类型-多媒体消息
  req.bText = NO;
  
//    req.scene = 0;//0 = 好友列表 1 = 朋友圈
    req.scene = [scene intValue];
  
  if (nil == shareInfos || [shareInfos length] == 0) {
    return;
  }
  
  // 分享数据
  id res = [NSJSONSerialization JSONObjectWithData:[shareInfos dataUsingEncoding:NSUTF8StringEncoding]
                                           options:NSJSONReadingMutableLeaves
                                             error:nil];
  ETDShareInfoObject *shareInfoObject = [[ETDShareInfoObject alloc] init];
  [ETDShareInfoObject awake:shareInfoObject fromData:res];
  
  //发送的多媒体信息
  WXMediaMessage *message = [WXMediaMessage message];
  
  //设置多媒体信息中包含的网页对象
  WXWebpageObject *ext = [WXWebpageObject object];
  message.mediaObject = ext;
  ext.webpageUrl = shareInfoObject.pageUrl;
  //发送标题
  message.title = shareInfoObject.title;
  //发送内容
  message.description = shareInfoObject.content;
  //图片
  NSString *imgUrl = shareInfoObject.imgUrl;
  if (self.imgView == nil) {
    self.imgView = [[UIImageView alloc] init];
  }
  [self.imgView setImageWithURLRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:imgUrl]]
                      placeholderImage:nil
                               success:^(NSURLRequest * _Nonnull request, NSHTTPURLResponse * _Nullable response, UIImage * _Nonnull image) {
                                 [message setThumbImage:image];
                                 
                                 //设置发送的多媒体信息
                                 req.message = message;
                                 //发送请求到微信
                                 [WXApi sendReq:req];
                               }
                               failure:^(NSURLRequest * _Nonnull request, NSHTTPURLResponse * _Nullable response, NSError * _Nonnull error) {
                                 [message setThumbImage:[UIImage imageNamed:@"default_icon"]];
                                
                                 //设置发送的多媒体信息
                                 req.message = message;
                                 //发送请求到微信
                                 [WXApi sendReq:req];
                               }];
}

@end
