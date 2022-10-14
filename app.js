const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// URL of the site
const url = "https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3";

async function scrapeData() {
    try {
        const { data } = await axios.get(url);

        const $ = cheerio.load(data);

        const list_items = $(".plainlist ul li");

        const countries = []

        list_items.each((id, el) => {
            const country = { name: "", iso3: "" };

            country.name = $(el).children("a").text();
            country.iso3 = $(el).children("span").text();

            countries.push(country);
        });

        console.dir(countries);
        
        fs.writeFile("countries.json", JSON.stringify(countries, null, 2), (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Successfully written data to file.");
        });
    } catch (err) {
        console.error(err);
    }
}

scrapeData();