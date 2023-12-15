// elements
$(document).ready(function(){
    $("#sidebar").load("../elements/sidebar.html"); 
    $("#footer").load("../elements/footer.html");
    $("#photo-grid").load("../elements/photogrid.html");
});

// articles stuff
// const articles = ['2023.08.18-1', '2023.08.18-2', '2023.08.18-3', '2023.08.18-4', '2023.09.27', '2023.10.17'];

function loadArticles() {
    articles.sort((a, b) => {
        const dateA = new Date(a.split('-').slice(0, 3).join('-'));
        const dateB = new Date(b.split('-').slice(0, 3).join('-'));
        return dateB - dateA;
    });

    articles.forEach(articleName => {
        fetch('/articles/' + articleName + '.html')
            .then(response => response.text())
            .then(data => {
                const articleDiv = document.createElement('div');
                articleDiv.innerHTML = data;
                articleDiv.id = articleName;
                articleDiv.classList.add('article');

                document.getElementById('article-container').appendChild(articleDiv);

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;
                const articleTitle = tempDiv.querySelector('h1').innerText;

                const articleLink = document.createElement('a');
                articleLink.href = '#' + articleName;
                articleLink.innerText = articleTitle;

                const linkSpan = document.createElement('span');
                linkSpan.appendChild(articleLink);

                document.getElementById('articles-sidebar').appendChild(linkSpan);

                const linkDiv = document.createElement('div');
                linkDiv.appendChild(articleLink);

                document.getElementById('articles-sidebar').appendChild(linkDiv);
            });
    });
}

document.body.onload = loadArticles;