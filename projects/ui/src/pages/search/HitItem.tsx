import { PageTagDetail, type SearchResultPage } from "../../graphql/generated";
import {
  ClockCircleOutlined,
  PlusOutlined,
  BookOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Space, Avatar, Card, Tag, Tooltip, Input, Typography } from "antd";
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
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  const tagInputStyle: React.CSSProperties = {
    width: 64,
    height: 22,
    marginInlineEnd: 8,
    verticalAlign: "top",
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    // background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const handleClose = (removedTag: PageTagDetail) => {
    // const newTags = tags.filter((tag) => tag !== removedTag);
    // console.log(newTags);
    // setTags(newTags);
  };

  const showInput = () => {
    // setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    // if (inputValue && !tags.includes(inputValue)) {
    //   setTags([...tags, inputValue]);
    // }
    // setInputVisible(false);
    // setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    // const newTags = [...tags];
    // newTags[editInputIndex] = editInputValue;
    // setTags(newTags);
    // setEditInputIndex(-1);
    // setEditInputValue('');
  };

  const updateDisplayTitle = () => {
    console.log("updateDisplayTitle");
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
      <Space>
        {hit.pageTags.map((pageTag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={editInputRef}
                key={pageTag.tag.id}
                size="small"
                style={tagInputStyle}
                value={editInputValue}
                onChange={handleEditInputChange}
                onBlur={handleEditInputConfirm}
                onPressEnter={handleEditInputConfirm}
              />
            );
          }
          const isLongTag = pageTag.tag.name.length > 20;
          const tagElem = (
            <Tag
              key={pageTag.tag.id}
              closable
              style={{ userSelect: "none" }}
              onClose={() => handleClose(pageTag)}
            >
              <span
                onDoubleClick={(e) => {
                  if (index !== 0) {
                    setEditInputIndex(index);
                    setEditInputValue(pageTag.tag.name);
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
        {inputVisible ? (
          <Input
            ref={inputRef}
            type="text"
            size="small"
            style={tagInputStyle}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        ) : (
          <Tag
            style={tagPlusStyle}
            icon={<PlusOutlined rev={undefined} />}
            onClick={showInput}
          >
            {t("search.newTag")}
          </Tag>
        )}
      </Space>
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
        <Space.Compact block>
          <Paragraph>
            <Snippet attribute="content" hit={hit} />
          </Paragraph>
        </Space.Compact>
      </div>
    </Card>
  );
};

export default HitItem;
