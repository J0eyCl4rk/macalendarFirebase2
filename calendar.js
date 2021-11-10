import firebase from './firebase.js';

console.log("!!!appeeee",firebase.firestore().collection('events'));
// firebase.ref("events");


firebase.firestore().collection("events").doc("event6").set({
  describtion: "Los Angeles",
  time: "30000000",
  title: "USA"
})

// const items = [];
// ref.onSnapshot((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//     items.push(doc.data());
//   });
// })

// const items = [];
// const ref = firebase.firestore().collection('events');
// ref.onSnapshot((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       items.push(doc.data());
//       console.log('!!!item111111',items);
//     });
// })
// console.log('!!!item',items);

var docRef = firebase.firestore().collection("events").doc("event1");

docRef.get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});

const items = [];
firebase.firestore().collection("events").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      items.push(doc.data());
  });
});
console.log('!!!item',items);
console.log('!!!Wanted', firebase.firestore().collection("events"));
// // console.log("!!!app",app);
// console.log("!!!app",firebase);




// /*https://code-boxx.com/simple-pure-javascript-calendar-events/*/
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
//   // TODO: Add SDKs for Firebase products that you want to use
//   // https://firebase.google.com/docs/web/setup#available-libraries

//   // Your web app's Firebase configuration
//   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
//   const firebaseConfig = {
//     apiKey: "AIzaSyCn2jEH5aiF67SdeCVqrce7eDBwc9MqNiU",
//     authDomain: "macalendartest.firebaseapp.com",
//     projectId: "macalendartest",
//     storageBucket: "macalendartest.appspot.com",
//     messagingSenderId: "611450666224",
//     appId: "1:611450666224:web:dd5536698b44df2e3bd635",
//     measurementId: "G-CXH35XSMDH"
//   };

//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig);
//   const db = getFirestore(app);

// console.log("!!!appeee",app);
// console.log("!!!appeeee",firebase.firestore().collection('events'));
// // firebase.ref("events");

// const ref = firebase.firestore().collection('events');
// ref.onSnapshot((querySnapshot) => {
//     const items = [];
//     querySnapshot.forEach((doc) => {
// items.push(doc.data());
// console.log('!!!item',items);
// });
// })


