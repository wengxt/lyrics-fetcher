var htmlToText = require('html-to-text');
var request = require('superagent');

var api_key = '5214af9986dd504c0b0bf2c73baeb1350520b78fe';

module.exports = function(arg, next) {
    args = new Array(arg.title, arg.artist);
    keyword = args.filter(function(e) { return e; }).join(" ");
    request.get("http://api.moefou.org/search/sub.json")
           .query({sub_type: 'song', keyword: keyword, api_key: api_key})
           .end(function(error, songres) {
               if (error) {
                   return next(error);
               }

               var json = null;
               try {
                   json = JSON.parse(songres.text);
               } catch (err){
                   return next(new Error("parse error"));
               }

               if (!json || !json.response || !json.response.subs) {
                   return next(new Error("not found"));
               }

               var lrc = null;
               for (var i = 0; i < json.response.subs.length; i++) {
                   if (json.response.subs[i].sub_about.length > 0) {
                       var lrc = htmlToText.fromString(json.response.subs[i].sub_about);
                       lrc = lrc.replace(/\[\d\d:\d\d.\d\d\]/g, '');
                       lrc = lrc.replace(/\[.*\]\n/g, '');
                       break;
                   }
               }
               
               if (i == json.response.subs.length) {
                   return next(new Error("not found"));
               }

               next(null, lrc);
           });
}
