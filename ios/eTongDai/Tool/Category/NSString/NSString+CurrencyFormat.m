//
//  NSString+CurrencyFormat.m
//  ETDApp
//
//  Created by cn on 2017/6/27.
//  Copyright © 2017年 cn. All rights reserved.
//

#import "NSString+CurrencyFormat.h"

@implementation NSString (CurrencyFormat)

#pragma mark - public fun

- (NSAttributedString *)currencyFromatAttributedString {
    NSString *money = self;
    NSArray *array = [money componentsSeparatedByString:@"."];
    NSMutableAttributedString *attribute = nil;
    
    money = array[0];
    
    if (money.length <= 4)
    {
        NSString *str = [NSString stringWithFormat:@"%d元",[money intValue]];
        attribute = [[NSMutableAttributedString alloc] initWithString:str];
        [attribute addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:15] range:[str rangeOfString:@"元"]];
    }
    
    if (money.length > 4&& money.length <= 8)
    {
        // 整数位大于4小于8时，分割为两部分，再拼上小数点后的数字
        NSString *first = [money substringToIndex:money.length-4];
        NSString *second = [money substringFromIndex:money.length-4];
        NSString *str = [NSString stringWithFormat:@"%d万%d元",first.intValue,second.intValue];
        attribute = [[NSMutableAttributedString alloc] initWithString:str];
        [attribute addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:15] range:[str rangeOfString:@"万"]];
        [attribute addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:15] range:[str rangeOfString:@"元"]];
    }
    
    if (money.length >= 8)
    {
        //整数位大于8时
        NSString *calculate = [money substringToIndex:money.length-8];
        NSString *myriad = [money substringToIndex:money.length -4];
        myriad = [myriad substringFromIndex:calculate.length];
        NSString *individual = [money substringFromIndex:money.length -4];
        money = [NSString stringWithFormat:@"%d亿%d万%d元",calculate.intValue,myriad.intValue,individual.intValue];
        attribute = [[NSMutableAttributedString alloc] initWithString:money];
        [attribute addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:15] range:[money rangeOfString:@"亿"]];
        [attribute addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:15] range:[money rangeOfString:@"万"]];
        [attribute addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:15] range:[money rangeOfString:@"元"]];
    }
    
    return attribute;
}

#pragma mark - private fun

@end
