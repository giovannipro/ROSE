function load_hints(){

    const container = document.getElementById('hints');

    let output = '';

    output = `<div>
            <p>
                It looks like you are very fast in selecting the search engine results to click upon. However, the results page provides a lot of information that can be useful. You could take more time when searching and look at the URLs or short texts (snippets) on the page. Also keep in mind that the first results don't always have to be "the best".
            </p>
            <p>
                Take your time to carefully decide which links to click on. Scroll down the search engine results page to see results beyond the first few ones. Get an overview of the whole page. 
                <br/><br/>
                👍  👎
            </p>
            <p>
                &nbsp;
            </p>
        </div>

        <div>
            <p>
               It looks like you are only reading the short previews on the search page without clicking on the links to open the full web pages. However, there is much more information on the web pages than just what is in the preview. When you visit the websites, you can also check whether the information is trustworthy. Take a little time to choose the right links, then you won't have to read too much.
            </p>
            <p>
                When you get search results, take a moment to select and open the most important and interesting links. You can also use several tabs to save good documents and read them later.
                <br/><br/>
                👍  👎
            </p>
            <p>
                &nbsp;
            </p>
        </div>
    `

    container.innerHTML = output;

}

load_hints()