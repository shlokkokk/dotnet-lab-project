const API_BASE = 'http://localhost:5000/api';
const REG_KEY = 'msu_dotnet_regdb';
const FD_KEY = 'msu_dotnet_fdtable';
const LOGS_KEY = 'msu_dotnet_adologs';
const ELECTIVES_KEY = 'msu_dotnet_electives';
const PHOTOS_KEY = 'msu_dotnet_photos';

const initialUsers = [
  {
    id: 1,
    name: 'Shlok Shah',
    address: 'Vadodara, Gujarat',
    birthdate: '2008-12-04',
    gender: 'Male',
    hobbies: 'Coding, Technology',
    age: '17',
    username: 'shlok',
    password: 'Admin@412',
    confirmpassword: 'Admin@412',
    email: 'shlokshah412@gmail.com',
    usertype: 'Admin',
    mobile: '9512345504',
    createdAt: new Date().toISOString()
  }
];

const initialFeedback = [];

export const checkServerHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
};

export const fetchUsers = async () => {
  try {
    const res = await fetch(`${API_BASE}/users`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(REG_KEY, JSON.stringify(data));
      return data;
    }
  } catch (e) {}
  const local = localStorage.getItem(REG_KEY);
  return local ? JSON.parse(local) : initialUsers;
};

export const getStoredUsers = () => {
  try {
    const data = localStorage.getItem(REG_KEY);
    return data ? JSON.parse(data) : initialUsers;
  } catch (e) {
    return initialUsers;
  }
};

export const saveUsers = (users) => {
  localStorage.setItem(REG_KEY, JSON.stringify(users));
};

export const registerUserApi = async (user) => {
  try {
    const res = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
};

export const loginUserApi = async (username, password, usertype) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, usertype }),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
};

export const deleteUserApi = async (id) => {
  try {
    await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE', signal: AbortSignal.timeout(2000) });
  } catch (e) {}
};

export const fetchFeedback = async () => {
  try {
    const res = await fetch(`${API_BASE}/feedback`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(FD_KEY, JSON.stringify(data));
      return data;
    }
  } catch (e) {}
  const local = localStorage.getItem(FD_KEY);
  return local ? JSON.parse(local) : initialFeedback;
};

export const getStoredFeedback = () => {
  try {
    const data = localStorage.getItem(FD_KEY);
    return data ? JSON.parse(data) : initialFeedback;
  } catch (e) {
    return initialFeedback;
  }
};

export const saveFeedback = (items) => {
  localStorage.setItem(FD_KEY, JSON.stringify(items));
};

export const submitFeedbackApi = async (name, feedback, rating) => {
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, feedback, rating }),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
};

export const fetchStudentElectives = async (username) => {
  try {
    const res = await fetch(`${API_BASE}/electives/${username}`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        localStorage.setItem(`${ELECTIVES_KEY}_${username}`, JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {}
  return getStudentElectives(username);
};

export const getStudentElectives = (username) => {
  try {
    const data = localStorage.getItem(`${ELECTIVES_KEY}_${username}`);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveStudentElectives = async (username, electives) => {
  localStorage.setItem(`${ELECTIVES_KEY}_${username}`, JSON.stringify(electives));
  try {
    await fetch(`${API_BASE}/electives/${username}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(electives),
      signal: AbortSignal.timeout(2000)
    });
  } catch (e) {}
};

export const getStudentPhoto = (username) => {
  try {
    return localStorage.getItem(`${PHOTOS_KEY}_${username}`) || null;
  } catch (e) {
    return null;
  }
};

export const saveStudentPhoto = (username, dataUrl) => {
  localStorage.setItem(`${PHOTOS_KEY}_${username}`, dataUrl);
};

export const getAdoLogs = () => {
  try {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const logAdoOperation = (op) => {
  const current = getAdoLogs();
  const entry = {
    id: Date.now(),
    timestamp: new Date().toLocaleTimeString(),
    ...op
  };
  const updated = [entry, ...current].slice(0, 50);
  localStorage.setItem(LOGS_KEY, JSON.stringify(updated));
  return entry;
};

export const clearAdoLogs = () => {
  localStorage.removeItem(LOGS_KEY);
};
