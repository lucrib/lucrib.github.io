function setLanguage(lang) {
	var result;
	switch(lang) {
		case "pt-br":
			$.getJSON( 'json/pt-br.json', function( data ) {
				result = data;
			});
			alert(JSON.stringify(result));
			break;	
		case "en-us":
			$.getJSON( 'json/en-us.json', function( data ) {
				result = data;
			});
			alert(JSON.stringify(result));
			break;
		default:
			$.getJSON( 'json/pt-br.json', function( data ) {
				result = data;
			});
			alert(JSON.stringify(result));
			break;
	}
}