function GeneratePages() {  

  var inputSheet = SpreadsheetApp.getActive().getSheetByName("InputSheet")
  var allCells = inputSheet.getRange("A1:A").getValues() 
  var numberOfValues = allCells.filter(String).length  
  var URL_list = inputSheet.getRange(2,1,numberOfValues-1).getValues() 

  inputSheet.getRange('B1').setValue("Status") 
  var valid_URL_list = URL_list.filter((url, index) => {    
    var cellPos = index + 2
    var status = getStatusCode(url) 

    Logger.log(status) 

    if(status == '200' || status == '301' ){
      inputSheet.getRange('B' + cellPos).setValue(status) 
      return true       
    }
    else{    
      inputSheet.getRange('B' + cellPos).setFontColor('red') 
      inputSheet.getRange('B' + cellPos).setValue(status) 
      return false 
    }    
  }) 

  Logger.log(valid_URL_list) 

  var ss = SpreadsheetApp.getActive()
  var mobileSheet = ss.getSheetByName('Mobile') 

  if (!mobileSheet) {
    mobileSheet = ss.insertSheet("Mobile")
    mobileSheet.getRange('A1').setValue("URL")
    mobileSheet.getRange('B1').setValue("Score")
    mobileSheet.getRange('C1').setValue("firstContentfulPaint") 
    mobileSheet.getRange('D1').setValue("speedIndex") 
    mobileSheet.getRange('E1').setValue("timeToInteractive") 
    mobileSheet.getRange('F1').setValue("firstMeaningfulPaint") 
    mobileSheet.getRange('G1').setValue("Largest Contentful Paint")
    mobileSheet.getRange('H1').setValue("Cumulative Layout Shift")
    mobileSheet.getRange('I1').setValue("First Input Delay")    
    mobileSheet.getRange('J1').setValue("Performance Score");
    mobileSheet.getRange('K1').setValue("Accessibility Score");
    mobileSheet.getRange('L1').setValue("Best Practices Score");
    mobileSheet.getRange('M1').setValue("SEO Score");       
  }

  var desktpSheet = ss.getSheetByName('Desktop') 
  if(!desktpSheet){
    desktpSheet = ss.insertSheet("Desktop")
    desktpSheet.getRange('A1').setValue("URL")
    desktpSheet.getRange('B1').setValue("Score")
    desktpSheet.getRange('C1').setValue("firstContentfulPaint") 
    desktpSheet.getRange('D1').setValue("speedIndex") 
    desktpSheet.getRange('E1').setValue("timeToInteractive") 
    desktpSheet.getRange('F1').setValue("firstMeaningfulPaint") 
    desktpSheet.getRange('G1').setValue("Largest Contentful Paint")
    desktpSheet.getRange('H1').setValue("Cumulative Layout Shift")
    desktpSheet.getRange('I1').setValue("First Input Delay") 
    desktpSheet.getRange('J1').setValue("Performance Score");
    desktpSheet.getRange('K1').setValue("Accessibility Score");
    desktpSheet.getRange('L1').setValue("Best Practices Score");
    desktpSheet.getRange('M1').setValue("SEO Score");          
  }

  var jsonResponseSheet = ss.getSheetByName("JSON Responses");
  if (!jsonResponseSheet) {
    jsonResponseSheet = ss.insertSheet("JSON Responses");
    jsonResponseSheet.getRange('A1').setValue("URL");
    jsonResponseSheet.getRange('B1').setValue("JSON Response");
  }


  var mobileData = fetchDataFromPSI('mobile', "https://mainroad-demo.netlify.app/")

  valid_URL_list.forEach((url, index) => {
    var  pos = index+2 

    try{
      var mobileData = fetchDataFromPSI('mobile', url)     
      Logger.log("Mobile Score: ")
      Logger.log(mobileData) 
      mobileSheet.getRange('A'+ pos).setValue(mobileData.url)
      mobileSheet.getRange('B'+ pos).setValue(mobileData.score)
      mobileSheet.getRange('C'+ pos).setValue(mobileData.firstContentfulPaint)
      mobileSheet.getRange('D'+ pos).setValue(mobileData.speedIndex)
      mobileSheet.getRange('E'+ pos).setValue(mobileData.timeToInteractive)
      mobileSheet.getRange('F'+ pos).setValue(mobileData.firstMeaningfulPaint)
      mobileSheet.getRange('G' + pos).setValue(mobileData.largestContentfulPaint);
      mobileSheet.getRange('H' + pos).setValue(mobileData.cumulativeLayoutShift);
      mobileSheet.getRange('I' + pos).setValue(mobileData.firstInputDelay);
      mobileSheet.getRange('J' + pos).setValue(mobileData.performanceScore);
      mobileSheet.getRange('K' + pos).setValue(mobileData.accessibilityScore);
      mobileSheet.getRange('L' + pos).setValue(mobileData.bestPracticesScore);
      mobileSheet.getRange('M' + pos).setValue(mobileData.seoScore);      
   
      

      var desktopData = fetchDataFromPSI('desktop', url) 
      Logger.log("Desktop Score: ")
      Logger.log(desktopData)
      desktpSheet.getRange('A'+ pos).setValue(desktopData.url)
      desktpSheet.getRange('B'+ pos).setValue(desktopData.score)
      desktpSheet.getRange('C'+ pos).setValue(desktopData.firstContentfulPaint)
      desktpSheet.getRange('D'+ pos).setValue(desktopData.speedIndex)
      desktpSheet.getRange('E'+ pos).setValue(desktopData.timeToInteractive)
      desktpSheet.getRange('F'+ pos).setValue(desktopData.firstMeaningfulPaint)
      desktpSheet.getRange('G' + pos).setValue(desktopData.largestContentfulPaint);
      desktpSheet.getRange('H' + pos).setValue(desktopData.cumulativeLayoutShift);
      desktpSheet.getRange('I' + pos).setValue(desktopData.firstInputDelay);    
      desktpSheet.getRange('J' + pos).setValue(desktopData.performanceScore);
      desktpSheet.getRange('K' + pos).setValue(desktopData.accessibilityScore);
      desktpSheet.getRange('L' + pos).setValue(desktopData.bestPracticesScore);
      desktpSheet.getRange('M' + pos).setValue(desktopData.seoScore);       

    }
    catch(error){
      Logger.log("invalid URL : " + url) 
      mobileSheet.getRange('A'+ pos).setFontColor("red")
      mobileSheet.getRange('A'+ pos).setValue(url)      

      desktpSheet.getRange('A'+ pos).setFontColor("red")
      desktpSheet.getRange('A'+ pos).setValue(url)
      Logger.log(error)
    }  
  })
}

