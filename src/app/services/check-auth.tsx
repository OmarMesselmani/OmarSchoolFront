import Cookies from 'js-cookie';
const checkAuth = async () => {
  try {
    const token = Cookies.get('token');
    const response = await fetch('http://127.0.0.1:8000/parent/authenticated', {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok && data.logged_in) {
      return {
        status: true,
      };
    } else {
      Cookies.remove('token');
      return {
        status: false,
      };
    }
  } catch (error) {
    Cookies.remove('token');
    return {
      status: false,
    };
  }
};

export default checkAuth;