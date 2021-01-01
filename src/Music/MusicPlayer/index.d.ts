interface MediaSourceContainer {
  mediaSource: MediaSource,
  clearHead: (duration: number) => void,
  bufferLatch: ResettingCountDownLatch,
  readableStream: ReadableStream,
  abort: () => void,
}