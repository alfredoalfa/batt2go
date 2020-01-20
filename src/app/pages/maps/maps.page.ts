
import { Component, OnInit} from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { LoadingController, Platform } from '@ionic/angular';

import { Router } from '@angular/router';

import { AlertController} from '@ionic/angular';

import { DbapiService } from '../../services/dbapi.service';

import { MenuController } from '@ionic/angular';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';




declare var google;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit{
 
  mapRef: null;
  
  batterybase: any;
  idclient;
  nombreclient: String;
  email: string;
  batterycliente: any;

  scannedResult: any;
  codigobase: string = '';

  backButtonSubscription;
  isOpen = false;

  searchbase: string = "";
  issearchbase: boolean = false;


  //Nuevooooooo
  directionsService: any = null;
  directionsDisplay: any = null;
  currentLocation: any = {
    lat: 0,
    lng: 0
  };
  //Hasta aquí //Nuevooooooo
  
   
   
  constructor(private _geoMap: Geolocation, private _loading: LoadingController,
              private route: Router,
              private _alertCtrl: AlertController,              
              private _dbService: DbapiService,
              private _menu: MenuController,              
              private _qrScanner: QRScanner,
              private _browser : InAppBrowser,
              private _platform: Platform,
  //            private _emailserv: EmailserviceService

              ) 
  { 
      

  }//Fin constructor

  
  openEnd() {
    this._menu.open('end');
    //this.getBatteryBase_Detalles()
    this.searchbase = "";
    this.batterybase = [];
  }

  ngOnInit() {    
    
    this._dbService.g_idcliente = window.localStorage.getItem("btt2go_iduser");
    this._dbService.g_email = window.localStorage.getItem("btt2go_email");
    this._dbService.g_nombrecliente = window.localStorage.getItem("btt2go_nombre");
       
  }//Fin OnOnit


  ngAfterViewInit() { 

    

    this._platform.ready().then(() => {
      //this.hideSplashScreen();
       
    });

    this.backButtonSubscription = this._platform.backButton.subscribe(
      data => {console.log(data);},
      error => {console.log(error);},
      () => {
      //this._platform.exitApp();
      /*if(this._menu.isOpen('mymenu')){
        this._menu.toggle()
      }
      else*/
      if ((this.route.url === '/') || (this.route.url === 'maps')){        
        this.presentAlertConfirm();
      } 
      
    });

  }//ngAfterViewInit()

  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
   }//ngOnDestroy()


  ionViewDidEnter() {
    
    if((this._dbService.g_login_accion == 5) && !(this._dbService.g_idcliente == null)){
      this._dbService.g_login_accion = 0;
      
      this.scanCode_QrScanner();
    }

    this.idclient = this._dbService.g_idcliente;
    this.email = this._dbService.g_email;
    this.nombreclient = this._dbService.g_nombrecliente;

    //Mantener actualización de credit card en falso
    this._dbService.g_updatecc = false;
    
    this.loadMap();
         
  }//Fin ionViewDidEnter


  ////////
  scanCode_QrScanner() {    
    // Pedir permiso de utilizar la camara
    this._qrScanner.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
        // el permiso fue otorgado
          this.isOpen = true;
        // iniciar el escaneo
          let scanSub = this._qrScanner.scan().subscribe((texto: string) => {
          console.log('Scanned something', texto);

          this.codigobase = texto;
          this.getDetallesBaseBattery(this.obtenerQrByUrl(this.codigobase));

          this.isOpen = false;
          this._qrScanner.hide(); // esconder el preview de la camara
          scanSub.unsubscribe(); // terminar el escaneo
        },
        (err) => {
              //alert(JSON.stringify(err));
              //alert(err);
        }); 
  
      } else if (status.denied) {
        // el permiso no fue otorgado de forma permanente
        // debes usar el metodo QRScanner.openSettings() para enviar el usuario a la pagina de configuracion
        // desde ahí podrán otorgar el permiso de nuevo
      } else {
        // el permiso no fue otorgado de forma temporal. Puedes pedir permiso de en cualquier otro momento
      }
    }) .catch((e: any) => console.log('El error es: ', e));
  }

    async closeScanner() {
        try {
            const status = await this._qrScanner.destroy();
            console.log('destroy status', status);
            this.isOpen = false;
        } catch (e) {
            console.error(e);
        }
    }
  ////////


