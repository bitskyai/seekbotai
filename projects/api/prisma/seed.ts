import seedDev from "./seeds/dev";
import seedProd from "./seeds/prod";

(async () => {
  await seedProd();
  await seedDev();
})();
