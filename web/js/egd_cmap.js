/**

   egd_cmap.js

**/

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

/*************************************************************************/

function cmapLogAll(val,N,vmin,vmax) {

   if(vmin==0) vmin=(1.0E-9);
   let logmin= Math.log(vmin);
   let logmax=Math.log(vmax);
   let logval=Math.log(val);

   logmin=truncateNumber(logmin,3);
   logmax=truncateNumber(logmax,3);
   logval=truncateNumber(logval,3);

   let idx=0;
   if(logval <= logmin) {
     idx=0;
   } else if ( logval >= logmax) {
     idx= N-1;
   } else { 
      let step = (logmax - logmin)/N;
      idx= Math.floor((logval-logmin)/step);
   }

   return logval, logmin, logmax, idx;
}

function cmapGetSliprateColor(v, N, vmin,vmax) {
   let target, tmin, tmax, idx=cmapLogAll(v,N,vmin,vmax);

   let cset=egd_cmap_tb.sliprate_rgb;
   let color=cset[idx];

   return color;
}

// make N+1 segments -- for making color bar ticks
// log = y, linear = x
function cmapGetSliprateSegment(N, vmin,vmax) {
   if(vmin==0) vmin=(1.0E-9);
   let tmin=Math.log(vmin);
   let tmax=Math.log(vmax);

   tmin=truncateNumber(tmin,3);
   tmax=truncateNumber(tmax,3);

window.console.log("val RANGE :  "+vmin+" to "+vmax);

window.console.log("log RANGE :  "+tmin+" to "+tmax);

   let segments=[];
   let isegments=[];
   let vvsegments=[];

   let step = (tmax - tmin)/N;
   let vvstep = (vmax - vmin)/N;
   let v,iv, vv;
   for( let i=0; i<N+1; i++) {

      v=(i*step + tmin);
      vv=(i*vvstep + vmin);
      iv=Math.exp(v); 

      v=truncateNumber(v,3);
      segments.push(v);
      vv=truncateNumber(vv,3);
      vvsegments.push(vv);
      iv=truncateNumber(iv,3);
      isegments.push(iv);
   }
window.console.log("linear", vvsegments.toString());
window.console.log("log", segments.toString());
window.console.log(isegments.toString());
   return segments;
}


function  cmapDebugString(r,N,rmin,rmax) {

   let target, tmin, tmax, idx=cmapLogAll(r,N,rmin,rmax);
   let rc=" "+idx+", ln="+target;
   return rc;
}

