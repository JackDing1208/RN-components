import React from "react"
import {StatusBar, Platform, NativeModules, NativeEventEmitter} from "react-native"

const application = NativeModules.Application
const applicationEmitter = new NativeEventEmitter(application)


let currentBarStyle
let isRunningFront = true

applicationEmitter.addListener(
  "application_page_status",
  (payload) => {
    const event = payload.event
    switch (event) {
      case "viewDidAppear":
        // do something
        StatusBar.setBarStyle(currentBarStyle)
        isRunningFront = true
        break
      case "viewDidDisappear":
        // do something
        isRunningFront = false
        break

      default:
        break
    }
  },
)


class StatusBarComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      barStyle: props.barStyle,
    }
  }



  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.enforcement && isRunningFront) {
      return true
    }
    return false
  }

  render() {
    if (Object.keys(this.props).length > 0 && this.props.barStyle) {
      // console.log("StatusBar.setBarStyle(this.props.barStyle)", this.props.barStyle)
      StatusBar.setBarStyle(this.props.barStyle)
      currentBarStyle = this.props.barStyle
    }
    const {
      backgroundColor = "transparent",
      barStyle,
      translucent,
    } = this.props

    return Platform.OS === "ios" ? (
      <StatusBar
        barStyle={barStyle}
        translucent={translucent}
        backgroundColor={backgroundColor}
      />
    ) : (
      <StatusBar
        animated={this.props.animated}
        translucent={translucent}
        barStyle={barStyle}
        backgroundColor={backgroundColor}
      />
    )
  }
}

export default StatusBarComponent
