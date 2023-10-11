import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { MessageSubject } from "~background/messages"
import { type IgnoreUrl } from "~graphql/generated"
import { LogFormat } from "~helpers/LogFormat"

const logFormat = new LogFormat("settings/ignorePatterns")
export default function ExtensionSettingsIgnorePatterns() {
  const [ignoreURLs, setIgnoreURLs] = useState<IgnoreUrl[]>([])
  useEffect(() => {
    sendToBackground({
      name: MessageSubject.getIgnoreURLs
    }).then((ignoreURLs) => {
      console.debug(...logFormat.formatArgs("ignoreURLs", ignoreURLs))
      setIgnoreURLs(ignoreURLs)
    })
  }, [])

  return <div>Ignore Patterns</div>
}
