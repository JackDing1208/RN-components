import React  from "react"
import LoadingComponent from '../../NewLoadingComponent'


module.exports = (Modal) => {
  if (!Modal.addType) {
    console.warn("Can not found [Modal.addType]")
    return
  }

  Modal.addType({
    type: "loading",
    contentComponent: <LoadingComponent active={true} style={{ margin: 12 }} />,
    contentContainerStyle: null,
  })
}