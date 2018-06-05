(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('socket.io-client')) :
  typeof define === 'function' && define.amd ? define(['socket.io-client'], factory) :
  (global['point-api'] = factory(global.io));
}(this, (function (io) { 'use strict';

  io = io && io.hasOwnProperty('default') ? io['default'] : io;

  //     

                                
                       
                       
                
    

  class PointApi {
                         
                   
                                       
                   

    constructor(emailAddress        , apiKey        ) {
      this.emailAddress = emailAddress;
      this.apiKey = apiKey;
      this.suggestions = [];
      this.socket = io(
        "http://dev-api-autocomplete.us-west-2.elasticbeanstalk.com",
        {
          query: {
            emailAddress: "przxmek@gmail.com"
          },
          transportOptions: {
            polling: {
              extraHeaders: {
                Authorization: "Basic " + this.apiKey
              }
            }
          }
        }
      );
    }

    searchSuggestions(query        )                                  {
      return new Promise(resolve => {
        if (!query || !query.trim()) {
          resolve(null);
        }
        this.socket.emit("suggestions", { seedText: query }, suggestions => {
          if (!suggestions || !suggestions.length) {
            resolve(null);
          }
          resolve(suggestions);
        });
      });
    }
  }

  return PointApi;

})));
