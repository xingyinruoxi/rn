//
//  ETDContactsSelectViewController.m
//  eTongDai
//
//  Created by cn on 2017/7/17.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ETDContactsSelectView.h"
#import "ETDContactsSelectTableViewCell.h"
#import <AddressBook/AddressBook.h>
#import "ETDContactsObject.h"
#import "ETDPersonContactObject.h"
#import <MessageUI/MessageUI.h>
#import "ETDShareInfoObject.h"

static ABAddressBookRef addBook;

@interface ETDContactsSelectView () <MFMessageComposeViewControllerDelegate>

// UI
@property (weak, nonatomic) IBOutlet UITableView *detailTableView;  // 通讯录表格
@property (weak, nonatomic) IBOutlet UIButton *batchSelectButton;   // 批量选择按钮
@property (weak, nonatomic) IBOutlet UILabel *batchNumLabel;        // “0/50”
@property (weak, nonatomic) IBOutlet UIButton *msgSendButton;

// data
@property (strong, nonatomic) ETDContactsObject *contactsObject;
@property (strong, nonatomic) ETDShareInfoObject *shareInfoObject;
@property (strong, nonatomic) NSMutableArray<NSIndexPath *> *selectArray;
@property (assign, nonatomic) NSUInteger batchMaxNum;

@end

@implementation ETDContactsSelectView

- (id)init {
  self = [super init];
  if (self) {
    
  }
  return self;
}

- (void)layoutSubviews {
  [super layoutSubviews];
}

- (void)awakeFromNib {
  [super awakeFromNib];
  
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(updateUI) name:@"updateAddressBook" object:nil];
  
  [self checkAddressBookkAuth];
  [self configData];
  [self configUI];
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

#pragma mark - public fun

+ (UIView *)createView {
  NSArray *array = [[NSBundle mainBundle] loadNibNamed:@"ETDContactsSelectView" owner:self options:nil];
  UIView *view = [array objectAtIndex:0];
  return view;
}

#pragma mark - data

- (void)configData {
  self.contactsObject = [[ETDContactsObject alloc] init];
  self.shareInfoObject = [[ETDShareInfoObject alloc] init];
  self.selectArray = [[NSMutableArray alloc] initWithCapacity:10];
  self.batchMaxNum = 50;
}

- (void)setShareInfos:(NSString *)shareInfos {
  _shareInfos = shareInfos;
  
  if (nil != shareInfos) {
    id res = [NSJSONSerialization JSONObjectWithData:[shareInfos dataUsingEncoding:NSUTF8StringEncoding]
                                             options:NSJSONReadingMutableLeaves
                                               error:nil];
    [ETDShareInfoObject awake:self.shareInfoObject fromData:res];
    NSLog(@"shareInfos:%@", res);
    NSLog(@"\n\n");
  }
}


#pragma mark - ui

- (void)updateSelectInfo {
  self.batchNumLabel.text = [NSString stringWithFormat:@"%ld/%ld", [self.selectArray count], self.batchMaxNum];
}

- (void)configUI {
  [self.batchSelectButton setImage:[UIImage imageNamed:@"common_unselect"] forState:UIControlStateNormal];
  [self.batchSelectButton setImage:[UIImage imageNamed:@"common_selected"] forState:UIControlStateSelected];
  
  self.msgSendButton.layer.cornerRadius = 5;
  self.msgSendButton.clipsToBounds = YES;
}

- (void)_updateTableView {
  [self.detailTableView reloadData];
}

- (void)updateUI {
  [self performSelectorOnMainThread:@selector(_updateTableView)
                         withObject:nil
                      waitUntilDone:YES];
}

#pragma mark - action

- (IBAction)batchSelectButtonPressed:(id)sender {
  
  NSLog(@"cn:--->batchSelectButtonPressed:(id)sender");
  
  [self.batchSelectButton setSelected:!self.batchSelectButton.isSelected];
  
  if ([sender isSelected]) {
    [self.selectArray removeAllObjects];
    
    for (int i = 0; i < [self.detailTableView numberOfSections]; i++) {
      for (int j = 0; j < [self.detailTableView numberOfRowsInSection:i]; j++) {
        if ([self.selectArray count] < self.batchMaxNum) {
          [self.selectArray addObject:[NSIndexPath indexPathForRow:j inSection:i]];
        }
      }
    }
    
  }
  else {
    [self.selectArray removeAllObjects];
    
  }
  
  [self updateSelectInfo];
  [self.detailTableView reloadData];
  
  
  NSLog(@"cn:batchSelectButtonPressed:(id)sender--->");
}

