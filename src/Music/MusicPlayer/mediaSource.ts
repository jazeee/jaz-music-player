import { ResettingCountDownLatch } from "../../utils/ResettingCountDownLatch";

export async function getStream(sourcePath: string): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch(sourcePath);
  if (!response.body) {
    throw new Error('API responded with no body');
  }
  // const reader = response.body.getReader();
  // reader.
  // const readableStream = new ReadableStream({
  //   async start(controller) {
  //     while (true) {
  //       const { done, value } = await reader.read();

  //       // When no more data needs to be consumed, break the reading
  //       if (done) {
  //         console.log('done in readableStream');
  //         break;
  //       }

  //       // Enqueue the next data chunk into our target stream
  //       controller.enqueue(value);
  //     }
  //     controller.close();
  //     reader.releaseLock();
  //   }
  // });
  return response.body;
}

// let filePath = `/Black%20Sheep/A%20Wolf%20in%20Sheep's%20Clothing/09%20Similak%20Child.mp3`;
// // filePath = 'http://localhost:4242/Genesis/Genesis/08 Silver Rainbow.mp3'
// filePath = 'http://localhost:4242/Jethro Tull/A Little Light Music/05 Rocks on the Road.mp3'

const CACHE_BUFFER_SIZE = 32 * 1024;
export async function createMediaSource(sourcePath: string): Promise<MediaSourceContainer> {
  console.log(`Loading ${sourcePath} into buffer.`);
  const readableStream = await getStream(sourcePath);
  const reader = readableStream.getReader();
  let readingIsEnabled = true;
  const continueLoadingLatch = new ResettingCountDownLatch();
  const bufferLatch = new ResettingCountDownLatch();
  const mediaSource = new MediaSource();
  mediaSource.addEventListener('sourceopen', function () {
    const mime = 'audio/mpeg';
    const sourceBuffer = mediaSource.addSourceBuffer(mime);
    sourceBuffer.onerror = console.error;

    function finalizeStream() {
      sourceBuffer.onupdate = null;
      if(mediaSource.readyState === 'open') {
        mediaSource.endOfStream();
      }
      bufferLatch.countDown();
      reader.cancel();
      console.log(`Total Bytes Read ${bytesRead / 1024 / 1024} MiB`);
    }

    let bytesRead = 0;
    let lastBytesReadReported = 0;
    reader.read().then(async function processChunk({ done, value }) {
      if (done || !readingIsEnabled) {
        finalizeStream();
        return;
      }
      // Merge small value lengths. (nginx seems to be pushing a 2-3 KB at a time.)
      let bufferByteCount = 0;
      const buffers: Array<Uint8Array> = [];
      async function appendValue(nextValue: Uint8Array | undefined) {
        if (nextValue) {
          bufferByteCount += nextValue.length;
          buffers.push(nextValue);
        }
        if (bufferByteCount < CACHE_BUFFER_SIZE) {
          await reader.read().then(async function ({ done, value }) {
            if (!done) {
              await appendValue(value);
            }
          })
        }
      }
      await appendValue(value);
      function appendToBuffer() {
        if (!readingIsEnabled) {
          finalizeStream();
          return;
        }
        sourceBuffer.onupdate = () => {
          const delayTime = Math.min(Math.floor(bytesRead / (32 * 1024)) + 1, 128);
          // onupdate is called after appendBuffer has completed.
          setTimeout(() => {
            // Processing chunks (appendBuffer) appears to be CPU intensive, which is a bit expensive on mobile.
            // Slow down the read process a little, to spread out the processing time.
            reader.read().then(processChunk);
          }, delayTime);
        };
        // Unfortunately, there is no way to predict whether the buffer will take the next block
        // See https://developers.google.com/web/updates/2017/10/quotaexceedederror
        try {
          if(!buffers.length) {return}
          let bytes: Uint8Array = new Uint8Array(bufferByteCount);
          let offset = 0;
          buffers.forEach(buffer => {
            bytes.set(buffer, offset);
            offset += buffer.length;
          });
          sourceBuffer.appendBuffer(bytes);
          bytesRead += bytes.length;
          if (bytesRead - lastBytesReadReported > 1024 * 1024) {
            lastBytesReadReported = bytesRead;
            console.log(`read ${bytesRead / 1024 / 1024} MiB`);
          }
          if (bytesRead > 64 * 1024) {
            bufferLatch.countDown();
          }
        } catch (e) {
          console.log(`Error: ${e.name} after reading ${bytesRead / 1024 / 1024} MiB`);
          if (e.name !== 'QuotaExceededError') {
            throw e;
          }
          continueLoadingLatch.waitFor().then(appendToBuffer);
        }
      }
      appendToBuffer();
    });
  });

  mediaSource.addEventListener('sourceclosed', () => console.log('sourceclosed'));
  mediaSource.addEventListener('sourceended', () => console.log('sourceended'));

  function clearHead(duration: number) {
    if (mediaSource.readyState === 'open') {
      const sourceBuffer = mediaSource.sourceBuffers[0];
      console.log('clearHead', sourcePath);
      if (sourceBuffer) {
        sourceBuffer.remove(0, duration);
        sourceBuffer.onupdate = () => {
          continueLoadingLatch.countDown();
        }
      }
    }
  }
  function abort() {
    readingIsEnabled = false;
    continueLoadingLatch.countDown();
  }
  return {
    clearHead,
    mediaSource,
    bufferLatch,
    readableStream,
    abort,
  };
}
