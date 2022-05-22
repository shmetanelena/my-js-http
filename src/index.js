import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash/debounce';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

//console.log(...fetchCountries('sw'));
/*
fetch(`https://restcountries.com/v3.1/all?fields=name,capital`)
  .then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  })
  .then(countries => {
    //console.log(...countries);
    const strangeCountries = countries.filter(c => c.capital.length > 1);
    console.log(...strangeCountries);
  })
  .catch(err => {
    console.error(err);
  });
*/
input.addEventListener(
  'input',
  debounce(() => {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    const name = input.value.trim();
    if (name.length === 0) {
      return;
    }
    fetchCountries(name)
      .then(countries => {
        console.log(...countries);
        if (countries.length > 10) {
          console.log('Too many matches found. Please enter a more specific name.'); // TODO
        } else if (countries.length >= 2 && countries.length < 10) {
          countryList.innerHTML = countries
            .map(
              country =>
                `<li>
              <div>
                <img class="flag" src=${country.flags.svg} />
                <span>${country.name.official}</span>
              </div>
            </li>`,
            )
            .join('');
        } else if (countries.length == 1) {
          const country = countries[0];
          countryInfo.innerHTML = `
          <div class="header">
            <img class="flag" src=${country.flags.svg} />
            <span>${country.name.official}</span>
          </div>
          <div>
            <span class="field-title">Capital:</span>
            <span class="field-value">${country.capital.join(', ')}</span>
          </div>
          <div>
            <span class="field-title">Population:</span>
            <span class="field-value">${country.population}</span>
          </div>
          <div>
            <span class="field-title">Languages:</span>
            <span class="field-value">${Object.values(country.languages)}</span>
          </div>
          `;
        }
      })
      .catch(err => {
        console.error(err);
        console.log('Oops, there is no country with that name'); // TODO
      });

    //const countries = ;
    /*  console.log(countries);
     */
  }, DEBOUNCE_DELAY),
);
