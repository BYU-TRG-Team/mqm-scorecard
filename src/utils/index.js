import jwtDecode from 'jwt-decode';

function getCookie(name) {
  const cookieArr = document.cookie.split(';');

  for (let i = 0; i < cookieArr.length; ++i) {
    const cookiePair = cookieArr[i].split('=');

    if (name === cookiePair[0].trim()) {
      // Decode the cookie value and return
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}

export const getToken = () => {
  const token = getCookie('scorecard_authtoken');
  if (token) {
    return jwtDecode(token);
  }

  return '';
};

export const parseToken = (token) => jwtDecode(token);

export const copyToClipboard = (text) => {
  const input = document.createElement('textarea');
  input.innerHTML = text;
  document.body.appendChild(input);
  input.select();
  const result = document.execCommand('copy');
  document.body.removeChild(input);
  return result;
};
