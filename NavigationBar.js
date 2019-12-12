import React from "react"
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  Image,
  Platform,
  Dimensions,
  StatusBar,
  DeviceEventEmitter,
  LayoutAnimation,
  Easing,
} from "react-native"
import {NavigationActions} from "react-navigation"
import SafeAreaView from "react-native-safe-area-view"
import DeviceInfo from "react-native-device-info"
import theme from "../config/theme"
import StatusBarComponent from "./StatusBarComponent"
import LocalSVGIcon from "./LocalSvg"


const __CONSTANT__ = {
  sideContainerWidth: 130, // 左右两侧容器最大宽度
}

class Component extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      toastDisplay: false,
      animatedValue: new Animated.Value(0),
    }
  }

  onPressBackButton = () => {
    const {
      onPressBackButton, // 覆盖返回按钮事件
    } = this.props
    if (onPressBackButton) {
      const result = onPressBackButton()
      if (result === false) {
        // 若返回 false，则中止默认返回方法
        return
      }
    }

    if (this.props.store) {
      const navigation = this.props.store.Navigation
      if (navigation.isTransitioning) {
        return
      }
      if (this.props.store.Navigation.routeIndex === 0) {
        Application.broadcast({type: "device/backHome"})
        Application.back()
        return
      }
    } else {
      Managers.RouterManager.Back()
    }

  }

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(
      "showNavigationToast",
      this.showNavigationToast,
    )
  }


  playToastAnimation() {
    this.animation = Animated.sequence([
      Animated.timing(this.state.animatedValue,
        {
          toValue: 1,
          duration: 500,
          easing: Easing.linear(),
          useNativeDriver: true,
        }),
      Animated.timing(this.state.animatedValue,
        {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear(),
          useNativeDriver: true,
        }),
      Animated.timing(this.state.animatedValue,
        {
          toValue: 0,
          duration: 500,
          easing: Easing.linear(),
          useNativeDriver: true,
        }),
    ]).start(() => {
      this.setState({toastDisplay: false})
    })
  }

  componentWillUnmount() {
    this.animation && this.animation.stop()
  }

  navigationToast() {
    return (
      <Animated.View style={{
        width: "100%",
        position: "absolute",
        paddingHorizontal: 8,
        transform: [{
          translateY: this.state.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, 0],
          }),
        }],

      }}>
        <View style={{
          width: "100%",
          height: 44,
          borderRadius: 5,
          backgroundColor: this.navigationToastColor,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}>
          <LocalSVGIcon
            icon={"icon_redtip"}
            height={14}
            width={14}
            color={"#FF4D4F"}
          />
          <Text style={{color: "#FF4D4F"}}>{" " + this.navigationToastText}</Text>
        </View>
      </Animated.View>
    )
  }

  showNavigationToast = ({text, backgroundColor}) => {
    this.navigationToastText = text
    this.navigationToastColor = backgroundColor || "#FFEDED"
    if (!this.state.toastDisplay) {
      this.setState({toastDisplay: true}, () => {
        this.playToastAnimation()
      })
    }
  }

  render() {
    const defaultColor = "#000"
    const {
      // 组件通用设置
      color = defaultColor, // 标题色
      backgroundColor = "transparent",
      fixed = false, // 是否浮动在页面上方，不占用布局空间
      backgroundView = null, // 背景元素
      bottomLine = false, // 底部分割线
      // left container 相关
      displayBackButton = true, // true or false, 是否显示返回按钮
      onPressBackButton, // 覆盖返回按钮事件
      leftElements = null, // Array<React Element> , 左侧区域自定义按钮
      // center container 相关
      title = "",
      // right container 相关
      rightElements = null, // Array<React Element> , 右侧区域自定义按钮
      // status bar 相关
      statusBar = {},
      //配合页面样式设置左右元素的padding
      paddingLeft = 13,
      paddingRight = 10,
    } = this.props


    let statusBarPaddingHeight = 0 // Android 刘海屏高度适配

    if (Platform.OS === "android") {
      const apiLevel = DeviceInfo.getAPILevel()
      if (apiLevel >= 19) {
        statusBarPaddingHeight = StatusBar.currentHeight
      }
    }


    // 导航栏
    const appBar = {
      left: (
        <View style={{...style.leftContainer, paddingLeft: paddingLeft}} key={"left"}>
          {displayBackButton &&
          <TouchableOpacity onPress={this.onPressBackButton} style={{height: 44, width: 44, justifyContent: "center"}}>
            <LocalSVGIcon
              icon={"icon_back"}
              height={20}
              width={20}
              color={this.props.backColor || theme.basic.mainColor}
            />
          </TouchableOpacity>
          }
          {leftElements && leftElements.length === 1 ? leftElements[0] : leftElements}
        </View>
      ),
      title: (
        <View style={style.centerContainer} key={"title"}>
          <Text
            style={{
              ...style.centerTitle,
              color: color,
              maxWidth: Dimensions.get("window").width - __CONSTANT__.sideContainerWidth * 2,
            }}
            numberOfLines={1}
            ellipsizeMode={"tail"}>
            {title || ""}
          </Text>
        </View>
      ),
      right: (
        <View style={{...style.rightContainer, paddingRight: paddingRight}} key={"right"}>
          {rightElements && rightElements.length === 1 ? rightElements[0] : rightElements}
        </View>
      ),
    }

    const containerFixedStyle = fixed ? {position: "absolute", top: 0, left: 0, right: 0, zIndex: 10} : {}

    return (
      <View
        style={{
          ...style.container,
          ...containerFixedStyle,
          paddingTop: statusBarPaddingHeight,
        }}>

        <StatusBarComponent
          barStyle={statusBar.barStyle}
          translucent={true}
          animated={statusBar.animated || false}
          backgroundColor={statusBar.backgroundColor || "transparent"}
          enforcement={statusBar.enforcement || false}
        />
        <View style={{
          ...style.backgroundContainer,
          backgroundColor: backgroundColor,
        }}>
          {backgroundView}
        </View>
        <SafeAreaView style={style.safeAreaContainer}>
          <View style={style.contentContainer}>
            <View
              style={{
                ...style.mainContainer,
                borderBottomWidth: bottomLine ? 1 : 0,
              }}>

              {this.props.customizedBar || [appBar.left, appBar.title, appBar.right]}

              {this.state.toastDisplay && this.navigationToast()}
            </View>
          </View>
        </SafeAreaView>
      </View>
    )
  }
}

const style = {
  container: {
    flexGrow: 0,
    overflow: "hidden",
    width: "100%",


  },
  safeAreaContainer: {
    flexGrow: 0,
    // borderWidth:1,
    // borderColor:"red"
  },
  contentContainer: {
    flexGrow: 0,
    justifyContent: "space-between",
    alignItems: "stretch",
    height: 44,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  leftContainer: {
    flexGrow: 0,
    flexBasis: __CONSTANT__.sideContainerWidth,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  centerContainer: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    // borderWidth: 1,
    // borderColor: "green"
  },
  centerTitle: {
    fontSize: 18,
    lineHeight: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  rightContainer: {
    flexGrow: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexBasis: __CONSTANT__.sideContainerWidth,
  },
}

export default Component
