'use strict';

const apiKey = '8jNBWzYGvW0ER0etCTSZZcNWg3Lxq8SIyDQIh9ss';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
}
function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  let html = '';
  for (let i = 0; i < responseJson.data.length; i++) {
    $('#results-list').append(
      `<li><h3><a href="${responseJson.data[i].url}">${responseJson.data[i].name}</a></h3>
      <p><b>Description:</b> ${responseJson.data[i].description}</p>
      <p><b>Address:</b> ${responseJson.data[i].directionsInfo}</p>
      </li>`
    )};
  //display the results section
  $('#results').removeClass('hidden');
}

function getParkResults(query, maxResults=10) {
  const params = {
    api_key: apiKey,
    limit: maxResults,
    stateCode: query
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('.user-form').submit(function(event) {
    event.preventDefault();
    const state = $(this)
      .find('#state')
      .val();
    const maxResults = $(this)
      .find('#max')
      .val();
    getParkResults(state, maxResults);
  });
}

$(watchForm);
