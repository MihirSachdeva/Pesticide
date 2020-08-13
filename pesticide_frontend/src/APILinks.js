export const API_ROOT = 'http://127.0.0.1:8000/api/';
export const REST_AUTH_LOGIN = 'http://127.0.0.1:8000/rest-auth/login/';
export const OMNIPORT_OAUTH = 'https://internet.channeli.in/oauth/authorise/?client_id=gKUvZEAlIemSbCql1JzDkR2ClVBY6MjGehIyqeeY&redirect_url=http://localhost:3000/onlogin/&state=foobarbaz42';
export const RICKROLLED = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
export const WEBSOCKET_ROOT = 'ws://127.0.0.1:8000/ws/';
export const UPDATE_PROJECT_MEMBERS = id => `${API_ROOT}projects/${id}/update-project-members/`;
export const UPDATE_PROJECT_STATUS = id => `${API_ROOT}projects/${id}/update-project-status/`;
export const UPDATE_ISSUE_STATUS = id => `${API_ROOT}issues/${id}/update-issue-status/`;
export const ASSIGN_ISSUE = id => `${API_ROOT}issues/${id}/issue-assign/`;