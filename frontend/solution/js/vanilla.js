import Store from './modules/Store';
import ElementClass from './modules/DropdownElement';

const { DomElement, DropdownElement } = ElementClass;

const base = 'http://165.227.80.34:5000/';
const apiUrl = `${base}api/`;
const refreshRate = 1000 * 5;
let lastRefresh = new Date();

// const WebSocketClient = require('websocket').client;
// var client = new WebSocketClient();

// client.on('connectFailed', function (error) {
//   console.log('Connect Error: ' + error.toString());
// });

// client.on('connect', function (connection) {
//   console.log('WebSocket Client Connected');
//   connection.on('error', function (error) {
//     console.log("Connection Error: " + error.toString());
//   });
//   connection.on('close', function () {
//     console.log('echo-protocol Connection Closed');
//   });
//   connection.on('message', function (message) {
//     if (message.type === 'utf8') {
//       console.log("Received: '" + message.utf8Data + "'");
//     }
//   });

//   function sendNumber() {
//     if (connection.connected) {
//       var number = Math.round(Math.random() * 0xFFFFFF);
//       connection.sendUTF(number.toString());
//       setTimeout(sendNumber, 1000);
//     }
//   }
//   sendNumber();
// });

// client.connect('ws://localhost:5000/', 'ws');



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
    const { image, emotion, distracted } = user;

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

// const refreshData = async () => {
//   fetchData().then((data) => {
//     console.log('refresh', data)
//     repaintPage(data);
//   }).catch((err) => {
//     console.error('error', err)
//   });

// }

// const reloadDataWorker = async () => {
//   // while(true) {
//   //   const n = new Date();
//   //   const delta = n.getTime() - lastRefresh.getTime()
//   //   if(delta > refreshRate) {
//   //     console.log(n, lastRefresh, delta)
//   //     lastRefresh = new Date();
//   //     refreshData();
//   //   }
//   // }
// }

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

  const socket = io.connect('http://localhost:5000/ws');

  socket.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  socket.on('after connect', function (msg) {
    console.log('After connect', msg);
  });

  socket.on('update value', function (msg) {
    console.log('Slider value updated');
  });

  socket.emit('ws', {
    data: 'Hello'
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
