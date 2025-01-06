const k = 'FngMjYtCrvAgEUtKixX1Lo1Ef2PVVaSNw0S5VPhNTzLeI5Qp'; 
const sb = document.getElementById('sb');
const q = document.getElementById('q');
const nc = document.getElementById('nc');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const sh = document.getElementById('sh');
let p = 1;
let t = 'latest'; 
function saveHistory(query) {
    const history = JSON.parse(localStorage.getItem('h')) || [];
    if (!history.includes(query)) {
        history.push(query);
        localStorage.setItem('h', JSON.stringify(history));
        updateSearchHistory();
    }
}
function updateSearchHistory() {
    const history = JSON.parse(localStorage.getItem('h')) || [];
    sh.innerHTML = history.map(item => `<option value="${item}"></option>`).join('');
}
function createCard(article) {
    if (!article?.title || !article?.url || !article?.image) return null;

    const card = document.createElement('div');
    card.classList.add('na');

    const img = new Image();
    img.src = article.image;
    img.alt = article.title;
    img.onerror = () => {
        card.remove();
    };

    const content = document.createElement('div');
    content.classList.add('c');
    content.innerHTML = `
        <h3>${article.title}</h3>
        <p>${article.description || 'No description available.'}</p>
    `;

    const link = document.createElement('a');
    link.href = article.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Read More';

    card.appendChild(img);
    card.appendChild(content);
    card.appendChild(link);

    return card;
}
async function fetchNews(query = 'latest', page = 1) {
    try {
        nc.innerHTML = '<div class="loading">Loading...</div>';
        const url = `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(query)}&page_number=${page}&apiKey=${k}`;
        
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'error') {
            throw new Error(data.message || 'API Error');
        }

        nc.innerHTML = '';

        if (!data.news?.length) {
            nc.innerHTML = '<div class="error">No articles found.</div>';
            return;
        }

        data.news
            .map(article => createCard(article))
            .filter(card => card !== null)
            .forEach(card => nc.appendChild(card));

        prev.disabled = page <= 1;
        next.disabled = !data.news.length;
    } catch (error) {
        nc.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        console.error('Error fetching news:', error);
    }
}
sb.addEventListener('click', () => {
    const value = q.value.trim();
    if (value) {
        t = value;
        p = 1;
        saveHistory(value);
        fetchNews(value, p);
    }
});

q.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const value = q.value.trim();
        if (value) {
            t = value;
            p = 1;
            saveHistory(value);
            fetchNews(value, p);
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
updateSearchHistory();
fetchNews();
