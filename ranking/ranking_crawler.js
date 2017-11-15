const request = require('request');
const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const fs = require('fs');

const baseURL = "http://www.politicos.org.br/";

class RankingCrawler{
	constructor(){

	}

	scrap(type){
		Nightmare({show:true})
			.goto(baseURL)
			.evaluate((type) => {

				let selection = document.getElementById("Position");
				let event = new Event('change');
				
				let data_by_years = {};
				let years = document.getElementById("Year");

				selection.options.selectedIndex = type;
				selection.dispatchEvent(event);
				// return document.getElementById("parlamentarians").children[0].children.innerHTML;
				// let paginator = document.querySelector("#parlamentarians > div > div.text-center > ul").lastElementChild.lastChild;
				// let n_pages = parseInt(paginator.getAttribute("data-page"));

				// for (let y = 1; y < years.length; y++){
				// 	let year = parseInt(years[y].value);
					
				// 	data_by_years[year] = [];
										
				// 	while(n_pages >= 0){
				// 		let grid = document.getElementById("grid-ranking");
				// 		let children = grid.children;

				// 		for(let i = 0; i < children.length; i += 3){
				// 			let infos = children[i].children[0].children[0];

				// 			let presenca_ = parseInt(children[i].children[1].lastChild);
				// 			let privilegios_ = parseInt(children[i].children[2].lastChild);
				// 			let processos_ = parseInt(children[i].children[3].lastChild);
				// 			let outros_ = parseInt(children[i].children[4].lastChild);
				// 			let qualidade_ = parseInt(children[i].children[5].lastChild);
							
				// 			let congress_person = {photo:infos.children[1].lastChild.lastChild.getAttribute("src"),
				// 									name:infos.children[2].children[0].innerHTML,
				// 									congress:infos.children[2].children[1].innerHTML.split("-")[0].trim(),
				// 									party:infos.children[2].children[1].innerHTML.split("-")[1].trim(),
				// 									uf:infos.children[2].children[1].innerHTML.split("-")[2].trim()
				// 									presenca:presenca_, privilegios: privilegios_, processos: processos_,
				// 									outros: outros_, qualidade: qualidade_
				// 									};

				// 			data_by_years[year].push(congress_person);

				// 		}

				// 		n_pages--;
					// }
				// }
				// return data_by_years;

			},type)
			// .end()
			.then((data_by_years) => {console.log(data_by_years)});
	}
}

// senate = 2
// chamber = 1 
var scrape = new RankingCrawler();
scrape.scrap(1);