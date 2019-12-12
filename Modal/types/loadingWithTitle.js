import React from "react"
import { View, Text } from "react-native"
import LoadingComponent from "../../NewLoadingComponent"

const Style = {
  loadingTitle: {
    textAlign: "center",
    marginTop: 12,
    color: "rgba(151, 175, 185, 1)",
  },
}

module.exports = Modal => {
  if (!Modal.addType) {
    console.warn("Can not found [Modal.addType]")
    return
  }

  Modal.addType({
    type: "loadingWithTitle",
    contentComponent: props => {
      const title = props.title || "Loading"
      return (
        <View>
          <LoadingComponent active={props.display} />
          <Text style={Style.loadingTitle}>{title}</Text>
        </View>
      )
    },
    contentContainerStyle: null,
  })
}
