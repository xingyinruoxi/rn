/**
 * Created by glzc on 2017/7/6.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import {MoreStyles} from './../../../styles/more/moreStyle';
import Line from './../../../commons/line';
export default class ListItem extends Component{
    constructor(props){
       super(props);
    };
    timeFormat(time){
        let date = new Date(time);
        let y=date.getFullYear(),
            m=date.getMonth()+1,
            d=date.getDate(),
            h=date.getHours(),
            min=date.getMinutes(),
            s=date.getSeconds();
        return y+'-'+(m<10 ? '0'+m : m)+'-'+(d<10 ? '0'+d : d)+' '+(h<10 ? '0'+h : h)+':'+(min<10 ? '0'+min : min);
    };
    keepMinutes(str){
        if(typeof str === 'string'){
            let idx = str.lastIndexOf(':');
            return str.slice(0, idx)
        } else {
            return this.timeFormat(str)
        }
    };
    render(){
		let { color } = this.props;
        if(this.props.isMessage){
            return (
                    <View>
                        <View style={MoreStyles.listItem}>
                            <View style={[MoreStyles.listItemSpace,MoreStyles.flexRow]}>
                                <Text allowFontScaling={false} style={[MoreStyles.messageTitle,!this.props.unRead && {color: '#c5c5c5'}]} numberOfLines={1}>{this.props.title}</Text>
                                <View style={[MoreStyles.myMessage,MoreStyles.flexRow]}>
                                    <Text allowFontScaling={false} style={[MoreStyles.subTitle,MoreStyles.marginRight,!this.props.unRead && {color: '#c5c5c5'}]}>{this.props.type === 0 ? this.keepMinutes(this.props.date) : this.timeFormat(this.props.date)}9999</Text>
                                    <Image style={MoreStyles.icon} source={require('./../../../imgs/more/left_icon.png')} />
                                </View>
                            </View>
                        </View>
                        { this.props.last ? null : <View style={MoreStyles.line}><Line full/></View>}
                    </View>
                )
        }else{
            return (
                <View>
                    <TouchableOpacity activeOpacity={0.8} style={[MoreStyles.listItem,color && {backgroundColor: color}]} onPress={this.props.callBack}>
                        <View style={MoreStyles.listItemSpace}>
                        {
                            this.props.rightText && this.props.callBack ?
                                <View style={MoreStyles.listContent}>
                                    <Text allowFontScaling={false} style={[MoreStyles.title,]}>{this.props.title}</Text>
                                    <View style={MoreStyles.right}>
                                        <Text allowFontScaling={false} style={[MoreStyles.title,MoreStyles.marginRight]}>{this.props.rightText}</Text>
                                        <Image style={MoreStyles.icon} source={require('./../../../imgs/more/left_icon.png')} />
                                    </View>
                                </View>
                                : this.props.rightText ?
                                <View style={MoreStyles.listContent}>
                                    <Text allowFontScaling={false} style={MoreStyles.title}>{this.props.title}</Text>
                                    <Text allowFontScaling={false} style={MoreStyles.title}>{this.props.rightText}</Text>
                                </View>
                                : this.props.point ?
                                <View style={MoreStyles.listContent}>
                                    <View style={{position: 'relative'}}>
                                        <View style={[MoreStyles.point,MoreStyles.pointPosition]}></View>
                                        <Text allowFontScaling={false} style={[MoreStyles.title]}>{this.props.title}</Text>
                                    </View>
                                    <Image style={MoreStyles.icon} source={require('./../../../imgs/more/left_icon.png')} />
                                </View>
                                : this.props.myMessageItem ?
                                <View style={MoreStyles.listContent}>
                                    <View>
                                        <Text allowFontScaling={false} style={MoreStyles.myMessagetitle}>{this.props.myMessageItem.title}</Text>
                                        <Text allowFontScaling={false} style={MoreStyles.myMessagetitle}>{this.props.myMessageItem.time}</Text>
                                    </View>
                                    <Image style={MoreStyles.icon} source={require('./../../../imgs/more/left_icon.png')} />
                                </View>
                                :
                                <View style={MoreStyles.listContent}>
                                    <Text allowFontScaling={false} style={[MoreStyles.title,,color&&{color: '#fff'}]}>{this.props.title}</Text>
                                    <Image style={MoreStyles.icon} source={require('./../../../imgs/more/left_icon.png')} />
                                </View>
                        }
                        </View>
                    </TouchableOpacity>
                    { this.props.last ? null :  <Line full={true} />}
                </View>
            )
        }
    }
}