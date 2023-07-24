import type { AnyRouter } from '@tanstack/router';

/**
 * Webstream compatible version of:
 * https://github.com/TanStack/router/blob/b637853f6074bdcdfd65f107ffe39c8958c37129/packages/react-start/src/server.tsx#L119
 */

export function transformStreamWithRouter(router: AnyRouter) {
  return transformStreamHtmlCallback(async () => {
    const injectorPromises = router.injectedHtml.map(d => (typeof d === 'function' ? d() : d));
    console.log('injectorPromises', injectorPromises);
    const injectors = await Promise.all(injectorPromises);
    router.injectedHtml = [];
    return injectors.join('');
  });
}

const encoder = /* #__PURE__ */ new TextEncoder();
const decoder = /* #__PURE__ */ new TextDecoder();

function transformStreamHtmlCallback(injector: () => Promise<string>) {
  let leftover = '';

  return new TransformStream({
    async transform(chunk, controller) {
      const chunkString = leftover + decoder.decode(chunk);

      // regex pattern for matching closing body and html tags
      const patternBody = /(<\/body>)/;
      const patternHtml = /(<\/html>)/;

      const bodyMatch = chunkString.match(patternBody);
      const htmlMatch = chunkString.match(patternHtml);

      const html = await injector();

      // If a </body></html> sequence was found
      if (bodyMatch && htmlMatch && bodyMatch.index! < htmlMatch.index!) {
        const bodyIndex = bodyMatch.index! + bodyMatch[0].length;
        const htmlIndex = htmlMatch.index! + htmlMatch[0].length;

        // Add the arbitrary HTML before the closing body tag
        const processed =
          chunkString.slice(0, bodyIndex) +
          html +
          chunkString.slice(bodyIndex, htmlIndex) +
          chunkString.slice(htmlIndex);

        controller.enqueue(encoder.encode(processed));
        leftover = '';
      } else {
        // For all other closing tags, add the arbitrary HTML after them
        const pattern = /(<\/[a-zA-Z][\w:.-]*?>)/g;
        let result;
        let lastIndex = 0;

        while ((result = pattern.exec(chunkString)) !== null) {
          lastIndex = result.index + result[0].length;
        }

        // If a closing tag was found, add the arbitrary HTML and send it through
        if (lastIndex > 0) {
          const processed = chunkString.slice(0, lastIndex) + html;
          controller.enqueue(encoder.encode(processed));
          leftover = chunkString.slice(lastIndex);
        } else {
          // If no closing tag was found, store the chunk to process with the next one
          leftover = chunkString;
        }
      }
    },
    flush(controller) {
      if (leftover) {
        console.log('flush', leftover);
        controller.enqueue(encoder.encode(leftover));
      }
    },
  });
}
