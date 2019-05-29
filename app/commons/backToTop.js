/**
 * eTongDai React Native App
 * This is component back to top, used with list view
 * The list view should define ref equal to listview
 * @John
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
var Util = require("./util");

module.exports = React.createClass({

  _onPress() {
      if(this.props.root.flatList){
          this.props.root.flatList.scrollToOffset({x: 0, y: 0, animated: true});
          this.props.root.setState({showToTop: false})
      }else{
          if (this.props.root.refs.listview._listViewRef == undefined && this.props.root.refs.listview._listView == undefined) {
              this.props.root.refs.listview.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true
              });
          } else if(this.props.root.refs.listview._listView){
              this.props.root.refs.listview._listView.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true
              });
          }else{
              this.props.root.refs.listview._listViewRef.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true
              });
          }
      }

  },

  render: function() {
    let config = this.props;
    return (
      <TouchableOpacity
        onPress={this._onPress} 
        style={[styles.toTop,{bottom: this.props.isHome ? Util.isIOS ? Util.pixel * 30 :Util.pixel * 10 : Util.pixel * 10}]}>
        <Image source={require('./../imgs/commons/scroll-to-top.png')} style={styles.image} />
      </TouchableOpacity>
    );
  }
});

const styles = StyleSheet.create({
  toTop: {
    flex: 1,
    position: 'absolute',
    right:Util.pixel*20,
  },
  image: {
    width: Util.pixel === 1 ? Util.pixel * 33 : Util.pixel * 40,
    height: Util.pixel === 1 ? Util.pixel * 33 : Util.pixel * 40,
    borderRadius: Util.pixel === 1 ? Util.pixel * 17 : Util.pixel * 20,
  },
});