function pageSpeedApiEndpointUrl(strategy, url) {
 const apiBaseUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed' 
 const websiteHomepageUrl = url 
 const apikey = 'put your API key here'  // Your API key, don't delete the single quotes ' '
 const apiCategories = ['pwa', 'performance', 'accessibility', 'best-practices', 'seo'];
 let categoryParams = apiCategories.map(aCategory => `&category=${aCategory}`).join('');
 //Logger.log(categoryParams);
 const apiEndpointUrl = apiBaseUrl + '?url=' + websiteHomepageUrl + '&key=' + apikey + '&strategy=' + strategy + categoryParams; 
 //Logger.log(apiEndpointUrl);
 return apiEndpointUrl; 

}

function getStatusCode(url){
   var options = {
     'muteHttpExceptions': true,     
     'followRedirects': false
   } 

   try{
     var response = UrlFetchApp.fetch(url, options) 
   }catch(error){
     Logger.log(error) 
     return(error) 
   }   
   return response.getResponseCode() 
}

function saveJsonToGoogleDoc(jsonString, docName) {
    const doc = DocumentApp.create(docName);
    doc.getBody().setText(jsonString);
    return doc.getUrl(); // Returns the URL of the document for reference
}

function saveJsonToDrive(jsonString, fileName) {
    const folderName = 'JSON Storage'; // Specify your folder name
    const folders = DriveApp.getFoldersByName(folderName);
    let folder;
    if (!folders.hasNext()) {
        folder = DriveApp.createFolder(folderName);
    } else {
        folder = folders.next();
    }
    const file = folder.createFile(fileName, jsonString, MimeType.PLAIN_TEXT);
    return file.getUrl(); // Returns the URL of the file for reference
}


function fetchDataFromPSI(strategy, url) {
  var options = {
    'muteHttpExceptions': true,    
  }; 
  const pageSpeedEndpointUrl = pageSpeedApiEndpointUrl(strategy, url);
  const response = UrlFetchApp.fetch(pageSpeedEndpointUrl, options);
  const json = response.getContentText();

  // //DEBUG
  // // Save the JSON response to the jsonResponseSheet
  // var jsonResponseSheet = SpreadsheetApp.getActive().getSheetByName("JSON Responses");
  // jsonResponseSheet.getRange('A2').setValue(url);
  // jsonRespGoogDocUrl = saveJsonToDrive(json, 'lhJsonResp.txt');
  // //jsonRespGoogDocUrl = saveJsonToGoogleDoc(json, 'lhJsonRespDoc')
  // jsonResponseSheet.getRange('B2').setValue(jsonRespGoogDocUrl); // Store the JSON string
  // //DEBUG

  const parsedJson = JSON.parse(json);
  const lighthouse = parsedJson['lighthouseResult'];  


  const result = {    
    'url': url,
    'score': lighthouse['categories']['performance']['score'] * 100,
    'firstContentfulPaint': lighthouse['audits']['first-contentful-paint']['displayValue'],
    'speedIndex': lighthouse['audits']['speed-index']['displayValue'],
    'timeToInteractive': lighthouse['audits']['interactive']['displayValue'],
    'firstMeaningfulPaint': lighthouse['audits']['first-meaningful-paint']['displayValue'],
    'largestContentfulPaint': lighthouse['audits']['largest-contentful-paint']['displayValue'],
    'cumulativeLayoutShift': lighthouse['audits']['cumulative-layout-shift']['displayValue'],
    'firstInputDelay': lighthouse['audits']['max-potential-fid']['displayValue'], 
    'performanceScore': lighthouse['categories']['performance']['score'] * 100,
    'seoScore': lighthouse['categories']['seo']['score'] * 100,    
    'accessibilityScore': lighthouse['categories']['accessibility']['score'] * 100,
    'bestPracticesScore': lighthouse['categories']['best-practices']['score'] * 100,
    // 'responsiveImages': lighthouse['audits']['uses-responsive-images']['displayValue'], 
    // 'renderBlocking': lighthouse['audits']['render-blocking-resources']['displayValue'],     
    // 'totalBlockingTime': lighthouse['audits']['total-blocking-time']['displayValue'],     
    // 'colorContrast': lighthouse['audits']['color-contrast']['displayValue'],     
  }
  Logger.log('result is:')
  Logger.log(result);
  return result 
  } 
