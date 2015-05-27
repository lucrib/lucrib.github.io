function setLanguage(lang) {
	var ptbr = "http://raw.githubusercontent.com/lucasribeiro1990/lucasribeiro1990.github.io/master/json/pt-br.json";
	var enus = "http://raw.githubusercontent.com/lucasribeiro1990/lucasribeiro1990.github.io/master/json/en-us.json";
	switch(lang) {
		case "pt-br":
			$.getJSON( 'json/pt-br.json', function( data ) {
				alert(data.resume);
				alert(data.exp[0].position);
			});
			break;	
		case "en-us":
			$.getJSON( 'json/en-us.json', function( data ) {
				alert(data.resume);
				alert(data.exp[0].position);
			});
		default:
			$.getJSON( 'json/pt-br.json', function( data ) {
				alert(data.resume);
				alert(data.exp[0].position);
			});
			break;
	}
}