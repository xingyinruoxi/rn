/**
 * Created by glzc on 2017/8/24.
 */
const React = require('react');
const { ViewPropTypes } = ReactNative = require('react-native');
const {
        StyleSheet,
        Text,
        View,
        Animated,
        TouchableOpacity,
        Image,
    } = ReactNative;
const Button = require('./Button');

const MessageTabBar = React.createClass({
    propTypes: {
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array,
        backgroundColor: React.PropTypes.string,
        activeTextColor: React.PropTypes.string,
        inactiveTextColor: React.PropTypes.string,
        textStyle: Text.propTypes.style,
        tabStyle: ViewPropTypes.style,
        renderTab: React.PropTypes.func,
        underlineStyle: ViewPropTypes.style,
        newMessageNum: React.PropTypes.number,
        newMessageNoticesNum: React.PropTypes.number,
        redPointStyle: ViewPropTypes.style,
        isShowVerticalLine: React.PropTypes.bool,
    },

    getDefaultProps() {
    return {
        activeTextColor: 'navy',
        inactiveTextColor: 'black',
        backgroundColor: null,
        newMessageNum: 0,
        newMessageNoticesNum: 0,
        isShowVerticalLine: false,
    };
},

renderTabOption(name, page) {
},

renderTab(name, page, isTabActive, onPressHandler, pagesNumber) {
    const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'normal';

    return <TouchableOpacity
                style={[{flex: 1}, this.props.isShowVerticalLine && (page < pagesNumber - 1) && {borderRightWidth: 1,borderRightColor: '#d8d8d8'} ]}
                key={name}
                accessible={true}
                accessibilityLabel={name}
                accessibilityTraits='button'
                onPress={() => onPressHandler(page)}
            >
                <View style={[styles.tab, this.props.tabStyle, ]}>
                    <Text allowFontScaling={false} style={[{color: textColor, fontWeight, }, textStyle, ]}>
                        {name}
                    </Text>
                    <View style={[styles.redPointStyle,this.props.redPointStyle]}>
                        {
                            name=='站内消息' && this.props.newMessageNum > 0 || name=='网站公告' && this.props.newMessageNoticesNum > 0 ? <Image source={require('./../../../imgs/home/red_point_icon.png')} /> : null
                        }
                    </View>
                </View>
            </TouchableOpacity>;
},

render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
        position: 'absolute',
        width: containerWidth / numberOfTabs,
        height: 4,
        backgroundColor: 'navy',
        bottom: -1,
    };

    const translateX = this.props.scrollValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0,  containerWidth / numberOfTabs],
    });
    return (
        <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor, }, this.props.style, ]}>
            {this.props.tabs.map((name, page) => {
                const isTabActive = this.props.activeTab === page;
                const renderTab = this.props.renderTab || this.renderTab;
                return renderTab(name, page, isTabActive, this.props.goToPage, numberOfTabs);
            })}
            <Animated.View
            style={[
                tabUnderlineStyle,
                {
                    transform: [
                        { translateX },
                    ]
                },
                    this.props.underlineStyle,
                ]}
            />
        </View>
    );
},
});

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    tabs: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#ccc',
    },
    redPointStyle: {
        position: 'relative',
        bottom: 5,
    },
});

module.exports = MessageTabBar;
