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
