async function loadTags() {
    try {
        const response = await fetch('keywords.json'); // Fetch the JSON file
        const data = await response.json(); // Parse the JSON data
        const tagList = document.getElementById('tag-list'); // Get the <ul> element

        tagList.innerHTML = '';
        const paragraph = document.createElement('span');
        paragraph.textContent = '이런 키워드는 어때요? ';
        // paragraph.style.fontWeight = 'bold';

        const svgIcon = document.createElement('span')
        svgIcon.innerHTML = `
            <svg width="25" height="25" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" color="#B5B5B5"><g id="Icon/System/Outlined/icon_circle_question"><path id="Icon" d="M6.54167 6.33482C6.65913 6.00091 6.89098 5.71934 7.19616 5.53998C7.50133 5.36063 7.86013 5.29507 8.20901 5.35491C8.55789 5.41475 8.87434 5.59614 9.1023 5.86694C9.33026 6.13774 9.45502 6.48048 9.45449 6.83445C9.45449 7.83371 7.95561 8.33333 7.95561 8.33333M7.97396 10.3333H7.98063M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`;
        paragraph.appendChild(svgIcon);

        const totalAvg = data[0]

        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = `TF-IDF 점수를 기반으로 상위 5개 키워드를 추천합니다\n현재 블로그의 전체 평균 TF-IDF는 ${totalAvg[1]}점입니다\n추천 키워드에 마우스를 올려 점수를 비교해보세요`; // Tooltip text
        tooltip.style.whiteSpace = 'pre';
        document.body.appendChild(tooltip);

        // Function to display the tooltip
        function showTooltip(event) {
            tooltip.style.display = 'block';
            
            // For mobile (touch) events
            if (event.touches) {
                tooltip.style.left = `${event.touches[0].pageX - tooltip.offsetWidth - 10}px`;
                tooltip.style.top = `${event.touches[0].pageY}px`;
            } else { // For desktop (mouse) events
                tooltip.style.left = `${event.pageX - tooltip.offsetWidth - 10}px`;
                tooltip.style.top = `${event.pageY}px`;
            }
        }

        // Function to hide the tooltip
        function hideTooltip() {
            tooltip.style.display = 'none';
        }

        // Show tooltip on mouse enter or touch start
        svgIcon.addEventListener('mouseenter', showTooltip);
        svgIcon.addEventListener('touchstart', (event) => {
            event.preventDefault();  // Prevent default touch behavior
            showTooltip(event);
        }, { passive: true });

        // Move tooltip with mouse or touch move
        svgIcon.addEventListener('mousemove', showTooltip);
        svgIcon.addEventListener('touchmove', (event) => {
            event.preventDefault();  // Prevent default touch behavior
            showTooltip(event);
        }, { passive: true });

        // Hide tooltip on mouse leave or touch end
        svgIcon.addEventListener('mouseleave', hideTooltip);
        svgIcon.addEventListener('touchend', hideTooltip);

        tagList.parentNode.insertBefore(paragraph, tagList);

        data.slice(1).forEach((obj, rnk) => {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.textContent = obj[0];

            const tip = document.createElement('div');
            tip.className = 'tooltip';
            tip.textContent = `${rnk+1}위(${obj[1]}점)`;
            document.body.appendChild(tip);

            span.addEventListener('mouseenter', (event) => {
                tip.style.display = 'block';
                tip.style.left = `${event.pageX + 10}px`;
                tip.style.top = `${event.pageY + 10}px`;
            });

            // Move tooltip with mouse
            span.addEventListener('mousemove', (event) => {
                tip.style.left = `${event.pageX + 10}px`;
                tip.style.top = `${event.pageY + 10}px`;
            });

            // Hide tooltip on mouse leave
            span.addEventListener('mouseleave', () => {
                tip.style.display = 'none';
            });
            
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