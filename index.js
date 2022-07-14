import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

function getTextToSpeechUrl(textString) {
  const ttsURL = new URL('http://localhost:5500/api/tts');
  // ttsURL.searchParams.append('voice', 'coqui-tts:en_ljspeech');
  ttsURL.searchParams.append('voice', 'flite:mycroft_voice_4.0');
  return ttsURL.href
}

function downloadFile(myURL, filename, textString) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    const req = http.request(myURL, {
      method: 'POST'
    }, (res) => {
      res.pipe(file);
      file.on('finish', () => {
          file.close();
          console.log(filename, 'Download Completed');
          resolve();
      });
    });
    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });
    req.write(textString);
    req.end();
  });
}

(async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const targetFolder = path.join(__dirname, `AdoptingInnerSource`);
  const fileArr = [
    '00-AdoptingInnerSource.txt',
    '01-AdoptingInnerSource.txt',
    '02-AdoptingInnerSource.txt',
    '03-AdoptingInnerSource.txt',
    '04-AdoptingInnerSource.txt',
    '05-AdoptingInnerSource.txt',
    '06-AdoptingInnerSource.txt',
    '07-AdoptingInnerSource.txt',
    '08-AdoptingInnerSource.txt',
    '09-AdoptingInnerSource.txt',
  ];
  let counter = 0;
  for (let j = 0; j < fileArr.length; j += 1) {
    const localFile = path.join(__dirname, fileArr[j]);
    const fileContents = fs.readFileSync(localFile, 'utf8');
    await downloadFile(getTextToSpeechUrl(), path.join(targetFolder, `_${counter.toString().padStart(4, '0')}-AdoptingInnerSource.wav`), fileContents);
    counter += 1;
  }
})();
