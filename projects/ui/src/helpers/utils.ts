export function updateURLQuery(
  params: { paramName: string; paramValue: string }[],
) {
  // create a new URL object with the current URL
  const url = new URL(window.location.href);

  // get the current search parameters
  const searchParams = new URLSearchParams(url.search);

  // set a new parameter value
  params.map((param) => searchParams.set(param.paramName, param.paramValue));

  // update the search string of the URL with the new parameters
  url.search = searchParams.toString();

  // update the browser's URL bar with the new URL
  window.history.pushState(null, "", url.toString());
}

export function extensionOptionPage() {
  console.log(`window.frameElement: `, window.frameElement);
  console.log(`document.referrer: `, document.referrer);
  // console.log(`window parent:`, window?.parent?.location.href);
  console.log(
    `display settings:`,
    window.frameElement?.getAttribute("data-displayextensionsettings"),
  );
}
