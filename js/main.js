function setLanguage(lang){
	ptBR={
			resume: "Portuguese Resume",
			exp: [
			      {
			    	  position: "B",
			    	  company: "C",
			    	  period: "D",
			    	  description:"E"
			      },
			      {
			    	  position: "F",
			    	  company: "G",
			    	  period: "H",
			    	  description:"I"
			      },
			      {
			    	  position: "J",
			    	  company: "K",
			    	  period: "L",
			    	  description: "M"
			      }
			      ]
	};
	enUS={
			resume: "English Resume.",
			exp: [
			      {
			    	  position: "O",
			    	  company: "P",
			    	  period: "Q",
			    	  description:"R"
			      },
			      {
			    	  position: "S",
			    	  company: "T",
			    	  period: "U",
			    	  description:"V"
			      },
			      {
			    	  position: "X",
			    	  company: "Z",
			    	  period: "K",
			    	  description: "W"
			      }
			      ]
	};

	switch(lang){
	case "pt-br":
		$("#resume-title").text("Resumo");
		$("#resume-text").text(ptBR.resume);
		break;	
	case "en-us":
		$("#resume-title").text("Resume");
		$("#resume-text").text(enUS.resume);
		break;
	default:
		alert(ptBR);
		break;
	}
}