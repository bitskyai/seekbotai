import type { PlasmoMessaging } from "@plasmohq/messaging";

export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log(`bookmarks/status`);
  console.log(req);

  res.send({
    message: "Transaction Send completed"
  });
};

export default handler;
