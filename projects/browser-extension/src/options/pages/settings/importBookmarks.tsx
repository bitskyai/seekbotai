import { Button, Col, List, Progress, Row, Statistic, Typography } from "antd"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

import {
  type BookmarksImportStatusMsgRes,
  MessageSubject
} from "~background/messages"
import { StorageKeys, getImportBookmarksDetail } from "~storage"
import { type ImportBookmarksSummary, ImportStatus } from "~types"
import { type ImportBookmarkRecord } from "~types"

const { Title, Text } = Typography

export default function ExtensionSettingsImport() {
  const [totalBookmarks, setTotalBookmarks] = useState<ImportBookmarkRecord[]>(
    []
  )

  async function startImportBookmarks() {
    await sendToBackground({
      name: MessageSubject.startImportBookmarks
    })
  }

  async function stopImportBookmarks() {
    await sendToBackground({
      name: MessageSubject.stopImportBookmarks
    })
  }

  const [importBookmarksSummary] = useStorage<ImportBookmarksSummary>(
    StorageKeys.ImportBookmarksSummary
  )

  useEffect(() => {
    getImportBookmarksDetail().then((importBookmarksDetail) => {
      setTotalBookmarks(
        importBookmarksDetail.failed
          .concat(importBookmarksDetail.success)
          .concat(importBookmarksDetail.remaining)
      )
    })
  }, [importBookmarksSummary])

  console.log(`ImportBookmarksSummary: `, importBookmarksSummary)

  return (
    <div>
      <Title level={5}>{chrome.i18n.getMessage("importTitle")}</Title>
      <Text type="secondary">
        {chrome.i18n.getMessage("importDescription")}
      </Text>
      <div className="settings-status-section">
        <Progress
          percent={
            importBookmarksSummary?.totalBookmarkCount
              ? parseFloat(
                  (
                    importBookmarksSummary.totalBookmarkCount -
                    importBookmarksSummary.remainingBookmarkCount /
                      importBookmarksSummary.totalBookmarkCount
                  ).toFixed(1)
                )
              : 0
          }
        />
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title={chrome.i18n.getMessage("totalTitle")}
              value={importBookmarksSummary?.totalBookmarkCount || 0}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={chrome.i18n.getMessage("pendingTitle")}
              value={importBookmarksSummary?.inProgressBookmarkCount || 0}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={chrome.i18n.getMessage("successTitle")}
              value={importBookmarksSummary?.successBookmarkCount || 0}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={chrome.i18n.getMessage("failedTitle")}
              value={importBookmarksSummary?.failedBookmarkCount || 0}
            />
          </Col>
        </Row>
      </div>
      <div>
        <Button
          type="primary"
          style={{ marginTop: 16 }}
          onClick={startImportBookmarks}
          loading={
            importBookmarksSummary?.status === ImportStatus.Pending
              ? true
              : false
          }>
          {chrome.i18n.getMessage("importButton")}
        </Button>
        <Button
          style={{ marginTop: 16, marginLeft: 5 }}
          onClick={stopImportBookmarks}>
          {chrome.i18n.getMessage("stopImportButton")}
        </Button>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={totalBookmarks || []}
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
