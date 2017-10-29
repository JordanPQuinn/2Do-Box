$(document).ready(function() {
  for (var i in localStorage) {
    displayIdea(i);
    $('#title-input').focus();
  }
});

$('.save-btn').on('click', storeOrReject);
$('.card-container').on('blur', 'article h2', editCardTitle);
$('.card-container').on('blur', 'article p', editCardBody);
$('.card-container').on('click', '.upvote', upvote);
$('.card-container').on('click', '.downvote', downvote);
$('.card-container').on( 'click', '.delete', removeCard);

function displayIdea(id) {
  var getArray = localStorage.getItem(id);
  var retrievedArray = JSON.parse(getArray);
  var title = retrievedArray.title;
  var body = retrievedArray.body;
  var id = retrievedArray.id;
  var quality = retrievedArray.quality;
  createIdea(title, body, id, quality);
}

function storeIdea() {
  var $title = $('#title-input').val();
  var $body = $('#description-input').val();
  var $id = Date.now();
  var $quality = 'swill';
  var storeCard = new StoreCard($title, $body, $id, $quality);
  var stringified = JSON.stringify(storeCard);
  localStorage.setItem($id, stringified);
  displayIdea($id);
}

function storeOrReject(e) {
  e.preventDefault()
  var $title = $('#title-input').val();
  var $body = $('#description-input').val();
  console.log($title);
  if (($title === '') || ($body === '')) {
    $('.title-missing-field').text('Please enter a valid to-do');
    return;
  }
  else {
    storeIdea();
    clearInput();
    $('.title-missing-field').text('');
  }
}

$('#title-input').on('keyup', enabledButton); 
$('#description-input').on('keyup', enabledButton);

$('#search').on('keyup', function() {
  searchTitle();
  searchBody();
});

// $('.card-container').on('blur', 'article h2', 'article p', editContent);
//Take two blur event listeners, set them to parse both the body and the title
//Then send both back to local storage
//Rather than take it out in pieces and send it back in pieces

function editCardTitle(){
  var cardID = $(this).closest('article').attr('id');
  var parsedCardId = JSON.parse(localStorage.getItem(cardID));
  parsedCardId.title = $(this).text();
  var titleStringify =JSON.stringify(parsedCardId);
  var storeTitle = localStorage.setItem(cardID, titleStringify);
}

function editCardBody(){
  var cardID = $(this).closest('article').attr('id');
  var parsedCardId = JSON.parse(localStorage.getItem(cardID));
  parsedCardId.body = $(this).text();
  var bodyStringify =JSON.stringify(parsedCardId);
  var storeBody = localStorage.setItem(cardID, bodyStringify);
  };



function upvote(){
  var cardID = $(this).closest('article').attr('id');
  var parsedCardId = JSON.parse(localStorage.getItem(cardID));
  var qualityDisplay = $(this).siblings('h3').find('.qualityValue');
  if (qualityDisplay.text() === 'swill') {
    qualityDisplay.text('plausible');
    parsedCardId.quality = 'plausible';
  } 
  else if (qualityDisplay.text() === 'plausible') {
    qualityDisplay.text('genius');
    parsedCardId.quality = 'genius';
  }
    var qualityStringify = JSON.stringify(parsedCardId);
    var storeQuality = localStorage.setItem(cardID, qualityStringify);
};

function downvote() {
  var cardID = $(this).closest('article').attr('id');
  var parsedCardId = JSON.parse(localStorage.getItem(cardID));
  var qualityDisplay = $(this).siblings('h3').find('.qualityValue');
  if (qualityDisplay.text() === 'genius') {
    qualityDisplay.text('plausible');
    parsedCardId.quality = 'plausible';
  }
  else if (qualityDisplay.text() === 'plausible') {
    qualityDisplay.text('swill');
    parsedCardId.quality = 'swill';
  }
    var qualityStringify = JSON.stringify(parsedCardId);
    var storeQuality = localStorage.setItem(cardID, qualityStringify);
};

function removeCard() {
  var cardToDel = $(this).closest('article');
  var cardID = $(cardToDel).attr('id');
  localStorage.removeItem(cardID)
  cardToDel.remove();
}

function StoreCard(title, body, id, quality) {
  this.title = title;
  this.body = body;
  this.id = id;
  this.quality = quality;
}

function createIdea(title, body, id, quality) {
  $('.card-side').prepend(
    `<article class="container" id ="${id}">
      <h2 contenteditable="true">${title}</h2>
      <div class="circle delete"></div>
      <p contenteditable="true">${body}</p>
      <h3>quality: <span class="qualityValue">${quality}</span></h3>
      <div class="circle upvote"> </div>
      <div class="circle downvote"> </div>
      <hr>
    </article>`)
}

function clearInput() {
  $('#description-input').val('');
  $('#title-input').val('');
  $('#title-input').focus();
}

function enabledButton() {
$('.save-btn').attr('disabled', false);
}

function searchTitle() {
 var $searchValue = $('#search').val().toLowerCase();
 var $cardsTitle = $('article h2');
 $.each($cardsTitle, function(index, value){
  var $cardsLowerCase = $(value).text().toLowerCase();
  if ($cardsLowerCase.includes($searchValue) === true) {
  var cardShow = $(value).parent('article');
  cardShow.show();
  } 
else {
  var cardShow = $(value).parent('article');
  cardShow.hide();
  }
 })
}

function searchBody() {
 var $searchValue = $('#search').val().toLowerCase();
 var $cardsBody = $('article p');
 $.each($cardsBody, function(index, value) {
  var $cardsLowerCase = $(value).text().toLowerCase();
  if ($cardsLowerCase.includes($searchValue) === true) {
  var cardShow = $(value).parent('article');
  cardShow.show();
  } 
  else {
    var cardShow = $(value).parent('article');
    cardShow.hide();
    }
  })
}