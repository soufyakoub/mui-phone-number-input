const axios = require("axios").default;
const fs = require("fs");
const { isSupportedCountry } = require("libphonenumber-js");

axios
  .get("https://flagcdn.com/en/codes.json")
  .then(({ data }) => {
    const obj = {};
    const entries = Object.entries(data);

    entries.sort((a, b) => a[1].localeCompare(b[1]));

    for (let [key, value] of entries) {
      key = key.toUpperCase();
      if (isSupportedCountry(key)) obj[key] = value;
    }

    fs.writeFileSync(
      "src/data.ts",
      `export const data = ${JSON.stringify(obj, null, 2)} as const;`
    );

    console.log("data.ts generated successfully");
  })
  .catch((error) => {
    console.error("Error fetching or processing JSON data:", error.message);
    process.exit(1);
  });
