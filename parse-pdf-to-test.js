import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import got from 'got';

function parseJson(str) {
  try {
    return JSON.parse(str);
  } catch (error) {
    return { error: `parseJson error: ${error.message}`, invalidJson: str };
  }
}

async function getRawTikaData(localFilePath) {
  // https://wiki.apache.org/tika/TikaJAXRS#Get_HELLO_message_back
  const fileBitMap = fs.readFileSync(localFilePath);
  const asciiFileBuffer = Buffer.from(fileBitMap, 'ascii');
  const response = await got({
    method: 'PUT',
    url: 'http://localhost:9998/rmeta/text',
    body: asciiFileBuffer,
  });
  console.log('response.statusCode:', response.statusCode);
  return response.body;
}

(async () => {
  const fileToParse = "Eric S. Raymond - The Cathedral & the Bazaar-O'Reilly Media, Inc. (2008).epub";
  const __filename = fileURLToPath(import.meta.url);
  const localFilePath = path.join(path.dirname(__filename), fileToParse);
  let rawTikaData;
  try {
    rawTikaData = await getRawTikaData(localFilePath);
  } catch (error) {
    console.log('error.message:', error.message);
  }
  // console.log('rawTikaData: ', rawTikaData);
  const tikaData = (parseJson(rawTikaData)?.[0]?.['X-TIKA:content'] ?? '').trim();
  console.log('tikaData: ', tikaData);
  fs.writeFileSync(path.join(path.dirname(__filename), `${fileToParse}.txt`), tikaData);
})();
