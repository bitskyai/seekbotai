import axios from "axios";

export default axios.create({
  baseURL: process.env.PLASMO_PUBLIC_SHIP_NAME,
  headers: {
    "Content-type": "application/json"
  }
});

// axios.defaults.baseURL = "$PLASMO_PUBLIC_BASE_URL";
// axios.defaults.headers.common['Content-type'] = 'application/json';

// export default axios;
