import { read } from "npm:to-vfile";
import { remark } from "npm:remark";
import remarkEmbedImages from "npm:remark-embed-images";

const markdownFile = Deno.args[0];
const outFile = Deno.args[1];

const file = await remark()
  .use(remarkEmbedImages)
  .process(await read(markdownFile));
console.log(file);

// console.log(String(file));