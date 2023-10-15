import { SCREENSHOT_PREVIEW_CROP_WIDTH } from "../../../../shared";
import Tags from "../../components/Tags";
import {
  type SearchResultPage,
  UpdatePageTagsDocument,
  DeletePagesDocument,
  UpdatePageMetadataDocument,
} from "../../graphql/generated";
import { publish } from "../../helpers/event";
import { getHost } from "../../helpers/utils";
import {
  ClockCircleOutlined,
  PlusOutlined,
  HeartFilled,
  DeleteOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  Space,
  Avatar,
  Card,
  Tag,
  Tooltip,
  Popover,
  Input,
  Typography,
  Image,
  Button,
  List,
  Divider,
} from "antd";
import type { Hit } from "instantsearch.js";
import { differenceBy } from "lodash";
import { ChangeEvent, createElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Highlight, Snippet, useInstantSearch } from "react-instantsearch";

export const HIT_ITEM_REFRESH = "HIT_ITEM_REFRESH";

const { Link, Paragraph, Text } = Typography;
const { TextArea } = Input;

const IconText = ({ icon, text }: { icon: any; text: string }) => (
  <Space>
    {createElement(icon)}
    {text}
  </Space>
);

const deleteContent = ({
  hit,
  deletePages,
}: {
  hit: Hit<SearchResultPage>;
  deletePages: (pageId: string, pattern?: string, ignore?: boolean) => void;
}) => {
  const url = hit.url;
  const { t } = useTranslation();
  const [deleteAllPagesUrl, setDeleteAllPagesUrl] = useState(url);
  const [deleteAndIgnoreAllPagesUrl, setDeleteAndIgnoreAllPagesUrl] =
    useState(url);
  console.log(
    "deleteContent - hit.url",
    url,
    " deleteAllPagesUrl",
    deleteAllPagesUrl,
    " deleteAndIgnoreAllPagesUrl",
    deleteAndIgnoreAllPagesUrl,
  );

  const onDeleteAllPagesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDeleteAllPagesUrl(event?.target?.value);
  };

  const onDeleteAndIgnoreAllPagesChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDeleteAndIgnoreAllPagesUrl(event?.target?.value);
  };

  const options = [
    {
      title: t("search.deleteConfirmDialog.deleteCurrent"),
      onClick: () => {
        deletePages(hit.id);
      },
    },
    {
      title: t("search.deleteConfirmDialog.deleteAllPagesMatchedCondition"),
      description: (
        <TextArea
          placeholder="Basic usage"
          autoSize={{ minRows: 2, maxRows: 6 }}
          value={deleteAllPagesUrl}
          onChange={onDeleteAllPagesChange}
        />
      ),
      onClick: () => {
        deletePages(hit.id, deleteAllPagesUrl, false);
      },
    },
    {
      title: t(
        "search.deleteConfirmDialog.deleteAndIgnoreAllPagesMatchedCondition",
      ),
      description: (
        <TextArea
          placeholder="Basic usage"
          autoSize={{ minRows: 2, maxRows: 6 }}
          value={deleteAndIgnoreAllPagesUrl}
          onChange={onDeleteAndIgnoreAllPagesChange}
        />
      ),
      onClick: () => {
        deletePages(hit.id, deleteAndIgnoreAllPagesUrl, true);
      },
    },
  ];

  return (
    <div>
      <List
        style={{ minWidth: 500 }}
        dataSource={options}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                type="primary"
                key={`${hit.id}-ok`}
                onClick={item.onClick}
              >
                {t("ok")}
              </Button>,
            ]}
          >
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      ></List>
    </div>
  );
};

