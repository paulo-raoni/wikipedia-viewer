$("document").ready(function() {
  "use strict";
  var userLang = navigator.language || navigator.userLanguage,
      $urlLangBr = "pt-BT" || "pt-PT",
      //Changes the settings to pt-BR || pt-PT if the user speaks portuguese.
      $placeHolderBr = $("input.searchBox"),
      $searchBr = $("input.searchButton"),
      $buttonRandomBr = $("button.randomArticle"),
      $readMore = 'READ MORE';

  if ($urlLangBr) {
    $placeHolderBr.attr("placeholder", "Pesquise por artigos na Wikipedia");
    $searchBr.attr("value", "Pesquisar");
    $buttonRandomBr.text("ESTOU COM SORTE");
    $readMore = 'LER MAIS';
  }

  // $('.searchBox').focus();

  //EVENT HANDLER - RANDOM
  $("button.randomArticle").on("click", function(e) {
    e.preventDefault();
    $(".results").html("");
    $("p.newBoxResult").removeClass().html("");

    //Change the random query to portuguese if the user is from a country that speaks pt.
    var $urlLangRandom,
        $urlLangRandomResult;

    if ($urlLangBr) {
      $urlLangRandom = 
        "https://pt.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=random&meta=&iwurl=1&rnnamespace=0&rnlimit=1utf8=";
      $urlLangRandomResult = "https://pt.wikipedia.org/?curid=";  
    } else {
      $urlLangRandom =
        "https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=random&meta=&iwurl=1&rnnamespace=0&rnlimit=1utf8=";
      $urlLangRandomResult = "https://en.wikipedia.org/?curid="
    }

    //Call for a random article on wikimidia API.
    $.ajax({
      url: $urlLangRandom,
      dataType: "jsonp",
      success: function(data) {
        console.log(data);
        var $titleRandom = data.query.random[0].title,
            $curidRandom = data.query.random[0].id;
        $(".results").append(
          "<div class = 'newBoxResult'><h3>" + $titleRandom + "</h3><a href = " + '\'' + 
          $urlLangRandomResult + 
          $curidRandom + '\'' + 
          "target = '_blank'><p class = 'readMore'><strong>" + $readMore + "</strong></p></a></div>");

        $('p.readMore').on('mouseover', function(){
                $(this).css({backgroundColor: 'darkgreen'});
              });
              $('p.readMore').on('mouseout', function(){
                $(this).css({backgroundColor: 'grey'});
              });

              $('div.newBoxResult').on('mouseover', function(){
                $(this).css({opacity:'0.9', color: 'white', backgroundColor: '#01093a',fontWeight: 'bold'}, 1000);  
              })
              $('div.newBoxResult').on('mouseout', function(){
                $(this).css({opacity:'1', color: 'black', backgroundColor: 'white'}, 500);  
              })
      },
      error: function() {
        alert("There is something wrong with your browser.");
      }
    });
  });

  //EVENT HANDLER - SEARCH
  $("input.searchButton").on("click", function(e) {
    e.preventDefault();

    //Clean everything to refresh page with new content required.
    $(".results").html("");
    $("p.newBoxResult").removeClass().html("");

    //Catches the value typed by the user.
    var $searchBox = $("input.searchBox").val();

    if ($searchBox === "") {
      //If the user didn't type anything this message will appear.
      if (userLang === "pt-BR" || "pt-PT") {
        $(".results").append(
          "<h3 class = 'badBoxResult'>Opa parece que você não digitou nada na caixa de pesquisa. :/</h3>"
        );
      } else {
        $(".results").append(
          "<h3 class = 'badBoxResult'>Ops looks like you are did't type anything in the search box.:/ </h3>"
        );
      }
    } else {
      //Else make a request(below) using the search query typed by the user.

      //Change the search query to portuguese if the user is from a country that speaks pt. Otherwise it  mantains the query in english.
      var $urlLangArticle,
          $urlLangRandomResult;

      if ($urlLangBr) {
        $urlLangArticle =
          "https://pt.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=" +
          $searchBox +
          "&srnamespace=0&indexpageids=1&prop=links&utf8=&format=json&meta=";
        $urlLangRandomResult = "https://pt.wikipedia.org/wiki/";
      } else {
        $urlLangArticle =
          "https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=" +
          $searchBox +
          "&prop=links&utf8=&format=json";
        $urlLangRandomResult = "https://pt.wikipedia.org/wiki/";
      }

      //Ajax call for the wikimidia API.
      $.ajax({
        url: $urlLangArticle,
        dataType: "jsonp",
        success: function(data) {
          console.log(data);
          var $dataArr = data.query.search;
          //If the data the search doesn't find any article mathing, it'll show this message.
          if ($dataArr.length === 0) {
            if (userLang == "pt-BR" || "pt-PT") {
              $(".results").append(
                "<h3 class = 'badBoxResult'>Parece que não existem artigos que correspondam a esta pesquisa. :/</h3>"
              );
            } else {
              $(".results").append(
                "<h3 class = 'badBoxResult'>Looks like there aren't any article matching this search. :/</h3>"
              );
            }
          } else {

            for (var i = 0; i < $dataArr.length; i++) {
              var $snippets = data.query.search[i].snippet,
                  $title = data.query.search[i].title,
                  $curid = data.query.search[i].title;
              $curid = $curid.replace(' ', '_');

              $(".results").append(
                "<div class = 'newBoxResult'><h3>" +
                $title +
                "</h3>" +
                "<p class = 'paragraphNewBox'>" +
                $snippets +
                "</p><a href = " + '\'' + $urlLangRandomResult + 
                $curid + '\'' + 
                "target = '_blank'><p class = 'readMore'><strong>" + $readMore + "</strong></p></a></div><br>"
              );

              $('p.readMore').on('mouseover', function(){
                $(this).css({backgroundColor: 'darkgreen'});
              });
              $('p.readMore').on('mouseout', function(){
                $(this).css({backgroundColor: 'grey'});
              });

              $('div.newBoxResult').on('mouseover', function(){
                $(this).css({opacity:'0.9', color: 'white', backgroundColor: '#01093a',fontWeight: 'bold'}, 1000);  
              })
              $('div.newBoxResult').on('mouseout', function(){
                $(this).css({opacity:'1', color: 'black', backgroundColor: 'white'}, 500);  
              })


            }
          }
        },
        error: function() {
          alert(
            "There is something wrong with your browser. Or the server is not responding"
          );
        }
      });
    }
  });
});