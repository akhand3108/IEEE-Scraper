let dataset = {};


function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

async function fetchPageData(year,pageNumber,pageStore) {
  const body = JSON.stringify({
    queryText: "image segmentation",
    highlight: true,
    returnFacets: ["ALL"],
    returnType: "SEARCH",
    matchPubs: true,
    ranges: [`${year}_${year}_Year`],
    rowsPerPage: "100",
    pageNumber: pageNumber
  });

  const response = await fetch("https://ieeexplore.ieee.org/rest/search", {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      "sec-ch-ua":
        "\"Not_A Brand\";v=\"99\", \"Microsoft Edge\";v=\"109\", \"Chromium\";v=\"109\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin"
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: body,
    method: "POST",
    mode: "cors",
    credentials: "include"
  });
  const data = await response.json();
  
  let page = []
  data.records.forEach((pub)=>page.push(pub.documentLink))
  pageStore[pageNumber] = page;
}

async function getTotalPages(year){
   const body = JSON.stringify({
    queryText: "image segmentation",
    highlight: true,
    returnFacets: ["ALL"],
    returnType: "SEARCH",
    matchPubs: true,
    ranges: [`${year}_${year}_Year`],
    rowsPerPage: "100",
    pageNumber: 1
  });

    const response = await fetch("https://ieeexplore.ieee.org/rest/search", {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-ch-ua":
          "\"Not_A Brand\";v=\"99\", \"Microsoft Edge\";v=\"109\", \"Chromium\";v=\"109\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: body,
      method: "POST",
      mode: "cors",
      credentials: "include"
    });
    const data = await response.json();
    
    return data.totalPages
}

async function getData(year){
  let pageStore = {}
  totalPages = await getTotalPages(year);
  for(let cur=1;cur<=totalPages;cur++){
    fetchPageData(year,cur,pageStore);
    if(cur%30==0){
      sleep(5000)
    }
  }
  dataset[year] = pageStore;
}


async function getDataFrom(start,end=2023){
  for(let cur=start;cur<=end;cur++){
    await getData(cur);
    console.log(cur + " is completed")
  }
}


total = new Set();

