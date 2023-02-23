import { readAll } from 'https://deno.land/std/streams/mod.ts';
import { encode as base64Encode } from 'https://deno.land/std/encoding/base64.ts';

const markdownFile = Deno.args[0];

let markdown = await Deno.readTextFile(markdownFile);

const images = markdown.matchAll(/!\[.*\]\((.*)\)/g);

for (const image of images) {
    const imagePath = image[1];
    const imageFile = await Deno.open(imagePath).catch(() => {
        const imagePathRelative = `${markdownFile}/${imagePath}`;
        return Deno.open(imagePathRelative);
    });
    const imageBytes = await readAll(imageFile);
    const imageBase64 = base64Encode(imageBytes);

    const imageType: 'png' | 'jpeg' | null = imagePath.endsWith('.png')
        ? 'png'
        : imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg')
        ? 'jpeg'
        : null;

    if (!imageType) {
        throw new Error(`Image type not supported: ${imagePath}`);
    }

    const imageBase64Data = `data:image/${imageType};base64,${imageBase64}`;

    markdown = markdown.replaceAll(imagePath, imageBase64Data);
}

console.log(markdown);
