export async function checkServiceHealth(url: string) {
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

function addZero(num: number) {
  return num < 10 ? `0${num}` : `${num}`;
}

export function getFullDateString(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = addZero(date.getDate());
  const hour = addZero(date.getHours());
  const minute = addZero(date.getMinutes());
  const second = addZero(date.getSeconds());
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function isVersionLessThan(version, compareVersion = "0.3.0") {
  const [major, minor, patch] = version.split(".").map(Number);
  const [compareMajor, compareMinor, comparePatch] = compareVersion
    .split(".")
    .map(Number);

  if (major < compareMajor) return true;
  if (major > compareMajor) return false;
  if (minor < compareMinor) return true;
  if (minor > compareMinor) return false;
  if (patch < comparePatch) return true;
  return false;
}
