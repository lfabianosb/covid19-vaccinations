const fetch = require('node-fetch');

const alpha2 = async() => {
  const res = await fetch('https://restcountries.eu/rest/v2/alpha/ALB');
  const data = await res.json();
  return data.alpha2Code;
}

alpha2()
  .then((a) => console.log(a));
