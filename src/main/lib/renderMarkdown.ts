import { readFileSync } from 'fs';
import markdownIt from 'markdown-it';

const renderMarkdown = (repoLocation, markdown): string => {
  const md = markdownIt({ html: true, linkify: true, breaks: true });
  let renderedDocument: string = md.render(markdown);

  const imgTagRegex = /<img\s+[^>]*src="([^"]*)"[^>]*>/g;
  const imgTags = renderedDocument.match(imgTagRegex);

  if (imgTags) {
    for (const imgTag of imgTags) {
      const srcMatch = imgTag.match(/src="([^"]*)"/);
      if (srcMatch && srcMatch[1]) {
        const imageUrl = srcMatch[1];
        try {
          const imageFile = readFileSync(
            `${repoLocation}/${imageUrl.replaceAll('../', '')}`,
            'binary'
          );
          const base64Image = Buffer.from(imageFile, 'binary').toString('base64');
          const dataUri = `data:image/jpeg;base64,${base64Image}`;
          // Replace the original image tag with the base64 data URI
          renderedDocument = renderedDocument.replace(imageUrl, dataUri);

          renderedDocument = renderedDocument.replace(/<img /, `<img class="medium-zoom" `);
        } catch (error) {
          console.error(`Failed to fetch and convert image: ${imageUrl}`);
        }
      }
    }
  }
  return renderedDocument;
};

export default renderMarkdown;
