/**
 * Created by glzc on 2017/12/28.
 */
import React,{Component} from 'react';
import {
    requireNativeComponent
} from 'react-native';

//just for IOS
const ETDHomepageView = requireNativeComponent('ETDHomepageView', HomeScrollView)
export default class HomeScrollView extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <ETDHomepageView {...this.props}>{this.props.children}</ETDHomepageView>
        )
    }
}