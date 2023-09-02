/**

   gsrd_cmap.js

**/

/* How many segments to chunk a set of csm data */
const GSRD_DEFAULT_DATA_SEGMENT_COUNT= 12;

/* there are 2 different log scale set.. */
var sliprateHighRateSegments=[];
var sliprateLowRateSegments=[];

var gsrd_cmap_tb={
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

/*************************************************************************/
function cmapGetSliprateLowRateColor(v) {
   let idx=cmapGetSliprateLowRateIndex(v);

   let cset=gsrd_cmap_tb.sliprate_rgb;
   let color=cset[idx];

   return color;
}

function cmapGetSliprateHighRateColor(v) {
   let idx=cmapGetSliprateHighRateIndex(v);

   let cset=gsrd_cmap_tb.sliprate_rgb;
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

// chop to 2 digits
function polishNumber(v) {
  let t=(Math.round( v*100 )) / 100; 
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
window.console.log(" ---- calling cmapSetupSliprateSegments!!!");
   let N=GSRD_DEFAULT_DATA_SEGMENT_COUNT;

//window.console.log("lr val RANGE :  "+lrmin+" to "+lrmax);
//window.console.log("hr val RANGE :  "+hrmin+" to "+hrmax);

   sliprateLowRateSegments=_logscale(Math.log10(lrmin),Math.log10(lrmax), N);
   sliprateHighRateSegments=_logscale(Math.log10(hrmin),Math.log10(hrmax), N);

//window.console.log("lr log", sliprateLowRateSegments.toString());
//window.console.log("hr log", sliprateHighRateSegments.toString());
}


// whole set
function cmapGetSegmentColors() {
  return gsrd_cmap_tb.sliprate_rgb;
}

// not in use 
function cmapGetSegmentColorsChunk(searchtype,minval, maxval) {
  var minidx,maxidx=0; 

  if(searchtype == GSRD_SLIPRATE.searchType.minrate) {
     minidx=cmapGetSliprateLowRateIndex(minval);
     maxidx=cmapGetSliprateLowRateIndex(maxval);
     } else {
       minidx=cmapGetSliprateHighRateIndex(minval);
       maxidx=cmapGetSliprateHighRateIndex(maxval);
  }
  window.console.log("minval"+minval+"maxval"+maxval+" minidx =="+minidx+" maxidx =="+maxidx);

  let clist=[];
	// dup head and tail by 1 term to extend beyond the handlers
  clist.push(gsrd_cmap_tb.sliprate_rgb[minidx]);
  for(let i=minidx;i<maxidx;i++) {
      let color=gsrd_cmap_tb.sliprate_rgb[i];
      clist.push(color);
  }
  let t=clist.length;
  clist.push(clist[t-1]);
  return clist; 
}

function cmapFindSegmentProperties(searchType) {
  var info={};
  if(searchType == GSRD_SLIPRATE.searchType.minrate) {
    info.labels=sliprateLowRateSegments;
    info.colors=gsrd_cmap_tb.sliprate_rgb;
    } else {
      info.labels=sliprateHighRateSegments;
      info.colors=gsrd_cmap_tb.sliprate_rgb;
  }
  return info;
}
