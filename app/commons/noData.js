/**
 * eTongDai React Native App
 * This is no data view
 */
'use strict';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
var Util = require("./util");

module.exports = React.createClass({

  getInitialState() {
    return {
      
    }
  },

  render: function() {
    return (
      <View style={[styles.container]}>
          <Image style={styles.noDataImg} source={require('./../imgs/commons/noData_icon.png')} />
          <Text allowFontScaling={false} style={styles.noDataText}>暂无数据</Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff',
    flexDirection:'column',
    alignItems: 'center',
  },
  noDataImg: {
    marginTop:Util.pixel * 100,
  },
  noDataText:{
    marginTop:Util.pixel * 20,
    fontSize:Util.commonFontSize(14),
    color:'#9d9d9d',
  },
});