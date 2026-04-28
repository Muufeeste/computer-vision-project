// utils.js
// Central constants and small helpers

export const API_KEY = "YOUR_API_KEY"; // set your TMDB key here
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const NO_IMAGE = "https://via.placeholder.com/500x750?text=No+Image";

export function navigateToDetails(id) {
	if (!id) return;
	window.location.href = `details.html?id=${id}`;
}

export function createMovieCard(movie) {
	const id = movie.id;
	const title = movie.title || movie.name || 'Untitled';
	const rating = (movie.vote_average ?? movie.rating ?? '-');
	const posterPath = movie.poster || movie.poster_path || null;
	const poster = posterPath ? (posterPath.startsWith('http') ? posterPath : `${IMAGE_BASE}${posterPath}`) : NO_IMAGE;

	const card = document.createElement('div');
	card.className = 'group relative bg-surface-container-low rounded-xl overflow-hidden hover:scale-105 transition-all duration-500 cursor-pointer shadow-2xl';
	card.dataset.movieId = id ?? '';

	const aspect = document.createElement('div');
	aspect.className = 'aspect-[2/3] relative overflow-hidden';

	const img = document.createElement('img');
	img.className = 'w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700';
	img.src = poster;
	img.alt = `${title} poster`;

	const badge = document.createElement('div');
	badge.className = 'absolute top-4 right-4 bg-primary text-on-primary text-xs font-black px-2 py-1 rounded-md';
	badge.textContent = rating !== '-' ? String(rating) : '--';

	aspect.appendChild(img);
	aspect.appendChild(badge);

	const body = document.createElement('div');
	body.className = 'p-6';
	const h3 = document.createElement('h3');
	h3.className = 'text-xl font-bold mb-1 text-on-surface font-headline';
	h3.textContent = title;
	body.appendChild(h3);

	card.appendChild(aspect);
	card.appendChild(body);

	card.addEventListener('click', (e) => {
		if (e.target.closest('button')) return; // allow button clicks inside card
		if (id) navigateToDetails(id);
	});

	return card;
}
