let TIMEOUT_SECONDS = 180;
let TIMEOUT_STRING = "three minutes";
let secondsRemaining = TIMEOUT_SECONDS;

let gameTimer;
let oldVal;
let problemNumber = 0;
let problemPoints = 0;
let currentScore = 0;
let numCorrect = 0;
let problemsOrder;
let debug = false;
let lastTarget = '';
let mobile = false;
let showShadow = false;
let skippedProblems = [];
let showSkipped = false;

// Set in respective HTML file (if relevant)
let isMultiplayer = false;

function mobileCheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayLaTeXInBody() {
    renderMathInElement(document.body, {
        options: {
            throwOnError: false,
            display: false
        }
    });
}

// A simple timer
function displayTime(secs) {
    let minutes = Math.floor(secs / 60) % 60;
    let seconds = secs % 60;
    let displayText = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
    $("#timer").text(displayText);
}

function displayInfiniteTime() {
    katex.render(`\\infty`, $("#timer")[0]);
}

function startTimer(duration, onTimeoutFunc) {
    secondsRemaining = duration;
    gameTimer = setInterval(function() {
        secondsRemaining--;
        displayTime(secondsRemaining);
        if (secondsRemaining == 0) {
            clearInterval(timer);
            onTimeoutFunc();
        }
    }, 1000);
}

function toggleShowSkipped() {
  $("#skipped-problems").toggle();
  showSkipped = !showSkipped;
  $("#show-skipped-button").text(showSkipped ? "Hide Skipped" : "Show Skipped");
}

function showIntro() {
    $("#game-window").hide();
    $("#ending-window").hide();
    $("#intro-window").show();

    let introText =  "This is a game to test your \\(\\LaTeX\\) skills. <br/> <br/>";
    $("#intro-text").html(introText);

    let singlePlayerText = "Type as many formulas as you can in " + TIMEOUT_STRING + " (timed game), or play an untimed game (zen mode)!"
    $("#single-player-text").html(singlePlayerText);

    let multiplayerPlayerText = "Create a game and share the link with friends! There'll be options to customise the game in the lobby!"
    $("#multi-player-text").html(multiplayerPlayerText);

    if (mobileCheck()) {
      $("#hint-list").prepend("<li><span style=\"color:red\"><b>Consider switching to a desktop browser</b></span></li>")
      mobile = true;
    }

    displayLaTeXInBody();
    $("#container").show();
}

function endGame() {
    clearTimeout(gameTimer);

    $("#intro-window").hide();
    $("#game-window").hide();
    $("#ending-window").show();
    displayLaTeXInBody();

    let problemsText = numCorrect + ((numCorrect == 1) ? " problem" : " problems");
    let endingText = "You finished " + problemsText + " for a total score of " + currentScore;
    $("#ending-text").text(endingText);
    $("#ending-text").append("<a style='text-decoration: none;' href='https://www.reddit.com/r/unexpectedfactorial/'>!</a>");

    skippedProblems.forEach(idx => {
      let target = problems[problemsOrder[idx % problems.length]];
      let targetId = 'skipTarget' + idx;
      let skippedProblemsHtml = `
        <p class="problem-header"><span class="title">${target.title}</span></p>
        <div class="latex">
          <div id="${targetId}"></div>
        </div>
        <br>
        <div disabled class="latex-source answer">${target.latex}</div>
        <br><br>
      `;
        $("#skipped-problems").append(skippedProblemsHtml);

        katex.render(target.latex, $("#" + targetId)[0], {
            throwOnError: false,
            displayMode: true
        });
    });
    displayLaTeXInBody();

    $("#skipped-problems").hide()
    $("#show-skipped-button").text("Show Skipped");
    showSkipped = false;
    if (skippedProblems.length > 0) {
      $("#show-skipped-message").show();
      $("#show-skipped-button").show();
    } else {
      $("#show-skipped-message").hide();
      $("#show-skipped-button").hide();
    }
}

