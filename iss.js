const request = require('request');

const fetchMyIP = function(callback) {
  request('https://api.myip.com',(error, response, body) => {
    if (error) callback(error, null);
    else if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP:\n${body}`), null);
    } else callback(error, JSON.parse(body).ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`https://ipvigilante.com/${ip}`, (error, response, body) => {
    if (error) callback(error, null);
    else if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP:\n${body}`), null);
    } else {
      const {latitude, longitude} = JSON.parse(body).data;
      callback(error, {latitude, longitude});
    }
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) callback(error, null);
    else if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS info:\n${body}`), null);
    } else {
      callback(error, JSON.parse(body).response);
    }
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) return callback(error, ip);
  
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) return callback(error, coords);
  
      fetchISSFlyOverTimes(coords, (error, info) => {
        if (error) return callback(error, info);
        callback(error, info);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