var cal = {
  // (A) PROPERTIES
  mName : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // Month Names
  data : null, // Events for the selected period
  startData:null, //Start time for event
  endData:null,
  concatData:null, //Concat start and event data
  sDay : 0, // Current selected day
  sMth : 0, // Current selected month
  sYear : 0, // Current selected year
  sMon : false, // Week start on Monday?

  // (B) DRAW CALENDAR FOR SELECTED MONTH
  list : function () {
    // (B1) BASIC CALCULATIONS - DAYS IN MONTH, START + END DAY
    // Note - Jan is 0 & Dec is 11 in JS.
    // Note - Sun is 0 & Sat is 6
    cal.sMth = parseInt(document.getElementById("cal-mth").value); // selected month
    cal.sYear = parseInt(document.getElementById("cal-yr").value); // selected year
    var daysInMth = new Date(cal.sYear, cal.sMth+1, 0).getDate(), // number of days in selected month
        startDay = new Date(cal.sYear, cal.sMth, 1).getDay(), // first day of the month
        endDay = new Date(cal.sYear, cal.sMth, daysInMth).getDay(); // last day of the month

    // (B2) LOAD DATA FROM LOCALSTORAGE
    cal.data = localStorage.getItem("cal-" + cal.sMth + "-" + cal.sYear);
    if (cal.data==null) {
      localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, "{}");
      cal.data = {};
    } else {
      cal.data = JSON.parse(cal.data);
    }
    cal.startData = localStorage.getItem("cal-" + cal.sMth + "-" + cal.sYear);
    if (cal.startData==null) {
      localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, "{}");
      cal.startData = {};
    } else {
      cal.startData = JSON.parse(cal.startData);
    }
    
    cal.concatData = localStorage.getItem("cal-" + cal.sMth + "-" + cal.sYear);
    if (cal.concatData==null) {
      localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, "{}");
      cal.concatData = {};
    } else {
      cal.concatData = JSON.parse(cal.concatData);
    }
    cal.endData = localStorage.getItem("cal-" + cal.sMth + "-" + cal.sYear);
    if (cal.endData==null) {
      localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, "{}");
      cal.endData = {};
    } else {
      cal.endData = JSON.parse(cal.endData);
    }

    // (B3) DRAWING CALCULATIONS
    // Determine the number of blank squares before start of month
    var squares = [];
    if (cal.sMon && startDay != 1) {
      var blanks = startDay==0 ? 7 : startDay ;
      for (var i=1; i<blanks; i++) { squares.push("b"); }
    }
    if (!cal.sMon && startDay != 0) {
      for (var i=0; i<startDay; i++) { squares.push("b"); }
    }

    // Populate the days of the month
    for (var i=1; i<=daysInMth; i++) { squares.push(i); }

    // Determine the number of blank squares after end of month
    if (cal.sMon && endDay != 0) {
      var blanks = endDay==6 ? 1 : 7-endDay;
      for (var i=0; i<blanks; i++) { squares.push("b"); }
    }
    if (!cal.sMon && endDay != 6) {
      var blanks = endDay==0 ? 6 : 6-endDay;
      for (var i=0; i<blanks; i++) { squares.push("b"); }
    }

    // (B4) DRAW HTML CALENDAR
    // Container
    var container = document.getElementById("cal-container"),
        cTable = document.createElement("table");
    cTable.id = "calendar";
    container.innerHTML = "";
    container.appendChild(cTable);

    // First row - Day names
    var cRow = document.createElement("tr"),
        cCell = null,
        days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    if (cal.sMon) { days.push(days.shift()); }
    for (var d of days) {
      cCell = document.createElement("td");
      cCell.innerHTML = d;
      cRow.appendChild(cCell);
    }
    cRow.classList.add("head");
    cTable.appendChild(cRow);

    // Days in Month
    var total = squares.length;
    cRow = document.createElement("tr");
    cRow.classList.add("day");
    for (var i=0; i<total; i++) {
      cCell = document.createElement("td");
      if (squares[i]=="b") { cCell.classList.add("blank"); }
      else {
        cCell.innerHTML = "<div class='dd'>"+squares[i]+"</div>";
        if (cal.data[squares[i]]) {
          cCell.innerHTML += "<div class='evt'>" + cal.data[squares[i]] + "</div>";
        }
        cCell.addEventListener("click", function(){
          cal.show(this);
        });
      }
      cRow.appendChild(cCell);
      if (i!=0 && (i+1)%7==0) {
        cTable.appendChild(cRow);
        cRow = document.createElement("tr");
        cRow.classList.add("day");
      }
    }

    // (B5) REMOVE ANY PREVIOUS ADD/EDIT EVENT DOCKET
    cal.close();
  },

  // (C) SHOW EDIT EVENT DOCKET FOR SELECTED DAY
  show : function (el) {
    // (C1) FETCH EXISTING DATA
    cal.sDay = el.getElementsByClassName("dd")[0].innerHTML;

    // (C2) DRAW EVENT FORM - ADD EVENT FORM
    var tForm = "<h1>" + (cal.data[cal.sDay] ? "EDIT" : "ADD") + " EVENT</h1>";
    tForm += "<div id='evt-date'>" + cal.sDay + " " + cal.mName[cal.sMth] + " " + cal.sYear + "</div>";
    //tForm += "<textarea id='evt-details' required>" + (cal.data[cal.sDay] ? cal.data[cal.sDay] : "Event") + "</textarea>";
    tForm += "<textarea id='evt-details' required>" + "</textarea>";
    // tForm += "<textarea id='name' required>" + (cal.data[cal.sDay] ? cal.data[cal.sDay] : "Name") + "</textarea>";
    // tForm += "<textarea id='start' required>" + (cal.data[cal.sDay] ? cal.data[cal.sDay] : "Start Time") + "</textarea>";
    // tForm += "<textarea id='end' required>" + (cal.data[cal.sDay] ? cal.data[cal.sDay] : "End Time") + "</textarea>";
    tForm += "<select id = 'start' onchange = 'favTutorial()'' required='required'> <option value=''> ---Start time--- </option> <option> 12 am </option> <option> 1 am </option> <option> 2 am </option> <option> 3 am </option> <option> 4 am </option> <option> 5 am </option> <option> 5 am </option> <option> 6 am </option> <option> 7 am </option> <option> 8 am </option> <option> 9 am </option> <option> 10 am </option> <option> 11 am </option> <option> 12 pm </option>  <option> 1 pm </option> <option> 2 pm </option> <option> 3 pm </option> <option> 4 pm </option> <option> 5 pm </option> <option> 6 pm </option> <option> 7 pm </option> <option> 8 pm </option> <option> 9 pm </option> <option> 10 pm </option> <option> 11 pm </option> </select>";
    tForm += "<select id = 'finish' onchange = 'favTutorial()'' required='required'> <option value = ''> ---End time--- </option> <option> 12 am </option> <option> 1 am </option> <option> 2 am </option> <option> 3 am </option> <option> 4 am </option> <option> 5 am </option> <option> 5 am </option> <option> 6 am </option> <option> 7 am </option> <option> 8 am </option> <option> 9 am </option> <option> 10 am </option> <option> 11 am </option> <option> 12 pm </option>  <option> 1 pm </option> <option> 2 pm </option> <option> 3 pm </option> <option> 4 pm </option> <option> 5 pm </option> <option> 6 pm </option> <option> 7 pm </option> <option> 8 pm </option> <option> 9 pm </option> <option> 10 pm </option> <option> 11 pm </option> </select>";
    tForm += "<input type='button' value='Close' onclick='cal.close()'/>";
    tForm += "<input type='button' value='Delete' onclick='cal.del()'/>";
    tForm += "<input type='submit' value='Save'/>";

    // (C3) ATTACH EVENT FORM
    var eForm = document.createElement("form");
    eForm.addEventListener("submit", cal.save);
    eForm.innerHTML = tForm;
    var container = document.getElementById("cal-event");
    container.innerHTML = "";
    container.appendChild(eForm);
  },

  // (D) CLOSE EVENT DOCKET
  close : function () {
    document.getElementById("cal-event").innerHTML = "";
  },

  // (E) SAVE EVENT

  //write things here!!!!!!!!!!!!!!!!!!!!!!!
  save : function (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    firebase.firestore().collection('events')
    console.log("!!!appZZZZZ",firebase.firestore().collection('events'));
    console.log("!!!value type",document.getElementById("evt-details").value,document.getElementById("start").value,document.getElementById("finish").value)
    cal.data[cal.sDay] = document.getElementById("evt-details").value;

    cal.startData[cal.sDay] = document.getElementById("start").value;
    
    cal.endData[cal.sDay] = document.getElementById("finish").value;


    firebase.firestore().collection("events").doc("event6").set({
      evtDetails: document.getElementById("evt-details").value,
      start: document.getElementById("start").value,
      finish: document.getElementById("finish").value,
      day: cal.sDay,
      month: cal.sMth,
      year: cal.sYear
    })


    var concat = cal.startData[cal.sDay] + " - "+cal.endData[cal.sDay]+" " + cal.data[cal.sDay];
    cal.concatData[cal.sDay] = concat;
    localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, JSON.stringify(cal.concatData));
    cal.list();
  },

  // (F) DELETE EVENT FOR SELECTED DATE
  del : function () {
    if (confirm("Remove event?")) {
      delete cal.data[cal.sDay];
      localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, JSON.stringify(cal.data));
      cal.list();
    }
  }
};

// (G) INIT - DRAW MONTH & YEAR SELECTOR
window.addEventListener("load", function () {
  // (G1) DATE NOW
  var now = new Date(),
      nowMth = now.getMonth(),
      nowYear = parseInt(now.getFullYear());

  // (G2) APPEND MONTHS SELECTOR
  var month = document.getElementById("cal-mth");
  for (var i = 0; i < 12; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = cal.mName[i];
    if (i==nowMth) { opt.selected = true; }
    month.appendChild(opt);
  }

  // (G3) APPEND YEARS SELECTOR
  // Set to 10 years range. Change this as you like.
  var year = document.getElementById("cal-yr");
  for (var i = nowYear-10; i<=nowYear+10; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = i;
    if (i==nowYear) { opt.selected = true; }
    year.appendChild(opt);
  }

  // (G4) START - DRAW CALENDAR
  document.getElementById("cal-set").addEventListener("click", cal.list);
  cal.list();
});