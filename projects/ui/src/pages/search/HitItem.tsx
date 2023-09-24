import { PageTagDetail, type SearchResultPage } from "../../graphql/generated";
import {
  FileImageOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Space, Avatar, Card, Tag, Tooltip, Input, Typography } from "antd";
import type { InputRef } from "antd";
import { createElement, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Highlight, Snippet } from "react-instantsearch";

const { Meta } = Card;
const { Paragraph } = Typography;

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {createElement(icon)}
    {text}
  </Space>
);

function getOrigin(url: string) {
  const urlObj = new URL(url);
  return urlObj.origin;
}

const HitItem = ({ hit }: { hit: SearchResultPage }) => {
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
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    // if (inputValue && !tags.includes(inputValue)) {
    //   setTags([...tags, inputValue]);
    // }
    // setInputVisible(false);
    // setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
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

  return (
    <Card
      hoverable
      key={hit.id}
      title={
        <Space>
          <Avatar src={hit.icon} />
          <Paragraph
            style={{ marginBottom: "0" }}
            editable={{ onChange: updateDisplayTitle }}
          >
            <a key="url-link" target="blank" href={hit.url}>
              <Highlight
                attribute={
                  hit.pageMetadata.displayTitle
                    ? "pageMetadata.displayTitle"
                    : hit.title
                    ? "title"
                    : "url"
                }
                hit={hit}
              />
            </a>
          </Paragraph>
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
          key="list-vertical-like-o"
        />
      }
      actions={[
        <IconText
          icon={FileImageOutlined}
          text={getOrigin(hit.url)}
          key="list-vertical-like-o"
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
              closable={index !== 0}
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
          <Tag style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
            New Tag
          </Tag>
        )}
      </Space>
      <Space>
        <Meta
          description={hit.pageMetadata.displayDescription ?? hit.description}
        />
      </Space>
      {/* <div className="hit-name">
        <Highlight attribute="title" hit={hit} />
      </div> */}
      {/* <img
        src={hit.icon ?? ""}
        alt={hit.pageMetadata.displayTitle ?? hit.title}
      /> */}
      <div className="hit-content">
        <Snippet attribute="content" hit={hit} />
      </div>
    </Card>
  );
};

export default HitItem;
