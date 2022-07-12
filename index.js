import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

function getTextToSpeechUrl(textString) {
  const ttsURL = new URL('http://localhost:5500/api/tts');
  ttsURL.searchParams.append('voice', 'coqui-tts:en_ljspeech');
  ttsURL.searchParams.append('text', textString);
  return ttsURL.href
}

function downloadFile(myURL, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    http.get(myURL, (response) => {
      response.pipe(file);
      file.on('finish', () => {
          file.close();
          console.log(filename, 'Download Completed');
          resolve();
      });
    });
  });
}

(async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const targetFolder = path.join(__dirname, `CathedralAndTheBazaar`);
  const fileArr = [
    "Eric S. Raymond - The Cathedral & the Bazaar-O'Reilly Media, Inc. (2008).txt",
  ];
  let counter = 0;
  for (let j = 0; j < fileArr.length; j += 1) {
    const localFile = path.join(__dirname, fileArr[j]);
    // console.log('localFile: ', localFile);
    const fileContents = fs.readFileSync(localFile, 'utf8');
    const lineArr = fileContents.split(/\r?\n/).filter(row => row.length > 0);
    // console.log('lineArr: ', lineArr);
    const ttsQueryArr = lineArr.map(row => getTextToSpeechUrl(row));
    console.log('ttsQueryArr: ', ttsQueryArr);
    for (let x = 0; x < ttsQueryArr.length; x += 1) {
      await downloadFile(ttsQueryArr[x], path.join(targetFolder, `${counter.toString().padStart(4, '0')}-CathedralAndTheBazaar.wav`));
      counter += 1;
    }
  }
})();
