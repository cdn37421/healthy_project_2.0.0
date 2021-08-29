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
      {
        event_date: new Date(2021, 7, 1),
        event_title: "看診",
        event_theme: "blue",
      },

      {
        event_date: new Date(2021, 7, 17),
        event_title: "生日",
        event_theme: "red",
      },

      {
        event_date: new Date(2021, 7, 16),
        event_title: "測試 ",
        event_theme: "green",
      },
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
    },
    addEvent() {
      if (this.event_title == "") {
        return;
      }

      this.events.push({
        event_date: this.event_date,
        event_title: this.event_title,
        event_theme: this.event_theme,
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
      let toRemove = this.event_title;

      //bug 順序上會有錯誤
      this.events.pop({
        event_date: "",
        event_title: "",
        event_theme: "",
      });

      console.log(this.events);

      // clear the form data
      this.event_title = "";
      this.event_date = "";
      this.event_theme = "blue";

      //close the modal
      this.openEventModal = false;
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
