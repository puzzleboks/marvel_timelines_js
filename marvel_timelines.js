// myImgPath = "";

$('form').click(function() {
  event.preventDefault();

  var privKey = "";
  var pubKey = "e687d607d622b25c31d6ae38f2f42597";
  var name = event.target.text.value;
  var ts = parseInt(Date.now()/1000, 10);
  var preHash = ts + privKey + pubKey;
  var hash = CryptoJS.MD5(preHash).toString();
  var url = "http://gateway.marvel.com:80/v1/public/characters?name=" + name + "&ts=" + ts + "&apikey=e687d607d622b25c31d6ae38f2f42597&hash=" + hash

  $.ajax({
    // the URL endpoint for the JSON object
    url: url,
    // type of request
    type: "get",
    // datatype xml or json
    dataType: "json"
    // promise that executes on successful ajax call
  }).done(function(response){
    myImgPath = response.data.results[0].thumbnail.path + "/portrait_incredible" + ".jpg";
  })
  // Clear form
  event.target.text.value = "";
});
