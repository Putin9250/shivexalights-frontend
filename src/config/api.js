// Production is deliberately pinned to the public Render service, so a normal
// `npm run build` / `npm run deploy` cannot accidentally publish a storefront
// that points at an old local or development API URL.
const PRODUCTION_API_URL = "https://shivexalights-backend.onrender.com/api";
const PRODUCTION_UPLOAD_URL = "https://shivexalights-backend.onrender.com";

export const API_URL = import.meta.env.PROD
  ? PRODUCTION_API_URL
  : import.meta.env.VITE_API_URL || PRODUCTION_API_URL;

export const API_UPLOAD_URL = import.meta.env.PROD
  ? PRODUCTION_UPLOAD_URL
  : import.meta.env.VITE_API_UPLOAD_URL || PRODUCTION_UPLOAD_URL;
