import { Button, Col, List, Progress, Row, Statistic, Typography } from "antd"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import {
  type BookmarksImportStatusMsgRes,
  MessageSubject
} from "~background/messages"
import { type ImportBookmarkRecord } from "~types"

const { Title, Text } = Typography

export default function ExtensionSettingsImport() {
  const [percentage, setPercentage] = useState(0)
  const [total, setTotal] = useState(0)
  const [success, setSuccess] = useState(0)
  const [pending, setPending] = useState(0)
  const [failed, setFailed] = useState(0)
  const [totalBookmarks, setTotalBookmarks] = useState<ImportBookmarkRecord[]>(
    []
  )

  async function getBookmarksImportStatus() {
    const importBookmarksStatus = (await sendToBackground({
      name: MessageSubject.getBookmarksImportStatus
    })) as BookmarksImportStatusMsgRes
    setTotal(importBookmarksStatus.data.total || 0)
    setSuccess(importBookmarksStatus.data.success.length || 0)
    setFailed(importBookmarksStatus.data.failed.length || 0)
    setPending(importBookmarksStatus.data.inProgress.length || 0)
    setPercentage(total > 0 ? Math.round((success / total) * 100) : 0)
    setTotalBookmarks(
      importBookmarksStatus.data.success
        .concat(importBookmarksStatus.data.failed)
        .concat(importBookmarksStatus.data.remaining)
    )
  }

  useEffect(() => {
    getBookmarksImportStatus()
  }, [])

  return (
    <div>
      <Title level={5}>{chrome.i18n.getMessage("importTitle")}</Title>
      <Text type="secondary">
        {chrome.i18n.getMessage("importDescription")}
      </Text>
      <div className="settings-status-section">
        <Progress percent={percentage} />
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title={chrome.i18n.getMessage("totalTitle")}
              value={total}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={chrome.i18n.getMessage("pendingTitle")}
              value={pending}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={chrome.i18n.getMessage("successTitle")}
              value={success}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={chrome.i18n.getMessage("failedTitle")}
              value={failed}
            />
          </Col>
        </Row>
      </div>
      <div>
        <Button type="primary" style={{ marginTop: 16 }}>
          {chrome.i18n.getMessage("importButton")}
        </Button>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={totalBookmarks}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
              description={
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.url}
                </a>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )
}
