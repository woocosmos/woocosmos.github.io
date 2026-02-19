document.addEventListener('DOMContentLoaded', () => {
  const Hs = document.querySelectorAll('.nav-toc ul.section-nav li.toc-entry.toc-h1, .nav-toc ul.section-nav li.toc-entry.toc-h2, .nav-toc ul.section-nav li.toc-entry.toc-h3');
  const links = Array.from(Hs).map(h => {
    return h.querySelector('a')
  })
  const anchors = Array.from(links).map(link => {
    const href = link.getAttribute('href');
    if (href) {
      return document.querySelector(href);
    }
    return null;
  }).filter(anchor => anchor !== null);

  window.addEventListener('scroll', () => {
    // const currentHash = window.location.hash;

    if (anchors.length > 0 && links.length > 0) {
      let scrollTop = window.scrollY;
      let activeIndex = -1;

      anchors.forEach((anchor, i) => {
        if (scrollTop >= anchor.offsetTop - 300) {
          activeIndex = i; 
        }
      });

      links.forEach((link) => {
        link.classList.remove('active');
      });

      if (activeIndex >= 0) {
        links[activeIndex].classList.add('active');
      }
    }
  });
});