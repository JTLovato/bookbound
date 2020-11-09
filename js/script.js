

//-------------CHAT BOX

// Gets the Channel ID from Scaledrone
const CLIENT_ID = 'dbz8cBr4C93y0fF8';

const drone = new ScaleDrone(CLIENT_ID, {
  data: { // Will be sent out as clientData via events
    name: getRandomName(),
    color: getRandomColor(),
  },
});

let members = [];

drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  console.log('Successfully connected to Scaledrone');

  const room = drone.subscribe('observable-room');
  room.on('open', error => {
    if (error) {
      return console.error(error);
    }
    console.log('Successfully joined room');
  });

  room.on('members', m => {
    members = m;
    updateMembersDOM();
  });

//   ADDS A MEMBER TO THE ROOM  
  room.on('member_join', member => {
    members.push(member);
    updateMembersDOM();
  });

//   REMOVES A MEMBER FROM THE ROOM
  room.on('member_leave', ({id}) => {
    const index = members.findIndex(member => member.id === id);
    members.splice(index, 1);
    updateMembersDOM();
  });

  room.on('data', (text, member) => {
    if (member) {
      addMessageToListDOM(text, member);
    } else {
      // Message is from server
    }
  });
});

drone.on('close', event => {
    console.log('Connection was closed', event);
  });
  
  drone.on('error', error => {
    console.error(error);
  });
  
  function getRandomName() {
    const adjs = ["Book", "Art", "Sci-Fi", "Fiction", "Non-Fiction", "Mystery", "Poetry", "Horror", "Thriller", "Comic", "Memoir", "Romance", "Fable", "Fantasy", "Suspense", "Winter", "Detective", "Graphic", "Studious", "Historical", "Philosophical", "Weathered", "Contemporary", "Sketchy", "Occult", "True-Crime", "Podcast", "Sniper", "Military", "Chocolate", "Crimson", "Flying", "Sharp", "Running", "California", "Mourning", "Framed", "Chivalrous", "Sparkling", "Destructive", "High-End", "Wandering", "Wonderous", "Tired", "Wild", "Onyx", "Holy", "Chilled", "Adventerous", "Deceptive", "Hungry", "Mad", "Proud", "Aged", "Snowy", "Proud", "Floral", "Restless", "Divine", "Polished", "Ancient", "Power", "Little", "Nameless"];
    const nouns = ["Champion", "Lover", "Killer", "Hater", "Smasher", "Reader", "Runner", "Detective", "Artist", "Dog", "Country", "King", "Queen", "Monarch", "Dawn", "Capital", "Forest", "Cheer", "Student", "Professor", "Sun", "Glade", "Bird", "Eagle", "Charger", "Painter", "Space", "Collector", "Fiend", "Hoarder", "Tiger", "Firefly", "Serenity", "Gloss", "Haze", "Mountain", "Night", "Ocean", "Dark", "Snow", "Silence", "Stealth", "Rocket", "Scream", "Surfer", "Thunder", "Lightning", "Waterfall", "Deer", "Wave", "Thrash", "Zero", "Sol", "Oak", "Dream", "Nightmare", "Metal", "Fog", "Frost", "Shriek", "Mill", "Lion", "Smoke", "Star"];
    return (
      adjs[Math.floor(Math.random() * adjs.length)] +
      "_" +
      nouns[Math.floor(Math.random() * nouns.length)]
    );
  }
  
  function getRandomColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
  }
  
  //------------- DOM STUFF
  
  const DOM = {
    membersCount: document.querySelector('.members-count'),
    membersList: document.querySelector('.members-list'),
    messages: document.querySelector('.messages'),
    input: document.querySelector('.message-form_input'),
    form: document.querySelector('.message-form'),
  };
  
  DOM.form.addEventListener('submit', sendMessage);
  
  function sendMessage() {
    const value = DOM.input.value;
    if (value === '') {
      return;
    }
    DOM.input.value = '';
    drone.publish({
      room: 'observable-room',
      message: value,
    });
  }
  
  function createMemberElement(member) {
    const { name, color } = member.clientData;
    const el = document.createElement('div');
    el.appendChild(document.createTextNode(name));
    el.className = 'member';
    el.style.color = color;
    return el;
  }
  
  function updateMembersDOM() {
    DOM.membersCount.innerText = `${members.length} users in room. Remember to be respectful!`;
    DOM.membersList.innerHTML = '';
    members.forEach(member =>
      DOM.membersList.appendChild(createMemberElement(member))
    );
  }
  
  function createMessageElement(text, member) {
    const el = document.createElement('div');
    el.appendChild(createMemberElement(member));
    el.appendChild(document.createTextNode(text));
    el.className = 'message';
    return el;
  }
  
  function addMessageToListDOM(text, member) {
    const el = DOM.messages;
    const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
    el.appendChild(createMessageElement(text, member));
    if (wasTop) {
      el.scrollTop = el.scrollHeight - el.clientHeight;
    }
  }



 //------------- CALENDAR

today = new Date();
twoWeeks = new Date(new Date().getTime()+(17*24*60*60*1000)); // This adds two weeks to the current date, so when someone views this, it's valid, even if it's two months from now
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();

    tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = "Meetings For " + months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth(month, year)) {
                break;
            }
            else {
                cell = document.createElement("td");
                cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-today");
                } // paints today's date.
                if (date === twoWeeks.getDate() && year === twoWeeks.getFullYear() && month === twoWeeks.getMonth()) {
                    cell.classList.add("bg-two-weeks");
                } // paints two weeks from current date.
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row); // appending each row into calendar body.
    }
}

// check how many days in a month code from https://dzone.com/articles/determining-number-days-month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}


//  -------- This launches special date and time modal in calendar
let test = document.getElementById("test");
let elements = document.getElementsByClassName("bg-two-weeks");
let close = document.getElementById("calendar-modal-close");

let openModal= function() {
    test.style.display = "block";
    test.classList.add("show");
    document.getElementById("next-meeting").innerHTML = "The next Bookbound Meeting is on " + twoWeeks.toDateString() + " starting at 6:00 PM until 7:30 PM at your local library. We hope to see you there!";
};

for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', openModal, false);
}

let closeModal = function() {
    test.style.display = "none";
    test.classList.remove("show");
    document.getElementById("next-meeting").innerHTML = "The next Bookbound Meeting is on " + twoWeeks.toDateString() + " starting at 6:00 PM until 7:30 PM at your local library. We hope to see you there!";
};

close.addEventListener("click", closeModal, false);

//  -------- Invalidation code for the form

(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();

