/**
 * Project 2: Feedr
 * ====
 *
 * See the README.md for instructions
 */
(function() {

function createArticle(img,title,channel,impressions,content,link){ //function to create an article object to be later appended
	var s = '<article class="article"><section class="featured-image"><img src="'+img+'" alt="" /></section><section class="article-content"><a href="#"><h3>'+title+'</h3></a><h6>'+channel+'</h6></section><section class="impressions">'+impressions+'</section><div class="clearfix"></div></article>';
	var wrapper= document.createElement('div');
	wrapper.innerHTML= s; //puts html code into temporary element to be later returned as a DOM element

	wrapper.firstChild.addEventListener("click",function(){popup(title,content,link)}) //binds an onclick event onto the article, shows popup
	return wrapper.firstChild //returns the dom element
}

function popup(title, content, link){ //changes the values of the popup
  var popupObject = document.querySelector(".content-pop-up");
  var titleObject = popupObject.querySelector(".wrapper h1");
  var contentObject = popupObject.querySelector(".wrapper p");
  var linkObject = popupObject.querySelector(".wrapper a");

  popupObject.style.display = "block";
  titleObject.innerHTML = title;
  contentObject.innerHTML = content;
  linkObject.href = link;
}

function hidePopup(){ //hides popup
  var popupObject = document.getElementById("pop-up");
  popupObject.style.display = "none";
}

function showLoading(){
	document.querySelector(".loader").style.display = "block";
}

function hideLoading(){
	document.querySelector(".loader").style.display = "none";
}

function fetchData(source, link){
	showLoading();//shows the loading...

	var xhttp = new XMLHttpRequest(); //creates new http request object where we can return api data
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) { //waits for it to load
			hideLoading(); //hides the loading once its loaded

			j = JSON.parse(xhttp.responseText); //parses the text as json

			switch(source){
				case "Mashable": //if the source is mashable...
					document.getElementById("main").innerHTML = "";//clear article list

					for (var post in j.hot){
						var img = j.hot[post].image;
						var title = j.hot[post].title;
						var channel = j.hot[post].channel;
						var impressions = j.hot[post].shares.total;
						var content = j.hot[post].content.plain;
						var link2 = j.hot[post].link;
						//assign the variables to the data retrieved from the json object
						var main = document.getElementById("main");

						var a = createArticle(img,title,channel,impressions,content,link2); //create article object with the variables retrieved
						main.appendChild(a);//append the article to the article list
					}

					break
				case "Reddit": 
					document.getElementById("main").innerHTML = ""
					var posts = j.data.children;

					for (i in posts){
						var img = (posts[i].data.thumbnail != "self" && posts[i].data.thumbnail != "nsfw" && posts[i].data.thumbnail != "") ? posts[i].data.thumbnail : "images/placeholder.jpg";
						var title = posts[i].data.title;
						var channel = posts[i].data.subreddit;
						var impressions = posts[i].data.score;
						var content = posts[i].data.selftext;
						var link2 = "http://reddit.com"+posts[i].data.permalink;

						var main = document.getElementById("main");

						var a = createArticle(img,title,channel,impressions,content,link2);
						main.appendChild(a);
					}
					break
			}
    }
	}
	xhttp.open("GET", "https://crossorigin.me/"+link, true);//loads the link through cors proxy
	xhttp.send();
}
//----------------------------------------------------------------------------------------------------------------------------------------
var source;

var sourcename = document.querySelector("nav ul li span");
var sourcechoices = document.querySelector("nav ul ul");
var sourcechoice = sourcechoices.querySelectorAll("li a");

var links = {"Mashable": "http://mashable.com/stories.json", "Reddit": "http://www.reddit.com/hot.json"};
var link;

source = sourcechoice[0].innerHTML;
sourcename.innerHTML = source;

link = links[source];

fetchData(source, link); //load the first link (mashable)

for (var x = 0; x<sourcechoice.length; x++) { //dropdown menu
	sc = sourcechoice[x];
	console.log(sc);
	sc.addEventListener("click",function(){
		source = this.innerHTML;
		sourcename.innerHTML = source;

		link = links[source];
		fetchData(source, link);
	})
}

document.querySelector("header .wrapper>a").onclick=function(){fetchData("Mashable",links["Mashable"])}//feedr logo

document.querySelector(".close-pop-up").onclick=function(){ //close popup button
  document.querySelector(".content-pop-up").style.display = "none";
}
})()
