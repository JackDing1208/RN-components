import React from "react"
import {View, Text} from "react-native"
import SvgUri from "react-native-svg-uri"
import Svg, {
  Circle,
  Ellipse,
  G,
  // Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  // Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from "react-native-svg"



//缓存已加载过的SVG
const iconContentCache = {}
const getICONContentForURI = async (URI) => {
  if (iconContentCache[URI]) {
    return iconContentCache[URI]
  }
  let content = await Managers.NetworkRequestManager.pureInstance.get(URI)

  console.log("SVG request content:", content.response)
  if (content.response) {
    content = content.response
  }
  iconContentCache[URI] = content.data
    .replace(/\s*<!-- Generator: Sketch [\.\w]+ \(\w+\) - https:\/\/\w+\.\w+ -->\s*/ig, "")
    .replace(/\s*<title>\w+<\/title>\s*/ig, "")
    .replace(/\s*<desc>[\w\. ]+<\/desc>\s*/ig, "")
    .replace(/transform="translate\(([\-\d\.]+), ([\-\d\.]+)\)"/ig, `x="$1" y="$2"`)
  return iconContentCache[URI]
}

class Component extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      iconXMLString: null,
    }
    this.URI = ""
    this.loadSVGContent(props)
  }

  componentWillReceiveProps(nextProps) {
    const {iconURI} = nextProps
    if (iconURI !== this.URI) {
      this.URI = iconURI
      this.loadSVGContent(nextProps)
    }
  }

  loadSVGContent = async (nextProps) => {
    logger.log("loadSVGContent()", nextProps)
    const {iconURI} = nextProps
    if (!iconURI) {
      logger.error("loadSVGContent()", "iconURI no value")
      return
    }
    try {
      // 开始请求设备图标的 SVG 数据
      const iconXMLResult = await getICONContentForURI(iconURI)
      const iconXMLString = iconXMLResult
      if (iconXMLString) {
        logger.success("iconXMLString YES")
        // 更新设备图标渲染
        this.setState({
          iconXMLString: iconXMLString,
        })
        this.URI = iconURI

      } else {
        logger.warn("iconXMLString NO")
      }
    } catch (error) {
      logger.error("loadSVGContent() error:", error)
      console.error("load device icon error", error)
    }
  }

  render() {
    const width = this.props.width || 40
    const height = this.props.height || 40
    const style = this.props.style || {}
    const color = this.props.color || "#00C1F9"

    if (!this.state.iconXMLString) {
      return (
        <Svg width={width} height={height} viewBox="0 0 60 60" style={style}>
          <G id="icon_default" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <G>
              <Polygon id="Fill-1" fill="#FFFFFF" opacity="0" points="0 60 60 60 60 0 0 0"></Polygon>
              <Path
                d="M33.0048,34.9634 L26.7978,34.9634 C25.8078,34.9634 25.0038,34.1614 25.0038,33.1704 L25.0028,26.9154 C25.0028,25.9244 25.8058,25.1214 26.7958,25.1214 L33.0038,25.1204 C33.9948,25.1204 34.7978,25.9234 34.7978,26.9144 L34.7988,33.1694 C34.7988,34.1604 33.9958,34.9634 33.0048,34.9634 L33.0048,34.9634 Z M38.1268,26.5504 C38.1268,23.9194 35.9928,21.7874 33.3618,21.7874 L26.4468,21.7874 C23.8218,21.7884 21.6748,23.9364 21.6748,26.5614 L21.6748,33.5374 C21.6758,36.1674 23.8078,38.2994 26.4388,38.2984 L33.3588,38.2984 C35.9818,38.2974 38.1278,36.1514 38.1278,33.5284 L38.1268,26.5504 Z"
                id="Fill-3" fill={color} opacity="0.5"></Path>
              <Path
                d="M14.8251,45.3057 L14.8221,14.7777 L45.2181,14.7747 L45.2291,45.3027 L14.8251,45.3057 Z M53.2061,25.5777 C54.1971,25.5777 55.0001,24.7747 55.0001,23.7847 L55.0001,23.7737 C55.0001,22.7837 54.1961,21.9807 53.2061,21.9807 L49.0531,21.9807 C48.9711,21.9807 48.8921,21.9947 48.8131,22.0047 L48.8121,14.2847 C48.8121,12.5727 47.4221,11.1797 45.7131,11.1797 L38.0121,11.1807 L38.0111,6.7937 C38.0111,5.8027 37.2081,4.9997 36.2171,4.9997 L36.2161,4.9997 C35.2251,4.9997 34.4231,5.8037 34.4231,6.7937 L34.4231,11.1807 L25.6201,11.1817 L25.6201,6.7947 C25.6201,5.8047 24.8171,5.0007 23.8261,5.0007 C22.8361,5.0017 22.0321,5.8047 22.0321,6.7947 L22.0331,11.1817 L14.3321,11.1827 C12.6241,11.1827 11.2341,12.5757 11.2341,14.2877 L11.2351,21.9847 L6.7941,21.9857 C5.8031,21.9857 5.0001,22.7877 5.0001,23.7787 L5.0001,23.7887 C5.0001,24.7797 5.8041,25.5827 6.7941,25.5827 L11.2351,25.5817 L11.2361,34.4357 C11.1821,34.4307 11.1301,34.4197 11.0731,34.4197 L6.7951,34.4197 C5.8041,34.4207 5.0011,35.2237 5.0011,36.2137 L5.0011,36.2307 C5.0011,37.2217 5.8041,38.0247 6.7951,38.0247 L11.0741,38.0237 C11.1301,38.0237 11.1821,38.0127 11.2371,38.0077 L11.2371,45.7967 C11.2401,47.5087 12.6291,48.9027 14.3351,48.9057 L22.0371,48.9047 L22.0371,53.2067 C22.0371,54.1977 22.8411,54.9997 23.8311,54.9997 C24.8211,54.9997 25.6251,54.1967 25.6251,53.2057 L25.6241,48.9047 L34.4271,48.9037 L34.4271,53.2047 C34.4271,54.1957 35.2301,54.9987 36.2211,54.9987 L36.2211,54.9987 C37.2131,54.9987 38.0151,54.1957 38.0151,53.2047 L38.0141,48.9027 L45.7131,48.9027 C47.4201,48.9017 48.8111,47.5077 48.8151,45.7927 L48.8141,38.0197 L53.2011,38.0197 C54.1911,38.0197 54.9951,37.2167 54.9951,36.2257 L54.9951,36.2087 C54.9941,35.2187 54.1911,34.4157 53.2001,34.4157 L48.8141,34.4157 L48.8131,25.5547 C48.8921,25.5647 48.9711,25.5777 49.0541,25.5777 L53.2061,25.5777 Z"
                id="Fill-5" fill={color}></Path>
            </G>
          </G>
        </Svg>
      )
    }

    const xmlDataString = this.state.iconXMLString
    return (
      <View style={style}>
        <SvgUri
          width={width}
          height={height}
          svgXmlData={xmlDataString}
          fill={color}
        />
      </View>
    )

  }
}

export default Component
