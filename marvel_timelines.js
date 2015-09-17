$(document).ready(function(){
  $('.heroInput').on('keypress', function(event) {
    if(event.which == 13){
      event.preventDefault();

      var privKey = "";
      var pubKey = "e687d607d622b25c31d6ae38f2f42597";
      var name = event.target.value;
      var ts = parseInt(Date.now()/1000, 10);
      var preHash = ts + privKey + pubKey;
      var hash = CryptoJS.MD5(preHash).toString();
      var url = "http://gateway.marvel.com:80/v1/public/characters?name=" + name + "&ts=" + ts + "&apikey=e687d607d622b25c31d6ae38f2f42597&hash=" + hash

      $.ajax({
        url: url,
        type: "get",
        dataType: "json"
      }).done(function(response){
        //if doesn't exist, then try again?
        var etag = response.etag;
        var heroId = response.data.results[0].id;
        var myImgPath = response.data.results[0].thumbnail.path + ".jpg";
        var limit = 50;

        // console.log(startDate)
        // var testUrl = response.data.results[0].events.items[0].resourceURI;
        // http://gateway.marvel.com:80/v1/public/characters/1009610/events?limit=50&apikey=e687d607d622b25c31d6ae38f2f42597
        var testUrl = "http://gateway.marvel.com:80/v1/public/characters/" + heroId + "/events?orderBy=startDate" + "&limit=" + limit + "&ts=" + ts + "&apikey=e687d607d622b25c31d6ae38f2f42597&hash=" + hash;

        $('.heroImg').attr('src', myImgPath)
        console.log(heroId)
        // console.log(etag)
        // console.log(response)
        // console.log(heroEvents)
        //http://gateway.marvel.com:80/v1/public/characters/1009351/events?apikey=e687d607d622b25c31d6ae38f2f42597
        // http://gateway.marvel.com:80/v1/public/characters/1009610/events?orderBy=startDate&limit=50&apikey=e687d607d622b25c31d6ae38f2f42597
        $.ajax({
          url: testUrl,
          type: "get",
          dataType: "json"
        }).done(function(res2){
          console.log(res2)
          var data = [];
          var startDate;
          var format = d3.time.format("%B %d, %Y");
          var newDate;
          var timeline = d3.select(".timeline");
          // var line = timeline.select(".timeline")
          console.log(newRect);
          // console.log(data);
          // $.format.parseDate(date);
          // $.format.date(r2d[i].start, "MMMM, yyyy")
          var r2d = res2.data.results
          for (var i = 0; i < res2.data.count; i++){
            startDate = res2.data.results[i].start;
            newDate = format(new Date(startDate))
            data.push(startDate)
            $('.heroInfo').append("<li><p>" + newDate + "</p></li>")
            // $('.heroInfo').append("<li><p>" + r2d[i].title + "</p><p>" + $.format.date(r2d[i].start, "MMMM, yyyy") + "</p><p>" + r2d[i].description + "</p></li>")
          }
          var rect = timeline.select("rect").data(data).enter();
          var newRect = rect.append("rect")
          // console.log(data);
          // console.log(res2.data.results[5].description)
        })
      })
      // Clear form
      event.target.value = "";
    }
  });
});
