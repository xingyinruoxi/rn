/**
 * eTongDai React Native App
 * This define app line component
 * @John
 */
'use strict';
import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
var util = require('./util');
module.exports = React.createClass({

  render: function() {
      let { color ,height} = this.props;
    return (
      <View style={[styles.line,this.props.style,height && {height: height},color && {backgroundColor:color},{width: util.size.width-28,},this.props.full && {width: util.size.width}]}/>
    );
  }
});

const styles = StyleSheet.create({
  line: {
    backgroundColor: '#e8e8e8',
    // height: 1,
    height: StyleSheet.hairlineWidth,
    alignSelf:'center'
  },
});