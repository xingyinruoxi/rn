/**
 * Created by liuzhenli on 2017/7/10.
 */

'use strict';
import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
var Util = require('./util');
module.exports = React.createClass({

    render: function() {
        var addStyle = {
            height: Util.pixel * this.props.height || Util.pixel * 16,
            backgroundColor: this.props.color || "#fff",
            width: this.props.width * Util.pixel  || StyleSheet.hairlineWidth ,
        };
        return (
            <View style={[addStyle ,this.props.style]} />
        );
    }
});