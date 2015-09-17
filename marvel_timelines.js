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
        var myImgPath = response.data.results[0].thumbnail.path + "/landscape_incredible.jpg";
        var limit = 50;

        // console.log(startDate)
        // var testUrl = response.data.results[0].events.items[0].resourceURI;
        // http://gateway.marvel.com:80/v1/public/characters/1009610/events?limit=50&apikey=e687d607d622b25c31d6ae38f2f42597
        var testUrl = "http://gateway.marvel.com:80/v1/public/characters/" + heroId + "/events?orderBy=startDate" + "&limit=" + limit + "&ts=" + ts + "&apikey=e687d607d622b25c31d6ae38f2f42597&hash=" + hash;

        // $('.heroImg').attr('src', myImgPath)
        // $('.page-header').css('background-image', 'url(' + myImgPath + ')', 'no-repeat');
        $('.page-header').css({'background-image': 'url(' + myImgPath + ')', 'background-repeat': 'no-repeat', 'background-position': '50% 50%'});
        console.log(heroId)
        // console.log(etag)
        console.log(response)
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
          // console.log(newRect);
          // console.log(data);
          // $.format.parseDate(date);
          // $.format.date(r2d[i].start, "MMMM, yyyy")
          var r2d = res2.data.results;
          $('timeline').empty();
          $('.timeline').html('<li></li>')
          for (var i = 0; i < res2.data.count; i++){
            startDate = res2.data.results[i].start;
            newDate = format(new Date(startDate));
            data.push(startDate);
            // <h5 class="timeline-date">Publication of first issue: 1984</h5>
            $('.timeline').append(
                "<li><div class='timeline-badge'><i class='glyphicon glyphicon-hand-left'></i></div><div class='timeline-panel'><div class='timeline-heading'><h4 class='timeline-title'>" + r2d[i].title + "</h4><h5 class='timeline-date'>First issue: " + newDate + "</h5></div><div class='timeline-body'><p>" + r2d[i].description + "</p></div></div></li>"
              )
            // $('.timeline-heading').append("<h4 class='timeline-title'>" + r2d[i].title + "</h4>"); //text(r2d[i].title);
            // $('.heroInfo').append("<li><p>" + newDate + "</p></li>")
            // $('.heroInfo').append("<li><p>" + r2d[i].title + "</p><p>" + $.format.date(r2d[i].start, "MMMM, yyyy") + "</p><p>" + r2d[i].description + "</p></li>")
          }
          // var rect = timeline.select("rect").data(data).enter();
          // var newRect = rect.append("rect")
          // console.log(data);
          // console.log(res2.data.results[5].description)
        })
      })
      // Clear form
      event.target.value = "";
    }
  });
});
