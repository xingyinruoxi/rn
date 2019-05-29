//
//  ETDMyInvesdetailRequest.h
//  ETDApp
//
//  Created by 侯文龙 on 2017/7/12.
//  Copyright © 2017年 cn. All rights reserved.
//
// 我的投资详情
//

#import "TUBaseRequest.h"



@interface ETDMyInvesdetailRequest : TUBaseRequest

@property (nonatomic, copy, nonnull)  NSString *rsbId;           // 批号编次
@property (nonatomic, copy, nonnull)  NSString *claId;           // 债权编码
@property (nonatomic, copy, nullable) NSString *claModifyTime;   // 计息时间

@end




