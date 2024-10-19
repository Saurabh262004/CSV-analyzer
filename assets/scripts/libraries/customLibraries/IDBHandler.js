const ver = 1;
const DBName = 'CSVAnalyzer';
const indexedDB = window.indexedDB || window.mozIndexedDB || window.webIndexedDB || window.msIndexedDB || window.shimIndexedDB;
const GLB_request = indexedDB.open(DBName, ver);

let RetrievedIDBData = {
  log : [],
  mostRecent : undefined,
  pastRetrieves : 0,
  add : (data) => {
    RetrievedIDBData.log.push(data);
    RetrievedIDBData.mostRecent = data;
    RetrievedIDBData.pastRetrieves++;
  }
}

GLB_request.onerror = event => {
  console.error('An error occured with IndexedDB:');
  console.error(event.target);
}

// structure of the database
GLB_request.onupgradeneeded = () => {
  const db = GLB_request.result;

  const user = db.createObjectStore('user', { keyPath: 'id' });

  user.createIndex('info', ['infoID'], { unique: true });
  user.createIndex('preferences', ['preferencesID'], { unique: true });
  user.createIndex('previousData', ['previousDataID'], { unique: true });

  user.oncomplete = () => {
    db.close();
  }

  putObject(DBName, 'user', ver, { 'id' : 'info', 'infoID' : 'firstTimeUser', 'firstTimeUser' : true });
  putObject(DBName, 'user', ver, {'id' : 'theme', 'preferencesID' : 'theme', 'default' : true, 'theme' : null});
}

GLB_request.onsuccess = () => {
  console.log('IDB is working');
}

const putObject = (DBName, storeName, version, object, callback) => {
  const request = indexedDB.open(DBName, version);

  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const query = store.put(object);

    query.onerror = event => {
      console.error('There was an error with the query!');
      console.error(event.target);
      if (typeof callback === 'function') {
        callback(false);
      }
    }

    query.onsuccess = event => {
      if (typeof callback === 'function') {
        callback(object);
      }
    }

    query.oncomplete = () => {
      db.close();
    }
  }

  request.onerror = event => {
    console.error('There was am error with request!');
    console.error(event.target);
  }
}

const deleteObject = (DBName, storeName, version, objectID, callback) => {
  const request = indexedDB.open(DBName, version);

  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const query = store.delete(objectID);

    query.onsuccess = event => {
      if (typeof callback === 'function') {
        callback(event.target);
      }
    }

    query.onerror = event => {
      console.error('There was an error with the query!');
      console.error(event.target);
    }

    query.oncomplete = () => {
      db.close();
    }
  }

  request.onerror = event => {
    console.error('There was an error with the request!');
    console.error(event.target);
  }
}

const getObject = async (DBName, storeName, version, key, callback) => {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open(DBName, version);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const query = store.get(key);

      query.onsuccess = () => {
        resolve(query.result);
        if (typeof callback === 'function') {
          callback(query.result);
        }
      }

      query.onerror = event => {
        reject(event.error);
        console.error('There was an error with the query!');
        console.error(event.target);

        if (typeof callback === 'function') {
          callback(false);
        }
      }

      query.oncomplete = () => {
        db.close();
      }
    }

    request.onerror = event => {
      reject(event.target);
      console.error('There was a promblem with the request!');
      console.error(event.target);
    }
  }).then(data => {
    RetrievedIDBData.add(data);
  });
}

const getObjectsByIndex = async (DBName, storeName, version, indexName, keys, callback) => {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open(DBName, version);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const query = index.getAll(keys);

      query.onsuccess = () => {
        resolve(query.result);
        if (typeof callback === 'function') {
          callback(query.result);
        }
      }

      query.onerror = event => {
        reject(event.target);
        console.error('There was an error with the query!');
        console.error(event.target);
      }

      query.oncomplete = () => {
        db.close();
      }
    }

    request.onerror = event => {
      reject(event.target);
      console.error('There was an error with request!');
      console.error(event.target);
    }
  }).then(data => {
    RetrievedIDBData.add(data);
  });
}

const deleteDatabase = (DBName, callback) => {
  const request = indexedDB.deleteDatabase(DBName);

  request.onsuccess = () => {
    console.log('Database deleted successfully');
    if (typeof callback === 'function') {
      callback('success');
    }
  };

  request.onerror = () => {
    console.log('Error deleting database');
    if (typeof callback === 'function') {
      callback('error');
    }
  };
}
