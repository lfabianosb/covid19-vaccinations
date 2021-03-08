const arr = [1, 2, 3, 4];
const iso = ['ALB', 'FRA', 'BRA'];
const fetch = require('node-fetch');

const doSomething = async (item) => {
  await new Promise(resolve => {
    setTimeout(resolve, item * 500);
  })
};

const fetchAlpha2Code = async(isoCode) => {
  const res = await fetch(`https://restcountries.eu/rest/v2/alpha/${isoCode}`);
  const data = await res.json();
  return data.alpha2Code;
}

const start1 = () => {
  arr.forEach(async(item) => {
    await doSomething(item);
    console.log(`x=${item}`);
  });
  console.log('start1');
};

const start2 = async () => {
  for(let x of arr) {
    await doSomething(x);
    console.log(`x=${x}`);
  }
  console.log('start2');
};

const start3 = async () => {
  for(let x = 1; x <= arr.length; x++) {
    await doSomething(x);
    console.log(`x=${x}`);
  }
  console.log('start3');
};

const fetch2 = async () => {
  for(let x of iso) {
    const alpha2Code = await fetchAlpha2Code(x);
    console.log(`alpha2Code=${alpha2Code}`);
  }
  console.log('fetch2');
};

// start1();

// (async () => {
//   await start2();
// })();
// start2();

// start3();

fetch2();

console.log('fim');
