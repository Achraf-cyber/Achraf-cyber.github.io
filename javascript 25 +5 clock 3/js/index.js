console.log("hello from me");

$(document).ready((e) => {
  const BREAK = "Break";
  const SESSION = "Session";

  const myRegularItems = [{
    id: "#break-length",
    increment: "#break-increment",
    decrement: "#break-decrement",
    propName: "breakLength"
  },
    {
      id: "#session-length",
      increment: "#session-increment",
      decrement: "#session-decrement",
      propName: "sessionLength"
    }];
  const format = (time) => {
    let mm = `${Math.floor(time/60)}`;
    let ss = `${time%60}`;
    ss = ss.length == 2? ss: 0+ss;
    mm = mm.length == 2? mm: 0+mm;
    return `${mm}:${ss}`;
  };
  const initialState = {
    breakLength: 5,
    sessionLength: 25,
    timeLeft: 1500,
    paused: true,
    breakOrSession: SESSION,
    started: false
  };

  const state = Object.assign({}, initialState);

  const update = function(){
    if (!state.started) {
    setTimeLeftFromInputs();
    }
    
    $("#timer-label").text(state.breakOrSession);
    myRegularItems.map((item) => {
      $(item.id).text(state[item.propName]);
    });
    $("#start_stop").text(state.paused?"start": "stop");
    $("#time-left").text(format(state.timeLeft));
  };

const setTimeLeftFromInputs = function(){
  state.timeLeft = state.breakOrSession == BREAK?state.breakLength*60: state.sessionLength*60;
};
  const reset = function(){
    stop();
    Object.assign(state, initialState);
    update();
  };

  let lastDate = 0;
  let intervalId = null;
  
  const initTimeLeft = function(){
  setTimeLeftFromInputs();
  update();
  };
  const start = function() {
    if (!state.started) {
      state.started = true;
      initTimeLeft();
    }
    resume();
  };

  const resume = function() {
    state.paused = false;
    const lapse = 1;
    const timeUpdater = function() {
      if (state.timeLeft > 0) {
        state.timeLeft -= lapse;
      }else{
        counterReachZero();
      }
      update();
    };
    intervalId = setInterval(timeUpdater, lapse);
  };
  
  const counterReachZero = function(){
    state.breakOrSession = state.breakOrSession != BREAK? BREAK : SESSION;
        initTimeLeft();
        const audio = document.getElementById('beep');
        audio.currentTime = 0;
        audio.play();
  };
  
  const stop = function() {
    state.paused = true;
    clearInterval(intervalId);
  };


  const startStop = function(){
    state.paused?start(): stop();
    update();
  }


  $("#reset").on("click", reset);
  $("#start_stop").on("click", startStop);
  
  
  myRegularItems.map((item) => {
    $(item.increment).on("click", () => {
      if (state[item.propName] < 60) {
        state[item.propName] = parseInt($(item.id).text()) + 1;
      }
      update()
    })
  });
  myRegularItems.map((item) => {
    $(item.decrement).on("click",
      () => {
        if (state[item.propName] > 1) {
          state[item.propName] = parseInt($(item.id).text()) - 1;
        }
        update()
      })
  });

});