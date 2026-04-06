import { defineCollection } from "astro:content";
import { notionLoader } from "@astro-notion/loader";

const portfolio = defineCollection({
  loader: notionLoader({
    auth: import.meta.env.NOTION_TOKEN,
    database_id: import.meta.env.NOTION_PORTFOLIO_DB_ID,
    filter: { property: "Published", checkbox: { equals: true } },
  }),
});

const blog = defineCollection({
  loader: notionLoader({
    auth: import.meta.env.NOTION_TOKEN,
    database_id: import.meta.env.NOTION_BLOG_DB_ID,
    filter: { property: "Published", checkbox: { equals: true } },
  }),
});

const journal = defineCollection({
  loader: notionLoader({
    auth: import.meta.env.NOTION_TOKEN,
    database_id: import.meta.env.NOTION_JOURNAL_DB_ID,
    filter: { property: "Published", checkbox: { equals: true } },
  }),
});

export const collections = { portfolio, blog, journal };
