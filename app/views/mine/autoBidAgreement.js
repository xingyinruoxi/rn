/**
 * Created by liuzhenli on 2017/9/1.
 */
import React,{ Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';
import Header from './../components/commonHeader';
import Util,{ Grow } from './../../commons/util';
var px = Util.pixel;
//TODO 修改规则第七条（已修改）
export  default class AutoBidAgreement extends Component{
    static navigationOptions = {
        header: null
        
    };
    render(){
        return (
            <View style={styles.container}>
                <Header title="自动投标规则" leftButton leftIcon goBack navigation={this.props.navigation}/>
                <ScrollView style={styles.contentBox}>
                    <Text allowFontScaling={false} style={styles.content}>一、自动投标适用于易通贷除债权转让以外的所有项目，请根据自己的风险偏好、投资习惯在自动投标中设置各种条件后并开启；</Text>
                    <Text allowFontScaling={false} style={styles.content}>二、开启自动投标后，此功能方可生效；若修改了自动投标的各种条件，则需要重新开启自动投标功能；</Text>
                    <Text allowFontScaling={false} style={styles.content}>三、手动参与一个项目后，若自动投标条件也满足则不再参与投标；</Text>
                    <Text allowFontScaling={false} style={styles.content}>四、账户可用余额&lt; 项目最低投资金额，不执行自动投标；</Text>
                    <Text allowFontScaling={false} style={styles.content}>五、单笔自动投标金额&lt; 项目最低投资金额，不执行自动投标；</Text>
                    <Text allowFontScaling={false} style={styles.content}>六、账户可用余额&lt; 单笔自动投标金额 + 账户保留金额，不执行自动投标；</Text>
                    <Text allowFontScaling={false} style={styles.content}>七、预期年回报率应设置为整数;</Text>
                    <Text allowFontScaling={false} style={styles.content}>八、开启自动投标未设置关闭，回款后满足条件将进行复投；</Text>
                    <Text allowFontScaling={false} style={styles.content}>九、如果有新的项目类型，则1需要重新设置自动投标规则方可重新生效；</Text>
                    <Text allowFontScaling={false} style={styles.content}>十、自动投标规则的解释权归易通贷所有。</Text>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'rgba(245,245,245,1)',
        alignItems:'center',
    },
    contentBox:{
        paddingHorizontal: 14 * px,
        marginTop: 15 * px,
    },
    content:{
        color:'#3c3c3c',
        fontSize: Util.commonFontSize(15),
        lineHeight: Util.lineHeight(28),
        marginBottom: 20 * px,
    }
});