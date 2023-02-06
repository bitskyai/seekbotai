import { cleanEnv, num, str } from "envalid";

export default cleanEnv(process.env, {
  VERSION: str({ default: "1.0.0" }),
  DATABASE_URL: str({
    default: "postgresql://localhost:5432/postgres?schema=public",
  }),
  API_PORT: num({ default: 4000 }),
});
