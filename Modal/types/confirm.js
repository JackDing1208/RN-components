import React from "react"
import {View, Text, TouchableOpacity} from "react-native"

const Style = {
  content: {
    fontSize: 16,
    lineHeight: 22,
    margin: 20,
    textAlign: "center",
    color: "#183B56",
  },
  title: {
    fontSize: 18,
    color: "#183B56",
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 20,
    textAlign: "center",
  },
  buttonContainer: {
    // flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderTopWidth: 1,
    // borderColor: "red",
    minWidth: 300,
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  buttonItem: {
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    minWidth: 100,
    borderRadius: 22,
    // borderColor: "blue",
    // borderWidth: 1,
    // backgroundColor: "rgba(127, 255, 136, 0.2)", // debug
  },
  buttonGap: {
    width: 15,
    height: 44,
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
  cuttingLine: {
    width: 1,
    backgroundColor: "rgba(151, 175, 185, 0.3)",
    height: 44,
  },
}

const generateButtonItem = ({title = "Title", onPress, titleStyle = {}}) => {
  return (
    <TouchableOpacity style={{...Style.buttonItem, backgroundColor: titleStyle.backgroundColor || "#fff"}}
                      onPress={onPress}>
      <Text style={{...Style.buttonTitle, color: titleStyle.color || "#000"}}>{title}</Text>
    </TouchableOpacity>
  )
}

// 中间分割线
const cuttingLine = () => {
  return <View style={Style.cuttingLine}/>
}

module.exports = Modal => {
  if (!Modal.addType) {
    console.warn("Can not found [Modal.addType]")
    return
  }

  Modal.addType({
    type: "confirm",
    contentComponent: props => {
      let {option} = props
      if (!option) {
        option = {}
      }
      const {content = "Content", title, confirm = {}, cancel = {}} = option
      const cancelButton = generateButtonItem(cancel)
      const confirmButton = generateButtonItem(confirm)

      return (
        <View style={Style.container}>
          {title ? <Text style={Style.title}>{title}</Text> : null}
          <Text style={Style.content}>{content}</Text>
          <View style={Style.buttonContainer}>
            {cancelButton}
            <View style={Style.buttonGap}/>
            {confirmButton}
          </View>
        </View>
      )
    },
    contentContainerStyle: {
      padding: 0,
    },
  })
}
