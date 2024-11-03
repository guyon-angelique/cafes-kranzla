function testget() {

  const isInWebAppiOS = (window.navigator.standalone === true);
  if (isInWebAppiOS){
    PullToRefresh.init({
      mainElement: 'body',
      onRefresh() {
        window.location.reload();
      }
    });
  }

  var url="https://script.google.com/macros/s/AKfycbxNmAu4vMmPyM5jPtp9QyDhRnCBX9dkS3Cc1mdwxrrA7lSlRhFx7wL6wTuX0Emh3fY/exec";
  
  fetch (url)
    .then(d=>d.json())
    .then(d=> {
  
      var donneesExtraites=[];
      var aujourdhui = new Date();
      var prochainCafe='non defini';
      var mois=["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  
      for (i=0;i<d.length;i++) {
  
        var elementDate = new Date (d[i][0]);
  
        if(prochainCafe=='non defini') {
  
          if(Date.parse(aujourdhui)<Date.parse(elementDate) && d[i][1]!= 'Férié') {
            var prochainCafe=i;
            var moisProchainCafe = elementDate.getMonth()+1;
            var donneesProchainCafe = elementDate.getDate()+"/"+moisProchainCafe+"/"+elementDate.getFullYear();
            donneesExtraites.splice(0,0,[donneesProchainCafe,d[i][1]]);
          }
        }
  
        var moisAffiche = elementDate.getMonth();
  
        for(j=0;j<mois.length;j++) {
          if(moisAffiche==j) {
            moisAffiche=mois[j];
          }
        }
  
        var elementOk = "vendredi "+elementDate.getDate()+" "+moisAffiche+" "+elementDate.getFullYear();
        donneesExtraites.push([elementOk,d[i][1]]);
      }
      console.log(donneesExtraites);
      var pourForm=[];
      var chaine_liste='<table><tr><th>Date</th><th>Nom</th></tr>'
  
      for(var i=1;i<donneesExtraites.length;i++) {
        chaine_liste += '<tr>'
        chaine_liste += '<td class="colonne1">'+donneesExtraites[i][0]+ '</td>'
  
        if(donneesExtraites[i][1]=="") {
  
          chaine_liste += '<td class="colonne2" id="'+i+'"></td>'
          pourForm.push(i);
        }
        else {
          chaine_liste += '<td class="colonne2">'+donneesExtraites[i][1]+ '</td>'
        }
        chaine_liste += '</tr>'
      }
      chaine_liste += '</table>'
      document.getElementById('insertion').innerHTML=chaine_liste;
  
      var prochainCafe=donneesExtraites[0];
      if (donneesExtraites[0][1]=="") {
        var inscritProchainCafe = "Pas d'inscrit";
      } else {
        var inscritProchainCafe=donneesExtraites[0][1];
      }
  
      document.getElementById('affichageProchainCafe').innerHTML=donneesExtraites[0][0]+" : "+inscritProchainCafe;
  
      for(j=0;j<pourForm.length;j++) {
  
        var idElement=pourForm[j];
        var selection = donneesExtraites[idElement][0];
        var separationSelection = selection.split(' ');
        var jour=separationSelection[1];
        var annee=separationSelection[3];
        var mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
        for(k=0;k<mois.length;k++) {
          if (mois[k]==separationSelection[2]) {
            var moisSelection=k+1;
          }
        }
  
        var form=document.createElement("div");
  
        form.innerHTML='<form class="grandEcran" id="form'+idElement+'" action="javascript:;" onsubmit="testSaisie('+idElement+','+jour+','+moisSelection+','+annee+')"><input class= "zoneSaisie" id="saisie'+idElement+'" placeholder="S\'inscrire"><input class= "boutonPlus" type="button" value="+" onclick="testSaisie('+idElement+','+jour+','+moisSelection+','+annee+')"></form><form class="petitEcran"><input type="button" class="inscriptionPetitEcran" value="S\'inscrire" onclick="testSaisie('+idElement+','+jour+','+moisSelection+','+annee+')"></form></td>';
        var cellule=document.getElementById(idElement);
        cellule.appendChild(form);
      }
  
    });
  
  }
  
  async function enregistrement(i, saisieValue) {
  
    await postSaisie(i, saisieValue);
  
  }
  
  async function postSaisie(i, saisieValue) {
    console.log('lancement script');
    console.log("index envoyé "+i+" et saisie input "+saisieValue);
    var url="https://script.google.com/macros/s/AKfycbxNmAu4vMmPyM5jPtp9QyDhRnCBX9dkS3Cc1mdwxrrA7lSlRhFx7wL6wTuX0Emh3fY/exec";
  
    await fetch(url,{
      method:'POST',
      mode:'no-cors',
      cache:'no-cache',
      credentials:'omit',
      headers: {
        'Content-Type' : 'application/json'
      },
      redirect:'follow',
  
      body: JSON.stringify({index:i, saisie:saisieValue})
    });
  console.log("fin script");
  console.log(saisieValue);
  var encodageInput=encodeURIComponent(saisieValue);
  var testurl = url+"?id="+i+"&saisie="+encodageInput;
  console.log(testurl);
  await fetch (testurl)
    .then(h=>h.json())
    .then(h=> {
      console.log("transfert url ok");
      console.log("retour"+h);
      if(h[0]=='ok') {
        console.log('modif ok');
        console.log(saisieValue);
        
        document.getElementById(i).innerHTML=saisieValue;
        fermer();
        
      }
      else {
        var date = new Date(h[1]);
        var mois = date.getMonth()+1
        console.log(date);
        var dateErreurModif = date.getDate()+"/"+mois+"/"+date.getFullYear();
        document.getElementById('chargement').innerHTML="<p>Désolé,</p><p>"+h[2]+" vient de s'inscrire pour le "+dateErreurModif+"</p><p><input type='button' class='boutonValider' value='OK' onclick='window.location.reload()'>";
      }
    })
  
  }
  PullToRefresh.init({
    mainElement: 'body', // Change ce sélecteur si nécessaire
    onRefresh: async () => {
        if (!navigator.onLine) {
            const cachedData = loadFromCache();
            updateUI(cachedData);
            return;
        }

        try {
            const response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/pulltorefreshjs/0.1.22/index.umd.js'); // Remplace par l'URL de ton API
            const data = await response.json();
            updateUI(data);
            saveToCache(data);
        } catch (error) {
            console.error('Erreur de récupération des données :', error);
        }
    }
});
function loadFromCache() {
    // Charger les données depuis le cache ou LocalStorage
    const cachedData = localStorage.getItem('cachedData');
    return cachedData ? JSON.parse(cachedData) : [];
}

function saveToCache(data) {
    // Enregistrer les données dans le cache ou LocalStorage
    localStorage.setItem('cachedData', JSON.stringify(data));
}
function fermer() {
  var fenetre=document.getElementById('chargement');
  fenetre.close();
}
function testSaisie(i, jour, moisSelection, annee) {

  document.getElementById('chargement').innerHTML='<p>Chargement</p>';
  var dialogChargement = document.getElementById('chargement');
  dialogChargement.showModal();
  var indexSaisie = "saisie"+i;
  var saisieValue = document.getElementById(indexSaisie).value;

  if(saisieValue=="") {
    var idSaisieBis='saisieBis'+i;
    document.getElementById('chargement').innerHTML='<p>Inscription pour le '+jour+'/'+moisSelection+'/'+annee+'</p><form id="formBis'+i+'" action="javascript:;" onsubmit="testSaisieBis('+i+')"><input class= "zoneSaisie" id="'+idSaisieBis+'" placeholder="S\'inscrire"><div class = "zoneBouton"><input class= "boutonValider" type="button" value="Valider" onclick="testSaisieBis('+i+','+jour+','+moisSelection+','+annee+')" ><input class= "boutonValider" type="button" value="Annuler" onclick="fermer()" ></div></form>';
    document.querySelector("#chargement input").focus();
  }else {
    enregistrement(i, saisieValue);
  //google.script.run.withSuccessHandler(verificationModif).verifModif(i,saisieValue);
  console.log("ajout ok");
  }
}
function testSaisieBis (i, jour, moisSelection, annee) {

  var indexSaisie = "saisieBis"+i;
  console.log(indexSaisie);
  var saisieValue = document.getElementById(indexSaisie).value;
  document.getElementById('chargement').innerHTML='<p>Chargement</p>';
  if(saisieValue=="") {
    var idSaisieBis='saisieBis'+i;
    document.getElementById('chargement').innerHTML='<p>Inscription pour le '+jour+'/'+moisSelection+'/'+annee+'<form id="formBis'+i+'" action="javascript:;" onsubmit="testSaisieBis('+i+')"><input class= "zoneSaisie" id="'+idSaisieBis+'" placeholder="S\'inscrire"><div class="zoneBouton"><input class= "boutonValider" type="button" value="Valider" onclick="testSaisieBis('+i+','+jour+','+moisSelection+','+annee+')"><input class= "boutonValider" type="button" value="Annuler" onclick="fermer()"> </div></form></td>';

  }else {

  enregistrement(i, saisieValue);
  console.log("ajout ok");
  }
}