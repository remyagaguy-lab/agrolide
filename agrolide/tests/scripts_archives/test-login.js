async function testLogin() {
  const res = await fetch("http://localhost:3000/api/auth/csrf");
  const data = await res.json();
  const csrfToken = data.csrfToken;
  const cookies = res.headers.get("set-cookie") || "";
  
  console.log("CSRF Token:", csrfToken);

  const loginRes = await fetch("http://localhost:3000/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": cookies
    },
    body: `csrfToken=${encodeURIComponent(csrfToken)}&email=remyagaguy%40gmail.com&password=test`
  });
  
  const text = await loginRes.text();
  console.log("Response Status:", loginRes.status);
  console.log("Response URL:", loginRes.url);
}
testLogin();
