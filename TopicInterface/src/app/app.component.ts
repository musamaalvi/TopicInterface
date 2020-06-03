import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TopicInterface';

  fileToUpload: File = null;
  arrayBuffer: any
  fileJson: any;
  FileUploaded: boolean = false;
  ExportData = false;
  Object = Object;
  RegExpres = /\n/g;
  re = new RegExp(this.RegExpres, "g");
  tagsArray = [];
  maxLengthTopic: Number = 0;
  globalIndex = -1;

  incomingfile(event) {

    this.fileToUpload = event.target.files[0];
  }
  PopulateTable() {
    debugger
    this.tagsArray = []
    this.fileJson.forEach((obj,index) => {
      
      var arr = []
      Object.keys(obj).forEach((key) => {
        if(key.substring(0,5)=="Topic"){
          arr.push(obj[key])

        }
      })
      if(arr.length>=this.maxLengthTopic)
        this.maxLengthTopic = index
      this.tagsArray.push(arr)
    })
    this.FileUploaded = true
  }


  Upload() {

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];

      this.fileJson = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.fileJson);
      this.PopulateTable();
    }
    fileReader.readAsArrayBuffer(this.fileToUpload);
  }

  removeTag(ind, removeTag) {
   debugger
   var index = this.tagsArray[ind].indexOf(removeTag.innerText)
    this.tagsArray[ind].splice(index,1)
  }
  Export(data) {
   


    this.ExportData = data;
    //data.children[0].children[1].innerText.replace(/\n/g, "|").split("||")
    setTimeout(() => {
      var htmlstr = document.getElementById('testingTable').outerHTML;
      var workbook = XLSX.read(htmlstr, { type: 'string' });
      XLSX.writeFile(workbook, 'out.xlsx');
    },
      4000);
    
  }
  AddTag(ind){
    debugger
    if(ind == this.globalIndex){
      var text = "";
      if (window.getSelection) {
          text = window.getSelection().toString();
      } 
      var value = text;
    if(value !=""){
      if(this.fileJson[ind].Comment.indexOf(value)>=0)
        if(this.tagsArray[ind].indexOf(value) == -1)
          this.tagsArray[ind].push(value)
    }

    }
     
  }

  setIndex(index){
    this.globalIndex = index;
  }
}
