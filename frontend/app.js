document.getElementById('registrationForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const dob = document.getElementById('dob').value;

  const response = await fetch('https://birthday-wisher.hostless.app/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, dob }),
  });

  const result = await response.json();
  document.getElementById('message').innerText = result.message;
});
