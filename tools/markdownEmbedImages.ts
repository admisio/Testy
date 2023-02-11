import { read } from "npm:to-vfile";
import { remark } from "npm:remark";
import remarkEmbedImages from "npm:remark-embed-images";

const markdownFile = Deno.args[0];

const file = await remark()
  .use(remarkEmbedImages)
  .process(await read(markdownFile));

console.log(String(file));