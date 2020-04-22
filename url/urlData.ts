import { urlFile, scrappedFolder } from "../config";
import * as fs from "fs";

interface Url {
  url: string;
  comment?: string;
  folder?: string;
}

export class UrlData {
  // basic data
  private urlContents: string;
  private filePath: string;
  private encoding: string;

  // url from urlData.json
  public urlToDo: Url[];
  public urlDone: Url[];
  public urlError: Url[];

  // private urlToRemoveFromDone: Url[];

  constructor(urlFilePath?: string, encoding?: string) {
    // Init
    this.filePath = urlFilePath ? urlFilePath : urlFile;
    this.encoding = encoding ? encoding : "utf8";

    // Generate backup file
    const bkpName = () => {
      const splitName = this.filePath.split(".");
      return splitName[0] + "-bkp." + splitName[1];
    };

    fs.copyFileSync(this.filePath, bkpName());
    this.urlContents = fs.readFileSync(this.filePath, this.encoding);

    // Load url Data
    const urlContentsData = JSON.parse(this.urlContents);
    this.urlToDo = urlContentsData.url.todo;
    this.urlDone = urlContentsData.url.done;
    this.urlError = urlContentsData.url.error;

// Check folder
    this.urlDone.forEach((u)=>{
    let missingFolder:string[] = [];
    try{
      fs.readdirSync(scrappedFolder+u.folder)
    }catch(e){
        if(u.folder) missingFolder.push(u.folder);
    }
    if(missingFolder.length>0) throw "Folder missing from scrapped: "+JSON.stringify(missingFolder);
  })
  }
}
