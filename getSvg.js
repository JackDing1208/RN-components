const fs = require("fs")
const path = require("path")
// 设置需要遍历的相对路径
const relativePath = "./Image"
const root = path.join(__dirname, relativePath)

let pathArray = []


readDirSync(root)
readAllFiles(pathArray).then((data) => {
  data.forEach((item) => {
    let key = Object.keys(item)[0]
    let regXML = item[key]
      .replace(/\s*<!-- Generator: Sketch [\.\w]+ \(\w+\) - https:\/\/\w+\.\w+ -->\s*/ig, "")
      .replace(/\s*<title>\w+<\/title>\s*/ig, "")
      .replace(/\s*<desc>[\w\. ]+<\/desc>\s*/ig, "")
      .replace(/transform="translate\(([\-\d\.]+), ([\-\d\.]+)\)"/ig, `x="$1" y="$2"`)
    item[key] = regXML
  })
  writeObject(data)
})


//同步递归获取全部svg路径
function readDirSync(path) {
  let files = fs.readdirSync(path)
  // 循环遍历当前的文件以及文件夹
  files.forEach(function (filename) {
    let info = fs.statSync(path + "\/" + filename)
    if (info.isDirectory()) {
      readDirSync(path + "\/" + filename)
    } else {
      let filePath = path + "\/" + filename
      let fileNameReg = /\.svg/g
      let shouldFormat = fileNameReg.test(filePath)

      if (shouldFormat) {
        let obj = {}
        obj[filename] = filePath
        pathArray.push(obj)
      }
    }
  })
}


function readAllFiles(pathArray) {
  return new Promise((resolve, reject) => {
    Promise.all(pathArray.map((item) => {
      let key = Object.keys(item)[0]
      let path = item[key]
      return readFile(path, key)
    })).then(data => resolve(data))
      .catch(err => reject(err))
  })
}

function readFile(dirPath, filename) {
  return new Promise((resolve, reject) => {
    console.log(dirPath)
    console.log(filename)
    fs.readFile(dirPath, "utf8", function (err, data) {
      if (err) reject(err)
      // console.log(data)
      resolve({
        [filename.slice(0, filename.lastIndexOf("."))]: data,
      })
    })
  })
}


function writeObject(XMLData) {
  let svgFile = "export default " + JSON.stringify(Object.assign.apply(this, XMLData))
  fs.writeFile(path.resolve(__dirname, "./svgIndex.js"), svgFile, function (err) {
    if (err) throw new Error(err)
  })
}