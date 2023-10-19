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
import { useStorage } from "@plasmohq/storage/hook"

import { MessageSubject } from "~background/messages"
import {
  DEFAULT_HISTORY_DAYS_FROM_TODAY,
  DEFAULT_MAX_RESULTS
} from "~background/modules/history"
import { LogFormat } from "~helpers/LogFormat"
import { StorageKeys, getImportHistoryDetail } from "~storage"
import {
  type ImportHistoryRecord,
  ImportStatus,
  type ImportSummary
} from "~types"

const { Title, Text, Link } = Typography
const logFormat = new LogFormat("ExtensionSettingImportHistory")

export default function ExtensionSettingImportHistory() {
  const [totalHistory, setTotalHistory] = useState<ImportHistoryRecord[]>([])

  async function startImportHistory() {
    await sendToBackground({
      name: MessageSubject.startImportHistory
    })
  }

  async function stopImportHistory() {
    await sendToBackground({
      name: MessageSubject.stopImportHistory
    })
  }

  async function cleanButton() {
    await sendToBackground({
      name: MessageSubject.cleanImportHistory
    })
  }

  const [importHistorySummary] = useStorage<ImportSummary>(
    StorageKeys.ImportHistorySummary
  )

  console.debug(
    ...logFormat.formatArgs("importHistorySummary", importHistorySummary)
  )

  useEffect(() => {
    getImportHistoryDetail().then(
      (importHistoryDetail) => {
        console.debug(
          ...logFormat.formatArgs("importHistoryDetail", importHistoryDetail)
        )
        setTotalHistory(
          importHistoryDetail.inProgress
            .concat(importHistoryDetail.failed)
            .concat(importHistoryDetail.success)
            .concat(importHistoryDetail.remaining)
        )
      },
      (error) => {
        console.error(error)
      }
    )
  }, [importHistorySummary])

  const statusFilterOptions = []
  for (const status of Object.values(ImportStatus)) {
    statusFilterOptions.push({
      text: <>{status}</>,
      value: `${status}`
    })
  }

  const columns: ColumnsType<ImportHistoryRecord> = [
    {
      title: chrome.i18n.getMessage("nameTitle"),
      dataIndex: "title",
      key: "name",
      render: (title, record) => (
        <a href={record?.url} target="_blank" rel="noreferrer">
          <Link>
            <Text style={{ width: 700 }} ellipsis={{ tooltip: title }}>
              {title ?? record?.url}
            </Text>
          </Link>
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
      title: chrome.i18n.getMessage("lastVisitedAtTitle"),
      dataIndex: "lastVisitTime",
      key: "lastVisitTime",
      sorter: (a, b) => a.lastVisitTime - b.lastVisitTime,
      render: (lastVisitTime) => (
        <Text>
          {lastVisitTime
            ? new Date(lastVisitTime).toLocaleString("en-US", {
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
      <Title level={5}>{chrome.i18n.getMessage("importHistoryTitle")}</Title>
      <Text type="secondary">
        <p>{chrome.i18n.getMessage("importHistoryDescription")}</p>
        <p>
          {chrome.i18n.getMessage("importHistoryDetail", [
            DEFAULT_HISTORY_DAYS_FROM_TODAY.toString(),
            DEFAULT_MAX_RESULTS.toString()
          ])}
        </p>
      </Text>
      <div className="settings-status-section">
        <Progress
          percent={
            importHistorySummary?.totalCount
              ? parseInt(
                  (
                    ((importHistorySummary.totalCount -
                      importHistorySummary.remainingCount) /
                      importHistorySummary.totalCount) *
                    10000
                  ).toFixed(3)
                ) / 100
              : 0
          }
        />
        <Row gutter={16}>
          <Col span={4}>
            <Statistic
              title={chrome.i18n.getMessage("remainingTitle")}
              value={importHistorySummary?.remainingCount || 0}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title={chrome.i18n.getMessage("pendingTitle")}
              value={importHistorySummary?.inProgressCount || 0}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title={chrome.i18n.getMessage("successTitle")}
              value={importHistorySummary?.successCount || 0}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title={chrome.i18n.getMessage("failedTitle")}
              value={importHistorySummary?.failedCount || 0}
            />
          </Col>
        </Row>
      </div>
      <div>
        <Button
          type="primary"
          style={{ marginTop: 16 }}
          onClick={startImportHistory}
          loading={
            importHistorySummary?.status === ImportStatus.Pending ? true : false
          }>
          {chrome.i18n.getMessage("importButton")}
        </Button>
        <Button
          style={{ marginTop: 16, marginLeft: 5 }}
          onClick={stopImportHistory}>
          {chrome.i18n.getMessage("stopImportButton")}
        </Button>
        <Button style={{ marginTop: 16, marginLeft: 5 }} onClick={cleanButton}>
          {chrome.i18n.getMessage("cleanButton")}
        </Button>
      </div>
      <Table
        rowKey={(record) => record?.id}
        columns={columns}
        dataSource={totalHistory}
        pagination={{
          defaultPageSize: 50,
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} items` // Custom total display
        }}
      />
    </div>
  )
}