function startGameSetup() {
    problemNumber = 0;
    currentScore = 0;
    numCorrect = 0;
    oldVal = "";
    problemsOrder = [...Array(problems.length).keys()];
    shuffleArray(problemsOrder);
    skippedProblems = [];

    $("#intro-window").hide();
    $("#ending-window").hide();
    $("#game-window").show();
    $("#skipped-problems").html("");
    $("#skipped-problems").hide();

    displayLaTeXInBody();

    $("#score").text(0);
}

function startMultiplayerGame() {
    sendEvent("start_game_owner", {});

    return false;
}

function startGame(useTimer) {
    startGameSetup();

    if (useTimer) {
        displayTime(TIMEOUT_SECONDS);

        // Reset and start the timer
        loadSingleplayerProblem();
        startTimer(TIMEOUT_SECONDS, function() {
            endGame();
        });
    } else {
        displayInfiniteTime();
        loadSingleplayerProblem();
    }
}

// `target` requires `title` and `latex` fields
function loadProblem(target) {
    problemNumber = problemNumber + 1;
    // clear current work
    $('#out').empty();
    $('#user-input').val('');

    // reset styling
    $('#out').parent().removeClass("correct");
    $('#user-input').prop("disabled", false);
    if (!mobile) {
      $('#user-input').focus();
    }
    // load problem text
    let problemText = "Problem " + problemNumber + ": " + target.title;
    $("#problem-title").text(problemText);
    problemPoints = Math.ceil(target.latex.length / 10.0);
    let pointsText = "(" + problemPoints + ((problemPoints == 1) ? " point)" : " points)");
    $("#problem-points").text(pointsText);

    displayLaTeXInBody();

    // load problem body
    katex.render(target.latex, $("#target")[0], {
        throwOnError: false,
        displayMode: true
    });

    // load problem body
    katex.render(target.latex, $("#shadow-target")[0], {
        throwOnError: false,
        displayMode: true
    });

    oldVal = "";
};

function loadSingleplayerProblem() {
    // load problem
    let target = problems[problemsOrder[problemNumber % problems.length]];
    if (debug) {
      target = problems[problemNumber + 179];
    }

    loadProblem(target);
}

function normalize(input) {
  normalizations.forEach(
    rule => input = input.replace(rule["rule"], rule["replacement"])
  );
  return input;
}

async function validateProblem() {
    let currentVal = normalize($("#user-input").val());
    if (currentVal == oldVal) {
        return false; // check to prevent multiple simultaneous triggers
    }

    oldVal = currentVal;
    // action to be performed on textarea changed
    katex.render(currentVal, $("#out")[0], {
        throwOnError: false,
        displayMode: true
    });

    if (currentVal == '') {
      // Defensively return if the input is empty.
      return false;
    }


    if ($("#target").width() != $("#out").width()) {
        // Return if the element widths are different.
        return false;
    }

    const targetCanvas = await html2canvas($('#target')[0], {});

    $('#out').parent().removeClass("correct");
    let width = targetCanvas.width;
    let height = targetCanvas.height;
    let targetData = targetCanvas.getContext("2d").getImageData(0, 0, width, height);
    let curTarget = $('#problem-title').text();

    const outCanvas = await html2canvas($('#out')[0], {});

    if (outCanvas.width != width || outCanvas.height != height) {
        console.log("doesn't match");
        return false;
    }
    let outData = outCanvas.getContext("2d").getImageData(0, 0, width, height);
    let diff = pixelmatch(targetData.data, outData.data, undefined, width, height, {threshold: 0.1});
    let result = "";
    console.log("diff is " + diff)
    if (diff == 0) {
        if (lastTarget == curTarget) {
            return false;
        }
        lastTarget = curTarget;
        currentScore += problemPoints;
        numCorrect += 1;

        // Styling changes
        $('#out').parent().addClass("correct");
        $('#user-input').prop("disabled", true);
        $("#score").text(currentScore);

        // Load new problem
        // setTimeout(loadSingleplayerProblem, 1500);
        return true;
    }
}

var globalOtp = "";
var globalUsername = "";