- (IBAction)sendSmsButtonPressed:(id)sender {
  NSLog(@"cn:(IBAction)sendSmsButtonPressed:(id)sender");
  if (nil != self.shareInfoObject.content &&
      nil != self.shareInfoObject.pageUrl) {
    [self smsWihtMsg:[NSString stringWithFormat:@"%@%@", self.shareInfoObject.content, self.shareInfoObject.pageUrl]
            phoneAry:[self selectPhoneArray]];
  }
}

#pragma mark - MFMessageComposeViewControllerDelegate

///发送后或者cancel退回本页面
- (void)messageComposeViewController:(MFMessageComposeViewController *)controller didFinishWithResult:(MessageComposeResult)result{
  [[UIApplication sharedApplication].keyWindow.rootViewController dismissViewControllerAnimated:YES completion:nil];
  
  if (MessageComposeResultCancelled != result) {
    if (self.onPopSelf) {
      self.onPopSelf(nil);
    }
  }
}

///编辑好内容跳转到系统发送短信页面
- (void)smsWihtMsg:(NSString*)msg phoneAry:(NSArray*)list{
  if ([MFMessageComposeViewController canSendText]) {
    if (nil == msg || [msg length] == 0) {
      return;
    }
    
    NSLog(@"cn:smsWihtMsg:(NSString*)msg phoneAry:(NSArray*)list");
    MFMessageComposeViewController *controller = [[MFMessageComposeViewController alloc] init];
    controller.body = msg;
    controller.recipients = list;
    controller.messageComposeDelegate = self;
    [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:controller animated:YES completion:^{
      NSLog(@"cn:[[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:controller animated:YES completion:");
    }];
  }
  else{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"您当前的设备无法发送信息"
                               message:nil
                              delegate:self
                     cancelButtonTitle:nil
                     otherButtonTitles:@"确定", nil];
    [alert show];
  }
}

#pragma mark - help fun

- (void)checkAddressBookkAuth {
  __weak ETDContactsSelectView *weakSelf = self;
  
  addBook = ABAddressBookCreateWithOptions(NULL, NULL);
  ABAddressBookRequestAccessWithCompletion(addBook, ^(bool granted, CFErrorRef error) {
    dispatch_async(dispatch_get_main_queue(), ^{
      if (granted) {
        [weakSelf getAddressBookData];
        
        [[NSNotificationCenter defaultCenter] postNotificationName:@"updateAddressBook" object:nil];
//        [weakSelf updateUI];
      }
      else {
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"已禁止“易通贷“的通讯录访问权限"
                                                        message:@"您可以在”设置“中允许”易通贷“访问本机通讯录"
                                                       delegate:self
                                              cancelButtonTitle:nil
                                              otherButtonTitles:@"确定", nil];
        [alert show];
      }
    });
  });
}

- (void)getAddressBookData {
  //获取所有联系人的数组
  CFArrayRef allLinkPeople = ABAddressBookCopyArrayOfAllPeople(addBook);
  //获取联系人总数
  CFIndex number = ABAddressBookGetPersonCount(addBook);
  
  for (int i = 0; i < number; i++) {
    //获取联系人对象的引用
    ABRecordRef person = CFArrayGetValueAtIndex(allLinkPeople, i);
    
    NSString *firstName=(__bridge NSString *)(ABRecordCopyValue(person, kABPersonFirstNameProperty));
    NSString *lastName=(__bridge NSString *)(ABRecordCopyValue(person, kABPersonLastNameProperty));
    if (nil == firstName)
    {
      firstName = @"";
    }
    if (nil == lastName) {
      lastName = @"";
    }
    NSString *userName = [NSString stringWithFormat:@"%@%@", lastName, firstName];
    NSString *firstLetter = nil;
    if ([userName length] > 0) {
      //汉字转拼音
      if ([userName length])
      {
        
        NSMutableString *ms = [[NSMutableString alloc] initWithString:userName];
        if (CFStringTransform((__bridge CFMutableStringRef)ms, 0, kCFStringTransformToLatin, NO))
        {
          //转拼音
        }
        if (CFStringTransform((__bridge CFMutableStringRef)ms, 0, kCFStringTransformStripDiacritics, NO))
        {
          //拼音去音标
          
        }
        ms = [[ms uppercaseString] mutableCopy];
        
        firstLetter = [ms substringToIndex:1];
        if (!([firstLetter characterAtIndex:0] >= 'A' && [firstLetter characterAtIndex:0] <= 'Z')) {
          firstLetter = @"#";
        }
      }
    }
    
    ABMultiValueRef phones = ABRecordCopyValue(person, kABPersonPhoneProperty);
    for (int j = 0; j < ABMultiValueGetCount(phones); j++) {
      NSString *phone = (__bridge NSString *)(ABMultiValueCopyValueAtIndex(phones, j));
      
      if ([phone length] > 0 && [userName length] > 0 && [firstLetter length] > 0) {
        ETDPersonContactObject *personObj = [[ETDPersonContactObject alloc] init];
        personObj.name = userName;
        personObj.nameFirstLetter = firstLetter;
        personObj.phone = phone;
        
        [self.contactsObject addContactItem:personObj];
//        [self.contactsObject.contacts addObject:personObj];
      }
    }
  }
}

