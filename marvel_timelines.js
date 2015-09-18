$(document).ready(function(){
  $('.heroInput').on('keypress', function(event) {
    if(event.which == 13){
      event.preventDefault();

      var privKey = "";
      pubKey = "e687d607d622b25c31d6ae38f2f42597";
      var name = event.target.value;
      ts = parseInt(Date.now()/1000, 10);
      var preHash = ts + privKey + pubKey;
      hash = CryptoJS.MD5(preHash).toString();
      var url = "http://gateway.marvel.com:80/v1/public/characters?name=" + name + "&ts=" + ts + "&apikey=e687d607d622b25c31d6ae38f2f42597&hash=" + hash
      console.log(url)
      $.ajax({
        url: url,
        type: "get",
        dataType: "json"
      }).done(function(response){
        var heroId = response.data.results[0].id;
        var limit = 50;
        // var etag = response.etag;
        //if doesn't exist, then try again?
        console.log(response.data.results[0].thumbnail)
        if (response.data.results[0].thumbnail!==null){
          var myImgPath = response.data.results[0].thumbnail.path + "/landscape_incredible.jpg";
          // console.log('it is null');
        }else{
          var myImgPath = "http://dummyimage.com/464x261/3b3b3b/ffffff.png&text=No+image+available";
          $('.heroInput').attr({'placeholder': 'Sorry, try a different superhero'})
        }


        //if image path is null
        // var myImgPath = response.data.results[0].thumbnail.path + "/landscape_incredible.jpg";


        // console.log(startDate)
        // var testUrl = response.data.results[0].events.items[0].resourceURI;
        // http://gateway.marvel.com:80/v1/public/characters/1009610/events?limit=50&apikey=e687d607d622b25c31d6ae38f2f42597
        var testUrl = "http://gateway.marvel.com:80/v1/public/characters/" + heroId + "/events?orderBy=startDate" + "&limit=" + limit + "&ts=" + ts + "&apikey=e687d607d622b25c31d6ae38f2f42597&hash=" + hash;

        // $('.heroImg').attr('src', myImgPath)
        // $('.page-header').css('background-image', 'url(' + myImgPath + ')', 'no-repeat');
        $('.heroImg').css({'background-image': 'url(' + myImgPath + ')', 'background-repeat': 'no-repeat', 'background-position': '50% 50%'});
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
          entityIds = {};
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
            startDate = r2d[i].start;
            newDate = format(new Date(startDate));
            data.push(startDate);
            entityIds[r2d[i].title] = r2d[i].id;
            // <h5 class="timeline-date">Publication of first issue: 1984</h5>
            $('.timeline').append(
              "<li class='timeline_li'><div class='timeline-badge'><i class='glyphicon glyphicon-hand-left'></i></div><div class='timeline-panel'><div class='timeline-heading'><h4 class='timeline-title'>" + r2d[i].title + "</h4><h5 class='timeline-date'>First issue: " + newDate + "</h5></div><div class='timeline-body'><p>" + r2d[i].description + "</p></div><button class='btn btn-default btn-xs' type='button' data-eventid='" + r2d[i].id + "' data-toggle='modal' href='#myModal1'>Cover</button></div></li>"
            )
            // $ ('#myModal1').data(r2d[i].id);
            //if odd, set class? timeline inverted
            // if (i%2 !== 0) {
            // console.log(i)
            // $('.timeline_li').attr('class', 'timeline-inverted')
            // $('.timeline li').attr('class', 'timeline-li')
            // }
            // $('.timeline-heading').append("<h4 class='timeline-title'>" + r2d[i].title + "</h4>"); //text(r2d[i].title);
            // $('.heroInfo').append("<li><p>" + newDate + "</p></li>")
            // $('.heroInfo').append("<li><p>" + r2d[i].title + "</p><p>" + $.format.date(r2d[i].start, "MMMM, yyyy") + "</p><p>" + r2d[i].description + "</p></li>")
          }
          $ ('ul.timeline li:even').addClass('timeline-inverted')

          // var rect = timeline.select("rect").data(data).enter();
          // var newRect = rect.append("rect")
          console.log(entityIds);
          // console.log(res2.data.results[5].description)
        })
      }).fail(function(response){
        // console.log(response)
        // console.log("failed")
        $('.heroInput').attr({'placeholder': 'Sorry, try a different superhero'})
      });
      // Clear form
      event.target.value = "";
    }
  });

  $('#myModal1').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var eventId = button.data('eventid')
    var modal = $(this)
    // http://gateway.marvel.com:80/v1/public/events/270/comics?issueNumber=1&apikey=e687d607d622b25c31d6ae38f2f42597
    var url = "http://gateway.marvel.com:80/v1/public/events/" + eventId + "/comics?issueNumber=1&ts=" + ts + "&apikey=e687d607d622b25c31d6ae38f2f42597&hash=" + hash;
    $.ajax({
      url: url,
      type: "get",
      dataType: "json"
    }).done(function(res){
      console.log(eventId);
      if(res.data.results.length === 0){
        modal.find('.modal-title').html("");
        modal.find('.modal-body img').attr('src', "http://dummyimage.com/300x450/ebebeb/000000.png&text=No+image+available")
        console.log("No data")
      }else{
        modal.find('.modal-title').html(res.data.results[0].title);
        modal.find('.modal-body img').attr('src', res.data.results[0].thumbnail.path + "/portrait_uncanny.jpg")
      }
    }).fail(function(){
      console.log("fail!")
    });
    // console.log(eventId);
    // var button = $(event.relatedTarget) // Button that triggered the modal
    // var recipient = button.data('whatever') // Extract info from data-* attributes
    // // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    // var modal = $(this)
    // modal.find('.modal-title').text('New message to ' + recipient)
    // modal.find('.modal-body input').val(recipient)
  })
});
