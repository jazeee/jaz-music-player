export async function getStream(sourcePath: string): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch(sourcePath);
  if (!response.body) {
    throw new Error('API responded with no body');
  }
  const reader = response.body.getReader();
  const readableStream = new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await reader.read();

        // When no more data needs to be consumed, break the reading
        if (done) {
          console.log('done in readableStream');
          break;
        }

        // Enqueue the next data chunk into our target stream
        controller.enqueue(value);
      }
      controller.close();
      reader.releaseLock();
    }
  });
  return readableStream;
}

// let filePath = `/Black%20Sheep/A%20Wolf%20in%20Sheep's%20Clothing/09%20Similak%20Child.mp3`;
// // filePath = 'http://localhost:4242/Genesis/Genesis/08 Silver Rainbow.mp3'
// filePath = 'http://localhost:4242/Jethro Tull/A Little Light Music/05 Rocks on the Road.mp3'

class ResettingCountDownLatch {
  initialCount: number;
  currentCount: number;
  resolver?: (value: boolean | PromiseLike<boolean>) => void;
  promise?: Promise<boolean>;

  constructor(initialCount = 1) {
    if (initialCount < 1) {
      throw new Error(`Initial count must be at least 1, not ${initialCount}`);
    }
    this.initialCount = initialCount;
    this.currentCount = initialCount;
    this._reset();
  }

  _reset() {
    this.currentCount = this.initialCount;
    this.promise = new Promise<boolean>((resolve, reject) => {
      this.resolver = resolve;
    });
  }
  async waitFor() {
    await this.promise;
  }

  countDown() {
    this.currentCount -= 1;
    if (this.currentCount === 0) {
      this.resolver?.(true);
      this._reset();
    }
  }
}

export async function createMediaSource(sourcePath: string) {
  console.log(sourcePath);
  const readableStream = await getStream(sourcePath);

  const continueLoadingLatch = new ResettingCountDownLatch();
  const bufferLatch = new ResettingCountDownLatch();
  const mediaSource = new MediaSource();
  mediaSource.addEventListener('sourceopen', function () {
    const mime = 'audio/mpeg';
    const sourceBuffer = mediaSource.addSourceBuffer(mime);

    const queuingStrategy = new CountQueuingStrategy({ highWaterMark: 1 });
    let bytesRead = 0;
    readableStream.pipeTo(new WritableStream({
      write(arrayBuffer) {
        return new Promise((resolve) => {
          function appendToBuffer() {
            // Unfortunately, there is no way to predict whether the buffer will take the next block
            // See https://developers.google.com/web/updates/2017/10/quotaexceedederror
            try {
              sourceBuffer.onupdate = () => resolve();
              sourceBuffer.appendBuffer(arrayBuffer);
              bytesRead += arrayBuffer.length;
              console.log(`read ${bytesRead}`);
              if (bytesRead > 1 * 100 * 1024) {
                bufferLatch.countDown();
              }
            } catch (e) {
              console.log('At Error', bytesRead);
              if (e.name !== 'QuotaExceededError') {
                throw e;
              }
              continueLoadingLatch.waitFor().then(appendToBuffer);
            }
          }
          appendToBuffer();
        })
      },
      close() {
        mediaSource.endOfStream();
        bufferLatch.countDown();
        console.log('bytesRead', bytesRead);
      },
    }, queuingStrategy))
  });

  mediaSource.addEventListener('sourceclosed', () => console.log('sourceclosed'));
  mediaSource.addEventListener('sourceended', () => console.log('sourceended'));

  function clearHead(duration: number) {
    if (mediaSource.readyState === 'open') {
      const sourceBuffer = mediaSource.sourceBuffers[0];
      console.log('clearHead');
      if (sourceBuffer) {
        sourceBuffer.remove(0, duration);
        sourceBuffer.onupdate = () => {
          continueLoadingLatch.countDown();
        }
      }
    }
  }
  return {
    clearHead,
    mediaSource,
    bufferLatch,
  };
}

// export async function createMediaSource2(sourcePath: string) {
//   const buffers: Array<Uint8Array> = [];

//   let isStreamCompleted = false;
//   const readableStream = await getStream(sourcePath);
//   const queuingStrategy = new CountQueuingStrategy({ highWaterMark: 1 });
//   let bytesRead = 0;
//   readableStream.pipeTo(new WritableStream({
//     write(arrayBuffer) {
//       return new Promise((resolve) => {
//         buffers.push(arrayBuffer);
//         bytesRead += arrayBuffer.length;
//         resolve();
//       })
//     },
//     close() {
//       isStreamCompleted = true;
//       console.log('bytesRead', bytesRead);
//     },
//   }, queuingStrategy))

//   const mediaSource = new MediaSource();
//   mediaSource.addEventListener('sourceopen', function() {
//     const mime = 'audio/mpeg';
//     const sourceBuffer = mediaSource.addSourceBuffer(mime);

//     let lastTimeout: NodeJS.Timeout;
//     function appendNextBuffer(callerName: string) {
//       console.debug(callerName, sourcePath);
//       if (!sourceBuffer.updating) {
//         const arrayBuffer = buffers[0];
//         let nextTimeoutDelay: number | void = undefined;
//         if (arrayBuffer) {
//           try {
//             // Unfortunately, there is no way to predict whether the buffer will take the next block
//             // See https://developers.google.com/web/updates/2017/10/quotaexceedederror
//             sourceBuffer.appendBuffer(arrayBuffer);
//             buffers.shift();
//           } catch (e) {
//             if (e.name !== 'QuotaExceededError') {
//               throw e;
//             }
//             console.debug('Buffer is full, so waiting for a bit');
//             // Delay about 12KB of time (bitrate * time)
//             nextTimeoutDelay = 256;
//           }
//         } else {
//           if (isStreamCompleted) {
//             mediaSource.endOfStream();
//           } else {
//             nextTimeoutDelay = 64;
//           }
//         }
//         if (nextTimeoutDelay != null) {
//           clearTimeout(lastTimeout);
//           lastTimeout = setTimeout(() => appendNextBuffer(`Waiting to reappend ${nextTimeoutDelay} msec`), nextTimeoutDelay);
//         }
//       } else {
//         console.log('waiting for buffer updated')
//       }
//     }
//     sourceBuffer.onupdate = () => appendNextBuffer('From onupdate');
//     appendNextBuffer('Initial call');
//   })

//   mediaSource.addEventListener('sourceclosed', () => console.log('sourceclosed'));
//   mediaSource.addEventListener('sourceended', () => console.log('sourceended'));
//   return {
//     mediaSource,
//     clearHead: undefined,
//   };
// }