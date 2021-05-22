const http = require('http');
const { URL } = require('url');

const countries = require('./countries.json');
const PORT = 3123;
const BASE_URL = `localhost:${PORT}` ;

const randomizeDalay = (start, end) => start + (end - start) * Math.random();

const createRequestDelay = (delay) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  });
};

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

  // When testing in browser, it tries to request a favicon
  if (req.url.includes('favicon.ico')) {
    return res.end(JSON.stringify([]));
  }

  console.log('****** REQUEST STARTED ******');
  const { searchParams } = new URL(`${BASE_URL}${req.url}`, BASE_URL);
  const query = searchParams.get('query');
  const limit = searchParams.get('limit') || 20;
  const requestDelay = randomizeDalay(200, 1000);

  console.log(`Query: ${query}`);
  console.log(`Request delay: ${Math.round(requestDelay)}ms`);

  const lowercasedQuery = query.toLowerCase();
  const foundCountries = countries
    .filter(country => country.text.toLowerCase().includes(lowercasedQuery))
    .slice(0, limit);

  await createRequestDelay(requestDelay);

  res.end(JSON.stringify(foundCountries));
});

server.listen(PORT);

console.log(`Server is listening on port: ${PORT}`);


