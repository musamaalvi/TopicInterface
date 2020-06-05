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
  loopIndexesEnd = undefined;
  loopIndexesStart = 0;

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


    this.setPaginationIndexes(100,0);

    this.FileUploaded = true
  }

  setPaginationIndexes(ending: Number, starting: Number) {
    debugger
    if (this.fileJson.length > ending)
      this.loopIndexesEnd = Array(ending).fill(ending).map((x, i) => {
        if (i >= starting) { return i }
      });
    else
      this.loopIndexesEnd = Array(this.fileJson.length).fill(this.fileJson.length).map((x, i) => {
        if (i >= starting) { return i }
      });
      this.loopIndexesEnd = this.loopIndexesEnd.filter((value, index)=>{
        if(value != undefined)
          return true
      })
      
  }
  Upload() {
    this.loopIndexesStart = 0;
    this.loopIndexesEnd = undefined;
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


    var maxLength = 0
    this.tagsArray.forEach((val, index) => {
      if (val.length >= maxLength) {
        this.maxLengthTopic = index
        maxLength = val.length
      }


    })


    // this.ExportData = data;

    setTimeout(() => {
      var htmlstr = document.getElementById('testingTable').outerHTML;
      var workbook = XLSX.read(htmlstr, { type: 'string', raw: true });
      var range = { s: { c: 1, r: 1 }, e: { c: 1, r: this.fileJson.length } }

      XLSX.writeFile(workbook, 'out.xlsx');
    },
      4000);

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
  showPrevious() {
    
    debugger
    if (this.loopIndexesEnd[this.loopIndexesEnd.length-1] - 100 >= 0){
      this.loopIndexesStart = this.loopIndexesEnd[0] - 100
      this.loopIndexesEnd = this.loopIndexesEnd[0] 

      
    }
      
    else{
      this.loopIndexesStart = 0
      this.loopIndexesEnd = 100

      
      
    }
    this.setPaginationIndexes(this.loopIndexesEnd, this.loopIndexesStart)
  }
  showNext() {
    debugger
    if (this.loopIndexesEnd[this.loopIndexesEnd.length-1] + 100 <= this.fileJson.length){
      this.loopIndexesStart = this.loopIndexesEnd[this.loopIndexesEnd.length-1] + 1
      this.loopIndexesEnd = this.loopIndexesEnd[this.loopIndexesEnd.length-1] + 100 + 1

      
    }
      
    else{
      this.loopIndexesStart = this.loopIndexesEnd[this.loopIndexesEnd.length-1] + 1
      this.loopIndexesEnd = this.loopIndexesEnd[this.loopIndexesEnd.length-1] + this.fileJson.length + 1
      
    }
    this.setPaginationIndexes(this.loopIndexesEnd, this.loopIndexesStart)
     
  }
}
