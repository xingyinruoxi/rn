/**
 * Created by glzc on 2017/11/20.
 */
import React,{Component} from 'react';
import {
    View,
    Image,
    StyleSheet,
} from 'react-native';

import Util from './../../../commons/util';

export default class SortIcon extends Component{
    constructor(props){
        super(props)
    };
    render(){
        let {type} = this.props
        return (
            <View>
                {
                    type === 0 ?
                        <Image source={require('./../../../imgs/projectList/active_sort_icon.png')} />
                        :
                        type === 1 ?
                            <Image source={require('./../../../imgs/projectList/active_sort_up_icon.png')} />
                            :
                            type === 2 ?
                                <Image source={require('./../../../imgs/projectList/active_sort_down_icon.png')} />
                                :
                                <Image source={require('./../../../imgs/projectList/sort_icon.png')} />
                }
            </View>
        )
    }
}

const sortIconStyle = StyleSheet.create({
    content: {
        width: Util.pixel*6,
        height: Util.pixel*3,
        position: 'relative',
    }
})