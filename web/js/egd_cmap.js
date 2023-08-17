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

function getSliprateColor(v, N, vmin,vmax) {
   let target=Math.log(v);
   let tmin=Math.log(vmin);
   let tmax=Math.log(vmax);

   let idx=0;
   if(target <= tmin) {
     idx=0;
   } else if ( target >= tmax) {
     idx= N-1;
   } else { 
      let step = (tmax - tmin)/N;
      idx= Math.floor((target-tmin)/step);
   }
   let cset=egd_cmap_tb.data_rgb;
   let color=cset[idx];
   return color;
}
