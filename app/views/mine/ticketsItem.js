/**
 * Created by liuzhenli on 2017/12/22.
 */
import React,{Component} from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import Util,{Grow} from './../../commons/util';

export default class TicketsItem extends Component{
	constructor(props){
		super(props);
		this.state={
			
		}
	};
	checkedRedPacket(item){
		if(this.props.radio){
			this.props.checkedRedPacked(item.ticId);
			this.props.callBack && this.props.callBack(this.props.checked == item.ticId ? '' : item);;
		}else{
			//Grow.track('elbn_my_myred_touse_click',{'elbn_my_myred_touse_click':'立即使用按钮点击量'});
			this.props.callBack && this.props.callBack(item);
		};
	};
	
	render(){
		let item = this.props.data;
		let isUnuse = item.ticUseState === "UNUSED";
		return (
			<View>
				<TouchableOpacity activeOpacity= {0.8} disabled={!isUnuse} onPress={this.checkedRedPacket.bind(this,item)}>
					<View style={[reiStyles.container,reiStyles.flexRow]}>
						<View style={[reiStyles.redEnvelope]}>
							<View style={reiStyles.flexRow}>
								<Image style={reiStyles.redEnvelope} source={ isUnuse ? require('./../../imgs/ticketsBackImg.png') : require('./../../imgs/ticketsBackImg_inactive.png')} />
							</View>
							<View style={[reiStyles.redEnvelopeBg,reiStyles.flexRow,{justifyContent: 'space-between'}]}>
								<View style={[reiStyles.flexColumn,reiStyles.leftContent]}>
									<View style={[reiStyles.flexRow,{alignItems: 'flex-end'}]}>
										<Text allowFontScaling={false} style={[reiStyles.supmaxText]}>{item.ticValue}</Text>
										<Text allowFontScaling={false} style={[reiStyles.maxText,{marginBottom: Util.pixel*4}]}>%</Text>
									</View>
									<Text allowFontScaling={false} style={[reiStyles.minText,{paddingBottom: Util.pixel*6}]}>加息券</Text>
								</View>
								<View style={[reiStyles.centerContent,reiStyles.flexColumn,{justifyContent: 'space-around',alignItems: 'flex-start'}]}>
									<Text allowFontScaling={false} style={[reiStyles.midText,{color: '#9b9b9b',paddingBottom: 3 * Util.pixel}]}>来源：{item.ticResource}</Text>
									<Text allowFontScaling={false} style={[reiStyles.maxText,{color: '#3F3A39',lineHeight: Util.lineHeight(Util.size.width <= 320 ? 12 * Util.pixel : 20 * Util.pixel)}]}>{item.ticRemark && item.ticRemark.replace('单笔投资','单笔出借')}</Text>
									<Text allowFontScaling={false} style={[reiStyles.midText,{color: '#9b9b9b',}]}>失效日期：{item.ticEndDate && item.ticEndDate.slice(0,10)}</Text>
								</View>
								<View style={[reiStyles.rightContent,reiStyles.flexRow,this.props.radio && {justifyContent: 'flex-start',paddingLeft: Util.pixel*8}]}>
									{
										this.props.radio ?
											<View style={[reiStyles.radio,reiStyles.flexRow,this.props.checked == item.ticId && {borderColor: '#e94639'}]}>
												{
													this.props.checked == item.ticId ?
														<View style={reiStyles.radioIn}></View>
														: null
												}
											</View>
											:
											<View style={[reiStyles.btn,reiStyles.flexRow,!isUnuse && {borderColor: '#888889'}]}>
												<Text allowFontScaling={false} style={[reiStyles.midText,reiStyles.buttontext,isUnuse ? {color: '#e94639'} : {color: '#888889'}]}>{isUnuse ? '立即使用' : '已使用'}</Text>
											</View>
									}
								</View>
							</View>
						</View>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
	
};

const reiStyles = StyleSheet.create({
	container: {
		paddingTop: Util.pixel*10,
	},
	flexRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	flexColumn: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	redEnvelope: {
		width: Util.pixel*(Util.size.width <= 320 ? 300 : 355),
		height: Util.pixel*(Util.size.width <= 320 ? 85 : 100),
		position: 'relative'
	},
	redEnvelopeBg: {
		width: Util.pixel*(Util.size.width <= 320 ? 300 : 355),
		height: Util.pixel*(Util.size.width <= 320 ? 85 : 100),
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 10,
	},
	leftContent: {
		width: Util.pixel*(Util.size.width <= 320 ? 100.5 : 110),
		height: (Util.size.width <= 320 ? 85 : 100),
		justifyContent: 'space-around',
		paddingTop: 10,
		alignItems: 'center',
		paddingBottom: 10
	},
	centerContent: {
		flex:1,
	},
	rightContent: {
		width: Util.pixel*(Util.size.width <= 320 ? 50.5 : 50),
		height: (Util.size.width <= 320 ? 85 : 100),
	},
	minText: {
		fontSize: Util.commonFontSize(14),
		color: '#fff',
		backgroundColor: 'transparent',
		textAlign: 'center'
	},
	midText: {
		fontSize: Util.commonFontSize(Util.size.width <= 320 ? 10 : 12),
		color: '#fff',
		backgroundColor: 'transparent',
		lineHeight: Util.lineHeight(Util.pixel*20),
	},
	maxText: {
		fontSize: Util.commonFontSize(Util.size.width <= 320 ? 11 : 14),
		color: '#fff',
		backgroundColor: 'transparent',

	},
	supmaxText: {
		fontSize: Util.commonFontSize(30),
		color: '#fff',
		backgroundColor: 'transparent',
	},
	radio: {
		width: Util.pixel*25,
		height: Util.pixel*25,
		borderWidth: Util.pixel*0.5,
		borderRadius: Util.pixel*13,
		borderColor: '#888889',
	},
	radioIn: {
		width: Util.pixel*12,
		height: Util.pixel*12,
		borderRadius: Util.pixel*6,
		backgroundColor: '#e94639',
	},
	btn: {
		width: Util.pixel*12,
		minHeight: Util.pixel*(Util.size.width <= 320 ? 80 : 30),
	},
	buttontext: {
		lineHeight: Util.lineHeight(Util.pixel*18),
	}
});