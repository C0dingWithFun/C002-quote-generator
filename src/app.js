const themeTitle = document.querySelector("#theme-title");
const themeLinkIcon = document.querySelector("#theme-link img");
const themeLink = document.querySelector("#theme-link");
const quoteElement = document.querySelector("#quote");
const quoteAuthorElement = document.querySelector("#quote-author");
const quoteLinkElement = document.querySelector("#quote-link");
const refreshLinkElement = document.querySelector("#refresh-link");

const THEME = {
  DARK: Symbol('dark'),
  LIGHT: Symbol('light'),
};
const API_URL = 'https://favqs.com/api/qotd';

let currentTheme = THEME.DARK;

function toggleTheme() {
  if (currentTheme === THEME.LIGHT) {
    themeTitle.innerText = "Light Mode:";
    themeLinkIcon.src = "./assets/light-mode-icon.png";
    themeLinkIcon.alt = "Light Mode Icon";
    document.body.id = "dark";
    currentTheme = THEME.DARK;
    return;
  }
  themeTitle.innerText = "Dark Mode:";
  themeLinkIcon.src = "./assets/dark-mode-icon.png";
  themeLinkIcon.alt = "Dark Mode Icon";
  document.body.id = "";
  currentTheme = THEME.LIGHT;
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
  toggleTheme();
}

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
  toggleTheme();
});


themeLink.addEventListener('click', (e) => {
  e.preventDefault();
  toggleTheme();
});

function fetchQuote(forced = false) {
  if (forced !== true && localStorage.quote) {
    const localStorageQuote = JSON.parse(localStorage.quote);
    const isOlderThanDay = new Date(localStorageQuote.time).getTime() + (24 * 60 * 60 * 1000) < new Date().getTime();
    if (!isOlderThanDay) {
      quoteElement.innerText = localStorageQuote.quote.body;
      quoteAuthorElement.innerText = localStorageQuote.quote.author;
      quoteLinkElement.innerText = localStorageQuote.quote.url;
      quoteLinkElement.href = localStorageQuote.quote.url;
      return;
    }
  }
  fetch(API_URL)
    .then((data) => data.json())
    .then((data) => {
      data.time = new Date();
      quoteElement.innerText = data.quote.body;
      quoteAuthorElement.innerText = data.quote.author;
      quoteLinkElement.innerText = data.quote.url;
      quoteLinkElement.href = data.quote.url;
      localStorage.quote = JSON.stringify(data);
    })
    .catch(console.error);
}

refreshLinkElement.addEventListener('click', (e) => {
  e.preventDefault();
  fetchQuote(true);
})

window.addEventListener('load', fetchQuote);