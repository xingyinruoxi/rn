/**
 * Created by liuzhenli on 2017/8/21.
 */
import React,{ Component } from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import Header from './../../components/commonHeader';
import VLine from './../../../commons/vLine';
import Line from './../../../commons/line';
import Util,{ Grow } from './../../../commons/util';
var px = Util.pixel;
export default class LimitExplain extends Component{
    static navigationOptions = ({navigation}) =>({
        header: null
    });
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render(){
        let params = this.props.navigation.state.params ? this.props.navigation.state.params.data : null;
        console.log('params',params)
        return(
            <View style={styles.container}>
                <Header title='绑卡限额列表' leftButton leftIcon goBack navigation={this.props.navigation}/>
                <View style={styles.contentBox}>
                    <View style={styles.itemBox}>
                        <Text allowFontScaling={false} style={styles.bankName}>{params ? params.bankName: ''}</Text>
                        <VLine color="#D8D8D8" height={30}/>
                        <Text allowFontScaling={false} style={styles.bankName}>单笔限额{params ? parseFloat(params.singleLimit)/10000: 0}万，单日限额{params ? parseFloat(params.dayLimit)/10000: 0}万</Text>
                    </View>
                    <Line/>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    contentBox:{
        flex:1,
        backgroundColor:'#f6f7fa',
        marginTop: 10 * px
    },
    itemBox:{
        height: 50 * px,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    bankName:{
        color:'#4A4A4A',
        fontSize: Util.commonFontSize(15),
        marginHorizontal: 14  * px
    }
});