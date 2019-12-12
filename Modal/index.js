import React from "react"
import {
  Animated,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Easing,
  Dimensions,
  Keyboard,
  Platform,
} from "react-native"
import LoadingComponent from "../LoadingComponent"
import { inject, observer } from "mobx-react"

// 引入预定义 Modal 类型
const ModalTypeComponents = [
  require("./types/loading"),
  require("./types/loadingWithTitle"),
  require("./types/alert"),
  require("./types/confirm"),
  require("./types/input"),
]

const __MODAL_TYPE__ = {
  toast: "toast",
  alert: "alert",
  confirm: "confirm",
  loading: "loading",
  loadingWithTitle: "loadingWithTitle",
  custom: "custom",
  qrcode: "qrcode",
}

const __MODAL_TYPE_CONTENT_COMPONENT__ = {}

const __MODAL_TYPE_CONTENT_CONTAINER_STYLE__ = {}

class Component extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      display: false, // 是否显示
      shadowViewOpacity: new Animated.Value(0),
      contentViewScale: new Animated.Value(0),
      contentViewTranslateY: new Animated.Value(0),
    }

    this.animating = {
      show: false,
      hide: false,
    }

    this.animation_keyboard_show = null
    this.animation_keyboard_hide = null
    this.animation_display = null

    this.needAutomaticDisplayAfterMount = !!props.display
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.__keyboardDidShow
    )
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.__keyboardDidHide
    )
  }

  componentDidMount() {
    if (this.needAutomaticDisplayAfterMount) {
      this.$__showModal()
    }
  }

  componentWillUnmount() {
    this.$__clearAnimation()
    Keyboard.removeListener("keyboardDidShow", this.__keyboardDidShow)
    Keyboard.removeListener("keyboardDidHide", this.__keyboardDidHide)
  }

  componentWillReceiveProps(newProps) {
    const oldProps = this.props
    if (newProps.display !== oldProps.display) {
      if (newProps.display) {
        this.$__showModal()
      } else {
        this.$__hideModal()
      }
    }
  }

  show = () => {
    this.$__showModal()
    this.__useAsSelfControledComponent = true // 标记组件作为 self controled 方式使用
    // 自动计时隐藏
    this.__autoHideSetTimeoutId && clearTimeout(this.__autoHideSetTimeoutId)
    this.__autoHideSetTimeoutId = null
    console.log("@auto hide", this.props)
    if (this.props.option && this.props.option.hideAfterMilliseconds && typeof this.props.option.hideAfterMilliseconds === "number") {
      console.log("@start auto hide")
      this.__autoHideSetTimeoutId = setTimeout(()=>{
        console.log("@autoHideModal")
        this.hide()
      }, this.props.option.hideAfterMilliseconds)
    }
  }

  hide = () => {
    if (!this.__useAsSelfControledComponent) {
      return
    }
    this.$__hideModal()
    // 清除 - 自动计时隐藏
    this.__autoHideSetTimeoutId && clearTimeout(this.__autoHideSetTimeoutId)
    this.__autoHideSetTimeoutId = null
  }

  __keyboardDidShow = e => {
    const keyboardHeight = e.endCoordinates.height
    console.log("keyboardHeight", keyboardHeight)
    this.animation_keyboard_show = Animated.parallel([
      Animated.timing(this.state.contentViewTranslateY, {
        toValue: -keyboardHeight / 2,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.easeInOutCubic,
      }),
    ])
    this.animation_keyboard_show.start()
  }

  __keyboardDidHide = () => {
    this.animation_keyboard_hide = Animated.parallel([
      Animated.timing(this.state.contentViewTranslateY, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.easeInOutCubic,
      }),
    ])
    this.animation_keyboard_hide.start()
  }

  $__showModal = () => {
    if (this.animating.show) {
      return
    }
    this.$__clearAnimation()

    // 定义动画
    const animationDuration = 200
    this.animation_display = Animated.parallel([
      Animated.timing(this.state.shadowViewOpacity, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
        easing: Easing.easeInOutCubic,
      }),
      Animated.timing(this.state.contentViewScale, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
        easing: Easing.easeInOutCubic,
      }),
      // Animated.timing(this.state.contentViewTranslateY, {
      //   toValue: 0,
      //   duration: animationDuration,
      //   useNativeDriver: true,
      //   easing: Easing.easeInOutCubic,
      // }),
    ])

    // 初始化数值
    this.state.shadowViewOpacity.setValue(0)
    this.state.contentViewScale.setValue(0)
    // this.state.contentViewTranslateY.setValue(Dimensions.get("window").height)
    this.animating.show = true
    // 开始动画
    this.setState(
      {
        display: true,
      },
      () => {
        this.animation_display.start(() => {
          this.animating.show = false
        })
      }
    )
  }

  $__hideModal = () => {
    if (this.animating.hide) {
      return
    }
    this.$__clearAnimation()

    const animationDuration = 200
    this.animation_display = Animated.parallel([
      Animated.timing(this.state.shadowViewOpacity, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
        easing: Easing.easeInOutCubic,
      }),
      Animated.timing(this.state.contentViewScale, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
        easing: Easing.easeInOutCubic,
      }),
    ])
    // 开始动画
    this.animating.hide = true
    this.animation_display.start(() => {
      this.animating.hide = false
      this.setState({
        display: false,
      })
    })
  }

  $__clearAnimation = () => {
    this.animation_keyboard_show && this.animation_keyboard_show.stop()
    this.animation_keyboard_show = null

    this.animation_keyboard_hide && this.animation_keyboard_hide.stop()
    this.animation_keyboard_hide = null

    this.animation_display && this.animation_display.stop()
    this.animation_display = null
  }

  $contentView = () => {
    // 计算显示内容
    const type = this.props.type
    let contentElements = this.props.children
    const modalTypeContentComponentConfig =
      __MODAL_TYPE_CONTENT_COMPONENT__[type]
    if (modalTypeContentComponentConfig) {
      if (React.isValidElement(modalTypeContentComponentConfig)) {
        contentElements = modalTypeContentComponentConfig
      }
      if (typeof modalTypeContentComponentConfig === "function") {
        contentElements = modalTypeContentComponentConfig(this.props, this)
      }
    }
    // 计算容器样式
    let typeStyle = {}
    if (__MODAL_TYPE_CONTENT_CONTAINER_STYLE__[type]) {
      typeStyle = __MODAL_TYPE_CONTENT_CONTAINER_STYLE__[type]
    }
    // TODO: remove this
    switch (type) {
      case __MODAL_TYPE__.loadingWithTitle:
        typeStyle = {
          width: 120,
          height: 120,
        }
        break
      case __MODAL_TYPE__.alert:
        typeStyle = {
          padding: 0,
        }
      default:
        break
    }
    const customContentViewStyle = this.props.contentViewStyle || {}
    const contentViewStyle = {
      ...Style.contentView,
      ...typeStyle,
      ...customContentViewStyle,
      opacity: this.state.shadowViewOpacity,
      transform: [
        {
          scaleX: this.state.contentViewScale,
        },
        {
          scaleY: this.state.contentViewScale,
        },
        {
          translateY: this.state.contentViewTranslateY,
        },
      ],
    }
    return (
      <Animated.View style={contentViewStyle}>{contentElements}</Animated.View>
    )
  }

  $shadowView = () => {
    // 计算样式
    const customShadowViewStyle = this.props.shadowViewStyle || {}
    const shadowViewStyle = {
      ...Style.shadowView,
      ...customShadowViewStyle,
      opacity: this.state.shadowViewOpacity,
    }
    const onPressShadowView = () => {
      // 判断是否需要自己维护点击消失状态
      if (this.props.option && this.props.option.tapShadowToHide) {
        this.hide()
      }
      // 执行钩子函数
      this.props.onPressShadowView && this.props.onPressShadowView()
    }
    return (
      <TouchableWithoutFeedback onPress={onPressShadowView}>
        <Animated.View style={shadowViewStyle} />
      </TouchableWithoutFeedback>
    )
  }

  render() {
    if (!this.state.display) {
      return null
    }
    return (
      <View style={Style.container}>
        {this.$shadowView()}
        {this.$contentView()}
      </View>
    )
  }

  // 静态方法

  /**
   * 添加 Modal 类型
   *
   * @static
   * @memberof Component
   */
  static addType = ({ type, contentComponent, contentContainerStyle }) => {
    __MODAL_TYPE__[type] = type
    __MODAL_TYPE_CONTENT_COMPONENT__[type] = contentComponent
    __MODAL_TYPE_CONTENT_CONTAINER_STYLE__[type] = contentContainerStyle
  }
}

const Style = {
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 999,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  shadowView: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -1,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  contentView: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    maxWidth: 300,
  },
}

// 注册默认类型
ModalTypeComponents.map(item => item(Component))

export default Component
export { __MODAL_TYPE__ as ModalType }
