import React, {Component} from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Animated,
  Easing,
} from "react-native"
import helper from "../config/helper"


const {height, width} = Dimensions.get("window")
const isIPhoneX = helper.isIPhoneX
const duration = 300


class ToastOption extends Component {
  constructor(props) {
    super(props)
    this.width = Dimensions.get("window").width
    this.state = {
      animatedValue: new Animated.Value(0),
      display: false,
    }
  }

  componentDidMount() {
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps): void {
    if (nextProps.display) {
      this.setState({display: nextProps.display})
      Animated.timing(this.state.animatedValue, {
          toValue: 0.5,
          duration: duration,
          easing: Easing.linear(),
          useNativeDriver: true,
        },
      ).start()
    } else if (!nextProps.display) {
      this.closeToast()
    }
  }

  closeToast = () => {
    Animated.timing(this.state.animatedValue, {
        toValue: 0,
        duration: duration,
        easing: Easing.linear(),
        useNativeDriver: true,
      },
    ).start(() => {
      this.setState({display: false})
    })
  }

  renderDayOption = () => {
    return this.props.optionList.map((item, index) => {
      return (
        <TouchableOpacity key={index.toString()} onPress={() => {
          this.props.setIndex(index, item.value)
        }}>
          <View style={style.sectionOptionContainer}>
            <Text style={style.sectionOptionText}>
              {item.text}
            </Text>
          </View>
        </TouchableOpacity>
      )
    })
  }


  renderToastTitle = () => {
    return (
      <View style={style.titleContainer}>
        <Text style={{fontSize: 15, color: "#183B56"}}>{this.props.title}</Text>
      </View>
    )
  }

  render() {
    return (
      this.state.display ?
        <View style={{...style.cover}}>
          <TouchableOpacity activeOpacity={1} onPress={this.closeToast}>
            <Animated.View
              style={{
                ...style.clickCover,
                opacity: this.state.animatedValue,
                backgroundColor: "#000",
              }}
            />
          </TouchableOpacity>

          <Animated.View style={{
            position: "absolute",
            bottom: -600,
            left: 0,
            right: 0,
            transform: [{
              translateY: this.state.animatedValue.interpolate({
                inputRange: [0, 0.5],
                outputRange: [0, -600],
              }),
            }],
            backgroundColor: "#fff",
            zIndex: 99,
            paddingHorizontal: 17,
            paddingBottom: isIPhoneX ? 34 : 0,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}>
            {this.props.title && this.renderToastTitle()}
            {this.renderDayOption()}
          </Animated.View>
        </View> : null
    )
  }
}


const style = {
  option: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 15,
    color: "#97AFB9",
  },
  iconContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  titleContainer: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  iconRowContainer: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },

  cancel: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    backgroundColor: "#fff",
  },
  cancelText: {
    color: "#979797",
    fontSize: 17,
  },

  optionTitle: {
    padding: 10,
    fontSize: 15,
    marginHorizontal: "auto",
  },

  optionText: {
    fontSize: 15,
    color: "#183B56",
  },
  clickCover: {
    width: "100%",
    height: "100%",
  },
  cover: {
    position: "absolute",
    width: width,
    height: height,
  },
  sectionOptionContainer: {
    width: "100%",
    height: 55,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    // borderWidth: 1,
    // borderColor: "red",
  },
  sectionOptionText: {
    fontSize: 15,
    color: "#183B56",
  },
}


export default ToastOption