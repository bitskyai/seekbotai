import { SCREENSHOT_PREVIEW_CROP_WIDTH } from "../../../../shared";
import Tags from "../../components/Tags";
import {
  type SearchResultPage,
  UpdatePageTagsDocument,
} from "../../graphql/generated";
import { getHost } from "../../helpers/utils";
import {
  ClockCircleOutlined,
  PlusOutlined,
  BookOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  Space,
  Avatar,
  Card,
  Tag,
  Tooltip,
  // Input,
  Typography,
  Image,
} from "antd";
// import type { InputRef } from "antd";
import type { Hit } from "instantsearch.js";
import { createElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Highlight, Snippet, useInstantSearch } from "react-instantsearch";

const { Link, Paragraph, Text } = Typography;

const IconText = ({ icon, text }: { icon: any; text: string }) => (
  <Space>
    {createElement(icon)}
    {text}
  </Space>
);

function HitItem({ hit }: { hit: Hit<SearchResultPage> }): JSX.Element {
  const { t } = useTranslation();
  const [inputVisible, setInputVisible] = useState(false);
  const { refresh } = useInstantSearch();

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    borderStyle: "dashed",
  };

  const [updatePageTagsMutation, { loading, error, data }] = useMutation(
    UpdatePageTagsDocument,
  );

  const updatePageTags = (tags: string[]) => {
    setInputVisible(false);
    updatePageTagsMutation({
      variables: {
        pageId: hit.id,
        pageTags: tags.map((tag) => ({ name: tag })),
      },
    });
    setTimeout(() => {
      refresh();
    }, 10000);
  };

  const removePageTag = (tagName: string) => {
    const newPageTags = hit.pageTags.filter(
      (pageTag) => pageTag.tag.name !== tagName,
    );
    updatePageTagsMutation({
      variables: {
        pageId: hit.id,
        pageTags: newPageTags.map((pageTag) => ({ name: pageTag?.tag?.name })),
      },
    });

    setTimeout(() => {
      refresh();
    }, 10000);
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
          <Tags
            value={hit.pageTags.map((pageTag) => pageTag.tag.name)}
            onBlur={updatePageTags}
          />
        ) : (
          <>
            {hit.pageTags.map((pageTag, index) => {
              const isLongTag = pageTag.tag.name.length > 20;
              const tagElem = (
                <Tag
                  key={pageTag.tag.id}
                  closable
                  style={{ userSelect: "none" }}
                  onClose={() => removePageTag(pageTag?.tag?.name)}
                >
                  <span
                    onDoubleClick={(e) => {
                      if (index !== 0) {
                        e.preventDefault();
                      }
                    }}
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
}

export default HitItem;
