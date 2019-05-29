/**
 * Created by glzc on 2017/7/11.
 */
import React,{Component} from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import Util from './util';
export default class WaveLine extends Component{
    constructor(props){
        super(props);
        this.state = {
            circles: []
        }
    };
    componentWillMount(){
        let len = (this.props.height || Util.size.width)%10 == 0 ? Util.size.width/10 : parseInt(Util.size.width/10)+1
        this.setState({
            circles: this.makeCircle(len)
        })
    };
    makeCircle(n){
        let arr = [];
        for(let i=0;i<n;i++){
            arr.push(i)
        };
        return arr;
    };
    render(){
        if(!this.props.row){
            return (
                <View style={[WaveLineStyles.horizontal,{height: this.props.height}]}>
                    {
                        this.state.circles.map((v,k) =>
                                <View key={k} style={[WaveLineStyles.circleSmall,{backgroundColor: this.props.circleColor}]}></View>
                        )
                    }
                </View>
            )
        }else{
            return (
                <View style={WaveLineStyles.container}>
                    {
                        this.state.circles.map((v,k) =>
                                <View key={k} style={WaveLineStyles.circle}></View>
                        )
                    }
                </View>
            )
        }
    }
};

const WaveLineStyles = StyleSheet.create({
    container: {
        height: Util.pixel*10,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    circle: {
        width: Util.pixel*10,
        height: Util.pixel*10,
        borderRadius: Util.pixel*10,
        backgroundColor: '#ffffff'
    },
    horizontal: {
        width: Util.pixel*10,
        height: Util.pixel*80,
        overflow: 'hidden',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    circleSmall: {
        width: Util.pixel*10,
        height: Util.pixel*10,
        borderRadius: Util.pixel*10,
        backgroundColor: '#ffffff'
    },
});