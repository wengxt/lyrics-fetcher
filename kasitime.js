var htmlToText = require('html-to-text');
var request = require('superagent');

var api_key = 'AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY';
var cx = '016571156778213938217:rzjoi8wykgi'

module.exports = function(arg, next) {
    args = new Array(arg.title, arg.artist);
    keyword = args.filter(function(e) { return e; }).join(" ");
    request.get("https://www.googleapis.com/customsearch/v1element")
           .query({cx: cx, q: keyword, key: api_key, hl: 'ja', prettyPrint: 'false', num: '10', rsz: 'filtered_cse'})
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

               if (!json || !json.results) {
                   return next(new Error("not found"));
               }

               var id = null;
               for (var i = 0; i < json.results.length; i++) {
                   if (json.results[i].url && json.results[i].url.match(/^http:\/\/www.kasi-time.com\/item-\d+.html$/)) {
                       id = json.results[i].url.replace(/^http:\/\/www.kasi-time.com\/item-(\d+).html$/, '$1');
                       break;
                   }
               }

               if (i == json.results.length) {
                   return next(new Error("not found"));
               }

               request.get('http://www.kasi-time.com/item_js.php')
                      .query({no: id})
                      .end(function(err, res) {
                          if (err) {
                              return next(err);
                          }

                          var lrc = res.text.replace('document.write(\'', '').replace('\');', '');
                          lrc = htmlToText.fromString(lrc);
                          next(null, lrc);
                      });

           });
}
