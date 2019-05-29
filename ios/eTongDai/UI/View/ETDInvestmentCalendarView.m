//
//  ETDInvestmentCalendarView.m
//  eTongDai
//
//  Created by cn on 2017/7/21.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDInvestmentCalendarView.h"
#import "FSCalendar.h"
#import "ETDRepaymentDateOfMonthObject.h"
#import "ETDRepaymentDateOfMonthRequest.h"
#import "TUNetworking.h"
#import "UIColor+HEX.h"
#import "ETDTheme.h"

@interface ETDInvestmentCalendarView () <FSCalendarDelegate, FSCalendarDataSource>

// data
@property (strong, nonatomic) ETDRepaymentDateOfMonthObject *repaymentDateOfMonthObject;
@property (strong, nonatomic) NSCalendar *gregorian;

// ui
@property (weak, nonatomic) IBOutlet FSCalendar *calendarView;

@end

@implementation ETDInvestmentCalendarView

RCT_EXPORT_MODULE();

/*
 // Only override drawRect: if you perform custom drawing.
 // An empty implementation adversely affects performance during animation.
 - (void)drawRect:(CGRect)rect {
 // Drawing code
 }
 */

- (void)awakeFromNib {
  [super awakeFromNib];
  
  [self configUI];
  [self configData];
  [self updateUI];
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(changeToCurrentMonth)
                                               name:@"changeToCurrentMonth"
                                             object:nil];
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

#pragma mark - ui

- (void)configUI {
  self.calendarView.delegate = self;
  self.calendarView.dataSource = self;
  
  self.calendarView.locale = [NSLocale localeWithLocaleIdentifier:@"zh-CN"];
  
  // 头部
  self.calendarView.calendarHeaderView.backgroundColor = [UIColor colorWithRGB:0xb3cfef];
  
  // 周一、周二、周三……
  self.calendarView.calendarWeekdayView.backgroundColor = [UIColor colorWithRGB:0xb3cfef];
  self.calendarView.appearance.caseOptions = FSCalendarCaseOptionsWeekdayUsesSingleUpperCase;
  
  // 1,2,3,4……
  self.calendarView.appearance.titleFont = [UIFont boldSystemFontOfSize:14];
  
//  self.calendarView.cal .caseOptions = FSCalendarCaseOptionsWeekdayUsesSingleUpperCase;
}

- (void)updateUI {

}

#pragma mark - action

- (IBAction)preMonthButtonPressed:(id)sender {
  NSDate *currentMonth = self.calendarView.currentPage;
  NSDate *previousMonth = [self.gregorian dateByAddingUnit:NSCalendarUnitMonth value:-1 toDate:currentMonth options:0];
  [self.calendarView setCurrentPage:previousMonth animated:YES];
}

- (IBAction)nextMonthButtonPressed:(id)sender {
  NSDate *currentMonth = self.calendarView.currentPage;
  NSDate *nextMonth = [self.gregorian dateByAddingUnit:NSCalendarUnitMonth value:1 toDate:currentMonth options:0];
  [self.calendarView setCurrentPage:nextMonth animated:YES];
}

- (void)changeToCurrentMonth {
  NSDate *currentMonth = [self getNowDateFromatAnDate:[NSDate date]];
  NSDate *previousMonth = [self.gregorian dateByAddingUnit:NSCalendarUnitMonth value:0 toDate:currentMonth options:0];
  [self.calendarView setCurrentPage:previousMonth animated:YES];
}

#pragma mark - net

- (void)requestCurrentMonthData {
  NSDate *date = [self getNowDateFromatAnDate:self.calendarView.currentPage];
  NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
  [dateFormat setDateFormat:@"yyyy-MM"];
  NSString *dateString = [dateFormat stringFromDate:date];
  [self sendRepaymentDateOfMonthRequest:dateString];
}

- (void)sendRepaymentDateOfMonthRequest:(NSString *)date {
  NSLog(@"date:%@", date);
  if (self.onRequestData) {
    self.onRequestData(@{@"date":date});
  }
  //  __weak ETDInvestmentCalendarView *weakSelf = self;
  //
  //  ETDRepaymentDateOfMonthRequest *request = [[ETDRepaymentDateOfMonthRequest alloc] init];
  //  request.date = date;
  //  request.sessionId = self.sessionId;
  //  request.uid = self.uid;
  //  [request sendRequestWithSuccess:^(__kindof TUBaseRequest * _Nonnull baseRequest, id  _Nullable responseObject) {
  //    [ETDRepaymentDateOfMonthObject awake:weakSelf.repaymentDateOfMonthObject fromData:responseObject];
  //    [weakSelf.calendarView reloadData];
  //    [weakSelf updateUI];
  //  }
  //                           failur:^(__kindof TUBaseRequest * _Nonnull baseRequest, NSError * _Nonnull error) {
  //
  //                           }];
}

