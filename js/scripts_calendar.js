const MONTH_NAMES = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];
const DAYS = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

function app() {
  return {
    month: "",
    year: "",
    no_of_days: [],
    blankdays: [],
    days: [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ],

    events: [
      // months need +1
      // bug
      // {
      //   event_date: new Date(2021, 8, 1),
      //   event_title: "看診",
      //   event_theme: "blue",
      // },
      // {
      //   event_date: new Date(2021, 8, 10),
      //   event_title: "看診2",
      //   event_theme: "red",
      // },
    ],
    event_title: "",
    event_date: "",
    event_theme: "blue",

    themes: [
      {
        value: "blue",
        label: "藍色",
      },
      {
        value: "red",
        label: "紅色",
      },
      {
        value: "yellow",
        label: "黃色",
      },
      {
        value: "green",
        label: "綠色",
      },
      {
        value: "purple",
        label: "紫色",
      },
    ],

    openEventModal: false,
    openEventModal2: false,

    initDate() {
      let today = new Date();
      this.month = today.getMonth();
      this.year = today.getFullYear();
      this.datepickerValue = new Date(
        this.year,
        this.month,
        today.getDate()
      ).toDateString();
    },

    isToday(date) {
      const today = new Date();
      const d = new Date(this.year, this.month, date);

      return today.toDateString() === d.toDateString() ? true : false;
    },
    getDateValue(date) {
      let selectedDate = new Date(this.year, this.month, date);
      this.datepickerValue = selectedDate.toDateString();

      this.$refs.date.value =
        selectedDate.getFullYear() +
        "-" +
        ("0" + selectedDate.getMonth()).slice(-2) +
        "-" +
        ("0" + selectedDate.getDate()).slice(-2);

      console.log(this.$refs.date.value);

      this.showDatepicker = false;
    },

    showEventModal(date) {
      // open the modal
      this.openEventModal = true;
      this.event_date = new Date(this.year, this.month, date).toDateString();
    },
    showEventModal2(date) {
      // open the modal
      this.openEventModal2 = true;
      this.event_date = new Date(this.year, this.month, date).toDateString();
      //show the index
      console.log(this.searchData(this.event_date));
    },
    getData() {
      let sch;

      healthyLifeStyleDBUtil.getSchedule((e) => {
        sch = e;
        // render
        for (let i in sch) {
          let unix_timestamp = sch[i].date;
          console.log(unix_timestamp);
          let date = new Date(unix_timestamp);
          let title = sch[i].title;
          let theme = sch[i].theme;

          this.events.push({
            event_date: date,
            event_title: title,
            event_theme: theme,
          });
        }

        console.log(this.events);
      });
    },

    searchData(xDay) {
      //xDay : Thu Sep 09 2021
      let failMag = -1;
      healthyLifeStyleDBUtil.getSchedule((e) => {
        let sch = e;
        // render
        for (let i in sch) {
          let unix_timestamp = sch[i].date;
          let theYear = new Date(unix_timestamp).getFullYear();
          let theMonth = new Date(unix_timestamp).getMonth();
          let theDate = new Date(unix_timestamp).getDate();
          let theXDay = new Date(theYear, theMonth, theDate).toDateString();
          if (xDay == theXDay) {
            console.log(i);
            return i;
          }
        }
      });
      return failMag;
    },

    show() {
      console.log("hello");
    },

    addEvent() {
      if (this.event_title == "") {
        return;
      }

      // delete after figure out problem
      this.events.push({
        event_date: this.event_date,
        event_title: this.event_title,
        event_theme: this.event_theme,
      });

      theYear = this.event_date.slice(-4);
      theMonth = this.event_date.slice(4, -8);
      theDay = this.event_date.slice(8, 10);

      console.log(theYear, theMonth, theDay);
      theMonthNumber =
        "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(theMonth) / 3 + 1;
      console.log(theYear + "-" + theMonthNumber + "-" + theDay);
      let datestamp = new Date(
        theYear + "-" + theMonthNumber + "-" + theDay
      ).getTime();

      healthyLifeStyleDBUtil.addSchedule({
        date: datestamp,
        title: this.event_title,
        theme: this.event_theme,
      });

      console.log(this.events);

      // clear the form data
      this.event_title = "";
      this.event_date = "";
      this.event_theme = "blue";

      //close the modal
      this.openEventModal = false;
    },

    deleteEvent() {
      this.searchData();

      // no database version
      // //bug 順序上會有錯誤
      // this.events.pop({
      //   event_date: "",
      //   event_title: "",
      //   event_theme: "",
      // });
      // // clear the form data
      // this.event_title = "";
      // this.event_date = "";
      // this.event_theme = "blue";
      // //close the modal
      // this.openEventModal = false;
    },

    updateEvent(new_event_title) {
      this.event_title = new_event_title;
    },

    getNoOfDays() {
      let daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

      // find where to start calendar day of week
      let dayOfWeek = new Date(this.year, this.month).getDay();
      let blankdaysArray = [];
      for (var i = 1; i <= dayOfWeek; i++) {
        blankdaysArray.push(i);
      }

      let daysArray = [];
      for (var i = 1; i <= daysInMonth; i++) {
        daysArray.push(i);
      }

      this.blankdays = blankdaysArray;
      this.no_of_days = daysArray;
    },
  };
}
