var sjs = SimpleJekyllSearch({
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('results-container'),
    json: '/search.json',
    searchResultTemplate: '<article><h2><a href="{url}">{title}</a></h2><div><span>{date}</span></div><div><span>{tags}</span></div><div><span>{content}</span></div></article>',
});

// 뒤로가기 했을 때 비워지도록
window.addEventListener('pageshow', function() {
    document.getElementById('search-input').value = '';
  });



