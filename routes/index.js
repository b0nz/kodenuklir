const express = require("express");
const request = require("request");
const cherio = require("cheerio");
const { BASE_URL } = require("../helpers/constants");

const router = express.Router();

router.get("/", (req, res, next) => {
  if (req.query.page) {
    request(
      `${BASE_URL}/?page=${req.query.page}`,
      async (err, response, html) => {
        try {
          if (response.statusCode === 200) {
            const data = [];
            const obj = {};
            const $ = await cherio.load(html);
            await $("section.pagination").each((index, elements) => {
              return Object.assign(obj, {
                next: $(elements).find("a.next").attr("href"),
              });
            });
            await $("div.container div.gallery a.cover").each(
              (index, elements) => {
                return data.push({
                  _id: $(elements).attr("href").split("/")[2],
                  url: $(elements).attr("href"),
                  cover: $(elements).find("img").attr("data-src"),
                  caption: $(elements).find("div.caption").text(),
                });
              }
            );
            await Object.assign(obj, { data });
            await res.status(200).json(obj);
          } else {
            throw err;
          }
        } catch (err) {
          res.status(404).json({ error: err });
        }
      }
    );
  } else {
    request(BASE_URL, async (err, response, html) => {
      try {
        if (response.statusCode === 200) {
          const data = [];
          const obj = {};
          const $ = await cherio.load(html);
          await $("section.pagination").each((index, elements) => {
            return Object.assign(obj, {
              next: $(elements).find("a.next").attr("href"),
            });
          });
          await $("div.container div.gallery a.cover").each(
            (index, elements) => {
              return data.push({
                _id: $(elements).attr("href").split("/")[2],
                url: $(elements).attr("href"),
                cover: $(elements).find("img").attr("data-src"),
                caption: $(elements).find("div.caption").text(),
              });
            }
          );
          await Object.assign(obj, { data });
          await res.status(200).json(obj);
        } else {
          throw err;
        }
      } catch (err) {
        res.status(404).json({ error: err });
      }
    });
  }
});

module.exports = router;
