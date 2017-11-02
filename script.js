$(document).ready(function() {
    for (var i in localStorage) {
    displayIdea(i);
    hideCompleted();
    $('#title-input').focus();
  }
    showFirstTen();
  });

$('.save-btn').on('click', storeOrReject);
$('.card-container').on('blur', 'article h2', editCardTitle);
$('.card-container').on('blur', 'article p', editCardBody);
$('.card-container').on('mousedown', '.circle-upvote', upvote);
$('.card-container').on('mousedown', '.circle-downvote', downvote);
$('.card-container').on( 'click', '.circle-delete', removeCard);
$('#title-input').on('keyup', enabledButton); 
$('#description-input').on('keyup', enabledButton);
$('#filter').on('keyup', searchContent);
$('#filter').on('keyup', emptyContent);
$('.filter-buttons').on('click','.none', noneFilter);
$('.filter-buttons').on('click', '.low', lowFilter);
$('.filter-buttons').on('click', '.normal', normalFilter);
$('.filter-buttons').on('click', '.high', highFilter);
$('.filter-buttons').on('click', '.critical', criticalFilter);
$('.card-container').on('click', '.complete-task', completeTask);
$('.card-side').on('click', '.load-more', showMore)
$('.card-side').on('click', '.show-complete', showComplete)

function displayIdea(id) {
  var getArray = localStorage.getItem(id);
  var retrievedArray = JSON.parse(getArray);
  var title = retrievedArray.title;
  var body = retrievedArray.body;
  var id = retrievedArray.id;
  var importanceCount = retrievedArray.importanceCount;
  var complete = retrievedArray.complete;
  createIdea(title, body, id, importanceCount, complete);
}

function storeIdea() {
  var $title = $('#title-input').val();
  var $body = $('#description-input').val();
  var $id = Date.now();
  var $importanceCount = 1;
  var $complete = 'false';
  var storeCard = new StoreCard($title, $body, $id, $importanceCount, $complete);
  var stringified = JSON.stringify(storeCard);
  localStorage.setItem($id, stringified);
  displayIdea($id);
  showFirstTen();
}

function storeOrReject(e) {
  e.preventDefault()
  var $title = $('#title-input').val();
  var $body = $('#description-input').val();
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
  if(parsedImportanceCount < 5){
    parsedCardId.importanceCount++;
    importanceDot.removeClass().addClass('importance-dot-'+parsedCardId.importanceCount + ' importance-dot');
  }
  var qualityStringify = JSON.stringify(parsedCardId);
  var storeQuality = localStorage.setItem(cardID, qualityStringify);
}

function downvote() {
  var cardID = $(this).closest('article').attr('id');
  var parsedImportanceCount = JSON.parse(localStorage.getItem(cardID)).importanceCount; 
  var parsedCardId = JSON.parse(localStorage.getItem(cardID));
  var importanceDot = $(this).parent().find('.importance-dot');
  if(parsedImportanceCount > 1) {
    parsedCardId.importanceCount--;
    importanceDot.removeClass().addClass('importance-dot-'+parsedCardId.importanceCount + ' importance-dot');
  }
  var qualityStringify = JSON.stringify(parsedCardId);
  var storeQuality = localStorage.setItem(cardID, qualityStringify);
}

function removeCard() {
  var cardToDel = $(this).closest('article');
  var cardID = $(cardToDel).attr('id');
  localStorage.removeItem(cardID)
  cardToDel.remove();
  for (var i in localStorage) {
    displayIdea(i);
    hideCompleted();
  }
  showFirstTen();
}

function StoreCard(title, body, id, importanceCount, complete) {
  this.title = title;
  this.body = body;
  this.id = id;
  this.importanceCount = importanceCount || 1;
  this.complete = complete || 'false';
}

function createIdea(title, body, id, importanceCount, complete) {
  $('.card-container').prepend(
    `<article class="card ${complete}" id ="${id}">
      <div class="vote-container">
        <div class="circle-upvote"> </div>
        <div class="importance-dot-${importanceCount} importance-dot"> </div>
        <div class="circle-downvote"> </div>
      </div>
      <div class="circle-delete"></div>
      <div class = "text-container">
      <h2 class="card-header" contenteditable="true">${title}</h2>
      <p contenteditable="true">${body}</p>
      <button class="complete-task">COMPLETE</button>
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

function noneFilter(){
  var importanceDotsArray = $('.importance-dot');
  for (i=0; i<importanceDotsArray.length; i++){
    if ($(importanceDotsArray[i]).hasClass('importance-dot-1')) {
      $(importanceDotsArray[i]).closest('article').show();
    }
    else {
      $(importanceDotsArray[i]).closest('article').hide();
    }
  }
}

function lowFilter(){
  var importanceDotsArray = $('.importance-dot');
  for (i=0; i<importanceDotsArray.length; i++){
    if ($(importanceDotsArray[i]).hasClass('importance-dot-2')){
      $(importanceDotsArray[i]).closest('article').show();
    }
    else {
      $(importanceDotsArray[i]).closest('article').hide();
    }
  }
}

function normalFilter(){
  var importanceDotsArray = $('.importance-dot');
  for (i=0; i<importanceDotsArray.length; i++){
    if ($(importanceDotsArray[i]).hasClass('importance-dot-3')){
      $(importanceDotsArray[i]).closest('article').show();
    }
    else {
      $(importanceDotsArray[i]).closest('article').hide();
    }
  }
}

function highFilter(){
  var importanceDotsArray = $('.importance-dot');
  for (i=0; i<importanceDotsArray.length; i++){
    if ($(importanceDotsArray[i]).hasClass('importance-dot-4')){
      $(importanceDotsArray[i]).closest('article').show();
    }
    else {
      $(importanceDotsArray[i]).closest('article').hide();
    }
  }
}

function criticalFilter(){
  var importanceDotsArray = $('.importance-dot');
  for (i=0; i<importanceDotsArray.length; i++){
    if ($(importanceDotsArray[i]).hasClass('importance-dot-5')){
      $(importanceDotsArray[i]).closest('article').show();
    }
    else {
      $(importanceDotsArray[i]).closest('article').hide();
    }
  }
}

function completeTask() {
  var card = $(this).closest('article');
  var cardID = $(this).closest('article').attr('id');
  var parsedCardId = JSON.parse(localStorage.getItem(cardID));
  card.removeClass(parsedCardId.complete);
  parsedCardId.complete = 'true';
  card.addClass(parsedCardId.complete);
  var qualityStringify = JSON.stringify(parsedCardId);
  var storeQuality = localStorage.setItem(cardID, qualityStringify)
}

function hideCompleted() {
  var completed = $('.true');
  completed.hide();
}

function showFirstTen() {
   var cardsToShowArray = $('.false');
   for(var i = 0; i < cardsToShowArray.length; i++){
    if(i >= 10){
      $(cardsToShowArray[i]).hide();
    }
   }
 }

 function showMore() {
  var cardsToShowArray = $('.false');
  for(var i = 0; i < cardsToShowArray.length; i++){
    $(cardsToShowArray[i]).show();
  }
}

function emptyContent() {
  if($('#filter').val() === '') {
    showFirstTen();
  }
}

function showCards() {
  for (var i in localStorage) {
    displayIdea(i);
    hideCompleted();
  }
}

function showComplete() {
  var uncompleteCards = $('.false');
  var completedCards = $('.true');
  for(var i = 0; i < completedCards.length; i++) {
    $(completedCards[i]).show();
  }
  for(var i = 0; i < uncompleteCards.length; i++) {
    $(uncompleteCards[i]).hide();
  }
}

