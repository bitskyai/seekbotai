import { Button, Typography } from "antd"
import { useEffect } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { MessageSubject } from "~background/messages"

const { Title, Text } = Typography

async function getBookmarks() {
  console.log(
    `MessageSubject.getBookmarksImportStatus: `,
    MessageSubject.getBookmarksImportStatus
  )
  const importBookmarksStatus = await sendToBackground({
    name: MessageSubject.getBookmarksImportStatus
  })

  console.log(`importBookmarksStatus: `, importBookmarksStatus)
}

export default function ExtensionSettingsImport() {
  useEffect(() => {
    getBookmarks()
  }, [])

  return (
    <div>
      <Title level={5}>{chrome.i18n.getMessage("importTitle")}</Title>
      <Text type="secondary">
        {chrome.i18n.getMessage("importDescription")}
      </Text>
      <div>
        <Button type="primary" style={{ marginTop: 16 }}>
          {chrome.i18n.getMessage("importButton")}
        </Button>
      </div>
    </div>
  )
}
