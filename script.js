const k = '6655aabe7b80496295c611ca9f41ca71'; 
const sb = document.getElementById('sb');
const q = document.getElementById('q');
const nc = document.getElementById('nc');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const sh = document.getElementById('sh');

let p = 1; 
let t = 'latest'; 

function saveHistory(q) {
    const h = JSON.parse(localStorage.getItem('h')) || [];
    if (!h.includes(q)) {
        h.push(q);
        localStorage.setItem('h', JSON.stringify(h));
        updateSh();
    }
}

function updateSh() {
    const h = JSON.parse(localStorage.getItem('h')) || [];
    sh.innerHTML = h.map(i => `<option value="${i}"></option>`).join('');
}

function createCard(a) {
    if (!a?.title || !a?.url || !a?.urlToImage) return null;

    const c = document.createElement('div');
    c.classList.add('na');

    const img = new Image();
    img.src = a.urlToImage;
    img.alt = a.title;
    img.onerror = () => {
        img.src = 'https://via.placeholder.com/300x150?text=No+Image';
    };

    const d = document.createElement('div');
    d.classList.add('c');
    d.innerHTML = `
        <h3>${a.title}</h3>
        <p>${a.description || 'No description available.'}</p>
    `;

    const l = document.createElement('a');
    l.href = a.url;
    l.target = '_blank';
    l.rel = 'noopener noreferrer';
    l.textContent = 'Read More';

    c.appendChild(img);
    c.appendChild(d);
    c.appendChild(l);

    return c;
}

async function fetchNews(t = 'latest', p = 1) {
    try {
        nc.innerHTML = '<div class="loading">Loading...</div>';
        const u = `https://newsapi.org/v2/everything?q=${encodeURIComponent(t)}&pageSize=10&page=${p}&apiKey=${k}`;
        const res = await fetch(u);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const d = await res.json();

        if (d.status === 'error') {
            throw new Error(d.message || 'API Error');
        }

        nc.innerHTML = '';

        if (!d.articles?.length) {
            nc.innerHTML = '<div class="error">No articles found.</div>';
            return;
        }

        d.articles
            .map(a => createCard(a))
            .filter(c => c !== null)
            .forEach(c => nc.appendChild(c));

        prev.disabled = p <= 1;
        next.disabled = !d.articles.length;
    } catch (err) {
        nc.innerHTML = `<div class="error">Error: ${err.message}</div>`;
        console.error('Error:', err);
    }
}

sb.addEventListener('click', () => {
    const v = q.value.trim();
    if (v) {
        t = v;
        p = 1;
        saveHistory(v);
        fetchNews(v, p);
    }
});

q.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const v = q.value.trim();
        if (v) {
            t = v;
            p = 1;
            saveHistory(v);
            fetchNews(v, p);
        }
    }
});

prev.addEventListener('click', () => {
    if (p > 1) {
        p--;
        fetchNews(t, p);
    }
});

next.addEventListener('click', () => {
    p++;
    fetchNews(t, p);
});

updateSh();
fetchNews();