/**
 * Event is used to wrap all messages Send and Recieved
 * on the Websocket
 * The type is used as a RPC
 * */
class Event {
    // Each Event needs a Type
    // The payload is not required
    constructor(type, payload) {
        this.type = type;
        this.payload = payload;
    }
}

class NewMemberEvent {
    constructor(name) {
        this.name = name;
    }
}

class AnswerMessageEvent {
    constructor(answer) {
        this.answer = answer;
    }
}

class StartGameEvent {
    constructor(startTimestamp, duration) {
        this.startTimestamp = startTimestamp;
        this.duration = duration;
    }
}

class NewProblemEvent {
    constructor(title, description, latex) {
        this.title = title;
        this.description = description;
        this.latex = latex
    }
}

class NewScoreUpdateEvent {
    constructor(name, score) {
        this.score = score;
        this.name = name;
    }
}

/**
 * sendEvent
 * eventname - the event name to send on
 * payload - the data payload
 * */
function sendEvent(eventName, payload) {
    // Create a event Object with a event named send_message
    const event = new Event(eventName, payload);
    // Format as JSON and send
    console.log(JSON.stringify(event));
    conn.send(JSON.stringify(event));
}

function requestNewProblem() {
    sendEvent("request_problem", {});
}

function updateScore(scoreUpdateEvent) {
    // Find the player whose score has changed
    let playerIndex = -1;

    $('#participant-scores tbody tr').each(function() {
        const tdText = $(this).find('td:eq(0)').text();
        console.log("tdText: " + tdText)
        if (tdText === scoreUpdateEvent.name) {
            // Do something with the row content
            playerIndex = $(this).index();
        }
    });

    // TODO: logic to add to the correct position in the list, s.t. the list is sorted
    // TODO: investigate if taking the index of the row and using that to insert the new row
    //   is faster than taking a copy of the list, sorting it, and putting it back (or if it is significant enough to even consider)
    const row = '<tr><td>' + scoreUpdateEvent.name + '</td><td>' + scoreUpdateEvent.score + '</td></tr>';
    if (playerIndex == -1) {
        $('#participant-scores tbody').append(row);
    } else {
        $('#participant-scores tbody tr:eq(' + playerIndex + ')').replaceWith(row);
    }
}

/**
 * routeEvent is a proxy function that routes
 * events into their correct Handler
 * based on the type field
 * */
function routeEvent(event) {

    if (event.type === undefined) {
        alert("no 'type' field in event");
    }

    switch (event.type) {
        case "new_member":
            // TODO
            const newMemberEvent = Object.assign(new NewMemberEvent, event.payload);
            break;
        case "remove_member":
            // TODO
            break;
        case "start_game":
            const startGameEvent = Object.assign(new StartGameEvent, event.payload);
            duration = parseInt(startGameEvent.duration)
            startGameSetup();
            startTimer(duration, function () {})
            break;
        case "new_problem":
            const problemEvent = Object.assign(new NewProblemEvent, event.payload.problem);
            console.log(problemEvent.latex)
            loadProblem(problemEvent);
            break;
        case "new_score_update":
            const scoreUpdateEvent = Object.assign(new NewScoreUpdateEvent, event.payload);
            updateScore(scoreUpdateEvent);
            break;
        case "end_game":
            endGame();
            // TODO: logic for ending the game
            break;
        default:
            alert("unsupported message type");
            break;
    }
}

/**
 * ConnectWebsocket will connect to websocket and add listeners
 * */
function connectWebsocket(otp, lobby) {
    // Check if the browser supports WebSocket
    if (window["WebSocket"]) {
        console.log("supports websockets");
        // Connect to websocket using OTP as a GET parameter
        conn = new WebSocket(`ws://${document.location.host}/ws?otp=${otp}&l=${lobby}`);

        // Onopen
        conn.onopen = function (evt) {
            globalUsername = username;
            globalOtp = otp;
            document.getElementById("connection-header").innerHTML = "Connected to Websocket: true";
        }

        conn.onclose = function (evt) {
            // Set disconnected
            document.getElementById("connection-header").innerHTML = "Connected to Websocket: false";
        }

        // Add a listener to the onmessage event
        conn.onmessage = function (evt) {
            console.log(evt);
            // parse websocket message as JSON
            const eventData = JSON.parse(evt.data);
            // Assign JSON data to new Event Object
            const event = Object.assign(new Event, eventData);
            // Let router manage message
            routeEvent(event);
        }
    } else {
        alert("Not supporting websockets");
    }
}

