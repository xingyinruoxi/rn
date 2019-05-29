//
//  NotificationService.h
//  eTongDaiNotifyService
//
//  Created by cn on 2017/11/2.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>

@interface NotificationService : UNNotificationServiceExtension

@end

#endif
