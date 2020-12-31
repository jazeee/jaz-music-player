var mime = 'audio/mpeg';
mediaSourceAudio = new Audio()
mediaSource = new MediaSource()
mediaSourceAudio.src = URL.createObjectURL(mediaSource)
mediaSourceAudio.ontimeupdate = () => console.log(mediaSourceAudio.currentTime)

filePath = `/data/music/Black%20Sheep/A%20Wolf%20in%20Sheep's%20Clothing/09%20Similak%20Child.mp3`;
//filePath = `http://localhost:5000/Black%20Sheep/A%20Wolf%20in%20Sheep's%20Clothing/09%20Similak%20Child.mp3`;

process = new Promise(resolve => {
  const buffers = [];
  async function getStream(path) {
    const response = await fetch(path, { mode: 'no-cors' });
    const reader = response.body.getReader();

    async function pump() {
      return reader.read().then(({ done, value }) => {
        // When no more data needs to be consumed, close the stream
        if (done) {
          console.log('Done')
          //               controller.close();
          return;
        }
        // Enqueue the next data chunk into our target stream
        //           controller.enqueue(value);
        buffers.push(value);
        return pump();
      });
    }
    pump().then('reader completed******************');
  }
  getStream(filePath).then(() => {
    console.log('streamed')
  });
  mediaSource.addEventListener('sourceopen', function test() {
    const sourceBuffer = mediaSource.addSourceBuffer(mime);
    function appendNextBuffer(caller) {
      console.log(caller);
      if (!sourceBuffer.updating) {
        if (buffers.length) {
          const arrayBuffer = buffers.shift();
          sourceBuffer.appendBuffer(arrayBuffer);
        } else {
          console.log('no buffer');
        }
      } else {
        console.log('waiting for buffer updated')
      }
    }
    sourceBuffer.onupdate = () => appendNextBuffer('from onupdate');
    const interval = setInterval(() => appendNextBuffer('from interval'), 1000)
  })


  //       new ReadableStream({
  //         start(controller) {
  //           return pump();
  //         }
  //       })
  mediaSourceAudio.play()
  mediaSource.addEventListener('sourceopen', () => console.log('sourceclosed'))
  mediaSource.addEventListener('sourceended', () => console.log('sourceended'))
})

process.then(console.log);