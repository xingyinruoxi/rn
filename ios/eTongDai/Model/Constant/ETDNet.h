//
//  ETDNet.h
//  ETDApp
//
//  Created by cn on 2017/6/28.
//  Copyright © 2017年 cn. All rights reserved.
//

#ifndef ETDNet_h
#define ETDNet_h

// 网络请求方式
typedef NS_ENUM(NSInteger, ETDRequestMode) {
    ETDRefresh = 0,
    ETDGetMore,
};

#define ETD_API_Host        @"api.cg.etongdai.org"
#define ETD_API_Protocol    @"https://"


#endif /* ETDNet_h */
