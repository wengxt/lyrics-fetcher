lyrics-fetcher
====================================================
ultimate lyrics provider only supports single url request, this project tries to
fetch lyrics from some good site but need mulitple requests to search.

Currently it supports moe.fm and www.kasi-time.com.

To use with ultimate lyrics provider, use following xml

 <?xml version="1.0" encoding="UTF-8"?>
 <lyricproviders>
   <provider name="name-you-want" charset="utf-8" url="http://host:port/?title={title}&amp;artist={artist}">
     <extract>
       <item begin="" end="null"/>
     </extract>
   </provider>
 </lyricproviders>
