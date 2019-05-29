/**
 * eTongDai React Native App
 * This is loading page
 */
'use strict';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';
var Util = require("./util");

module.exports = React.createClass({

  getInitialState() {
    return {
      modalVisible: false,
      transparent: true,
      msg: '正在努力加载...'
    }
  },

  render: function() {
    return (
      <View style={[styles.container]}>
          <ActivityIndicator
            style={styles.loading}
            color="#fff"
            size="large"
          />
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },
  loading: {
    height: Util.pixel * 200,
    minWidth: Util.pixel * 80,
    alignItems: 'center',
    padding: Util.pixel * 10
  },
});