import type { PageEvent } from './types.ts';

type InjectIntoSSRStreamOpts<PE extends PageEvent> = {
  pageEvent: PE;
  emitToDocumentHead?: (props: { event: PE }) => Promise<string>;
  emitBeforeSsrChunk?: (props: { event: PE }) => Promise<string>;
};

const encoder = /* #__PURE__ */ new TextEncoder();
const decoder = /* #__PURE__ */ new TextDecoder();

export function injectIntoSSRStream<PE extends PageEvent = PageEvent>({
  pageEvent,
  emitToDocumentHead,
  emitBeforeSsrChunk,
}: InjectIntoSSRStreamOpts<PE>) {
  // regex pattern for matching closing body and html tags
  const patternHead = /(<\/head>)/;
  const patternBody = /(<\/body>)/;

  let leftover = '';
  let headMatched = false;

  return new TransformStream({
    async transform(chunk, controller) {
      const chunkString = leftover + decoder.decode(chunk);

      let processed = chunkString;

      if (emitToDocumentHead && !headMatched) {
        const strToInject = (await emitToDocumentHead({ event: pageEvent })).trim();
        if (strToInject) {
          const headMatch = processed.match(patternHead);
          if (headMatch) {
            const headIndex = headMatch.index!;
            headMatched = true;
            const headChunk =
              processed.slice(0, headIndex) + strToInject + processed.slice(headIndex, headMatch[0].length);
            controller.enqueue(encoder.encode(headChunk));
            processed = processed.slice(headIndex + headMatch[0].length);
          }
        }
      }

      const bodyMatch = processed.match(patternBody);
      if (bodyMatch) {
        // If a </body> sequence was found
        const bodyIndex = bodyMatch.index!;

        const html = emitBeforeSsrChunk ? await emitBeforeSsrChunk({ event: pageEvent }) : '';

        // Add the arbitrary HTML before the closing body tag
        processed = processed.slice(0, bodyIndex) + html + processed.slice(bodyIndex);

        controller.enqueue(encoder.encode(processed));
        leftover = '';
      } else {
        const html = emitBeforeSsrChunk ? await emitBeforeSsrChunk({ event: pageEvent }) : '';
        if (html) {
          processed = html + processed;
        }

        controller.enqueue(encoder.encode(processed));
      }
    },
    flush(controller) {
      if (leftover) {
        controller.enqueue(encoder.encode(leftover));
      }
    },
  });
}
