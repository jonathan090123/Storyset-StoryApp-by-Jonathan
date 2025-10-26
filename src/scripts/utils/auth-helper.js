const AUTH_KEY = 'story_app_token';

export function saveToken(token) {
    sessionStorage.setItem(AUTH_KEY, token);
}

export function getToken() {
    return sessionStorage.getItem(AUTH_KEY);
}

export function removeToken() {
    sessionStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated() {
    return !!getToken();
}