#pragma mark - data

RCT_EXPORT_METHOD(changeDisplayMonth:(NSString *)month) {
  if (nil != month) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [[NSNotificationCenter defaultCenter] postNotificationName:@"changeToCurrentMonth" object:nil];
    });
  }
}

- (void)setCurrentMonthData:(NSString *)currentMonthData {
  _currentMonthData = currentMonthData;
  
  if (nil != currentMonthData) {
    id res = [NSJSONSerialization JSONObjectWithData:[currentMonthData dataUsingEncoding:NSUTF8StringEncoding]
                                             options:NSJSONReadingMutableLeaves
                                               error:nil];
    [ETDRepaymentDateOfMonthObject awake:self.repaymentDateOfMonthObject fromData:res];
    [self.calendarView reloadData];
    [self updateUI];
  }
}

- (void)configData {
  self.repaymentDateOfMonthObject = [[ETDRepaymentDateOfMonthObject alloc] init];
  
  self.gregorian = [[NSCalendar alloc] initWithCalendarIdentifier:NSCalendarIdentifierGregorian];
}

- (void)setSessionId:(NSString *)sessionId {
  //  _sessionId = sessionId;
  //
  //  if (nil != _uid && nil != _sessionId) {
  //    // net
  //    [self requestCurrentMonthData];
  //  }
}

- (void)setUid:(NSString *)uid {
  //  _uid = uid;
  //
  //  if (nil != _uid && nil != _sessionId) {
  //    // net
  //    [self requestCurrentMonthData];
  //  }
}

#pragma mark - public fun

+ (UIView *)createView {
  NSArray *array = [[NSBundle mainBundle] loadNibNamed:@"ETDInvestmentCalendarView" owner:self options:nil];
  UIView *view = [array objectAtIndex:0];
  return view;
}

#pragma mark - FSCalendarDataSource
/*
 - (nullable NSString *)calendar:(FSCalendar *)calendar titleForDate:(NSDate *)date {
 
 }
 */
//- (nullable NSString *)calendar:(FSCalendar *)calendar subtitleForDate:(NSDate *)_date {
//  NSDate *date = [self getNowDateFromatAnDate:_date];
//  NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
//  [dateFormat setDateFormat:@"yyyy-MM-dd"];
//  NSString *dateString = [dateFormat stringFromDate:date];
//  if ([self.repaymentDateOfMonthObject.list containsObject:dateString]) {
//    return @"有回款";
//  }
//
//  return nil;
//}

//- (nullable UIImage *)calendar:(FSCalendar *)calendar imageForDate:(NSDate *)_date {
//  NSDate *date = [self getNowDateFromatAnDate:_date];
//  NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
//  [dateFormat setDateFormat:@"yyyy-MM-dd"];
//  NSString *dateString = [dateFormat stringFromDate:date];
//  if ([self.repaymentDateOfMonthObject.list containsObject:dateString]) {
//    return [UIImage imageNamed:@"account_returned_money"];
//  }
//
//  return nil;
//}
/*
 - (NSDate *)minimumDateForCalendar:(FSCalendar *)calendar {
 
 }
 
 - (NSDate *)maximumDateForCalendar:(FSCalendar *)calendar {
 
 }
 
 - (__kindof FSCalendarCell *)calendar:(FSCalendar *)calendar cellForDate:(NSDate *)date atMonthPosition:(FSCalendarMonthPosition)position {
 
 }
 
 - (NSInteger)calendar:(FSCalendar *)calendar numberOfEventsForDate:(NSDate *)date {
 
 }
 
 */

//- (BOOL)calendar:(FSCalendar *)calendar hasEventForDate:(NSDate *)_date FSCalendarDeprecated(-calendar:numberOfEventsForDate:) {
//  NSDate *date = [self getNowDateFromatAnDate:_date];
//  NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
//  [dateFormat setDateFormat:@"yyyy-MM-dd"];
//  NSString *dateString = [dateFormat stringFromDate:date];
//  if ([self.repaymentDateOfMonthObject.list containsObject:dateString]) {
//    return YES;
//  }
//
//  return NO;
//}

#pragma mark - FSCalendarDelegate

- (BOOL)calendar:(FSCalendar *)calendar shouldSelectDate:(NSDate *)_date atMonthPosition:(FSCalendarMonthPosition)monthPosition {
  NSDate *date = [self getNowDateFromatAnDate:_date];
  NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
  [dateFormat setDateFormat:@"yyyy-MM-dd"];
  NSString *dateString = [dateFormat stringFromDate:date];
  if ([self.repaymentDateOfMonthObject.list containsObject:dateString]) {
    return YES;
  }
  return NO;
}

