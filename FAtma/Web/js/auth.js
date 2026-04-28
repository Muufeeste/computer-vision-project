import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "./firebase.js";

export function setupAuth() {

  const userIcon = document.getElementById("userIcon");
  const userMenu = document.getElementById("userMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const goFavorites = document.getElementById("goFavorites");

  if (!userIcon) return;

  // click icon
  userIcon.addEventListener("click", async () => {

    if (!auth.currentUser) {
      try {
        await signInWithPopup(auth, provider);
        return;
      } catch (err) {
        console.error(err);
      }
    }

    userMenu.classList.toggle("hidden");
  });

  // go to favorites
  goFavorites.addEventListener("click", () => {
    window.location.href = "favorites.html";
  });

  // logout
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    location.reload();
  });

  // update user image
  onAuthStateChanged(auth, (user) => {
    if (user && user.photoURL) {
      userIcon.src = user.photoURL;
    }
  });

  // close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!userIcon.contains(e.target) && !userMenu.contains(e.target)) {
      userMenu.classList.add("hidden");
    }
  });
}