$(document).ready(function() {
    function doOperation(Id, type,flag=false) {
        var obj = $("#" + Id);
        var currentVal = obj.html();
        if (type == 'I') {
            obj.html(parseInt(currentVal) + 1);
            if(flag)
                $("#source").html(parseInt(currentVal) + 1);
        } else if (type == 'D') {
            if (currentVal == 1) {
                return;
            }
            obj.html(parseInt(currentVal) - 1);
            if(flag)
              $("#source").html(parseInt(currentVal) - 1);
        }
    };
    $('button').click(function() {
        if (pomodoro.runStarted == true) {
            return;
        }
        var $this = $(this);
        var id = $this.attr('id');
        if (id == "decrement-break") {
            doOperation('break-length', 'D');
        } else if (id == "increment-break") {
            doOperation('break-length', 'I');
        } else if (id == "decrement-session") {
            doOperation('session-length', 'D',true);
        } else if (id == "increment-session") {
            doOperation('session-length', 'I',true);
        }
    });
    var pomodoro = {
        workMinutes: parseInt($('#session-length').html()) * 60,
        breakMinutes: parseInt($('#break-length').html()) * 60,
        currentSession: "work",
        runStarted: false,
        reset: false,
        display: function(minutes) {
            var display = this.leadZero(Math.floor(minutes / 60)) + ':' + this.leadZero((minutes % 60));
            //document.getElementById('demo').innerHTML=display;
            $('#source').html(display);
            var percentLeft;
            var lengthOfSession = (this.currentSession == "work") ? this.mainMinutes : this.breakMain;
            percentLeft = 100 - (minutes / lengthOfSession) * 100;
            var pomoProgress = document.getElementById("pomo-progress");
            pomoProgress.style.width = percentLeft + "%";
        },
        leadZero: function(number) {
            if (number < 10) {
                return "0" + number;
            } else {
                return number;
            }
        },
        startWork: function() {
            var self = this;
            if (!this.runStarted) {
                self.workMinutes = parseInt($('#session-length').html()) * 60;
                self.breakMinutes = parseInt($('#break-length').html()) * 60;
            }
            this.runStarted = true;
            if (self.reset) {
                self.workMinutes = parseInt($('#session-length').html()) * 60;
                self.breakMinutes = parseInt($('#break-length').html()) * 60;
                self.reset = !self.reset;

            }
            if (self.workMinutes > 0) {
                this.workInterval = setInterval(function() {
                    self.currentSession = "work";
                    document.getElementById('sessionName').innerHTML = "work";
                    self.workMinutes -= 1;
                    self.display(self.workMinutes);
                    if (self.workMinutes == 0) {
                        //let audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
                        //audio.play();
                        let mySound = new buzz.sound("./sounds/simonSound1.mp3");
                         buzz.all().play();
                        self.pause();
                        self.startBreak();
                    }
                }, 1000);
            }

        },
        startBreak: function() {
            var self = this;
            if (self.breakMinutes > 0) {
                this.breakInterval = setInterval(function() {
                    self.currentSession = 'break';
                    document.getElementById('sessionName').innerHTML = "break";
                    self.breakMinutes -= 1;
                    self.display(self.breakMinutes);
                    //  document.getElementById('demo').innerHTML=self.breakMinutes;
                    if (self.breakMinutes == 0) {
                        self.pause();
                        self.reset = true;
                        //let audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
                        //audio.play();
			let mySound = new buzz.sound("./sounds/simonSound1.mp3");
                         buzz.all().play();
                        self.startWork();
                    }
                }, 1000);
            }

        },
        pause: function() {
            if (this.currentSession == 'work') {
                clearInterval(this.workInterval);
                delete this.workInterval;

            } else if (this.currentSession == 'break') {
                clearInterval(this.breakInterval);
                delete this.breakInterval;
            }
        },
        resume: function() {
            if (this.currentSession == 'work') {
                if (!this.workInterval) {
                    this.startWork();
                }
            } else if (this.currentSession == 'break') {
                if (!this.breakInterval) {
                    this.startBreak();
                }
            }
        }
    };
   
    $("#start").on("click", ".fa-pause", function() {
        $(this).removeClass('fa-pause');
        $(this).addClass('fa-play');
        pomodoro.pause();
    });

    $("#start").on("click", ".fa-play", function() {
        if (!pomodoro.runStarted) {
            pomodoro.mainMinutes = parseInt($('#session-length').html()) * 60;
            pomodoro.breakMain = parseInt($('#break-length').html()) * 60;
        }
        $(this).removeClass('fa-play');
        $(this).addClass('fa-pause');
        pomodoro.resume();
    });
});