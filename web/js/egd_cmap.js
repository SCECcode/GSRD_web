/**

   egd_cmap.js

**/

/* How many segments to chunk a set of csm data */
const EGD_DEFAULT_DATA_SEGMENT_COUNT= 12;

/* there are 2 different log scale set.. */
var sliprateHighRateSegments=[];
var sliprateLowRateSegments=[];

var egd_cmap_tb={
    sliprate_rgb:[ "rgb(52,16,60)",
                   "rgb(59,91,169)",
                   "rgb(78,132,196)",
                   "rgb(130,210,225)",
                   "rgb(253,245,166)",
                   "rgb(247,237,65)",
                   "rgb(232,216,25)",
                   "rgb(220,183,38)",
                   "rgb(242,101,34)",
                   "rgb(239,60,35)",
                   "rgb(217,34,38)",
                   "rgb(131,21,23)"]
    };

var egd_gradient_tb={
    display_options: [
          {sz:1,  stops: [ "100%" ]},
          {sz:2,  stops: [ "50%", "50%" ]},
          {sz:3,  stops: [ "30%","30% 70%","70%" ]},
          {sz:12, stops: [ "10%",
                           "10% 18%",
                           "18% 26%",
                           "26% 34%",
                           "34% 42%",
                           "42% 50%",
                           "50% 58%",
                           "58% 66%",
                           "66% 74%",
                           "74% 82%",
                           "82% 90%",
                           "90%" ]}

    ]};
/*************************************************************************/
function cmapGetSliprateLowRateColor(v) {
   let idx=cmapGetSliprateLowRateIndex(v);

   let cset=egd_cmap_tb.sliprate_rgb;
   let color=cset[idx];

   return color;
}

function cmapGetSliprateHighRateColor(v) {
   let idx=cmapGetSliprateHighRateIndex(v);

   let cset=egd_cmap_tb.sliprate_rgb;
   let color=cset[idx];

   return color;
}

function cmapGetSliprateLowRateIndex(target) {
   let sz=sliprateLowRateSegments.length;
   if(target < sliprateLowRateSegments[0]) {
     return 0;
   }
   for(let i=1; i<sz; i++) {
     let term=sliprateLowRateSegments[i];
     if( target > term ) {
       continue;
       } else {
          return i-1;
     }
   }
   return sz-1;
}

// chop to 3 digits
function polishNumber(v) {
  let t=(Math.floor( v*1000 )) / 1000; 
  return t; 

}
function cmapGetSliprateHighRateIndex(target) {
   let sz=sliprateHighRateSegments.length;
   if(target < sliprateHighRateSegments[0]) {
     return 0;
   }
   for(let i=1; i<sz; i++) {
     let term=sliprateHighRateSegments[i];
     if( target > term ) {
       continue;
       } else {
          return i-1;
     }
   }
   return sz-1;
}

function _logscale(ea, eb, N) {
   let step= (eb - ea) / N;
   step=polishNumber(step);

   let slist=[];
   let v=ea;
   for( let i=0; i<N; i++) {
     let s=v+(i * step);
     let ns=Math.pow(10, s);
     ns=polishNumber(ns);
     slist.push(ns);
   }
   // last one
   let ss= Math.pow(10, eb);
   ss=polishNumber(ss);
   slist.push(ss);
   return slist;
}

// make N+1 segments -- for making color bar ticks
// log = y, linear = x
function cmapSetupSliprateSegments(lrmin,lrmax,hrmin,hrmax) {
   let N=EGD_DEFAULT_DATA_SEGMENT_COUNT;

window.console.log("lr val RANGE :  "+lrmin+" to "+lrmax);
window.console.log("hr val RANGE :  "+hrmin+" to "+hrmax);

   sliprateLowRateSegments=_logscale(Math.log10(lrmin),Math.log10(lrmax), N);
   sliprateHighRateSegments=_logscale(Math.log10(hrmin),Math.log10(hrmax), N);

window.console.log("lr log", sliprateLowRateSegments.toString());
window.console.log("hr log", sliprateHighRateSegments.toString());
}


// whole set
function cmapGetSegmentColors(searchType) {
  return egd_cmap_tb.sliprate_rgb;
}

function cmapGetSegmentColors0(searchType) {
  let dtb=egd_graident_tb.display_options;
  let dsz=dtb.length;
  let dtarget=undefined;
  for(let d=0; d<sz; d++) {
     let dterm=dtb[d];
     if(dterm.sz == target) {
        dtarget=dterm;
	break;
     }
  }
  if(dtarget == undefined) {
     window.console.log("THIS is BAD...");
     return [];
  }	   

  var rgblist=[];
  let n=EGD_DEFAULT_DATA_SEGMENT_COUNT;
  let clist=egd_cmap_tb.sliprate_rgb;
  for(let i=0; i<n; i++) {
     let s=dtarget[i];
     let c=clist[i];
     let newt=c+" "+s;
     rgblist.push(newt);
  }
  return rgblist;
}

function cmapGetSegmentColorsChunk(searchtype,minval, maxval) {
  var minidx,maxidx=0; 

  if(searchtype == EGD_SLIPRATE.searchType.minrate) {
     minidx=cmapGetSliprateLowRateIndex(minval);
     maxidx=cmapGetSliprateLowRateIndex(maxval);
     } else {
       minidx=cmapGetSliprateHighRateIndex(minval);
       maxidx=cmapGetSliprateHighRateIndex(maxval);
  }
  window.console.log("minval"+minval+"maxval"+maxval+" minidx =="+minidx+" maxidx =="+maxidx);

  let clist=[];
	// dup head and tail by 1 term to extend beyond the handlers
  clist.push(egd_cmap_tb.sliprate_rgb[minidx]);
  for(let i=minidx;i<maxidx;i++) {
      let color=egd_cmap_tb.sliprate_rgb[i];
      clist.push(color);
  }
  let t=clist.length;
  clist.push(clist[t-1]);
  return clist; 
}

function cmapFindSegmentProperties(searchType) {
  var info={};
  if(searchType == EGD_SLIPRATE.searchType.minrate) {
    info.labels=sliprateLowRateSegments;
    info.colors=egd_cmap_tb.sliprate_rgb;
    } else {
      info.labels=sliprateHighRateSegments;
      info.colors=egd_cmap_tb.sliprate_rgb;
  }
  return info;
}
