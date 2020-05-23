import { Component } from '@angular/core';
import * as XLSX from 'xlsx';


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
  ExportData=false;
  Object = Object;
  RegExpres = /\n/g;
  re = new RegExp(this.RegExpres,"g");

  incomingfile(event) {

    this.fileToUpload = event.target.files[0];
  }
  PopulateTable() {

    var toPass = this.fileJson
    Object.keys(toPass[0]).forEach(function (key, index) {
      // key: the name of the object key
      // index: the ordinal position of the key within the object
     // console.log(toPass[0][key])
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

  removeTag(ToRemoveTag) {
    debugger
    ToRemoveTag.remove()
  }
  Export(data) {
    // var workbook = XLSX.utils.book_new();
    // var ws1 = XLSX.utils.table_to_book(document.getElementById('testingTable'));
    // XLSX.utils.book_append_sheet(workbook, ws1, "Sheet1");
    // XLSX.writeFile(workbook, 'out.xlsb');

debugger

  this.ExportData=data;
    //data.children[0].children[1].innerText.replace(/\n/g, "|").split("||")
    var htmlstr = document.getElementById('testingTable').outerHTML;
    var workbook = XLSX.read(htmlstr, { type: 'string' });
    XLSX.writeFile(workbook, 'out.xlsb');
  }
}
