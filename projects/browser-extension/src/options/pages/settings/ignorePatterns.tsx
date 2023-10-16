import { Popconfirm, Table } from "antd"
import type { ColumnsType } from "antd/es/table"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { MessageSubject } from "~background/messages"
import { type IgnoreUrl } from "~graphql/generated"
import { LogFormat } from "~helpers/LogFormat"

import Help from "../../../components/Help"

const logFormat = new LogFormat("settings/ignorePatterns")

export default function ExtensionSettingsIgnorePatterns() {
  const [ignoreURLs, setIgnoreURLs] = useState<IgnoreUrl[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    sendToBackground({
      name: MessageSubject.getIgnoreURLs
    }).then((ignoreURLs) => {
      console.debug(...logFormat.formatArgs("ignoreURLs", ignoreURLs))
      setIgnoreURLs(ignoreURLs?.data)
      setLoading(false)
    })
  }, [])

  const handleDelete = async (id: string) => {
    const res = await sendToBackground({
      name: MessageSubject.deleteIgnoreURLs,
      body: { deleteIgnoreURLs: [{ id }] }
    })
    if (res.data) {
      const newData = ignoreURLs.filter((item) => item.id !== id)
      // need to trigger a mutation to delete the item
      setIgnoreURLs(newData)
    }
  }

  const columns: ColumnsType<IgnoreUrl> = [
    {
      title: (
        <>
          {chrome.i18n.getMessage("containsText")}
          <Help i18nKey="containsTextTooltip" />
        </>
      ),
      dataIndex: "pattern",
      key: "pattern"
    },
    {
      title: chrome.i18n.getMessage("action"),
      dataIndex: "action",
      render: (_, record: { id: string }) =>
        ignoreURLs.length >= 1 ? (
          <Popconfirm
            title={chrome.i18n.getMessage("sureToDelete")}
            onConfirm={() => handleDelete(record.id)}>
            <a>{chrome.i18n.getMessage("delete")}</a>
          </Popconfirm>
        ) : null
    }
  ]

  return (
    <div className="ignore-urls-container">
      <Table
        loading={loading}
        bordered
        dataSource={ignoreURLs}
        columns={columns}
        pagination={{ pageSize: 100 }}
      />
    </div>
  )
}
