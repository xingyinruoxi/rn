/**
 * Created by liuzhenli on 2017/7/17.
 */
import * as React from 'react';
import { View, Text, TouchableOpacity, Picker as RNPicker, StyleSheet, Animated, ScrollView,Modal } from 'react-native';
import { baseNativeComponent, } from './Component';
import { NativeFactory as f } from './class/Factory';
import { arrayHp, objHp, funHp } from './helper';
const Item = RNPicker.Item;
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentDay = new Date().getDate();
var Util = require('./../../../../commons/util');
var px  = Util.pixel;
export class Picker extends baseNativeComponent {
    constructor(props) {
        super();
        this.maxBranchLength = 30;
        this.defaultTitle = '请选择';
        this.selectValues = [];
        this.selectItems = [];
        this.newBranchPickers = [];
        this.branchLength = 0;
        this.onMaskLayerPress = () => {
            this.showPicker(false);
        };
        this.onDefaultValueButtonPress = () => {
            const { defaultSelectValues = [], getDefaultSelectValuesFun } = this.props;
            if (funHp.isFun(getDefaultSelectValuesFun))
                this.selectValues = getDefaultSelectValuesFun();
            else
                this.selectValues = defaultSelectValues;
            if (this.props.isDynamic) {
                const nowItem = arrayHp.find(this.newBranchPickers[0], { value: this.selectValues[0] });
                this.selectItems[0] = nowItem;
                this.makeNewLinkageList(0, nowItem, this.props);
                this.setState({
                    branchPickers: this.newBranchPickers.slice(0),
                    selectValues: this.selectValues.slice(0),
                    topInfo: this.getTopInfo(this.props)
                });
            }
            else {
                this.selectItems = this.selectValues.map((v, i) => {
                    return arrayHp.find(this.newBranchPickers[i], { value: v });
                });
                this.setState({
                    selectValues: this.selectValues.slice(0),
                    topInfo: this.getTopInfo(this.props)
                });
            }
        };
        this.onValueChange = (value, _index, branchIndex) => {
            if((branchIndex == 0 && parseInt(value) > currentYear)){
                this.onDefaultValueButtonPress();
                return;
            }else if(branchIndex == 0 && parseInt(value) == currentYear && parseInt(this.selectValues[1]) > currentMonth){
                this.onDefaultValueButtonPress();
                return;
            }else if(branchIndex == 0 && parseInt(value) == currentYear && parseInt(this.selectValues[1]) == currentMonth && parseInt(this.selectValues[2]) > currentDay){
                this.onDefaultValueButtonPress();
                return;
            }else if(branchIndex == 1 && parseInt(this.selectValues[0]) == currentYear && parseInt(value) > currentMonth){
                this.onDefaultValueButtonPress();
                return;
            }else if(branchIndex == 1 && parseInt(this.selectValues[0]) == currentYear && parseInt(value) == currentMonth &&  parseInt(this.selectValues[2]) > currentDay){
                this.onDefaultValueButtonPress();
                return;
            }else if(branchIndex == 2 && parseInt(this.selectValues[0]) == currentYear && parseInt(this.selectValues[1])  ==  currentMonth && parseInt(value) > currentDay){
                this.onDefaultValueButtonPress();
                return;
            }
            if (this.selectValues[branchIndex] == value)
                return;
            this.selectValues[branchIndex] = value;
            const nowItem = arrayHp.find(this.newBranchPickers[branchIndex], { value: value });
            this.selectItems[branchIndex] = nowItem;
            if (this.props.isDynamic) {
                this.makeNewLinkageList(branchIndex, nowItem, this.props);
                this.setState({
                    branchPickers: this.newBranchPickers.slice(0),
                    selectValues: this.selectValues.slice(0),
                    topInfo: this.getTopInfo(this.props)
                });
            }
            else {
                this.setState({
                    selectValues: this.selectValues.slice(0),
                    topInfo: this.getTopInfo(this.props)
                });
            }

        };
        this.onCancelPress = () => {
            this.showPicker(false);
            if (funHp.isFun(this.props.cancelCallBack)) {
                this.props.cancelCallBack(this.selectValues, this.selectItems);
            }
        };
        this.onOkPress = () => {
            this.showPicker(false);
            if (funHp.isFun(this.props.okCallBack)) {
                this.props.okCallBack(this.selectValues, this.selectItems);
            }
        };
        this.initBranchPickersDataByProps(props);
        this.state = {
            branchPickers: this.newBranchPickers.slice(0),
            selectValues: this.selectValues.slice(0),
            show: false,
            opacityAnimated: new Animated.Value(0),
            topInfo: this.getTopInfo(props)
        };
    }
    getTopInfo(props) {
        let info;
        if (funHp.isFun(props.topInfoCreateFun)) {
            info = props.topInfoCreateFun(this.selectItems);
        }
        return info;
    }
    initBranchPickersDataByProps(props) {
        const { isDynamic = false, data = [], defaultSelectValues = [] } = props;
        try {
            if (isDynamic) {
                const linkageData = data;
                if (!(linkageData instanceof Array))
                    return;
                this.selectValues = [];
                this.selectItems = [];
                if (defaultSelectValues.length > 0) {
                    this.selectValues = defaultSelectValues;
                }
                this.newBranchPickers = [linkageData];
                let selectItem = arrayHp.find(linkageData, { value: this.selectValues[0] });
                if (!selectItem) {
                    selectItem = linkageData[0];
                    if (!selectItem)
                        return;
                    this.selectValues[0] = selectItem && selectItem.value;
                }
                this.selectItems[0] = selectItem;
                this.makeNewLinkageList(0, selectItem, props);
            }
            else {
                const _data = data;
                if (!(_data instanceof Array))
                    return;
                this.selectValues = [];
                this.selectItems = [];
                this.branchLength = _data.length;
                for (let i = 0; i < this.branchLength; i++) {
                    let selectItem = _data[i] && arrayHp.find(_data[i], { value: defaultSelectValues[i] });
                    if (!selectItem) {
                        selectItem = _data[i][0];
                    }
                    this.selectValues.push(selectItem && selectItem.value);
                    this.selectItems.push(selectItem);
                }
                this.newBranchPickers = _data;
            }
        }
        catch (e) {
        }
    }
    makeNewLinkageList(index, fatherItem, props) {
        ++index;
        if (index >= this.maxBranchLength)
            return;
        const { getChildrenFuns = [] } = props;
        if (fatherItem) {
            let nowList;
            if (fatherItem.mustGetNewChildrenEveryTime || !(fatherItem.children instanceof Array)) {
                if (funHp.isFun(getChildrenFuns[index - 1])) {
                    nowList = getChildrenFuns[index - 1](this.selectItems, index - 1);
                    if (!fatherItem.mustGetNewChildrenEveryTime) {
                        fatherItem.children = nowList;
                    }
                }
            }
            else {
                nowList = fatherItem.children;
            }
            if (nowList instanceof Array) {
                let selectItem = arrayHp.find(nowList, { value: this.selectValues[index] });
                this.newBranchPickers[index] = nowList;
                if (!selectItem) {
                    selectItem = nowList[0];
                    if (!selectItem) {
                        return;
                    }
                    this.selectValues[index] = selectItem.value;
                }
                this.selectItems[index] = selectItem;
                this.branchLength = index + 1;
                this.makeNewLinkageList(index, selectItem, props);
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (objHp.isEqual(this.props.data, nextProps.data) && this.props.isDynamic == nextProps.isDynamic && objHp.isEqual(this.props.defaultSelectValues, nextProps.defaultSelectValues)) {
            return;
        }
        this.initBranchPickersDataByProps(nextProps);
        this.setState({
            branchPickers: this.newBranchPickers.slice(0),
            selectValues: this.selectValues.slice(0)
        });
    }
    showPicker(show) {
        if (!this.state.show && show) {
            this.setState({
                show: true
            });
        }
        else if (this.state.show && !show) {
                this.setState({
                    show: false
                });
        }
    }
    render() {
        const { branchTitles = [], okButtonText = '确定', cancelButtonText = '取消', titleStyle, topInfoStyle, branchTitleStyle, branchPickersStyles = [], branchPickersItemStyles = [], buttonStyle, colunmMax = 3, defaultValueButtonShow, defaultValueButtonText = '默认值', title = this.defaultTitle, pressMaskLayerToHide } = this.props;
        const { branchPickers = [], selectValues = [], show = false, opacityAnimated, topInfo } = this.state;
        const styles = getStyles();
        const hide = show ? null : styles.hide;
        const branchTable = [];
        const rowCount = Math.ceil(this.branchLength / colunmMax);
        for (let i = 0; i < rowCount; i++) {
            const branchRow = [];
            for (let j = 0; j < colunmMax; j++) {
                const bp = branchPickers[i * colunmMax + j];
                if (!bp)
                    break;
                branchRow.push(branchPickers[i * colunmMax + j]);
            }
            if (branchRow.length <= 0)
                break;
            branchTable.push(branchRow);
        }
        const showBranchTitles = branchTitles.length > 0;
        return (<Modal animationType="slide"
                       visible={this.state.show}
                       transparent={true}
                        onRequestClose={() => this.showPicker(false)}>
            <TouchableOpacity  activeOpacity={1} style={styles.mainContainer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={this.onCancelPress}>
                        <Text allowFontScaling={false} style={[styles.buttonText, buttonStyle]}>{cancelButtonText}</Text>
                    </TouchableOpacity>
                    <View style={[styles.buttonBorder]}/>
                    <TouchableOpacity style={[styles.button]} onPress={this.onOkPress}>
                        <Text allowFontScaling={false} style={[styles.buttonText, buttonStyle]}>{okButtonText}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.branchPickersTableView}>
                        {
                            branchTable.map(
                                (row, rowIndex) => {
                                    return (
                                        <View key={'row' + rowIndex} style={styles.branchPickersRowView}>
                                            {
                                                row instanceof Array && row.map(
                                                    (oneBranch, index) => {
                                                        const branchIndex = rowIndex * colunmMax + index;
                                                        const _branchTitleStyle = branchTitleStyle instanceof Array ? branchTitleStyle[branchIndex] : branchTitleStyle;
                                                        const _branchPickersStyles = branchPickersStyles instanceof Array ? branchPickersStyles[branchIndex] : branchPickersStyles;
                                                        const _branchPickersItemStyles = branchPickersItemStyles instanceof Array ? branchPickersItemStyles[branchIndex] : branchPickersItemStyles;
                                                        return (
                                                            <View key={'pickerView' + index} style={styles.branchPickerContainer}>
                                                                {showBranchTitles ?
                                                                    <Text allowFontScaling={false} style={[styles.branchTitle, _branchTitleStyle]}>{branchTitles[branchIndex]}</Text> : null}
                                                                <RNPicker
                                                                    style={[styles.branchPicker, _branchPickersStyles]}
                                                                    itemStyle={[styles.itemStyle, _branchPickersItemStyles]}
                                                                    selectedValue={selectValues[branchIndex]}
                                                                    prompt={branchTitles[branchIndex]}
                                                                    onValueChange={(v, i) => { this.onValueChange(v.toString(), i, branchIndex) } }>
                                                                    {
                                                                        oneBranch instanceof Array && oneBranch.map(
                                                                            (oneItem) => {
                                                                                return <Item key={'item+' + branchIndex + oneItem.value} value={oneItem.value} label={oneItem.lable} />
                                                                            }
                                                                        )
                                                                    }
                                                                </RNPicker>
                                                            </View>
                                                        )
                                                    }
                                                )
                                            }
                                        </View>
                                    )
                                }
                            )
                        }
                </View>

            </TouchableOpacity>
        </Modal>);
    }
}
let _styles;
const getStyles = () => {
    if (!_styles && f.Device) {
        try {
            _styles = StyleSheet.create({
                container: {
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    justifyContent: 'center',
                    zIndex: 500,
                    alignItems: 'center',
                },
                mainContainer: {
                    flex:1,
                    backgroundColor: '#ffffff',
                    zIndex: 10,
                    height: 250 * px,
                    width:f.Device.getWindowWidth(),
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                },
                titleContainer: {
                    borderBottomColor: '#00BFFF',
                    borderBottomWidth: 2,
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    paddingVertical: f.Device.getActualSize(3)
                },
                title: {
                    textAlign: 'center',
                    fontSize: f.Device.getActualSize(8),
                    color: '#00BFFF',
                    fontWeight: 'bold',
                },
                topInfo: {
                    textAlign: 'center',
                    fontSize: f.Device.getActualSize(6),
                    color: '#00BFFF',
                    marginTop: f.Device.getActualSize(2)
                },
                branchPickersTableScrollView: {
                    flexDirection: 'column',
                    alignItems: 'stretch',
                },
                branchPickersRowView: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                },
                branchPickerContainer: {
                    flexDirection: 'column',
                    alignItems: 'center'
                },
                branchTitle: {
                    marginTop: f.Device.getActualSize(3),
                    textAlign: 'center',
                    fontSize: f.Device.getActualSize(7),
                    color: 'black',
                    fontWeight: 'bold'
                },
                branchPicker: {
                    padding: 0,
                    margin: 0,
                    width: f.Device.getWindowWidth() * 0.3,
                    height: f.Device.IsAndroid ? f.Device.getActualSize(60) : undefined
                },
                itemStyle: {
                    fontSize: f.Device.getActualSize(7),
                    lineHeight: f.Device.getActualSize(7),
                    padding: 0,
                    margin: 0,
                    height: f.Device.getActualSize(80),
                },
                buttonContainer: {
                    flexDirection: 'row',
                    height: 40 * px,
                    backgroundColor:"rgba(245,245,245,1)",
                    justifyContent:'space-around'
                },
                button: {
                    flex: 1,
                },
                buttonBorder:{
                    flex: 2,
                },
                buttonText: {
                    paddingVertical: f.Device.getActualSize(6),
                    textAlign: 'center',
                    fontSize: f.Device.getActualSize(7),
                    color: '#025FCB'
                },
                hide: {
                    zIndex: -10000
                }
            });
        }
        catch (e) {
        }
    }
    return _styles;
};
