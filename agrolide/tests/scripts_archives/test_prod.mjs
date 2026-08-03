import https from 'https';

https.get('https://agrolide.org/api/bibliotheque/download/7e92701c-017e-45cc-9649-1730fcbe4499', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = [];
  res.on('data', chunk => data.push(chunk));
  res.on('end', () => {
    const buffer = Buffer.concat(data);
    console.log('Received bytes:', buffer.length);
    if (res.statusCode !== 200) {
      console.log('Error Body:', buffer.toString());
    }
  });
}).on('error', (err) => {
  console.error('Request Error:', err.message);
});
