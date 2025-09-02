let words = JSON.parse(localStorage.getItem('greWords')) || {};

// Search for a word
function searchWord(word) {
    const entry = words[word.toLowerCase()];
    const resultDiv = document.getElementById('result');

    if (entry) {
        resultDiv.innerHTML = `
      <p>${getToneEmoji(entry.tone)} <strong>${word}</strong>: ${entry.meaning}</p>
      <p><b>Synonyms:</b> ${entry.synonyms.join(', ') || 'None'}</p>
      <p><b>Antonyms:</b> ${entry.antonyms.join(', ') || 'None'}</p>
    `;
    } else {
        resultDiv.innerHTML = `<p>❌ Word not found.</p>`;
    }
}

function getToneEmoji(tone) {
    if (tone === 'positive') return '🟢';
    if (tone === 'negative') return '🔴';
    return '🟡';
}

// Add a new word
function addWord() {
    const word = document.getElementById('word').value.trim().toLowerCase();
    const meaning = document.getElementById('meaning').value.trim();
    const synonyms = document.getElementById('synonyms').value.split(',').map(s => s.trim()).filter(s => s);
    const antonyms = document.getElementById('antonyms').value.split(',').map(s => s.trim()).filter(s => s);
    const tone = document.getElementById('tone').value;

    if (!word || !meaning) return alert('⚠ Please enter both word and meaning.');

    words[word] = { meaning, tone, synonyms, antonyms };
    localStorage.setItem('greWords', JSON.stringify(words));
    alert('✅ Word added successfully!');
    clearInputs();
}

function clearInputs() {
    document.getElementById('word').value = '';
    document.getElementById('meaning').value = '';
    document.getElementById('synonyms').value = '';
    document.getElementById('antonyms').value = '';
}

// Export words to a file
function exportWords() {
    const dataStr = JSON.stringify(words, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'gre_words_backup.json';
    a.click();
}

// Import words from a file
function importWords(file) {
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const imported = JSON.parse(e.target.result);
            words = { ...words, ...imported };
            localStorage.setItem('greWords', JSON.stringify(words));
            alert('✅ Words imported successfully!');
        } catch (err) {
            alert('❌ Invalid JSON file.');
        }
    };
    reader.readAsText(file);
}

// Event listeners
document.getElementById('search').addEventListener('input', e => {
    const word = e.target.value.trim();
    if (word) searchWord(word);
    else document.getElementById('result').innerHTML = '';
});

document.getElementById('addBtn').addEventListener('click', addWord);
document.getElementById('exportBtn').addEventListener('click', exportWords);
document.getElementById('importBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('importFile');
    if (fileInput.files.length > 0) {
        importWords(fileInput.files[0]);
    } else {
        alert('⚠ Please select a file first.');
    }
});
