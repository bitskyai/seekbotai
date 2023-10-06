function subscribe(eventName: string, listener: (arg: any) => void) {
  // unsubscribe before subscribe to avoid duplicate listeners
  unsubscribe(eventName, listener);
  document.addEventListener(eventName, listener);
}

function unsubscribe(eventName: string, listener: (arg: any) => void) {
  document.removeEventListener(eventName, listener);
}

function publish(eventName: string, data: any) {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}

export { publish, subscribe, unsubscribe };
