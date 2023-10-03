import { GetTagsDocument, type PageTagDetail } from "../../graphql/generated";
import { useQuery } from "@apollo/client";
import { Select } from "antd";
import React from "react";
import "./style.css";

export type TagsSelectorProps = {
  tags: PageTagDetail[];
};
const TagsSelector: React.FC<TagsSelectorProps> = ({ tags }) => {
  const { loading: fetchTags, data: tagsData } = useQuery(GetTagsDocument);
  const handleChange = (value: any) => {
    console.log(`selected ${value}`);
  };
  const handleBlur = () => {
    console.log("blur");
  };
  return (
    <Select
      mode="tags"
      style={{ width: "100%" }}
      placeholder="Tags Mode"
      loading={fetchTags}
      onChange={handleChange}
      onBlur={handleBlur}
      options={
        tagsData?.tags?.map((tag) => ({
          label: tag?.name,
          value: tag?.name,
        })) || []
      }
    />
  );
};

export default TagsSelector;
