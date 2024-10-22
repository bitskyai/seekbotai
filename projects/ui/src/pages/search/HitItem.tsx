import { WEB_APP_SCREENSHOT_PREVIEW_CROP_WIDTH } from "../../../../shared";
import Help from "../../components/Help";
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
      title: (
        <>
          {t("search.deleteConfirmDialog.deleteCurrent")}
          <Help title={t("search.deleteConfirmDialog.deleteCurrentTooltip")} />
        </>
      ),
      onClick: () => {
        deletePages(hit.id);
      },
    },
    {
      title: (
        <>
          {t("search.deleteConfirmDialog.deleteAllPagesMatchedCondition")}
          <Help
            title={t(
              "search.deleteConfirmDialog.deleteAllPagesMatchedConditionTooltip",
            )}
          />
        </>
      ),
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
      title: (
        <>
          {t(
            "search.deleteConfirmDialog.deleteAndIgnoreAllPagesMatchedCondition",
          )}
          <Help
            title={t(
              "search.deleteConfirmDialog.deleteAndIgnoreAllPagesMatchedConditionTooltip",
            )}
          />
        </>
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

  let displayTitle = hit.pageMetadata.displayTitle
    ? hit.pageMetadata.displayTitle
    : hit.title;
  let displayDescription = hit.pageMetadata.displayDescription
    ? hit.pageMetadata.displayDescription
    : hit.description;

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
                      attribute={
                        "pageMetadata.displayTitle" as keyof SearchResultPage
                      }
                      hit={hit}
                    />
                  ) : (
                    <Highlight attribute={titleHighlightAttribute} hit={hit} />
                  )}
                </Link>
                <Button
                  onClick={() => {
                    displayTitle = hit.pageMetadata.displayTitle
                      ? hit.pageMetadata.displayTitle
                      : hit.title;
                    setEditingTitle(true);
                  }}
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
                  displayTitle = hit.pageMetadata.displayTitle
                    ? hit.pageMetadata.displayTitle
                    : hit.title;
                  setEditingTitle(false);
                },
                onChange: (newTitle: string) => {
                  displayTitle = newTitle;
                },
                onEnd: async () => {
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
        <Space.Compact block>
          <div style={{ width: "50%", paddingRight: "20px" }}>
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
          </div>
          <div style={{ width: "50%" }}>
            <Divider
              style={{ fontSize: 14 }}
              orientation="left"
              orientationMargin="0"
            >
              {t("description")}
            </Divider>
            <div>
              {!editingDescription && (
                <>
                  {hit.pageMetadata.displayDescription ||
                    (hit.description &&
                      (hit.pageMetadata.displayDescription ? (
                        <Highlight
                          attribute={
                            "pageMetadata.displayDescription" as keyof SearchResultPage
                          }
                          hit={hit}
                        />
                      ) : (
                        <Highlight attribute={"description"} hit={hit} />
                      )))}
                  <Button
                    onClick={() => {
                      displayDescription = hit.pageMetadata.displayDescription
                        ? hit.pageMetadata.displayDescription
                        : hit.description;
                      setEditingDescription(true);
                    }}
                    type="link"
                    icon={<EditOutlined rev={"edit-icon"} />}
                  />
                </>
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
                      displayDescription = hit.pageMetadata.displayDescription
                        ? hit.pageMetadata.displayDescription
                        : hit.description;
                      setEditingDescription(false);
                    },
                    onChange: (newDescription: string) => {
                      displayDescription = newDescription;
                    },
                    onEnd: async () => {
                      if (
                        displayDescription ===
                        hit.pageMetadata.displayDescription
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
        </Space.Compact>
      </div>

      <Divider
        style={{ fontSize: 14 }}
        orientation="left"
        orientationMargin="0"
      >
        {t("search.autoExtractedContent.title")}
        <Help title={t("search.autoExtractedContent.tooltip")} />
      </Divider>
      <div className="hit-content">
        <Space>
          {hit.pageMetadata.screenshotPreview && (
            <Image
              src={`${getHost()}/${hit.pageMetadata.screenshotPreview}`}
              width={WEB_APP_SCREENSHOT_PREVIEW_CROP_WIDTH}
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
            {hit.pageMetadata.displayTitle && hit.title && (
              <>
                <Text strong>
                  <Highlight attribute="title" hit={hit} />
                </Text>
                <br />
              </>
            )}
            {hit.pageMetadata.displayDescription && hit.description && (
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
