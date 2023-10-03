import { SCREENSHOT_PREVIEW_CROP_WIDTH } from "../../../../shared";
import TagsSelector from "../../components/TagsSelector";
import {
  PageTagDetail,
  type SearchResultPage,
  GetTagsDocument,
} from "../../graphql/generated";
import { getHost } from "../../helpers/utils";
import {
  ClockCircleOutlined,
  PlusOutlined,
  BookOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Space,
  Avatar,
  Card,
  Tag,
  Tooltip,
  Input,
  Typography,
  Image,
} from "antd";
import type { InputRef } from "antd";
import type { Hit } from "instantsearch.js";
import { createElement, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Highlight, Snippet } from "react-instantsearch";

const { Link, Paragraph, Text } = Typography;

const IconText = ({ icon, text }: { icon: any; text: string }) => (
  <Space>
    {createElement(icon)}
    {text}
  </Space>
);

const HitItem = ({ hit }: { hit: Hit<SearchResultPage> }) => {
  const { t } = useTranslation();
  const [inputVisible, setInputVisible] = useState(false);

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    // background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  const titleHighlightAttribute = hit.title ? "title" : "url";

  return (
    <Card
      hoverable
      key={hit.id}
      title={
        <Space>
          <Avatar src={hit.icon} />
          <Tooltip title={hit.url}>
            <Link target="blank" href={hit.url}>
              <Highlight attribute={titleHighlightAttribute} hit={hit} />
            </Link>
          </Tooltip>
        </Space>
      }
      extra={
        <IconText
          icon={ClockCircleOutlined}
          text={`${t("viewedAt")}: ${
            hit.pageMetadata.lastVisitTime
              ? new Date(hit.pageMetadata.lastVisitTime).toLocaleString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  },
                )
              : ""
          }`}
          key="card-viewedAt"
        />
      }
      actions={[
        <IconText
          icon={BookOutlined}
          text={
            hit.pageMetadata.bookmarked
              ? t("search.unbookmark")
              : t("search.bookmark")
          }
          key="card-action-bookmark"
        />,
        <IconText
          icon={DeleteOutlined}
          text={t("delete")}
          key="card-action-delete"
        />,
      ]}
    >
      <div>
        {inputVisible ? (
          <TagsSelector />
        ) : (
          <>
            {hit.pageTags.map((pageTag, index) => {
              const isLongTag = pageTag.tag.name.length > 20;
              const tagElem = (
                <Tag
                  key={pageTag.tag.id}
                  closable
                  style={{ userSelect: "none" }}
                  // onClose={() => handleClose(pageTag)}
                >
                  <span
                  // onDoubleClick={(e) => {
                  //   if (index !== 0) {
                  //     setEditInputIndex(index);
                  //     setEditInputValue(pageTag.tag.name);
                  //     e.preventDefault();
                  //   }
                  // }}
                  >
                    {isLongTag
                      ? `${pageTag.tag.name.slice(0, 20)}...`
                      : pageTag.tag.name}
                  </span>
                </Tag>
              );
              return isLongTag ? (
                <Tooltip title={pageTag.tag.name} key={pageTag.tag.id}>
                  {tagElem}
                </Tooltip>
              ) : (
                tagElem
              );
            })}
            <Tag
              style={tagPlusStyle}
              icon={<PlusOutlined rev={undefined} />}
              onClick={() => {
                setInputVisible(true);
              }}
            >
              {t("search.newTag")}
            </Tag>
          </>
        )}
      </div>
      <div className="hit-content">
        <Space.Compact block>
          {hit.pageMetadata.displayTitle && (
            <Text strong>
              <Highlight attribute="title" hit={hit} />
            </Text>
          )}
          {hit.pageMetadata.displayDescription && (
            <Text type="secondary">
              <Highlight attribute="description" hit={hit} />
            </Text>
          )}
        </Space.Compact>
        <Space>
          {hit.pageMetadata.screenshotPreview && (
            <Image
              src={`${getHost()}/${hit.pageMetadata.screenshotPreview}`}
              width={SCREENSHOT_PREVIEW_CROP_WIDTH}
              preview={
                hit.pageMetadata.screenshot
                  ? {
                      src: `${getHost()}/${hit.pageMetadata.screenshot}`,
                    }
                  : false
              }
            />
          )}
          <Paragraph>
            <Snippet attribute="content" hit={hit} />
          </Paragraph>
        </Space>
      </div>
    </Card>
  );
};

export default HitItem;