/**
 * Obtener todos los datos de la base indicada en el parámetro base
 */  
getDetallesBaseBattery(base){

  this._dbService.getDetallesBaseBattery(base).then(
    data => {
      this.batterybase = data;
      if(this.batterybase.length == 0){
        alert("PowerBank doesn't exist.");
      }
      else
      if(this.batterybase[0]["estatus"] == 0){
        alert("PowerBank Off Line.");
      }
      else{                              
        this._dbService.g_idbatterybase =  this.batterybase[0]["id"];
        this._dbService.g_codigobase = this.batterybase[0]["codigo"];
        this._dbService.g_batterydisponibles = this.batterybase[0]["disponibles"];
        
       // this._dbService.g_opcion = _opcion;
               
        //this.route.navigate(['/detalles-base']);
        this.route.navigateByUrl('/hora-alquiler');
      }
    },
    error => {
      console.log('Error: ' + Error)
    } 
   )
  
 }// Fin getDetallesBaseBattery
////////////9999999999999999999

  async presentAlert(_message: string) {
    console.log("Alert msg");
    const alert = await this._alertCtrl.create({
      header: "Batt2go",
      subHeader: "",
      message: _message,
      buttons: ['OK']
    });

    await alert.present();
  }//present Alert


  async loadMap(){
    //console.log("loadMap");
    //Nuevo
    //this. directionsService = new google.maps.DirectionsService;
    //this.directionsDisplay = new google.maps.DirectionsRenderer;    
    //Hasta Aquí Nuevo
  
    /*const loading = await this._loading.create();
    loading.present();*/
    
    const detalles_posicion = await this.getPosition();
    this.currentLocation = detalles_posicion;
    
   // detalles_posicion.lat;
   // detalles_posicion.lng;
    
    const mapElement: HTMLElement = document.getElementById('map');
    
    this.mapRef = new google.maps.Map(mapElement, {
      center: detalles_posicion,
      //styles: COLORSMAPS,      
      mapTypeControl: false,      
      scaleControl: true,
      streetViewControl: false,
      zoomControl: false,
      fullscreenControl: false,
      tilt: 30,
      zoom: 15,      
    });

  
    google.maps.event.addListenerOnce(this.mapRef, 'idle', () => {
      //Mapa Cargado
      console.log("Mapa Cargado");
      
      //loading.dismiss();

    this.addMaker_BaseBattery();
    
    this.addMarker(detalles_posicion.lat, detalles_posicion.lng, "My location.", 0, 0, -1, "", "");   
                  
    })


/////////////////////
//Nuevoooooo
//this. directionsDisplay.setMap(this.mapRef);
//hasta aquí nuevo//////////////////////



  }//Fin loadMap

/**
 * Agrega aviso de información a marker indicado en parámetro marker
 * @param marker 
 */
addInfoWindowToMarker(marker, datos, status) {
  //var infoWindowContent = '<div id="content"><h3 id="firstHeading" class="firstHeading">' + marker.title + '</h3></div>';
  
  var vhref;
  
  
  vhref = '<a href="http://maps.google.com/?ll=' + datos["latitud"] + ", " + datos["longitud"] + "&z=18" +'">'
  vhref = vhref + " Go to " + datos["ubicacion"] +  "</a>"
    
  if(status == 1){
    var infoWindowContent =     
                            '<div>' 
                              + "<div >"
                              +   '<font size="4">'
                              +      datos["ubicacion"]
                              +   '</font>'
                              +   "<br>"
                              +   '<font size="4">'
                              +      datos["direccion"]
                              +   '</font>'
                              +   "<br>"
                              +   '<font size="4">'
                              +      datos["zipcode"]
                              +    '</font>'
                              + "</div>"                                 
                              + '<div>'                                     
                                    + '<font size="3" color = "#3f458b">Availability: </font>'                                    
                                    + '<font size="3" color = "#3f458b">'
                                              + datos["por_rentar"] 
                                    + '</font>'
                                    + "<br>"                                    
                                    +  '<font size="3" color = "#57b6b2">Return Slots: </font>'
                                    + '<font size="3" color = "#57b6b2">'
                                       + datos["por_retornar"]    
                                    + '</font>'
                              + "</div>" 
                              + "<br>"
                              + vhref
                            "</div>"

  }
  else
  if(status == 0)
  {
    var infoWindowContent =     
    '<div>'           
          + '<font size="4">Temporarily Out of Service</font>'          
     "</div>"

  }
  
  var infoWindow = new google.maps.InfoWindow({
    content: infoWindowContent
  });
  marker.addListener('click', () => {
    infoWindow.open(this.mapRef, marker);
  });
}

  
//Crear marcas de sitios
//lati: Recibe la latitud del sitio a marcar.
//long: Recibe la longitud del sitio a marcar.
//sitio: recibe el identificación del lugar a marcar.


