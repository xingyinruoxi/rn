/**
 * Created by liuzhenli on  17/8/23.
 */
import React,{ Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback
} from 'react-native';
import Util from './../../../commons/util';
var px = Util.pixel;
class Option extends Component{
    constructor(props){
        super(props);
        this.state = {
            isSelected: false
        }
    }
    render() {
        var { onPress, isSelected, color, selectedColor, children} = this.props;
        let innerCircle;
        let appliedColor;
        if (isSelected) {
            appliedColor = selectedColor;
            innerCircle = <View style={[styles.innerCircle, { backgroundColor: appliedColor }]}/>;
        } else {
            appliedColor = color;
            innerCircle = null;
        }
        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={styles.contentBox}>
                    <View style={{padding:4}}>
                        <View style={[styles.outerCircle, { borderColor: appliedColor }]}>
                            {innerCircle}
                        </View>
                    </View>
                    <View style={styles.textContent}>
                        {children}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
class Radio extends Component{
    constructor(props){
        super(props);
        this.state = {
            isSelected: false,
            questionTitle: '324234',
            answer: '234234234234234234',
        }
    }
    componentDidMount(){
        console.log('this.props',this.props)
    }
    _onSelect(index) {
        var { onSelect } = this.props;
        this.setState({
            selectedIndex: index
        });
        onSelect(index,this.state.questionTitle,this.state.answer);
    }
    render() {
        var { selectedIndex } = this.state;
        var targetIndex = selectedIndex !== -1? selectedIndex : this.props.defaultSelect;
        var children = React.Children.map(this.props.children, (child, index) => {
            if (child.type === Option) {
                return React.cloneElement(child, {
                    onPress: () => {
                        this._onSelect(index)
                        this.setState({
                            // questionTitle: this.props.children[index].props.children.props.title,
                            questionTitle: '23234234',
                            // answer: this.props.children[index].props.children.props.children,
                            answer: '234234234',
                        })
                    },
                    isSelected: index == targetIndex
                });
            }
            return child;
        });
        return (
            <View>
                {children}
            </View>
        );

    }
}
const styles = StyleSheet.create({
    outerCircle: {
        height: 14 * px,
        width: 14 * px,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderRadius: 50 ,
        backgroundColor: 'transparent',
        borderColor: '#636f83'
    },
    innerCircle: {
        height: 8 * px,
        width: 8 * px,
        borderRadius: 50
    },
    contentBox:{
        flexDirection:'row',
        alignItems:'center',
        height: 30 * px,
    },
    textContent:{
        flex: 1 ,
        justifyContent:'flex-start',
        marginLeft: 5 * px
    }
});
module.exports = {
    get Option(){return Option},
    get Radio(){return Radio},
}

