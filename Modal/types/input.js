import React from "react"
import { View, Text, TouchableOpacity, TextInput, Platform } from "react-native"

const __CONSTANT__ = {
  isAndroid: Platform.OS === "android"
}

const Style = {
  content: {
    fontSize: 18,
    lineHeight: 22,
    marginTop: 25,
    marginBottom: 20,
    color: "rgba(24, 59, 86, 1)",
    textAlign: "center"
  },
  buttonContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    minWidth: 270
  },
  buttonItemContainer: {
    flexDirection: "row",
    flexGrow: 0,
    justifyContent: "center",
    // alignItems: "center",
    height: 69,
    width: "50%"
  },
  buttonItem: {
    flexDirection: "row",
    flexGrow: 0,
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    width: "100%",
    borderRadius: 22
  },
  buttonTitle: {
    // flexGrow: 1,
    alignSelf: "center",
    textAlign: "center",
    lineHeight: 22,
    fontSize: 17
    // borderWidth: 1, // debug
    // borderColor: "rgba(0, 0, 0, 0.3)", // debug
  },
  cuttingLine: {
    width: 1,
    backgroundColor: "rgba(151, 175, 185, 0.3)",
    height: 44
  },
  inputContainer: {
    flexGrow: 0,
    borderColor: "rgba(185, 205, 228, 1)",
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 0,
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 20,
    paddingLeft: 8,
    paddingRight: 8
  },
  input: {
    flexGrow: 0,
    height: 45,
    fontSize: 14,
    padding: 0
    // lineHeight: __CONSTANT__.isAndroid ? 14 : 18,
    // borderWidth: 1, // debug
    // borderColor: "rgba(0, 0, 0, 0.3)", // debug
  }
}

module.exports = Modal => {
  if (!Modal.addType) {
    console.warn("Can not found [Modal.addType]")
    return
  }

  Modal.addType({
    type: "input",
    contentComponent: (props, modalContainer) => {
      let { option } = props
      if (!option) {
        option = {}
      }

      const generateButtonItem = (type, { title = "Title", onPress, titleStyle = {} }) => {
        const paddingLeft = type === "confirm" ? 10 : 25
        const paddingRight = type === "confirm" ? 25 : 10
        const backgroundColor = type === "confirm" ? "rgba(51, 209, 255, 1)" : "rgba(245, 245, 245, 1)"
        const color = type === "confirm" ? "rgba(255, 255, 255, 1)" : "rgba(24, 59, 86, 1)"
        const onPressFunction = () => {
          modalContainer.hide()
          const value = this.input._lastNativeText

          if(onPress && typeof onPress === "function"){
            onPress(value)
          }
        }
        return (
          <View style={{ ...Style.buttonItemContainer, paddingLeft, paddingRight }}>
            <TouchableOpacity style={{ ...Style.buttonItem, backgroundColor }} onPress={onPressFunction}>
              <Text style={{ ...Style.buttonTitle, ...titleStyle, color }}>{title}</Text>
            </TouchableOpacity>
          </View>
        )
      }

      const { content = "Content", confirm = {}, cancel = {} } = option
      const cancelButton = generateButtonItem("cancel", cancel)
      const confirmButton = generateButtonItem("confirm", confirm)
      const textInputComponent = (
        <View style={Style.inputContainer}>
          <TextInput
            style={Style.input}
            autoFocus={true}
            defaultValue={option.defaultValue}
            underlineColorAndroid="transparent"
            ref={component => {
              this.input = component
            }}
          />
        </View>
      )

      return (
        <View style={Style.container}>
          <Text style={Style.content}>{content}</Text>
          {textInputComponent}
          <View style={Style.buttonContainer}>
            {cancelButton}
            {confirmButton}
          </View>
        </View>
      )
    },
    contentContainerStyle: {
      padding: 0
    }
  })
}
