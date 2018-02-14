function leikepoyta()
{
	var input  = document.getElementById("csvtext");
    event.preventDefault();
    input.select();
    document.execCommand("copy");

}

function latausmessage()
{
	document.getElementById("data").innerHTML = "Loading......";
}

function Get(yourUrl)
{
	var Httpreq = new XMLHttpRequest();
	Httpreq.open("GET",yourUrl,false);
	Httpreq.send(null);
	return Httpreq.responseText;
}

function hae_tiedot(muoto)
{	
	var a0 = muoto;
	
	// YRITYKSEN TOIMIALALUOKITUS
	var a1 = document.getElementById("luokitus").value; 

	// YRITYKSEN SIJAINTI
	var a2 = document.getElementById("kaupunki").value;

	// YRITYKSEN TYYPPI (AOY,OYJ,OY,OK,VOJ)
	var a3 = document.getElementById("yhtiomuoto").value;

	// HAETTAVAT TIETUEET
	var a4 = document.getElementById("kpl").value; // Montako tietuetta haetaan (Maksimi 1000kpl. Suositus enintään 300kpl kerralla.)
	var a5 = document.getElementById("tietue").value;; // Monennestako tietueesta haku suoritetaan (0 on ensimmäinen tietue)

	// AIKAVÄLI REKISTERIIN TEHTYJEN KIRJAUSTEN SUHTEEN
	var a6 = document.getElementById("apvm").value; // Alkuajankohta
	var a7 = document.getElementById("lpvm").value; // Loppuajankohta

	var contents = "";
	
	var json_obj = JSON.parse(Get("http://avoindata.prh.fi/bis/v1?totalResults=true&maxResults="+a4+"&resultsFrom="+a5+"&registeredOffice="+encodeURI(a2)+"&businessLineCode="+a1+"&companyRegistrationFrom="+a6+"&companyRegistrationTo="+a7+"&companyForm="+a3+""));
	var json_obj_yritystiedot;
	var json_count = json_obj.totalResults;

	if (muoto == 1) // Perustable
	{
		contents = "Yrityksiä löytyi: " + json_obj.totalResults + " kpl<br><br>";
		contents += "<table border=1><tr><td></td><td>Yrityksen nimi</td><td>Yhteystiedot</td><td>Google</td></tr>";

		for (i=0; i<a4;i++)
		{
			json_obj_yritystiedot = JSON.parse(Get(json_obj.results[i].detailsUri));

			contents += "<tr><td>"+(i+1)+"</td><td>"+json_obj.results[i].name +"</td><td>";
	
			if (json_obj_yritystiedot.results[0].contactDetails[0] != undefined)
			{
				for (ii=0;ii<json_obj_yritystiedot.results[0].contactDetails.length;ii++)
				{
					if (json_obj_yritystiedot.results[0].contactDetails[ii].type == "Kotisivun www-osoite" || json_obj_yritystiedot.results[0].contactDetails[ii].type == "www-adress" || json_obj_yritystiedot.results[0].contactDetails[ii].type == "Website address")
					{
						
						contents += json_obj_yritystiedot.results[0].contactDetails[ii].type + ": <a href=\"http://"+json_obj_yritystiedot.results[0].contactDetails[ii].value+"\" target=\"blank\">"+json_obj_yritystiedot.results[0].contactDetails[ii].value+"</a> <br>";
					}
					else
					{
						contents += json_obj_yritystiedot.results[0].contactDetails[ii].type + ": "+json_obj_yritystiedot.results[0].contactDetails[ii].value+"<br>";
					}
				}
			}
			
			contents +="</td><td><a href=\"http://www.google.fi/search?q="+json_obj.results[i].name+"\">Hae</a></td></tr>";
		}

		contents += "</table>";
		document.getElementById("data").innerHTML = contents;

	}
	else if (muoto == 2) // CSV
	{
		
		for (i=0; i<a4;i++)
		{
			json_obj_yritystiedot = JSON.parse(Get(json_obj.results[i].detailsUri));

			contents += (i+1)+","+json_obj.results[i].name+","+json_obj.results[i].businessId;
	
			if (json_obj_yritystiedot.results[0].contactDetails[0] != undefined)
			{
				for (ii=0;ii<json_obj_yritystiedot.results[0].contactDetails.length;ii++)
				{
					contents += ","+json_obj_yritystiedot.results[0].contactDetails[ii].value;	
				}
			}
			
			contents += "\n"
		}
		
		document.getElementById("data").innerHTML = "<textarea id=\"csvtext\" rows=3 cols=50>"+contents+"</textarea>";
	}
}