private addMarker(lati: number, long: number, sitio: string, por_rentar: number, por_retornar: number, status: number,
                  direccion: string, zipcode: string){
    
  var img: string;

  //let icon_img;
  var icon_img;
  let datos = { ubicacion: sitio, por_rentar: por_rentar, por_retornar: por_retornar, longitud: long, latitud: lati, direccion: direccion, zipcode: zipcode};
  
  img = '';
  
  if(status == 0){     
     //img = 'assets/icon/base_1.png';       
     icon_img = {      
      url: 'assets/icon/base_1.png', 
      //url: 'assets/icon/base_2.png', 
      //scaledSize: new google.maps.Size(20, 32), // scaled size
     }
  }
  else if(status == 1){        
    icon_img = {      
      url: 'assets/icon/base_2.png', 
      //scaledSize: new google.maps.Size(20, 32), // scaled size
     }  
  }
  else {    
    //icon_img = "";
    icon_img = {      
      url: 'assets/icon/persona.png', 
      //scaledSize: new google.maps.Size(20, 32), // scaled size
     }
  }

    
  const markerb = new google.maps.Marker({
  position: {
        lat: lati,
        lng: long
        
      },
      zoom: 5,
      map: this.mapRef,
      animation: google.maps.Animation.DROP,
      title: sitio,
      icon: icon_img
  
  });
  
  //animation: google.maps.Animation.DROP,
//    position: place.geometry.location

  /*let self = this
      markerb.addListener('click', function() {
        console.log("test");
        
        self.presentAlert(sitio)
      });*/

  //Llamada a método que agrega el mensaje a mostrar cuando se hace click sobre el marker    

  if(!(status == -1)){
    this.addInfoWindowToMarker(markerb, datos, status);
  }
  

}//Fin addMarker

//Obtener la ubicación geográfica del sitio
private async getPosition(){
    
    const posicion = await this._geoMap.getCurrentPosition(); 
    
    return  {
       lat: posicion.coords.latitude,
       lng: posicion.coords.longitude
    };

}//Fin getPosition


//Ir a las baterías disponibles.
batterysPage(){     
  this.route.navigateByUrl('/batterys');  
}

//Ir a la ubicación actual.
mapsPage(){
  //this.route.navigateByUrl('/maps');
  this.loadMap();
}

/**
 * Obtener la ubicación de las bases existentes y mostrarlas en el mapa.
 */
addMaker_BaseBattery(){  

      //this._dbService.getBaseBattery().subscribe(
    this._dbService.getBaseBattery_Detalles(-1).subscribe(      
    data => {
               console.log(data);
           
               this.batterybase = data;                              
          },
          error => {
            console.error(error);
          },
          () =>{
           
              for (let i = 0; i < this.batterybase.length; i++) {                
                
               this.addMarker(this.batterybase[i]["latitud"], this.batterybase[i]["longitud"],  
               this.batterybase[i]["ubicacion"], this.batterybase[i]["disponibles"],
               this.batterybase[i]["retornables"], this.batterybase[i]["status"], 
               this.batterybase[i]["direccion"], this.batterybase[i]["zipcode"]);               
               
              }
                         
          }
);
}//Fin getBaseBattery

