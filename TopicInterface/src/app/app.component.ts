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
  loopIndexes = undefined;

  incomingfile(event) {

    this.fileToUpload = event.target.files[0];
  }
  PopulateTable() {
    
    this.tagsArray = []
    this.fileJson.forEach((obj, index) => {

      var arr = []
      Object.keys(obj).forEach((key) => {
        if (key.substring(0, 5) == "Topic") {
          arr.push(obj[key])

        }
      })

      this.tagsArray.push(arr)
    })
    debugger
    if(this.fileJson.length > 100)
      this.loopIndexes = Array(100).fill(100).map((x,i)=> i);
    else
      this.loopIndexes = Array(this.fileJson.length).fill(this.fileJson.length).map((x,i)=> i);
    
    
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
    
    var index = this.tagsArray[ind].indexOf(removeTag.innerText)
    this.tagsArray[ind].splice(index, 1)
  }
  Export(data) {

    debugger
    var maxLength = 0
    this.tagsArray.forEach((val, index) => {
      if (val.length >= maxLength) {
        this.maxLengthTopic = index
        maxLength = val.length
      }


    })


   // this.ExportData = data;
    
    //setTimeout(() => {
      var htmlstr = document.getElementById('testingTable').outerHTML;
      var workbook = XLSX.read(htmlstr, { type: 'string', raw: true});
      var range = {s:{c:1, r:1}, e:{c:1, r:this.fileJson.length}}
      
      XLSX.writeFile(workbook, 'out.xlsx');
   // }//,
      //4000);

  }
  AddTag = (ind) => {
    
    if (ind == this.globalIndex) {
      var text = "";
      if (window.getSelection) {
        text = window.getSelection().toString();
      }
      var value = text;
      if (value != "") {
        if (this.fileJson[ind].Comment.indexOf(value) >= 0)
          if (this.tagsArray[ind].indexOf(value) == -1)
            if (value.split(' ').length < 6)
              this.tagsArray[ind].push(value)
            else
              alert("Topics limit exceeded")
      }

    }

  }

  setIndex(index) {
    this.globalIndex = index;
  }
  clearTopics(index) {
    this.tagsArray[index] = [];
  }
}
