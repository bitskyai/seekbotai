export const isSupportedProtocol = (url: string): boolean => {
  return !!url?.match(/^\s*(https?|http?):\/\//)
}

export const isPDF = (url: string): boolean => {
  return !!url?.endsWith(".pdf")
}

export const isImage = (url: string): boolean => {
  return !!url?.match(/\.(jpeg|jpg|gif|png|svg)$/)
}

export const isVideo = (url: string): boolean => {
  return !!url?.match(/\.(mp4|webm)$/)
}

export const isAudio = (url: string): boolean => {
  return !!url?.match(/\.(mp3|wav|ogg)$/)
}

export const isWordDoc = (url: string): boolean => {
  return !!url?.match(/\.(doc|docx)$/)
}

export const isExcelDoc = (url: string): boolean => {
  return !!url?.match(/\.(xls|xlsx)$/)
}

export const isPowerPointDoc = (url: string): boolean => {
  return !!url?.match(/\.(ppt|pptx)$/)
}

export const isArchive = (url: string): boolean => {
  return !!url?.match(/\.(zip|rar|tar|gz|7z)$/)
}

export const isText = (url: string): boolean => {
  return !!url?.match(/\.(txt|csv)$/)
}

export const isHTML = (url: string): boolean => {
  return (
    !!url?.match(/\.(html|htm)$/) ||
    !(
      isPDF(url) ||
      isImage(url) ||
      isVideo(url) ||
      isAudio(url) ||
      isWordDoc(url) ||
      isExcelDoc(url) ||
      isPowerPointDoc(url) ||
      isArchive(url) ||
      isText(url)
    )
  )
}
