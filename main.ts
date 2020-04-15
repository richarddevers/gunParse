import * as fs from "fs";

// Get file to do
const scrappedFileTodo: string[] = fs.readdirSync("./scrapped");

// Read file
console.log(`file: ${scrappedFileTodo[0]}`);
const fileData = fs.readFileSync("./scrapped/" + scrappedFileTodo[0], "utf8");

//////////////////////////////
// import { parse } from 'fast-html-parser';
// Use DOM parser
// const rootDom = parse(fileData)

// // get title
// const title =  rootDom.querySelector('.page-header__title').text;
// console.log(`title: ${title}`)

// // get table of content part
// const toc1 = rootDom.querySelectorAll('.mw-headline');
// console.log(toc1[0])
// toc1.forEach((x)=>console.log(x.text))
//////////////////////////////

//////////////////////////////
// import { createParser } from 'htmljs-parser';
// let toto = createParser(fileData)
// console.log(toto.onText)
//////////////////////////////

import { JSDOM } from "jsdom";

// Generate DOM & extract window document
const dom = new JSDOM(fileData);
const dwd = dom.window.document;

// Get title
const title = dwd.querySelector(".page-header__title");
// console.log(title?.textContent)

// Get Note
// const note = dwd.querySelector(".box");
// console.log(note?.textContent)
// console.log(note?.innerHTML)

// Get TOC (table of content)
const toc = dwd.querySelectorAll(".mw-headline");

// For each element of table of content, get text & inner html
// console.log(toc[0])
// console.log(toc[0].parentElement)
// console.log(toc[0].parentElement?.nextElementSibling?.textContent)
// console.log(toc[0].parentElement?.nextElementSibling?.innerHTML)
// console.log(toc[0].parentElement?.nextElementSibling?.outerHTML)
////////////////////
let tocResult = {};

for (let t of toc) {
  if (t.textContent) {
    const nextElem = t.parentElement?.nextElementSibling;
    if (nextElem) {
        nextElemProxy(t.textContent, nextElem);
    }
  }
}

console.log("Result")
console.log(JSON.stringify(tocResult))

function nextElemProxy(tocTitle:string, nextElem: Element){
    if (nextElem.nodeName === "P") {
        console.log("P not implemented yet")
        // setP(tocTitle, nextElem);
      } else if (nextElem.nodeName === "DL") {
          console.log("DL not implemented yet")
        // setDL(tocTitle, nextElem);
      } else if (nextElem.nodeName === "H3") {
          console.log(`${tocTitle} H3 not implemented yet`)
      } else if (nextElem.nodeName === "DIV") {
          console.log("DIV not implemented yet")
      } else if (nextElem.nodeName === "UL") {
          console.log("UL not implemented yet")
      }
}

function setP(tocTitle: string, nextElem: Element) {
  setTocResult(tocTitle, nextElem.textContent, nextElem.innerHTML);
}

function setDL(tocTitle: string, nextElem: Element) {
  const subTitle = nextElem.firstChild?.firstChild?.firstChild?.textContent;
  setTocSubResult(tocTitle, subTitle,  nextElem.textContent, nextElem.innerHTML);

  let next = nextElem.nextElementSibling;
  if(next?.nodeName==="DL") setDL(tocTitle, next)
}

function setTocResult(tocTitle: string, tocText: string | null, TocInnerHTML: string) { // ???
  tocResult[tocTitle] = {
    textContent: tocText,
    innerHTML: TocInnerHTML,
  };
}

function setTocSubResult(tocTitle: string, subTitle:string | null | undefined, tocText: string | null, TocInnerHTML: string) { // ???
  if(!tocResult[tocTitle]) tocResult[tocTitle]=[];
  tocResult[tocTitle].push({
    subTitle: subTitle,
    textContent: tocText,
    innerHTML: TocInnerHTML,
  })
}