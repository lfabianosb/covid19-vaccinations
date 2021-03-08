const csv = require('csvtojson')
const fs = require('fs');
const fetch = require('node-fetch');

let count = 0;

const isValidRow = (row) => {
  if (row.iso_code
      && row.iso_code.length === 3
      && Number(row.total_vaccinations) > 0
      && Number(row.people_vaccinated) > 0
      && Number(row.total_vaccinations_per_hundred) > 0
      && Number(row.people_vaccinated_per_hundred) > 0) {
    count++;
    return true;
  }
  return false;
}

const loadCSV = async () => {
  const res = await fetch('https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.csv');
  const data = await res.text();
  return data;
}

const fetchIsoAlpha2Code = async (alpha3Code) => {
  const res = await fetch(`https://restcountries.eu/rest/v2/alpha/${alpha3Code}`);
  const data = await res.json();
  return data.alpha2Code ? data.alpha2Code.toLowerCase() : null;
};

const safeToFile = (data) => {
  console.log('data', Object.keys(data));
  fs.writeFile('covid19-vaccines.json', JSON.stringify(data), 'utf8', () => {
    console.log('count', count);
  });
};

loadCSV().then((data) => {
  csv()
  .fromString(data)
  .then((jsonObj) => {
    let location = '';
    let countryList = {};
    const _run = async () => {
      for(let obj of jsonObj) {
        if (isValidRow(obj)) {
          if (location !== obj.location) {
            location = obj.location;
            const alpha2Code = await fetchIsoAlpha2Code(obj.iso_code);
            console.log('alpha2Code', alpha2Code);
            countryList[location] = {
              iso_code: alpha2Code,
              flag: `https://flagpedia.net/data/flags/normal/${alpha2Code}.png`,
              data: [],
            };
          }
          if (countryList[location]?.data) {
            countryList[location].data.push({
              date: obj.date,
              total_vaccinations: obj.total_vaccinations ? Number(obj.total_vaccinations) : 0,
              people_vaccinated: obj.people_vaccinated ? Number(obj.people_vaccinated) : 0,
              people_fully_vaccinated: obj.people_fully_vaccinated ? Number(obj.people_fully_vaccinated) : 0,
              total_vaccinations_per_hundred: obj.total_vaccinations_per_hundred ? Number(obj.total_vaccinations_per_hundred) : 0,
              people_vaccinated_per_hundred: obj.people_vaccinated_per_hundred ? Number(obj.people_vaccinated_per_hundred) : 0,
              people_fully_vaccinated_per_hundred: obj.people_fully_vaccinated_per_hundred ? Number(obj.people_fully_vaccinated_per_hundred) : 0,
              daily_vaccinations: obj.daily_vaccinations ? Number(obj.daily_vaccinations) : 0,
            });
          }
        }
      }
      safeToFile(countryList);
    };
    _run();
  });
});