function login() {
    let formData = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value,
        "lobbyId": (new URL(window.location.href)).searchParams.get("l")
    }
    // Send the request
    fetch("/login", {
        method: 'post',
        body: JSON.stringify(formData),
        mode: 'cors',
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw 'unauthorized';
        }
    }).then((data) => {
        // Now we have a OTP, send a Request to Connect to WebSocket
        $("#login-form").hide();
        $("#start-multiplayer-button").show();
        connectWebsocket(data.otp, data.lobby);
    }).catch((e) => { alert(e) });
    return false;
}

function convertLobbyToLogin() {
    $("#create-lobby-form").hide();
    $("#login-form").show();
}

/**
 * login will send a login request to the server and then 
 * connect websocket
 * */
function createLobby() {
    console.log(document.getElementById("lobby-name").value);
    let formData = {
        "lobbyName": document.getElementById("lobby-name").value,
    }
    // Send the request
    fetch("/createLobby", {
        method: 'post',
        body: JSON.stringify(formData),
        mode: 'cors',
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw 'unauthorized';
        }
    }).then((data) => {
        const newURL = window.location.origin + "/lobby/?l=" + data.l;
        console.log(newURL);
        history.replaceState(null, null, "/lobby/?l=" + data.l)

        let copyPromptText = `Copy this link to invite others to your lobby:`
        $("#copy-lobby").text(copyPromptText);

        // Copy link to clipboard button
        $("#copy-lobby").append("<button id='copy-lobby-button' class='latex-button'></button>")
        let copyButton = document.getElementById("copy-lobby-button");
        copyButton.addEventListener("click", function() {
            navigator.clipboard.writeText(newURL);
        });
        $("#copy-lobby-button").text("Copy Link");

        convertLobbyToLogin();
    }).catch((e) => { alert(e) });
    return false;
}

// Start by showing the intro.
$(document).ready(function() {
    // Handlers
    $("#start-button-timed").click(function() {
        startGame(true);
    });

    $("#start-button-untimed").click(function() {
        startGame(false);
    });

    $("#login-button").click(function() {
        login();
    });

    $("#start-multiplayer-button").click(function() {
        startMultiplayerGame();
    });

    $("#create-lobby").click(function() {
        // TODO(madhav): add things for adding lobby
        createLobby();
    });

    $("#reset-button-timed").click(function() {
        startGame(true);
    });

    $("#reset-button-untimed").click(function() {
        startGame(false);
    });

    $("#skip-button").click(function() {
        skippedProblems.push(problemNumber - 1);
        if (isMultiplayer) {
            requestNewProblem();
        } else {
            loadSingleplayerProblem();
        }
    });

    $("#show-skipped-button").click(function() {
      toggleShowSkipped();
    })

    $("#end-game-button").click(function() {
        endGame();
    });

    $("#user-input").on("change keyup paste", async function() {
        const valid = await validateProblem()
        console.log(valid)
        if (isMultiplayer && valid) {
            setTimeout(() => sendEvent("give_answer", {}), 1500);
        } else if (valid) {
            setTimeout(loadSingleplayerProblem, 1500);
        }
    });

    $("#shadow-checkbox").change(_ => {
        $("#shadow-target").toggle();
    });

    $("#l-shadow-checkbox").keydown(e => {
      if (e.which == 13 /* enter */) {
        $("#shadow-checkbox").prop("checked", !$("#shadow-checkbox").prop("checked"));
        $("#shadow-target").toggle();
      }
    });

    if (isMultiplayer) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (urlParams.get('l') != null) {
            convertLobbyToLogin();
        }
    }
    showIntro();
});
