import { PageTagDetail, type SearchResultPage } from "../../graphql/generated";
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
        <Space>
          <Image
            src={`${getHost()}/${hit.pageMetadata.screenshotPreview}`}
            width={500}
            preview={{
              src: `${getHost()}/${hit.pageMetadata.screenshot}`,
            }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
          />
          <Paragraph>
            <Snippet attribute="content" hit={hit} />
          </Paragraph>
        </Space>
      </div>
    </Card>
  );
};

export default HitItem;
