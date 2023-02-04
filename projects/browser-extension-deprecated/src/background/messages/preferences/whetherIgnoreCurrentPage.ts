import type { PlasmoMessaging } from "@plasmohq/messaging";

export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("preferences/whetherIgnoreCurrentPage");
  console.log(req);

  res.send({
    message: "preferences/whetherIgnoreCurrentPage - response - true"
  });
};

export default handler;
