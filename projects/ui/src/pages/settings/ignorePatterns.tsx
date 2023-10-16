import Help from "../../components/Help";
import {
  type IgnoreUrl,
  GetIgnoreUrLsDocument,
  DeleteIgnoreUrLsDocument,
} from "../../graphql/generated";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Popconfirm, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ExtensionSettingsIgnorePatterns() {
  const { t } = useTranslation();
  const [ignoreURLs, setIgnoreURLs] = useState<IgnoreUrl[]>([]);
  const [getIgnoreURLs, { loading }] = useLazyQuery(GetIgnoreUrLsDocument);
  const [deleteIgnoreURLs] = useMutation(DeleteIgnoreUrLsDocument);
  useEffect(() => {
    getIgnoreURLs().then((result) => {
      setIgnoreURLs(result?.data?.ignoreURLs || []);
    });
  }, []);

  const handleDelete = async (id: string) => {
    const res = await deleteIgnoreURLs({
      variables: { deleteIgnoreURLs: [{ id }] },
    });
    if (res.data?.deleteIgnoreURLs?.success) {
      const newData = ignoreURLs.filter((item) => item.id !== id);
      // need to trigger a mutation to delete the item
      setIgnoreURLs(newData);
    }
  };

  const columns: ColumnsType<IgnoreUrl> = [
    {
      title: (
        <>
          {t("settings.containsText")}
          <Help title={t("settings.containsTextTooltip")} />
        </>
      ),
      dataIndex: "pattern",
      key: "pattern",
    },
    {
      title: t("action"),
      dataIndex: "action",
      render: (_, record: { id: string }) =>
        ignoreURLs.length >= 1 ? (
          <Popconfirm
            title={t("sureToDelete")}
            onConfirm={() => handleDelete(record.id)}
          >
            <a>{t("delete")}</a>
          </Popconfirm>
        ) : null,
    },
  ];

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
  );
}
