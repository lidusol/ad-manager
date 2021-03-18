var jQueryScript = document.createElement('script');  
 jQueryScript.setAttribute('src','https://www.gstatic.com/charts/loader.js');
 jQueryScript.type="text/javascript"
 document.head.appendChild(jQueryScript); 
 setTimeout(() => {
     try{
         google.charts.load('current', {
           'packages':['corechart', 'geochart', 'line', 'bar', 'timeline'],
           // Note: you will need to get a mapsApiKey for your project.
           // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
           'mapsApiKey': 'AIzaSyDWWL2sAz2tVIUPlyl5sXXt3veuHRgBA64'
         });
   
       }catch(e){
         console.log(e)
       }
     
 }, 1500);
