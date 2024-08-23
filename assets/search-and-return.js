var sjs = SimpleJekyllSearch({
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('results-container'),
    json: '/search.json',
    searchResultTemplate: 
        '<article>'+
        '<div><i class="fas fa-book fa-fw"></i><a href="{url}">{title}</a></div>'+
        '<div><i class="fas fa-clock fa-fw"></i><span>{date}</span></div>'+
        '<div><i class="fas fa-tag fa-fw"></i>{tags}</div>'+
        '<div style="display:inline-flex">' + 
            '<i class="fas fa-pencil-alt fa-fw" style="padding-top:5px"></i><a href="{url}"><span style="color:#343a40">{content}</span></a>' + 
        '</div>'+
        '</article>',
    noResultsText: '😴 검색 결과가 없습니다',
    templateMiddleware : function (prop, value, template) {
        if (prop === "url" || prop === 'date') {
          return value;
        }

        const searchTerm = document.getElementById("search-input").value;
        const regex = new RegExp(searchTerm, "gi");
        let highlightedValue;


        if (prop === 'tags') {

            const dest = window.location.origin;
            const theTags = value.split(', ').map(tag => tag.trim());

            spanValue = theTags.map(tag => `<span>${tag}</span>`).join(', ');
            highlightedValue = spanValue.replace(regex, '<b style="background:gold">$&</b>');

            highlightedLinkedValue = highlightedValue.split(',').map(tag => tag.trim())
                            .map((h, idx) => {
                                const c = h.replace(/<\/?span[^>]*>/g, '');
                                return `<a href="${dest}/tags/#${theTags[idx]}">${c}</a>`;
                            }).join(', ');

            return highlightedLinkedValue;
        }

        if (prop === 'title') {
            highlightedValue = value.replace(regex, '<span style="background:gold"><b>$&</b></span>')
            return highlightedValue;
        }

        // content
        value = value.replace(/\[.*?\]/g, '');
        const matches = value.match(regex);
        let matchCnt;
        if (matches) {
            const wordsArray = value.split(/\s+/);
            const matchIndex = wordsArray.findIndex(word => regex.test(word));
            const start = Math.max(0, matchIndex - 15); 
            const end = Math.min(wordsArray.length, matchIndex + 15 + 1); 
            const truncatedValue = wordsArray.slice(start, end).join(" ");

            highlightedValue = truncatedValue.replace(
                regex,
                '<span style="background:gold"><b>$&</b></span>'
            );
            matchCnt = matches.length

        } else {
            const words = value.split(/\s+/).slice(0, 30).join(" ");
            highlightedValue = `${words}...`;
            matchCnt = 0
        }
        highlightedValue += `<div style="padding-top:5px"><span id="match-counter">본문에 <b>${matchCnt}</b>번 언급되었습니다</span></div>`;
        return highlightedValue;
        
      }
});

// 뒤로가기 했을 때 비워지도록
window.addEventListener('pageshow', function() {
    document.getElementById('search-input').value = '';
  });