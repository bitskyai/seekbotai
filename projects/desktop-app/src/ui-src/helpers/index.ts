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
