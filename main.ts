import * as fs from "fs";
import { JSDOM } from "jsdom";
import {tocToIgnore} from './config';
import { connect } from "http2";
// Get file to do
const scrappedFileTodo: string[] = fs.readdirSync("./scrapped");

// Read file
console.log(`file: ${scrappedFileTodo[0]}`);
const fileData = fs.readFileSync("./scrapped/" + scrappedFileTodo[0], "utf8");


// Generate DOM & extract window document
const dom = new JSDOM(fileData);
const dwd = dom.window.document;

// Get title
// const title = dwd.querySelector(".page-header__title");
// console.log(title?.textContent)

// Get Note
// console.log("======")
// console.log("NOTE")
// console.log("======")
// const note = dwd.querySelector(".box");
// console.log(note?.textContent)
// console.log("======")

// Get TOC (table of content)
console.log("======")
console.log("TOC")
console.log("======")
const toc = dwd.querySelectorAll(".mw-headline");
toc.forEach((t)=>console.log(t.textContent))
console.log("======")

// Get Data from each toc
let tocResult = {};

for (let t of toc) {
  if (t.textContent && tocToIgnore.indexOf(t.textContent) === -1) {
console.log("======")
// console.log(t.textContent)
console.log("======")
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
        // console.log(nextElem.textContent)
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
  if(nextElem && nextElem.textContent){
    const text = getNextContent(nextElem.textContent, nextElem, "P");
    setTocResult(tocTitle, text);
  }
}

function getNextContent(content: string, nextElem: Element, typeToCheck: string){
  const next = nextElem.nextElementSibling;
  if(next && next.nodeName === typeToCheck && next.textContent){
    let content2 = `${content} \n ${next.textContent}`;
    let result = getNextContent(content2, next, typeToCheck);
    return result;
  }
  return content;
}


function setDL(tocTitle: string, nextElem: Element) {
  const subTitle = nextElem.firstChild?.firstChild?.firstChild?.textContent;
  setTocSubResult(tocTitle, subTitle,  nextElem.textContent);

  let next = nextElem.nextElementSibling;
  if(next?.nodeName==="DL") setDL(tocTitle, next)
}

function setTocResult(tocTitle: string, tocText: string | null | undefined) { // ???
  tocResult[tocTitle] = {
    textContent: tocText
  };
}

function setTocSubResult(tocTitle: string, subTitle:string | null | undefined, tocText: string | null) { // ???
  if(!tocResult[tocTitle]) tocResult[tocTitle]=[];
  tocResult[tocTitle].push({
    title: subTitle,
    textContent: tocText
  })
}