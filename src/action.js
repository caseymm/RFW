import AWS from 'aws-sdk';
import fetch from 'node-fetch';
import twitter from 'twitter-lite';
// import puppeteer from "puppeteer";
// import chromium from "chromium";
import playwright from 'playwright';

const client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,  
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,  
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,  
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
const uploadClient = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,  
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,  
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,  
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  subdomain: "upload"
});

// The name of the bucket that you have created
const BUCKET_NAME = 'red-flag-warnings';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
});

const uploadFile = (name, data, ext) => {

  // Setting up S3 upload parameters
  const params = {
      Bucket: BUCKET_NAME,
      Key: `${name}.${ext}`, // File name you want to save as in S3
      Body: data
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
      if (err) {
          throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
  });
};

async function getObject (bucket, objectKey) {
  try {
    const params = {
      Bucket: bucket,
      Key: objectKey 
    }

    const data = await s3.getObject(params).promise();
    return data.Body.toString('base64');
  } catch (e) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`)
  }
}

async function useTheData(){
  for (const browserType of ['chromium']) {
    const browser = await playwright[browserType].launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://caseymm.github.io/mbx-devour/?url=https://red-flag-warnings.s3.us-west-1.amazonaws.com/latest.json&fill=e60000&fill-opacity=.6", { waitUntil: 'networkidle0' });
    const screenshot = await page.screenshot();
    uploadFile(`latest-img`, screenshot, 'png');
    uploadFile(`${new Date()}-img`, screenshot, 'png');
    await browser.close();
  }
  // let browser = null;
  // // try {
  //   // launch headless Chromium browser
  //   browser = await puppeteer.launch({ headless: true, executablePath: chromium.path });
  //   // create new page object
  //   const page = await browser.newPage();
  //   // set viewport width and height
  //   await page.setViewport({ width: 1440, height: 1080 });
  //   await page.goto("https://caseymm.github.io/mbx-devour/?url=https://red-flag-warnings.s3.us-west-1.amazonaws.com/latest.json&fill=e60000&fill-opacity=.6", { waitUntil: 'networkidle0' });
  //   // capture screenshot and store it into screenshots directory.
  //   const screenshot = await page.screenshot();
  //   uploadFile(`latest-img`, screenshot, 'png');
  //   uploadFile(`${new Date()}-img`, screenshot, 'png');
  // // } catch (err) {
  // //   console.log(`❌ Error: ${err.message}`);
  // //   return;
  // // } finally {
  //   await browser.close();
  //   console.log(`\n🎉 screenshots captured.`);
  //   return;
  // // }
}

async function getLatestRFW(){
  const rfwUrl = 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/NWS_Watches_Warnings_v1/FeatureServer/9/query?where=Event%3D%27Red+Flag+Warning%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=';
  const resp = await fetch(rfwUrl);
  const json = await resp.json()

  const latestFileUrl = 'https://red-flag-warnings.s3.amazonaws.com/latest.json';
  const respLatest = await fetch(latestFileUrl);
  const jsonLatest = await respLatest.json();

  // if what we just pulls doesn't equal the lastest version we have, save it
  // if(JSON.stringify(json) === JSON.stringify(jsonLatest)){
  //   console.log('no new data');
  // } else {
    uploadFile(new Date(), JSON.stringify(json), 'json');
    uploadFile('latest', JSON.stringify(json), 'json');

    useTheData().then(stuff => {
      getObject(BUCKET_NAME, 'latest-img.png').then(img => {
        uploadClient.post('media/upload', { media: img }).then(result => {
          const status = {
            status: "New Red Flag Warning",
            media_ids: result.media_id_string
          }
          client.post('statuses/update', status).then(result => {
            console.log('You successfully tweeted this : "' + result.text + '"');
          }).catch(console.error);
        }).catch(console.error);
      });
    })

  // }
}

getLatestRFW();
