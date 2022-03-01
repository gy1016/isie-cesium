import Supercluster from 'supercluster';

const now = Date.now();

let index;

getJSON('/json/places.json', (geojson) => {
  console.log(`loaded ${geojson.features.length} points JSON in ${(Date.now() - now) / 1000}s`);
  index = new Supercluster({
    log: true,
    radius: 100, //60
    extent: 256,
    maxZoom: 17, //17
  }).load(geojson.features);
  postMessage({ ready: true });
});

self.onmessage = function (e) {
  if (e.data.getClusterExpansionZoom) {
    postMessage({
      expansionZoom: index.getClusterExpansionZoom(e.data.getClusterExpansionZoom),
      center: e.data.center,
    });
  } else if (e.data) {
    postMessage(index.getClusters(e.data.bbox, e.data.zoom));
  }
};

function getJSON(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300 && xhr.response) {
      callback(xhr.response);
    }
  };
  xhr.send();
}
