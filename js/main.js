const SOURCES = {
	ALL: "all",
	CORRECT: "correct",
	INCORRECT: "incorrect",
	CORRECTFINAL: "correctfinal"
};

const PAGES = {
	START: "start",
	INFO: "info",
	ANLEGEN: "anlegen",
	OPERATIONEN: "operationen",
	EINGEBEN: "eingeben",
	IMPORTIEREN: "importieren",
	BEARBEITEN: "bearbeiten",
	LERNENOPERATIONEN: "lernenOperationen",
	LERNEN: "lernen"
};

let Vokabel = function() {
	this.Deutsch = "";
	this.Uebersetzung = "";
}

let Sammlung = function() {
	this.ID = "";
	this.Name = "";
	this.Sprache = "";
}

let TestItem = function(vokabel) {
	this.Vokabel = vokabel;
	this.Source = "";
}

let app = new Vue({
  el: '#app',
  data: {
	sammlungen: [],
	sammlung: null,
    vokabeln: [],
	page: PAGES.START,
	deutsch: "",
	uebersetzung: "",
	name: "",
	sprache: "Französisch",
	testTyp: 1,
	testAll: [],
	testCorrect: [],
	testCorrectFinal: [],
	testIncorrect: [],
	testCounter: 0,
	selectedTestItem: null,
	frage: "",
	antwort: "",
	lernenInfo: "",
	importInput: "",
	specialCharacters: ["á", "à", "â", "é", "è", "ê", "ó", "ò", "ô", "ú", "ù", "û", "ç"]
  },
  computed: {
	exportURL: function() {
		let text = JSON.stringify(this.vokabeln);
		let data = new Blob([text], {type: 'text/plain'});
		let url = window.URL.createObjectURL(data);
		return url;
	}
  },
  methods: {
    showStart: function() {
      this.page = PAGES.START
    },
	
	showInfo: function() {
      this.page = PAGES.INFO
    },
	
	showAnlegen: function() {
	  this.page = PAGES.ANLEGEN
    },
	
	showOperationen: function() {
      this.page = PAGES.OPERATIONEN
    },
	
	showEingeben: function() {
      this.page = PAGES.EINGEBEN
    },
	
	showImportieren: function() {
      this.page = PAGES.IMPORTIEREN;
	  this.importInput = "";
    },
		
	showBearbeiten: function() {
      this.page = PAGES.BEARBEITEN
    },
	
	showLernenOperationen: function() {
      this.page = PAGES.LERNENOPERATIONEN
	},
	
	showLernen: function(typ) {
      this.page = PAGES.LERNEN;
	  this.testTyp = typ;
	  this.generateTest();
	  this.nextTest();
    },
	
	showLoeschen: function() {
		if (confirm("Sammlung wirklich löschen?"))
		{
			const index = this.sammlungen.indexOf(this.sammlung);
			if (index > -1) {
				this.sammlungen.splice(index, 1);
				this.sammlung = null;
				this.saveSammlungen();
				window.localStorage.removeItem('vokabeln' + this.sammlung.ID);
				this.showStart();
			}
		}
	},
	
	create: function() {
		let s = new Sammlung();
		s.ID = generateUUID();
		s.Name = this.name;
		s.Sprache = this.sprache;
		this.sammlungen.push(s);
		this.saveSammlungen();
		this.name = "";
	    this.sprache = "";
		this.showStart();
	},
	
	add: function() {
		let v = new Vokabel();
		v.Deutsch = this.deutsch;
		v.Uebersetzung = this.uebersetzung;
		this.vokabeln.push(v);
		this.saveVokabeln();
		this.deutsch = "";
		this.uebersetzung = "";
		
		Vue.nextTick(function () {
		  // DOM updated
		  $('#textareaDeutsch').focus();
		})		
	},
	
	openFile: function(event) {
		let vm = this;
        let input = event.target;
        let reader = new FileReader();
        reader.onload = function(){
          let text = reader.result;
		  vm.importInput = text;
        };
        reader.readAsText(input.files[0]);
    },
	
	importFromText: function() {
		let str = this.importInput;
		let vokabeln = JSON.parse(str);
		for (let i = 0; i < vokabeln.length; i++)
		{
			this.vokabeln.push(vokabeln[i]);
		}
		
		this.saveVokabeln();
		this.showOperationen();
	},
	
	deleteVokabel: function(vokabel) {
		if (confirm("Vokabel wirklich löschen?"))
		{
			const index = this.vokabeln.indexOf(vokabel);
			if (index > -1) {
				this.vokabeln.splice(index, 1);
			}
		}
	},	
	
	update: function() {
		this.saveVokabeln();
		this.showOperationen();
	},
	
	cancelUpdate: function() {
		this.loadVokabeln(this.sammlung);
		this.showOperationen();
	},
	
	//Takes the newest 30 Vokabeln first and then add the rest (randomized)
	generateTest: function() {
		this.testAll = [];
		this.testCorrect = [];
		this.testCorrectFinal = [];
		this.testIncorrect = [];
		this.testCounter = 0;
		
		let rest = [];
		
		for (let i = this.vokabeln.length - 1; i > 0; i--)
		{
			let testItem = new TestItem(this.vokabeln[i]);
			if (this.testAll.length < 30)
			{
				this.testAll.push(testItem);
			} else {
				rest.push(testItem);
			}
		}
		
		shuffle(rest);
		
		for (let i = 0; i < rest.length; i++)
		{
			this.testAll.push(rest[i]);
		}			
	},

	nextTest: function() {	
		this.testCounter++;
		
		if (this.testAll.length == 0 && this.testCorrect.length == 0 && this.testIncorrect.length == 0)
		{
			alert('Du hast alle Fragen zweimal korrekt beantwortet.');
			this.showOperationen();
			return;
		}
		
		if (this.testCounter % 10 === 0) {
			if (this.testCorrect.length > 0) {
				this.selectedTestItem = this.testCorrect[0];
				this.selectedTestItem.Source = SOURCES.CORRECT;
			} else if (this.testAll.length > 0)	{
				this.selectedTestItem = this.testAll[0];
				this.selectedTestItem.Source = SOURCES.ALL;
			} else if (this.testIncorrect.length > 0) {
				this.selectedTestItem = this.testIncorrect[0];
				this.selectedTestItem.Source = SOURCES.INCORRECT;
			}
		} else if (this.testCounter % 5 === 0) {
			if (this.testIncorrect.length > 0) {
				this.selectedTestItem = this.testIncorrect[0];
				this.selectedTestItem.Source = SOURCES.INCORRECT;
			} else if (this.testAll.length > 0)	{
				this.selectedTestItem = this.testAll[0];
				this.selectedTestItem.Source = SOURCES.ALL;
			} else if (this.testCorrect.length > 0) {
				this.selectedTestItem = this.testCorrect[0];
				this.selectedTestItem.Source = SOURCES.CORRECT;
			}
		} else {
			if (this.testAll.length > 0) {
				this.selectedTestItem = this.testAll[0];
				this.selectedTestItem.Source = SOURCES.ALL;
			} else if (this.testIncorrect.length > 0) {
				this.selectedTestItem = this.testIncorrect[0];
				this.selectedTestItem.Source = SOURCES.INCORRECT;
			} else if (this.testCorrect.length > 0) {
				this.selectedTestItem = this.testCorrect[0];
				this.selectedTestItem.Source = SOURCES.CORRECT;
			}
		}
		
		if (this.testTyp === 1)
		{
			this.frage = this.selectedTestItem.Vokabel.Deutsch;
		} else {
			this.frage = this.selectedTestItem.Vokabel.Uebersetzung;
		}
		
		this.antwort = "";
		this.lernenInfo = "";
		
		Vue.nextTick(function () {
		  // DOM updated
		  $('#textareaAntwort').focus();
		})		
	},
	
	pruefen: function() {
		let correct = false;
		let item;
		
		if (this.testTyp === 1 && this.selectedTestItem.Vokabel.Uebersetzung === this.antwort)
		{
			correct = true;
		} else if (this.testTyp === 2 && this.selectedTestItem.Vokabel.Deutsch === this.antwort) {
			correct = true;
		}
		
		if (correct) {
			this.lernenInfo = "richtig";
			switch (this.selectedTestItem.Source) {
				case SOURCES.ALL:
					item = this.testAll.shift();
					this.testCorrect.push(item);
					break;
				case SOURCES.INCORRECT:
					item = this.testIncorrect.shift();
					this.testCorrect.push(item);
					break;
				case SOURCES.CORRECT:
					item = this.testCorrect.shift();
					this.testCorrectFinal.push(item);
					break;
			}
		} else {
			if (this.testTyp === 1)
			{
				this.lernenInfo = "korrekte Antwort: <span class='correct'>" + this.selectedTestItem.Vokabel.Uebersetzung + "</span>";
			} else {
				this.lernenInfo = "korrekte Antwort: <span class='correct'>" + this.selectedTestItem.Vokabel.Deutsch + "</span>";
			}
			switch (this.selectedTestItem.Source) {
				case SOURCES.ALL:
					item = this.testAll.shift();
					this.testIncorrect.push(item);
					break;
				case SOURCES.INCORRECT:
					//stays on top
					break;
				case SOURCES.CORRECT:
					item = this.testCorrect.shift();
					this.testIncorrect.push(item);
					break;
			}
		}
		
		Vue.nextTick(function () {
		  // DOM updated
		  $('#buttonWeiter').focus();
		})	
	},
	
	addCharacter: function(c) {
		this.antwort += c;
	},
	
	saveSammlungen: function() {
		window.localStorage.setItem('sammlungen', JSON.stringify(this.sammlungen));
	},
	
	saveVokabeln: function() {
		window.localStorage.setItem('vokabeln' + this.sammlung.ID, JSON.stringify(this.vokabeln));
	},
	
	loadSammlungen: function() {
		let str = window.localStorage.getItem('sammlungen');
		if (str != null) {
			this.sammlungen = JSON.parse(str);
		}
	},
	
	loadVokabeln: function(sammlung) {
		this.sammlung = sammlung;
		this.vokabeln = [];
		let str = window.localStorage.getItem('vokabeln' + sammlung.ID);
		if (str != null) {
			this.vokabeln = JSON.parse(str);
		}
		this.showOperationen();
	}
  },
  mounted(){
    this.loadSammlungen();
  }
})