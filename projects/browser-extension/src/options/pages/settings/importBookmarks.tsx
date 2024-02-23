import {
  Badge,
  Breadcrumb,
  Button,
  Col,
  Progress,
  Row,
  Statistic,
  Table,
  Typography
} from "antd"
import type { ColumnsType } from "antd/es/table"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { MessageSubject } from "~background/messages"
import { LogFormat } from "~helpers/LogFormat"
import { StorageKeys, getImportBookmarksDetail } from "~storage"
import {
  type ImportBookmarkRecord,
  ImportStatus,
  type ImportSummary
} from "~types"

const { Title, Text } = Typography
const logFormat = new LogFormat("ExtensionSettingsImport")

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

  async function cleanButton() {
    await sendToBackground({
      name: MessageSubject.cleanImportBookmarks
    })
  }

  const [importBookmarksSummary] = useStorage<ImportSummary>({
    key: StorageKeys.ImportBookmarksSummary,
    instance: new Storage({
      area: "local"
    })
  })

  console.debug(
    ...logFormat.formatArgs("importBookmarksSummary", importBookmarksSummary)
  )

  useEffect(() => {
    getImportBookmarksDetail().then(
      (importBookmarksDetail) => {
        console.debug(
          ...logFormat.formatArgs(
            "importBookmarksDetail",
            importBookmarksDetail
          )
        )
        setTotalBookmarks(
          importBookmarksDetail.inProgress
            .concat(importBookmarksDetail.failed)
            .concat(importBookmarksDetail.success)
            .concat(importBookmarksDetail.remaining)
        )
      },
      (error) => {
        console.error(error)
      }
    )
  }, [importBookmarksSummary])

  const statusFilterOptions = []
  for (const status of Object.values(ImportStatus)) {
    statusFilterOptions.push({
      text: <>{status}</>,
      value: `${status}`
    })
  }

  const columns: ColumnsType<ImportBookmarkRecord> = [
    {
      title: chrome.i18n.getMessage("nameTitle"),
      dataIndex: "title",
      key: "name",
      render: (title, record) => (
        <a href={record?.url} target="_blank" rel="noreferrer">
          {title}
        </a>
      )
    },
    {
      title: chrome.i18n.getMessage("statusTitle"),
      dataIndex: "status",
      key: "status",
      filters: statusFilterOptions,
      filterSearch: true,
      onFilter: (value, record) => {
        return record.status.indexOf(value as string) === 0
      },
      render: (status) => {
        if (status === ImportStatus.Failed) {
          return <Badge status="error" text={status} />
        } else if (status === ImportStatus.Success) {
          return <Badge status="success" text={status} />
        } else if (status === ImportStatus.Pending) {
          return <Badge status="processing" text={status} />
        } else {
          return <Badge status="default" text={status} />
        }
      }
    },
    {
      title: chrome.i18n.getMessage("folderTitle"),
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <Breadcrumb
          items={tags?.map((tag) => {
            return { title: tag }
          })}></Breadcrumb>
      )
    },
    {
      title: chrome.i18n.getMessage("lastImportedAtTitle"),
      dataIndex: "lastImportedAt",
      key: "lastImportedAt",
      sorter: (a, b) => a.lastImportedAt - b.lastImportedAt,
      render: (lastImportedAt) => (
        <>
          {lastImportedAt
            ? new Date(lastImportedAt).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              })
            : ""}
        </>
      )
    },
    {
      title: chrome.i18n.getMessage("createdAtTitle"),
      dataIndex: "dateAdded",
      key: "dateAdded",
      sorter: (a, b) => a.dateAdded - b.dateAdded,
      render: (dateAdded) => (
        <Text>
          {dateAdded
            ? new Date(dateAdded).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              })
            : ""}
        </Text>
      )
    }
  ]

  return (
    <div>
      <Title level={5}>{chrome.i18n.getMessage("importTitle")}</Title>
      <Text type="secondary">
        {chrome.i18n.getMessage("importDescription")}
      </Text>
      <div className="settings-status-section">
        <Progress
          percent={
            importBookmarksSummary?.totalCount
              ? parseFloat(
                  (
                    (importBookmarksSummary.totalCount -
                      importBookmarksSummary.remainingCount) /
                    importBookmarksSummary.totalCount
                  ).toFixed(3)
                ) * 100
              : 0
          }
        />
        <Row gutter={16}>
          <Col span={4}>
            <Statistic
              title={chrome.i18n.getMessage("remainingTitle")}
              value={importBookmarksSummary?.remainingCount || 0}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title={chrome.i18n.getMessage("pendingTitle")}
              value={importBookmarksSummary?.inProgressCount || 0}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title={chrome.i18n.getMessage("successTitle")}
              value={importBookmarksSummary?.successCount || 0}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title={chrome.i18n.getMessage("failedTitle")}
              value={importBookmarksSummary?.failedCount || 0}
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
        <Button style={{ marginTop: 16, marginLeft: 5 }} onClick={cleanButton}>
          {chrome.i18n.getMessage("cleanButton")}
        </Button>
      </div>
      <Table
        rowKey={(record) => record?.id}
        columns={columns}
        dataSource={totalBookmarks}
        pagination={{
          defaultPageSize: 50,
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} items` // Custom total display
        }}
      />
    </div>
  )
}
