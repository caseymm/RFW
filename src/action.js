import AWS from 'aws-sdk';
import fetch from 'node-fetch';
import gp from "geojson-precision";
import mapCoordinates from 'geojson-apply-right-hand-rule';
import simplify from 'simplify-geojson';
import twitter from 'twitter-lite';
const client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,  
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,  
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,  
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// The name of the bucket that you have created
const BUCKET_NAME = 'red-flag-warnings';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
});

const uploadFile = (name, data) => {

  // Setting up S3 upload parameters
  const params = {
      Bucket: BUCKET_NAME,
      Key: `${name}.json`, // File name you want to save as in S3
      Body: JSON.stringify(data)
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
      if (err) {
          throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
  });
};

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
    uploadFile(new Date(), json);
    uploadFile('latest', json);

    // do this only for CA
    // west of -113.0019105
    // south of 41.99980888895469
    let trimmed = gp.parse(json, 3);
    trimmed.features.forEach(f => {
      f.geometry.type = "LineString"
      f.geometry.coordinates = mapCoordinates(f.geometry.coordinates).coordinates[0];
      f.properties = {"fill": "#e60000","fill-opacity": .6}
    })
    let filtered = [];
    trimmed.features.forEach(f => {
      let firstCoords = f.geometry.coordinates[0];
      if(firstCoords[0] < -113.0019105 && firstCoords[1] < 41.99980888895469){
        filtered.push(f)
      }
    })
    trimmed.features = filtered;
    let simplified = simplify(trimmed, 0.01)
    uploadFile('latest-small', simplified);
    const data = encodeURIComponent(JSON.stringify(simplified));
    const imageData = `https://api.mapbox.com/styles/v1/caseymmiler/cktf3jdcs2ws819qttibvokom/static/geojson(${data})/-119.2368,37.4522,4.99,0/500x600@2x?before_layer=admin-0-boundary&access_token=pk.eyJ1IjoiY2FzZXltbWlsZXIiLCJhIjoiY2lpeHY1bnJ1MDAyOHVkbHpucnB1dGRmbyJ9.TzUoCLwyeDoLjh3tkDSD4w`
    uploadFile('lastet-image-CA', {"image": imageData})


    client.post('statuses/update', { status: `RFW updated`,  }).then(result => {
      console.log('You successfully tweeted this : "' + result.text + '"');
    }).catch(console.error);
  }
// }

getLatestRFW();
