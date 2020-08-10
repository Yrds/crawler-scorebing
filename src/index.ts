import crawler from "./Crawler";

crawler().init({maxResults: 100}).then(results => {
  console.log(results);
})
