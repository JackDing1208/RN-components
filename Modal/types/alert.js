import React from "react"
import { View, Text, TouchableOpacity } from "react-native"

const Style = {
  content: {
    fontSize: 17,
    lineHeight: 22,
    margin: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    borderTopColor: "rgba(151, 175, 185, 0.3)",
    borderTopWidth: 1,
    minWidth: 270,
  },
  buttonItem: {
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    // backgroundColor: "rgba(127, 255, 136, 0.2)", // debug
  },
  buttonTitle: {
    // flexGrow: 1,
    alignSelf: "center",
    textAlign: "center",
    lineHeight: 22,
    fontSize: 17,
    // borderWidth: 1, // debug
    // borderColor: "rgba(0, 0, 0, 0.3)", // debug
  },
}

const generateButtonItem = ({ title, onPress, titleStyle }) => {
  return (
    <TouchableOpacity style={Style.buttonItem} onPress={onPress}>
      <Text style={{ ...Style.buttonTitle, ...titleStyle }}>{title}</Text>
    </TouchableOpacity>
  )
}

module.exports = Modal => {
  if (!Modal.addType) {
    console.warn("Can not found [Modal.addType]")
    return
  }

  Modal.addType({
    type: "alert",
    contentComponent: props => {
      let { option } = props
      if (!option) {
        option = {}
      }
      const {
        onPressConfirmButton,
        content = "Content",
        buttonTitle = I18n.t('DeviceDetail_Toast_Ikown'),
        titleStyle = null,
      } = option
      return (
        <View style={Style.container}>
          <Text style={Style.content}>{content}</Text>
          <View style={Style.buttonContainer}>
            {generateButtonItem({
              title: buttonTitle,
              onPress: onPressConfirmButton,
              titleStyle,
            })}
          </View>
        </View>
      )
    },
    contentContainerStyle: null,
  })
}
