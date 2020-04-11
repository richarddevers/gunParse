import * as fs from "fs";
import { parse } from 'fast-html-parser';

// Get file to do
const scrappedFileTodo:string[]=fs.readdirSync('./scrapped');

// Read file
console.log(`file: ${scrappedFileTodo[0]}`)
const fileData = fs.readFileSync('./scrapped/'+scrappedFileTodo[0], 'utf8');

// Use DOM parser
const rooDom = parse(fileData)

// request class title
console.log(rooDom.querySelector('.page-header__title').text);