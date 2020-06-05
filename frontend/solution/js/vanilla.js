import Store from './modules/Store';
import ElementClass from './modules/DropdownElement';

const { DomElement, DropdownElement } = ElementClass;

const base = 'http://165.227.80.34:5000/';
const apiUrl = `${base}api/`;
const refreshRate = 1000 * 5;
let lastRefresh = new Date();

// check for IE browser
const isIEBrowser = () => (!(!document.attachEvent || typeof (document.attachEvent) === 'undefined'));

const getAssetPath = (res) => `/dist/assets/images/${res}`;

// check for webp image support
const canUseWebP = () => {
  const elem = document.createElement('canvas');
  return elem.getContext && elem.getContext('2d') && elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
};

const getImageExtension = () => (canUseWebP() ? 'webp' : 'jpg');

const getImagePath = (name = 'default-cover', id) => {
  const ext = getImageExtension();
  if (id) {
    return getAssetPath(`${name.toLowerCase().replace(' ', '-')}-${id}.${ext}`);
  }
  // show default image incase of no destination selection
  return getAssetPath(`default-cover.${ext}`);
};


const fetchData = async () => fetch(apiUrl).then((response) => {
  if (response.status !== 200) {
    throw `Looks like there was a problem. Status Code: ${response.status}`;
  }
  return response.json();
});

const repaintPage = (data) => {
  const contentEle = new DomElement('content');
  contentEle.removeContent();
  Object.keys(data.users).map((key) => {
    const user = data.users[key]
    const {image, emotion, distracted} = user;

    const img = document.createElement('img');
    img.style.width = '100px'
    img.src = `${base}${image}`;

    const detail = document.createElement('span');
    detail.innerHTML = `${emotion} ${distracted}`;

    contentEle.addChild(img);
    contentEle.addChild(detail);
  })
  contentEle.show();
}

const refreshData = async () => {
  fetchData().then((data) => {
    console.log('refresh', data)
    repaintPage(data);
  }).catch((err) => {
    console.error('error', err)
  });

}

const reloadDataWorker = async () => {
  while(true) {
    const n = new Date();
    const delta = n.getTime() - lastRefresh.getTime()
    if(delta > refreshRate) {
      console.log(n, lastRefresh, delta)
      lastRefresh = new Date();
      refreshData();
    }
  }
}

const onPageLoad = () => {
  // loader animation div
  const loaderEle = new DomElement('loader');
  fetchData().then((data) => {
    console.log('first call', data)
    loaderEle.hide();

    repaintPage(data);
    setInterval(reloadDataWorker, refreshRate);
  }).catch((err) => {
    // in case things go south
    const ele = document.createElement('h3');
    ele.innerHTML = err;

    contentEle.removeContent();
    contentEle.addChild(ele);
    loaderEle.hide();
    contentEle.show();
  });
};


// trigger on page load
const addEventToDocument = ((onPageLoad) => {
  if (onPageLoad && typeof (onPageLoad) === 'function') {
    if (!isIEBrowser()) {
      document.addEventListener('DOMContentLoaded', onPageLoad);
    } else {
      document.attachEvent('onreadystatechange', () => {
        if (document.readyState === 'complete') {
          return onPageLoad();
        }
      });
    }
  }
  return onPageLoad;
});

(function (document, window, addEventToDocumentMethod) {
  addEventToDocumentMethod(onPageLoad);
}(document, window, addEventToDocument));
