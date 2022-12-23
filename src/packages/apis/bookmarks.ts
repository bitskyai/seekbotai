import axios from "axios";

import http from "./http";

export type GetBookmarkStatusResponse = {
  data: {
    url: string;
    status: ["bookmarked", "notbookmarked", "failed"];
  };
};
export async function getBookmarkStatus(url: string) {
  try {
    const { data } = await http.get<GetBookmarkStatusResponse>(
      `/bookmarks/status?url=${url}`
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("error message: ", err.message);
      return {
        url: url,
        status: "failed"
      };
    } else {
      console.log("unexpected error: ", err);
      return {
        url: url,
        status: "failed"
      };
    }
  }
}
