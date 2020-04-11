const express = require("express");
const request = require("request");
const cherio = require("cheerio");
const { BASE_URL } = require("../helpers/constants");

const router = express.Router();

router.get("/:id", (req, res, next) => {
  request(`${BASE_URL}/g/${req.params.id}`, async (err, response, html) => {
    try {
      if (response.statusCode === 200) {
        const images = [];
        const obj = {};
        const $ = await cherio.load(html);
        await $("div#thumbnail-container div.thumb-container").each(
          (index, elements) => {
            return images.push($(elements).find("a img").attr("data-src"));
          }
        );
        await $("div#bigcontainer").each((index, elements) => {
          const tags = $(elements)
            .find("div.tag-container a.tag")
            .text()
            .split(")");
          tags.pop();
          return Object.assign(obj, {
            title: $(elements).find("div#info-block h1").text(),
            alias: $(elements).find("div#info-block h2").text(),
            cover: $(elements).find("div#cover img").attr("data-src"),
            tags,
            uploaded_at: $(elements)
              .find("div#info-block time")
              .attr("datetime"),
          });
        });
        await Object.assign(obj, { images });
        return res.status(200).json(obj);
      } else {
        console.log(err);
      }
    } catch (err) {
      res.status(404).json({ error: err });
    }
  });
});

module.exports = router;
