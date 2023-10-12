import { GetTagsDocument } from "../../graphql/generated";
import { useQuery } from "@apollo/client";
import { Select } from "antd";
import React from "react";
import "./style.css";

export type TagsSelectorProps = {
  value: string[];
  onBlur: (value: string[]) => void;
};
const Tags: React.FC<TagsSelectorProps> = ({ value, onBlur }) => {
  const { loading: fetchTags, data: tagsData } = useQuery(GetTagsDocument);
  const [selectedTags, setSelectedTags] = React.useState<string[]>(value);
  const handleChange = (value: string[]) => {
    setSelectedTags(value);
  };
  const handleBlur = () => {
    console.log("blur", selectedTags);
    if (onBlur && typeof onBlur === "function") {
      onBlur(selectedTags);
    }
  };
  return (
    <Select
      mode="tags"
      style={{ width: "100%" }}
      placeholder="Tags Mode"
      loading={fetchTags}
      value={selectedTags}
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

export default Tags;
