import { Result } from "antd"

function LoseConnection() {
  return (
    <div style={{ maxWidth: 650, margin: "0 auto" }}>
      <Result
        status="404"
        title={chrome.i18n.getMessage("serviceNotHealthTitle")}
        subTitle={chrome.i18n.getMessage("serviceNotHealthDetail")}
      />
    </div>
  )
}

export default LoseConnection
