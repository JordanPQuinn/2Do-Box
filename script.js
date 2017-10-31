$(document).ready(function() {
  for (var i in localStorage) {
    displayIdea(i);
    $('#title-input').focus();
  }
});

$('.save-btn').on('click', storeOrReject);
$('.card-container').on('blur', 'article h2', editCardTitle);
$('.card-container').on('blur', 'article p', editCardBody);
$('.card-container').on('click', '.circle-upvote', upvote);
$('.card-container').on('click', '.circle-downvote', downvote);
$('.card-container').on( 'click', '.circle-delete', removeCard);
$('#title-input').on('keyup', enabledButton); 
$('#description-input').on('keyup', enabledButton);
$('#filter').on('keyup', searchContent);

function displayIdea(id) {
  var getArray = localStorage.getItem(id);
  var retrievedArray = JSON.parse(getArray);
  var title = retrievedArray.title;
  var body = retrievedArray.body;
  var id = retrievedArray.id;
  var importance = retrievedArray.importance;
  var importanceCount = retrievedArray.importanceCount;
  createIdea(title, body, id, importance, importanceCount);
}

function storeIdea() {
  var $title = $('#title-input').val();
  var $body = $('#description-input').val();
  var $id = Date.now();
  var $importance = 'none';
  var $importanceCount = 0;
  var storeCard = new StoreCard($title, $body, $id, $importance, $importanceCount);
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

function editCardTitle() {
  var cardID = $(this).closest('article').attr('id');
  var parsedCardId = JSON.parse(localStorage.getItem(cardID));
  parsedCardId.title = $(this).text();
  var titleStringify =JSON.stringify(parsedCardId);
  var storeTitle = localStorage.setItem(cardID, titleStringify);
}

function editCardBody() {
  var cardID = $(this).closest('article').attr('id');
  var parsedCardId = JSON.parse(localStorage.getItem(cardID));
  parsedCardId.body = $(this).text();
  var bodyStringify =JSON.stringify(parsedCardId);
  var storeBody = localStorage.setItem(cardID, bodyStringify);
  }

function upvote() {
  var cardID = $(this).closest('article').attr('id');
  var parsedImportanceCount = JSON.parse(localStorage.getItem(cardID)).importanceCount; 
  var parsedCardId = JSON.parse(localStorage.getItem(cardID));
  var importanceDot = $(this).parent().find('.importance-dot');
  if (parsedImportanceCount === 0) {
    console.log(importanceDot);
    console.log(parsedImportanceCount);
    importanceDot.css('background-image', 'url(images/low-dot.svg)');
    parsedCardId.importance = 'low';
    parsedCardId.importanceCount++;
  } 
  else if (parsedImportanceCount === 1) {
    console.log(importanceDot);
    console.log(parsedImportanceCount);
    importanceDot.css('background-image', 'url(images/normal-dot.svg)');
    parsedCardId.importance = 'normal';
    parsedCardId.importanceCount++;
  }
    var qualityStringify = JSON.stringify(parsedCardId);
    var storeQuality = localStorage.setItem(cardID, qualityStringify);
}

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
}

function removeCard() {
  var cardToDel = $(this).closest('article');
  var cardID = $(cardToDel).attr('id');
  localStorage.removeItem(cardID)
  cardToDel.remove();
}

function StoreCard(title, body, id) {
  this.title = title;
  this.body = body;
  this.id = id;
  this.importanceCount = 0; 
}

function createIdea(title, body, id) {
  $('.card-container').prepend(
    `<article class="card" id ="${id}">
      <div class="vote-container">
        <div class="circle-upvote"> </div>
        <div class="importance-dot"> </div>
        <div class="circle-downvote"> </div>
      </div>
      <div class="circle-delete"></div>
      <div class = "text-container">
      <h2 class="card-header" contenteditable="true">${title}</h2>
      <p contenteditable="true">${body}</p>
      </div>
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

function searchContent(){
  var $searchValue = $('#filter').val();
  var $cardsTitle = $('article h2');
  var $cardsBody = $('article p');
  for (i=0; i<$cardsTitle.length; i++){
   if ($($cardsTitle[i]).text().includes($searchValue) || ($($cardsBody[i]).text().includes($searchValue))) {
    $($cardsTitle[i]).closest('article').show();
   } 
   else {
    $($cardsTitle[i]).closest('article').hide();
   }
  }
}