/**
 * Obtener las baterías alquiladas por el usuario.
 * Si tiene baterías alquiladas, mostrarlas;
 * en caso contrario pasar directo a la pantalla de alquiler
 */
/* getBatterysByCliente(){  
    alert("we");
    if(this.idclient == null)  {
      //this.route.navigateByUrl('/login');
      this._dbService.g_login_accion = 5;
      this.loginPage();
    }
    else{
          this._dbService.getBatteryByCliente_promise(this.idclient).then(
            (res) => { 
              
              console.log(res);      
              this.batterycliente = res;              
              
              if (this.batterycliente.length == []){        
                this._dbService.g_opcion = 1; 
                
                this.route.navigate(['/alquiler']);     
                //scanCode();
              }
              else{                
                this.route.navigate(['/menu-alquiler']);
              }
            },
            (error) =>{
              console.error(error);
              alert("Error: " + error)
            }
          )
    }
      
 }//Fin getBatterysByCliente
*/
 /*Ir a rentar batería
   Se realiza todo el proceso de rentar la batería.
 */
 rentar_batt(){    
      
  if(this.idclient == null)  {
    //this.route.navigateByUrl('/login');
    this._dbService.g_login_accion = 5;
    this.loginPage();
  }
  else{
    this._dbService.g_opcion = 1; 
                console.log('rentbatt');
    //Esto es lo original 
      // this.route.navigate(['/alquiler']);     


    //this.scanCode();   
    this.scanCode_QrScanner(); 
  }
}//rentar_batt()
 

//Obtener todas las bases activas y sus detalles
 getBatteryBase_Detalles(){
  /* const loading = await this._loading.create();
   loading.present();*/
   
    this._dbService.getBaseBattery_Detalles(-1).subscribe(
        data => {
                //console.log(data);
                console.log(data);                
                return this.batterybase = data;                                    
                
              },
              error => {
                 // loading.dismiss();
              },
              () =>{
                //loading.dismiss();
                console.log("Abre menú");                
              }
    );

}// Fin getBatteryBase

//Terminar sesión
 logout(){    
  this.hideMenu(); 
  if(!(this.idclient == null))  {
        this.presentConfirm();
  }
 }

 async presentConfirm() {
  const alert = await this._alertCtrl.create({
    //title: 'Confirm purchase',
    header: "Batt2go",
    message: 'Exit?',

    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Ok',
        handler: () => {
          console.log('logout');
          
          this.idclient = null;
          this.nombreclient = null;
          
          this._dbService.limpiar_Variables_Globales();
          
          this.presentAlert("See you later.");
        }
      }
    ]
  });

  await alert.present();
  
}//Fin presentConfirm()


//Ir al login
loginPage(){
  this.route.navigateByUrl('/login');
}

loginPageForMenu(){
  if(this.idclient == null)  {
      this.hideMenu();
      this._dbService.g_login_accion = 0; //Ir al mapa
      this.route.navigateByUrl('/login');
  }
}

homePage(){
     this.hideMenu();
     this.loadMap();      
}

historyPage(){ 
    this.hideMenu();
    if(this.idclient == null)  {
      //this.route.navigateByUrl('/login');
      this._dbService.g_login_accion = 1; 
      this.loginPage();
    }
    else{            
      this.route.navigateByUrl('history-page');
    }  
}//Fin istoryPage


supportPage(){ 
  this.hideMenu();
  if(this.idclient == null)  {
    //this.route.navigateByUrl('/login');
    this._dbService.g_login_accion = 3; 
    this.loginPage();
  }
  else{    
    this.route.navigateByUrl('support-page');
  }  
}//Fin supportPage

aboutusPage(){ 
  this.hideMenu();
  //ESTE BLOQUE ES EL CORRECTO
  /*if(this.idclient == null)  {
    //this.route.navigateByUrl('/login');
    this.loginPage();
  }
  else{  */      
    this.route.navigateByUrl('aboutus');    
  //}  

}//Fin aboutusPage

settingPage(){ 
  this.hideMenu();
  if(this.idclient == null)  {
    //this.route.navigateByUrl('/login');
    this._dbService.g_login_accion = 4;
    this.loginPage();
  }
  else{        
    this.route.navigateByUrl('setting');    
  }  
}//Fin setting

