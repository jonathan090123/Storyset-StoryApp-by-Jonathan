import CONFIG from '../config';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  STORIES_WITH_LOCATION: `${CONFIG.BASE_URL}/stories?location=1`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
};

export async function registerUser({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
  return await response.json();
}

export async function loginUser({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return await response.json();
}

export async function getStories(token) {
  const response = await fetch(ENDPOINTS.STORIES, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
}

export async function getStoriesWithLocation(token) {
  const response = await fetch(ENDPOINTS.STORIES_WITH_LOCATION, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
}

export async function addStory(token, formData) {
  const response = await fetch(ENDPOINTS.ADD_STORY, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  return await response.json();
}