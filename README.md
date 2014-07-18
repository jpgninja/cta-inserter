#Insert a fake Call to Action via Bookmarklet

##Installation

###In terminal... 
- run *git clone git@github.com:jpgninja/cta-inserter.git*
- run *npm install*
- run *gulp install*
- do a find & replace to get rid of any *clientcoffee.com* hard-coded stuff

###Commands...
- *gulp dev* watches the js/css
- *gulp dist* compiles minified js/css

###Usage
- go to index.html, drag and drop the link to your bookmark bar
- land on the target website
- click *Insert CTA* bookmarklet
- now toggle the CTA script on and off with the toggle key: **`**
- when in insert mode (toggled on), hover divs until you find where you want to insert
- click. Applet will insert BEFORE wherever you clicked.
- Retry with the X, OK with the Checkmark
- If you want to bring back the context menu, click the CTA
- To remove refresh the page, or click "retry" in the context menu then toggle out of insert mode
- You can toggled out of insert mode with **ESC** and **`**

###Production...
- html/index.html
- html/cta.min.js
- html/styles/cta.css

## Please let me know if you ever do something with this code