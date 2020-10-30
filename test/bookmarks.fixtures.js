function makeBookmarksArray() {
  return [
    {
      id: 1,
      'title': 'First test Bookmark',
      url: 'https://www.w3schools.com/whatis/',
      description: 'Every Web Developer must have a basic understanding of HTML, CSS, and JavaScript.',
      rating: 5
    },
    {
      id: 2,
      'title': 'Second test Bookmark',
      url: 'https://en.wikipedia.org/wiki/Web_development',
      description: 'Every Web Developer must have a basic understanding of HTML, CSS, and JavaScript.',
      rating: 5
    },
    {
      id: 3,
      'title': 'Third test Bookmark',
      url: 'https://careerfoundry.com/en/blog/web-development/what-does-it-take-to-become-a-web-developer-everything-you-need-to-know-before-getting-started/',
      description: 'Every Web Developer must have a basic understanding of HTML, CSS, and JavaScript.',
      rating: 5
    },
    {
      id: 4,
      'title': 'Fourth test Bookmark',
      url: 'https://developer.mozilla.org/en-US/docs/Learn',
      description: 'Every Web Developer must have a basic understanding of HTML, CSS, and JavaScript.',
      rating: 5
    },
  ];
}

function makeMaliciousBookmark() {
  const maliciousBookmark = {
    id: 911,
    style: 'How-to',
    date_published: new Date().toISOString(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  }
  const expectedBookmark = {
    ...maliciousBookmark,
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  }
  return {
    maliciousBookmark,
    expectedBookmark,
  }
}

module.exports = {
  makeBookmarksArray,
  makeMaliciousBookmark,
}