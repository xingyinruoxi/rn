/**
 * Created by liuzhenli on  17/8/23.
 * 需要一个状态机 : optionSelected: -1,  标记选中的option的角标
 * 需要有一个回调函数,将选中的option的值取回: onSelect();
 *          回调函数中的参数:
 *            index: 当前选中选项的角标
 *            title: 当前选中选项的标题
 *            answer: 当前选中选项的option
 */
import React from 'react';
var Util = require("./../../common/util");
modul.export = React.createClass({
    getInitialState(){
        return{
            optionSelected: -1,
        }
    },
    onSelect(index,title,answer) {

    },
    render(){
        return(
            <Radio onSelect={this.onSelect} defaultSelect={this.state.optionSelected - 1}>
                <Option
                    color="gray"
                    selectedColor="#81e0e4"
                    style={{ paddingTop: 0, paddingLeft: 10 ,height:20,width:200,}}
                    title={item.title}>
                    <Text allowFontScaling={false} style={{fontSize:Util.pixel * 12,color:'gray'}} title={row.title}>
                        选项
                    </Text>
                </Option>
            </Radio>
        )
    }
})