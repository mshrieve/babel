import fs from 'fs'

const appendFile = async (path: fs.PathLike, content: string) =>
  new Promise((res, rej) =>
    fs.appendFile(path, content, (err) => {
      if (err) return rej()
      return res(true)
    })
  )

const writeFile = async (path: fs.PathLike, content: string) =>
  new Promise((res, rej) =>
    fs.writeFile(path, content, (err) => {
      if (err) return rej()
      return res(true)
    })
  )

export { appendFile, writeFile }
