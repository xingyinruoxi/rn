//
//  NSData+MD5.m
//  ETDApp
//
//  Created by cn on 2017/6/21.
//  Copyright © 2017年 cn. All rights reserved.
//

#import "NSData+MD5.h"
// Need to import for CC_MD5 access
#import <CommonCrypto/CommonDigest.h>
#include <string.h>

@implementation NSData (MD5)

#pragma mark - public fun

- (NSString *)MD5
{
    unsigned char result[16];
    CC_MD5( self.bytes, (CC_LONG)self.length, result); // This is the md5 call
    return [NSString stringWithFormat:
            @"%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x",
            result[0], result[1], result[2], result[3],
            result[4], result[5], result[6], result[7],
            result[8], result[9], result[10], result[11],
            result[12], result[13], result[14], result[15]];
}

#pragma mark - private fun


@end
