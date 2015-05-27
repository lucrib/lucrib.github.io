function setLanguage(lang) {
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