function HitItem({ hit }: { hit: Hit<SearchResultPage> }): JSX.Element {
  const { t } = useTranslation();
  const { refresh } = useInstantSearch();
  const [inputVisible, setInputVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);
  const [displayTitle, setDisplayTitle] = useState(
    hit.pageMetadata.displayTitle ? hit.pageMetadata.displayTitle : hit.title,
  );
  hit.description = hit.description ? hit.description : " ";

  const [displayDescription, setDisplayDescription] = useState(
    hit.pageMetadata.displayDescription
      ? hit.pageMetadata.displayDescription
      : hit.description,
  );

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    borderStyle: "dashed",
  };

  const [updatePageTagsMutation] = useMutation(UpdatePageTagsDocument);
  const [deletePagesMutation] = useMutation(DeletePagesDocument);
  const [updatePageMetadataMutation] = useMutation(UpdatePageMetadataDocument);

  const updatePageTags = async (tags: string[]) => {
    setInputVisible(false);
    const updatedTags = tags.map((tag) => ({ name: tag }));
    const currentTags = hit.pageTags.map((pageTag) => ({
      name: pageTag.tag.name,
    }));
    if (differenceBy(updatedTags, currentTags, "name").length) {
      setUpdating(true);
      await updatePageTagsMutation({
        variables: {
          pageId: hit.id,
          pageTags: tags.map((tag) => ({ name: tag })),
        },
      });
      refresh();
      publish(HIT_ITEM_REFRESH, hit.id);
      setUpdating(false);
    }
  };

  const removePageTag = async (tagName: string) => {
    setUpdating(true);
    const newPageTags = hit.pageTags.filter(
      (pageTag) => pageTag.tag.name !== tagName,
    );
    await updatePageTagsMutation({
      variables: {
        pageId: hit.id,
        pageTags: newPageTags.map((pageTag) => ({ name: pageTag?.tag?.name })),
      },
    });
    refresh();
    publish(HIT_ITEM_REFRESH, hit.id);
    setUpdating(false);
  };

  const deletePages = async (
    pageId: string,
    pattern?: string,
    ignore?: boolean,
  ) => {
    setOpen(false);
    setUpdating(true);

    await deletePagesMutation({
      variables: {
        pages: [
          {
            pageId,
            pattern,
            ignore,
          },
        ],
      },
    });

    refresh();
    publish(HIT_ITEM_REFRESH, hit.id);
    setUpdating(false);
  };

  const onFavoriteClick = async () => {
    setUpdating(true);
    await updatePageMetadataMutation({
      variables: {
        pageId: hit.id,
        pageMetadata: {
          favorite: !hit.pageMetadata.favorite,
        },
      },
    });
    refresh();
    publish(HIT_ITEM_REFRESH, hit.id);
    setUpdating(false);
  };

  const titleHighlightAttribute = hit.title ? "title" : "url";

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Card
      hoverable
      key={hit.id}
      loading={updating}
      title={
        <Space>
          <Avatar src={hit.icon} />
          {!editingTitle && (
            <Tooltip title={hit.url}>
              <Space>
                <Link target="blank" href={hit.url}>
                  {hit.pageMetadata.displayTitle ? (
                    <Highlight
                      attribute="pageMetadata.displayTitle"
                      hit={hit}
                    />
                  ) : (
                    <Highlight attribute={titleHighlightAttribute} hit={hit} />
                  )}
                </Link>
                <Button
                  onClick={() => setEditingTitle(true)}
                  type="link"
                  icon={<EditOutlined rev={"edit-icon"} />}
                />
              </Space>
            </Tooltip>
          )}
          {editingTitle && (
            <Paragraph
              style={{
                display: editingTitle ? "block" : "none",
                margin: "0 0 0 10px",
                minWidth: "600px",
              }}
              editable={{
                editing: true,
                autoSize: true,
                onCancel: () => {
                  setEditingTitle(false);
                },
                onChange: (newTitle: string) => {
                  console.log("onChange newTitle:", newTitle);
                  setDisplayTitle(newTitle);
                  console.log("onChange displayTitle:", displayTitle);
                },
                onEnd: async () => {
                  console.log("onEnd displayTitle:", displayTitle);
                  if (displayTitle === hit.pageMetadata.displayTitle) {
                    setEditingTitle(false);
                    return;
                  }
                  setUpdating(true);
                  setEditingTitle(false);
                  await updatePageMetadataMutation({
                    variables: {
                      pageId: hit.id,
                      pageMetadata: {
                        displayTitle: displayTitle,
                      },
                    },
                  });
                  refresh();
                  publish(HIT_ITEM_REFRESH, hit.id);
                  setUpdating(false);
                },
              }}
            >
              {displayTitle}
            </Paragraph>
          )}
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
        <Button
          key="card-action-favorite"
          type="text"
          onClick={onFavoriteClick}
          icon={
            hit.pageMetadata.favorite ? (
              <HeartFilled rev={undefined} />
            ) : (
              <HeartOutlined rev={undefined} />
            )
          }
        >
          {hit.pageMetadata.favorite
            ? t("search.favorited")
            : t("search.favorite")}
        </Button>,
        <Popover
          key="card-action-delete-popover"
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
          content={deleteContent({ hit, deletePages })}
        >
          <Button type="text" icon={<DeleteOutlined rev={undefined} />}>
            {t("delete")}
          </Button>
        </Popover>,
      ]}
    >
      <div className="editable-content">
        <Divider
          style={{ fontSize: 14 }}
          orientation="left"
          orientationMargin="0"
        >
          {t("sideNav.tags.sectionTitle")}
        </Divider>
        {inputVisible ? (
          <Tags
            value={hit.pageTags.map((pageTag) => pageTag.tag.name)}
            onBlur={updatePageTags}
          />
        ) : (
          <>
            {hit.pageTags.map((pageTag) => {
              const isLongTag = pageTag.tag.name.length > 20;
              const tagElem = (
                <Tag
                  key={pageTag.tag.id}
                  closable={!updating}
                  style={{ userSelect: "none" }}
                  onClose={() => removePageTag(pageTag?.tag?.name)}
                >
                  <span>
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
            {!updating && (
              <Tag
                style={tagPlusStyle}
                icon={<PlusOutlined rev={undefined} />}
                onClick={() => {
                  setInputVisible(true);
                }}
              >
                {t("search.newTag")}
              </Tag>
            )}
          </>
        )}
        <Divider
          style={{ fontSize: 14 }}
          orientation="left"
          orientationMargin="0"
        >
          {t("description")}
        </Divider>
        <div>
          {!editingDescription && (
            <div>
              {hit.pageMetadata.displayDescription ? (
                <Highlight
                  attribute={"pageMetadata.displayDescription"}
                  hit={hit}
                />
              ) : (
                <Highlight attribute={"description"} hit={hit} />
              )}
              <Button
                onClick={() => setEditingDescription(true)}
                type="link"
                icon={<EditOutlined rev={"edit-icon"} />}
              />
            </div>
          )}
          {editingDescription && (
            <Paragraph
              style={{
                margin: "0 0 0 10px",
                minWidth: "600px",
              }}
              editable={{
                editing: true,
                autoSize: true,
                onCancel: () => {
                  setEditingDescription(false);
                },
                onChange: (newDescription: string) => {
                  console.log("onChange newDescription:", newDescription);
                  setDisplayDescription(newDescription);
                  console.log("onChange displayDescription:", newDescription);
                },
                onEnd: async () => {
                  console.log("onEnd displayDescription:", displayDescription);
                  if (
                    displayDescription === hit.pageMetadata.displayDescription
                  ) {
                    setEditingDescription(false);
                    return;
                  }
                  setUpdating(true);
                  setEditingDescription(false);
                  await updatePageMetadataMutation({
                    variables: {
                      pageId: hit.id,
                      pageMetadata: {
                        displayDescription: displayDescription,
                      },
                    },
                  });
                  refresh();
                  publish(HIT_ITEM_REFRESH, hit.id);
                  setUpdating(false);
                },
              }}
            >
              {displayDescription}
            </Paragraph>
          )}
        </div>
      </div>
      <Divider
        style={{ fontSize: 14 }}
        orientation="left"
        orientationMargin="0"
      >
        Auto Extracted Content
      </Divider>
      <div className="hit-content">
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
            {hit.pageMetadata.displayTitle && (
              <>
                <Text strong>
                  <Highlight attribute="title" hit={hit} />
                </Text>
                <br />
              </>
            )}
            {hit.pageMetadata.displayDescription && (
              <>
                <Text type="secondary">
                  <Highlight attribute="description" hit={hit} />
                </Text>
                <br />
              </>
            )}
            <Snippet attribute="content" hit={hit} />
          </Paragraph>
        </Space>
      </div>
    </Card>
  );
}

export default HitItem;
