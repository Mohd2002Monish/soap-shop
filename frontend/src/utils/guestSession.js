// Guest session ID management
const GUEST_ID_KEY = "soap-shop-guest-id";

export const getOrCreateGuestId = () => {
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  if (!guestId) {
    guestId = "GUEST-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  return guestId;
};

export const getGuestId = () => localStorage.getItem(GUEST_ID_KEY);

export const clearGuestId = () => localStorage.removeItem(GUEST_ID_KEY);
