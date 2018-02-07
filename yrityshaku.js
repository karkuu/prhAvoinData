/// =========================================================
// ======================= ASETUKSET =======================
// =========================================================

// YRITYKSEN TOIMIALALUOKITUS
// Eri toimialojen toimialaluokitukset löytyvät osoitteesta:
// http://www.stat.fi/meta/luokitukset/toimiala/001-2008/index.html
// Esim: 62010, joka on Ohjelmistot, konsultointi ja siihen liittyvä toiminta
var a1 = 62010; 

// YRITYKSEN SIJAINTI
var a2 = "Jyväskylä";

// YRITYKSEN TYYPPI (AOY,OYJ,OY,OK,VOJ)
var a3 = "OY";

// HAETTAVAT TIETUEET
// Jos yrityksiä löytyy yli haettavien tietueiden määrän, saadaan loput tietueet
// näkymään muuttamalla kohtaa monennestako tietueesta alkaen haku suoritetaan.
// Esim: a4=100, a5=0 hakee tietueet 0-99 (100kpl)
// Esim: a4=100, a5=101 hakee tietueet 100-200 (100kpl)
var a4 = 10; // Montako tietuetta haetaan (Maksimi 1000kpl. Suositus enintään 300kpl kerralla.)
var a5 = 0; // Monennestako tietueesta haku suoritetaan (0 on ensimmäinen tietue)

// AIKAVÄLI REKISTERIIN TEHTYJEN KIRJAUSTEN SUHTEEN
// Päivämäärien on oltava muotoa "vvvv-kk-pv" (vuosi-kuukausi-päivä).
// Yksinumeroisten päivien ja kuukausien edessä on oltava 0 esim: "1999-06-08".
// Loppuajankohdaksi kannattaa laittaa nykyinen päivämäärä, ellei halua rajata
// pois "liian" tuoreita yrityksiä.
var a6 = "2000-01-01"; // Alkuajankohta
var a7 = "2017-02-28"; // Loppuajankohta

// =========================================================
// =========================================================
// =========================================================

var contents;

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

var json_obj = JSON.parse(Get("http://avoindata.prh.fi/bis/v1?totalResults=true&maxResults="+a4+"&resultsFrom="+a5+"&registeredOffice="+encodeURI(a2)+"&businessLineCode="+a1+"&companyRegistrationFrom="+a6+"&companyRegistrationTo="+a7+"&companyForm="+a3+""));
var json_obj_yritystiedot;
var json_count = json_obj.totalResults;

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