- (void)calendar:(FSCalendar *)calendar didSelectDate:(NSDate *)_date atMonthPosition:(FSCalendarMonthPosition)monthPosition {
  NSDate *date = [self getNowDateFromatAnDate:_date];
  NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
  [dateFormat setDateFormat:@"yyyy-MM-dd"];
  NSString *dateString = [dateFormat stringFromDate:date];
  if ([self.repaymentDateOfMonthObject.list containsObject:dateString]) {
    if (self.onSelectDate) {
      self.onSelectDate(@{@"onSelectDate":dateString});
    }
  }
}
/*
 - (BOOL)calendar:(FSCalendar *)calendar shouldDeselectDate:(NSDate *)date atMonthPosition:(FSCalendarMonthPosition)monthPosition {
 
 }
 */
- (void)calendar:(FSCalendar *)calendar didDeselectDate:(NSDate *)date atMonthPosition:(FSCalendarMonthPosition)monthPosition {
  
}

- (void)calendar:(FSCalendar *)calendar boundingRectWillChange:(CGRect)bounds animated:(BOOL)animated {
  
}

- (void)calendar:(FSCalendar *)calendar willDisplayCell:(FSCalendarCell *)cell forDate:(NSDate *)date atMonthPosition:(FSCalendarMonthPosition)monthPosition {
  
}

- (void)calendarCurrentPageDidChange:(FSCalendar *)calendar {
  [self updateUI];
//  [self requestCurrentMonthData];
  [self performSelector:@selector(requestCurrentMonthData) withObject:nil afterDelay:0.4];
}

#pragma mark - FSCalendarDelegateAppearance

- (nullable UIColor *)calendar:(FSCalendar *)calendar appearance:(FSCalendarAppearance *)appearance fillDefaultColorForDate:(NSDate *)_date {
  NSDate *date = [self getNowDateFromatAnDate:_date];
  NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
  [dateFormat setDateFormat:@"yyyy-MM-dd"];
  NSString *dateString = [dateFormat stringFromDate:date];
  if ([self.repaymentDateOfMonthObject.list containsObject:dateString]) {
    return [UIColor colorWithRGB:0x025fcb];
  }
  
  return nil;
}

- (nullable UIColor *)calendar:(FSCalendar *)calendar appearance:(FSCalendarAppearance *)appearance fillSelectionColorForDate:(NSDate *)_date {
//  NSDate *date = [self getNowDateFromatAnDate:_date];
//  NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
//  [dateFormat setDateFormat:@"yyyy-MM-dd"];
//  NSString *dateString = [dateFormat stringFromDate:date];
//  if ([self.repaymentDateOfMonthObject.list containsObject:dateString]) {
//    return [UIColor colorWithRGB:0xf75766];
//  }
//  
//  return nil;
  return [UIColor colorWithRGB:0x025fcb];
}

- (nullable UIColor *)calendar:(FSCalendar *)calendar appearance:(FSCalendarAppearance *)appearance titleDefaultColorForDate:(NSDate *)_date {
  NSDate *date = [self getNowDateFromatAnDate:_date];
  NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
  [dateFormat setDateFormat:@"yyyy-MM-dd"];
  NSString *dateString = [dateFormat stringFromDate:date];
  if ([self.repaymentDateOfMonthObject.list containsObject:dateString]) {
    return [UIColor whiteColor];
  }
  
  return nil;
}

#pragma mark - date help

- (NSDate *)getNowDateFromatAnDate:(NSDate *)anyDate {
  //设置源日期时区
  NSTimeZone* sourceTimeZone = [NSTimeZone timeZoneWithAbbreviation:@"UTC"];//或GMT
  //设置转换后的目标日期时区
  NSTimeZone* destinationTimeZone = [NSTimeZone localTimeZone];
  //得到源日期与世界标准时间的偏移量
  NSInteger sourceGMTOffset = [sourceTimeZone secondsFromGMTForDate:anyDate];
  //目标日期与本地时区的偏移量
  NSInteger destinationGMTOffset = [destinationTimeZone secondsFromGMTForDate:anyDate];
  //得到时间偏移量的差值
  NSTimeInterval interval = destinationGMTOffset - sourceGMTOffset;
  //转为现在时间
  NSDate* destinationDateNow = [[NSDate alloc] initWithTimeInterval:interval sinceDate:anyDate];
  return destinationDateNow;
}

@end
