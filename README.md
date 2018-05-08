# article-scrape-hw

## [Kotaku Scraper](https://kotaku-scrape.herokuapp.com)
This application uses the following npm packages
  * express
  * express-handlebars
  * mongoose
  * body-parser
  * cheerio
  * request
 
 This application scrapes the following from [Kotaku](https://kotaku.com)'s main website:
   * Title
   * Summary of article
   * URL to the oriinal article

A user can do the following with this app: 
  * Access homepage, all articles, and favorited articles from the nav bar.
  * From the homepage: 
    * scrape the most recent articles 
  * From "All Articles" page:
    * view the titles all of the articles in the database, along with their summaries.
    *  Add a specific article to the "Favorites" section 
  * From "Favorited Articles" page: 
    * view all favorited articles
    * remove an article from the favorited list
  * From "Comments" pages:
    * View all comments associated to that article
    *  Add a new comment 


Ideas for future development:
  * Show a message when theres no articles or comments on a page, but hides when there is content
  *  make it pretty 
