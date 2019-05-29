import React,{Component} from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import Util from './../../../commons/util';

export default class AdEnter extends Component {
    constructor(props) {
        super(props);
        this.navigation = this.props.navigation;
    };
    _toPage(){
			console.log('this.props.data.picGoUrl', this.props.data.picGoUrl)
        this.navigation.navigate('webview', {source: {uri: this.props.data.picGoUrl}, title: this.props.data.picTitle, h5Page: false})
    };
    render() {
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={this._toPage.bind(this)}
                style={adEnterStyle.container}
                >
                <Image source={{uri: this.props.data.picUrl}} style={adEnterStyle.container} />
            </TouchableOpacity>
        )
    }
}

const adEnterStyle = StyleSheet.create({
    container: {
        width: Util.pixel*60,
        height: Util.pixel*60,
    }
});