paymentPage(){ 
  this.hideMenu();
  if(this.idclient == null)  {
    //this.route.navigateByUrl('/login');
    this._dbService.g_login_accion = 2;
    this.loginPage();
  }
  else{    
   // this.presentAlert("En Construcción.");
  
    this.route.navigateByUrl('payment-page');    
  }  
}//Fin paymentPage

consultaWalletPage(){
  this.hideMenu();
  if(this.idclient == null)  {
    //this.route.navigateByUrl('/login');
    this._dbService.g_login_accion = 6;
    this.loginPage();
  }
  else{    
   // this.presentAlert("En Construcción.");
  
    this.route.navigateByUrl('consultawallet');    
  }
}


hideMenu(){
  this._menu.enable(false);
  this._menu.enable(true);
}

//Recargar y refrescar información fr las bases
refreshbase(){
  this.addMaker_BaseBattery();
}

//Recargar mapa
refreshmapa(){
  this.loadMap();
}

/**
 * 
 *  Obtener el código qr en la url indicada en el parámetro _url.
 */
obtenerQrByUrl(_url){  
  var urlaux;
  
    urlaux = _url.split("?");
        
    if(!(urlaux.length == 0)){      
      if(urlaux.length > 1){
        return urlaux[1].split("=")[1];  
      }
      else{        
        return _url;  
      }
    }
    else{       
      return _url;
    }
    
}

/**
 * 
 * @param _longitud 
 * @param _latitud 
 * Construye el link con la longitud y latitud indicada
 */
browser_url(_longitud, _latitud){ 
  var url_maps: string;
  let opts : string = "location=yes,clearcache=yes,hidespinner=no";

  url_maps = "http://maps.google.com/?ll=" + _latitud + ", " + _longitud + "&z=18";

  
 
  this._browser.create(url_maps, '_self', opts);
  
  //this.browserLink(url_maps);
}



////7777777777777777777
/**
 * Verificar si serve está en línea
 * 
 */
serverOnline(base){
    
  let comando = "00";
  

  this._dbService.getliberaBatt(comando, base, "").then(
    res => {
        console.log(res);
                 
        if(res == null){
          alert("Host off line.")         
        }
        else{
            //alert("Host on Line.");                                               
            this.getDetallesBaseBattery(base);
        }//else if(!res == null)
                  
    }, err =>{
    
        console.log(err.message);                    
    }); 
 
}//Fin liberarBatt

////777777777777777777



/////////8888888888888
async presentAlertConfirm() {
  const alert = await this._alertCtrl.create({        
    header: "Exit the app",         
    message: 'Do you want to exit the app?',                            
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'yes',
        handler: () => {
          console.log('Confirm Yes');
          //this._platform.exitApp();
          navigator['app'].exitApp();                    
        }
      }
    ]
  });

  await alert.present();
}
/////////88888888888888

//Buscar la base
searchBaseByOption(){
  //alert(this.searchbase);
  this.issearchbase = false;  
  this.batterybase = [];
  if(this.searchbase.length > 0){
    this._dbService.getsearchBase(this.searchbase).then(
      res => {
          console.log(res);
          this.issearchbase = true;         
          if(res == null){          
            this.batterybase = [];
          }
          else{  
              this.batterybase = res;
          }//else if(!res == null)
                    
      }, err =>{    
          console.log(err.message);                    
      });
  }
  else{
    alert("nada")
  }
  
}//Fin searchBase


/*async pruebaruta(){
  //const detalles_posicion = await this.getPosition();
  this. directionsService = new google.maps.DirectionsService;
  this.directionsDisplay = new google.maps.DirectionsRenderer;
    
  this. directionsDisplay.setMap(this.mapRef);

  this.directionsService.route({
    origin: this.currentLocation,
    destination: {
      lat: 10.9664108,
      lng: -63.8662443
    },
    travelMode: 'DRIVING'
  }, function (response, status) {
    if (status === 'OK') {
      this.directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });

  
}
*/

}//Fin class MapsPage
