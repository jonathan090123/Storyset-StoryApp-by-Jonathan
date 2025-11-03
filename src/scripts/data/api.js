import CONFIG from '../config';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  STORIES_WITH_LOCATION: `${CONFIG.BASE_URL}/stories?location=1`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
};

// Optional endpoints for push subscription management on server (if provided by backend)
ENDPOINTS.PUSH_SUBSCRIBE = `${CONFIG.BASE_URL}/subscribe`;
ENDPOINTS.PUSH_UNSUBSCRIBE = `${CONFIG.BASE_URL}/unsubscribe`;

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

export async function sendPushSubscription(subscription, token) {
  const response = await fetch(ENDPOINTS.PUSH_SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(subscription),
  });
  return await response.json();
}

export async function removePushSubscription(endpointUrl, token) {
  // If your backend expects to remove subscription by endpoint or id, pass it as JSON body
  const response = await fetch(ENDPOINTS.PUSH_UNSUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ endpoint: endpointUrl }),
  });
  return await response.json();
}