async function fetchScores() {
    try {
        const url = "http://localhost:3000/api/v1/score";
        const res = await fetch(url);
        return await res.json();
    } catch (error) {
        const scoreList = document.getElementById("scorelist");
        const loadDiv = document.getElementById("loading");
        scoreList.innerHTML = `
            <div class="fetch-err">
                <p>Error fetching score</p>
            </div>
        `;
        loadDiv.style.display = "none";
        return null;
    }
}

function formatDateTime(isoDate) {
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(new Date(isoDate));
}

function renderUi(data) {
    const scoreList = document.getElementById("scorelist");
    const loadDiv = document.getElementById("loading");
    scoreList.innerHTML = data.scores.map((s, i) => `
        <div class="score">
            <p class="score-position">${i + 1}.</p>
            <p>${s.name}</p>
            <p class="score-points">${s.value}pts</p>
            <p class="score-date">${formatDateTime(s.createdAt)}</p>
        </div>
    `).join('');
    loadDiv.style.display = "none";
}

const data = await fetchScores();
if (data) {
    renderUi(data);
}