- (NSArray *)selectPhoneArray {
  NSMutableArray *phoneArray = [[NSMutableArray alloc] initWithCapacity:10];
  for (int i = 0; i < [self.selectArray count]; i++) {
    NSIndexPath *indexPath = [self.selectArray objectAtIndex:i];
    NSArray *firstLetters = [self.contactsObject nameFirstLetterArray];
    NSString *tempStr = [firstLetters objectAtIndex:indexPath.section];
    NSArray *tempArray = [self.contactsObject contactsWithFirstLetter:tempStr];
    ETDPersonContactObject *obj = [tempArray objectAtIndex:indexPath.row];
    if (nil != obj.phone) {
      [phoneArray addObject:obj.phone];
    }
  }
  return [NSArray arrayWithArray:phoneArray];
}

#pragma mark - UITableViewDataSource

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
  NSArray *firstLetters = [self.contactsObject nameFirstLetterArray];
  return [firstLetters count];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
  NSArray *firstLetters = [self.contactsObject nameFirstLetterArray];
  NSString *tempStr = [firstLetters objectAtIndex:section];
  NSArray *tempArray = [self.contactsObject contactsWithFirstLetter:tempStr];
  return [tempArray count];
}

- (nullable NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section {
  NSArray *firstLetters = [self.contactsObject nameFirstLetterArray];
  return [firstLetters objectAtIndex:section];
}

- (nullable NSArray<NSString *> *)sectionIndexTitlesForTableView:(UITableView *)tableView {
  NSArray *firstLetters = [self.contactsObject nameFirstLetterArray];
  return firstLetters;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
  static NSString *cellIdentiferId = @"ETDContactsSelectTableViewCell";
  ETDContactsSelectTableViewCell *cell = (ETDContactsSelectTableViewCell *)[tableView dequeueReusableCellWithIdentifier:cellIdentiferId];
  if (cell == nil) {
    NSArray *nibs = [[NSBundle mainBundle]loadNibNamed:@"ETDContactsSelectTableViewCell" owner:nil options:nil];
    cell = [nibs lastObject];
  }
  
  NSArray *firstLetters = [self.contactsObject nameFirstLetterArray];
  NSString *tempStr = [firstLetters objectAtIndex:indexPath.section];
  NSArray *tempArray = [self.contactsObject contactsWithFirstLetter:tempStr];
  ETDPersonContactObject *obj = [tempArray objectAtIndex:indexPath.row];
  [cell setName:obj.name phone:obj.phone];
  [cell setIsSelect:[self.selectArray containsObject:indexPath]];
  
  return cell;
}

#pragma mark - UITableViewDelegate

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
  [tableView deselectRowAtIndexPath:indexPath animated:YES];
  
  [self.batchSelectButton setSelected:NO];
  
  if ([self.selectArray containsObject:indexPath]) {
    [self.selectArray removeObject:indexPath];
  }
  else {
    if ([self.selectArray count] < self.batchMaxNum) {
      [self.selectArray addObject:indexPath];
    }
  }
  
  [self updateSelectInfo];
  
  [tableView reloadRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationNone];
}

#pragma mark - UIAlertViewDelegate

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
  if (self.onPopSelf) {
    self.onPopSelf(nil);
  }
}

@end
