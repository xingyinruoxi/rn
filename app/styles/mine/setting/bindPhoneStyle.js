/**
 * Created by liuzhenli on 2017/12/14.
 */
import { StyleSheet } from 'react-native';
import Util from './../../../commons/util';
var commonFontSize = Util.commonFontSize;
var px = Util.pixel;
const bindPhoneStyle =  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },
  contentBox:{
    alignItems:'center',
    flex:1,
  },
  topReminderBox: {
    height: 20 * px,
    marginTop: 20 * px,
    width: Util.size.width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topReminderText: {
    fontSize: 14 * px,
    color: '#006EEE'
  },
  itemBox:{
    height: 55 * px,
    width: Util.size.width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 14 * px,
  },
  itemBoxLeft: {
    width: 30 * px,
    height: 60 * px,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 12 * px,
  },
  itemBoxRight: {
    width: 150 * px,
    height: 60 * px,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10 * px,
  },
  itemBoxCenter: {
    flex: 1,
    height: 60 * px,
    justifyContent: 'flex-end'
  },
  inputBox: {
    height: 40 * px,
    alignItems: 'flex-end'
  },
  input: {
    height: 40 * px,
    fontSize: 15* px,
    marginLeft: 5 * px
  },
  verifyCodeBox: {
    height: 30 * px,
    width: 100 * px,
    backgroundColor: '#f6f7fa',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10 * px
  },
  verifyCodeImg: {
    height: 30 * px,
    width: 100 * px
  },
  buttonBox: {
    height: 50 * px,
    width: Util.size.width,
    justifyContent: 'center',
    alignItems: 'center',

  },
  itemBoxRightButtonBox: {
    height: 40 * px,
    width: 140 * px,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  itemBoxRightButton: {
    height: 40  * px,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  itemBoxRightButtonName: {
    fontSize: 15 * px,
    color: '#888889'
  },
  bottomReminderBox: {
    height: 30 * px,
    width: Util.size.width,
    paddingLeft: 50 * px,
    justifyContent: 'center'
  },
  bottomReminder: {
    fontSize: 10 * px,
    color: '#888889'
  }
});
export {
  bindPhoneStyle
}