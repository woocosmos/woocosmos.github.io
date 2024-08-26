async function loadTags() {
    try {
        const response = await fetch('keywords.json'); // Fetch the JSON file
        const data = await response.json(); // Parse the JSON data

        const tagList = document.getElementById('tag-list'); // Get the <ul> element

        tagList.innerHTML = '';
        const paragraph = document.createElement('span');
        const icon = document.createElement('i');
        icon.className = 'fa fa-circle-info'; // Set the classes for the icon

        paragraph.textContent = '이런 키워드는 어때요? ';
        paragraph.appendChild(icon);
        tagList.parentNode.insertBefore(paragraph, tagList);

        data.forEach(obj => {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.textContent = obj[0];
            
            span.addEventListener('click', function(event) {
                const searchInput = document.getElementById('search-input');
                searchInput.value = obj[0];

                // trigger
                const e = new Event('input', { bubbles: true });
                searchInput.dispatchEvent(e);
            });
            

            li.appendChild(span);
            tagList.appendChild(li);
        });

    } catch (error) {
        console.error('Error loading the tags:', error);
    }
}

// Load the tags when the page is loaded
window.onload = loadTags;