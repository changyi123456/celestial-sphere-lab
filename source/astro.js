/* Educational mean-equator-of-date model. Degrees unless otherwise stated. */
(function(root){
'use strict';
const D=Math.PI/180, mod=(x,n=360)=>(x%n+n)%n, clamp=(x,a=-1,b=1)=>Math.max(a,Math.min(b,x));
function jd(date){return date.getTime()/86400000+2440587.5;}
function gmst(date){const d=jd(date)-2451545,T=d/36525;return mod(280.46061837+360.98564736629*d+0.000387933*T*T-T*T*T/38710000);}
function sun(date){
 const T=(jd(date)-2451545)/36525,L=mod(280.46646+T*(36000.76983+.0003032*T)),M=mod(357.52911+T*(35999.05029-.0001537*T));
 const e=.016708634-T*(.000042037+.0000001267*T),C=(1.914602-T*(.004817+.000014*T))*Math.sin(M*D)+(.019993-.000101*T)*Math.sin(2*M*D)+.000289*Math.sin(3*M*D);
 const lon=mod(L+C),eps=23+(26+(21.448-T*(46.815+T*(.00059-.001813*T)))/60)/60;
 const ra=mod(Math.atan2(Math.cos(eps*D)*Math.sin(lon*D),Math.cos(lon*D))/D),dec=Math.asin(Math.sin(eps*D)*Math.sin(lon*D))/D;
 const y=Math.tan(eps*D/2)**2;
 const eqTime=4/D*(y*Math.sin(2*L*D)-2*e*Math.sin(M*D)+4*e*y*Math.sin(M*D)*Math.cos(2*L*D)-.5*y*y*Math.sin(4*L*D)-1.25*e*e*Math.sin(2*M*D));
 return {ra,dec,lon,eps,eqTime};
}
function horizontal(ra,dec,lat,lst){
 const H=mod(lst-ra+180)-180,h=H*D,p=lat*D,d=dec*D;
 const east=-Math.cos(d)*Math.sin(h),up=Math.sin(p)*Math.sin(d)+Math.cos(p)*Math.cos(d)*Math.cos(h),north=Math.cos(p)*Math.sin(d)-Math.sin(p)*Math.cos(d)*Math.cos(h);
 return {alt:Math.asin(clamp(up))/D,az:Math.hypot(east,north)<1e-10?null:mod(Math.atan2(east,north)/D),hourAngle:H,x:east,y:up,z:-north};
}
function precess(ra,dec,date){
 const t=(jd(date)-2451545)/36525;
 const zeta=(2306.2181*t+.30188*t*t+.017998*t*t*t)/3600*D,z=(2306.2181*t+1.09468*t*t+.018203*t*t*t)/3600*D,theta=(2004.3109*t-.42665*t*t-.041833*t*t*t)/3600*D;
 const a=ra*D+zeta,d=dec*D,A=Math.cos(d)*Math.sin(a),B=Math.cos(theta)*Math.cos(d)*Math.cos(a)-Math.sin(theta)*Math.sin(d),C=Math.sin(theta)*Math.cos(d)*Math.cos(a)+Math.cos(theta)*Math.sin(d);
 return {ra:mod((Math.atan2(A,B)+z)/D),dec:Math.asin(clamp(C))/D};
}
function star(row,date){
 const years=(jd(date)-2451545)/365.25;
 // Hipparcos mu_alpha* includes cos(delta). Apply tangent-vector motion;
 // this also avoids division by cos(delta) close to the celestial poles.
 const a=row[1]*15*D,d=row[2]*D,ca=Math.cos(a),sa=Math.sin(a),cd=Math.cos(d),sd=Math.sin(d);
 const x=cd*ca+years*(-row[5]*sa-row[6]*sd*ca),y=sd+years*row[6]*cd,z=-cd*sa+years*(-row[5]*ca+row[6]*sd*sa),r=Math.hypot(x,y,z);
 return precess(mod(Math.atan2(-z,x)/D),Math.asin(clamp(y/r))/D,date);
}
function visibility(dec,lat){
 const a=Math.sin(lat*D)*Math.sin(dec*D),b=Math.abs(Math.cos(lat*D)*Math.cos(dec*D)),lo=a-b,hi=a+b;
 if(Math.abs(lo)<1e-8&&Math.abs(hi)<1e-8)return '沿地平線';
 if(lo>1e-8)return '拱極・全日不落';
 if(hi < -1e-8)return '全日不升';
 if(Math.abs(lo)<1e-8||Math.abs(hi)<1e-8)return '與地平線相切';
 return '東升西落';
}
function solarDay(date,lat,lon,tz){
 const s=sun(date),p=lat*D,d=s.dec*D,a=Math.sin(p)*Math.sin(d),b=Math.abs(Math.cos(p)*Math.cos(d));
 const noon=720-4*lon-s.eqTime+tz*60;
 let hours,type='一般日';
 if(b<1e-9){hours=a>1e-7?24:a < -1e-7?0:12;type=hours===24?'極晝':hours===0?'極夜':'沿地平線';}
 else if(a-b>=0){hours=24;type='極晝';}else if(a+b<=0){hours=0;type='極夜';}else hours=2*Math.acos(clamp(-a/b))/D/15;
 return {hours,type,noon,rise:type==='一般日'?noon-hours*30:null,set:type==='一般日'?noon+hours*30:null,maxAlt:90-Math.abs(lat-s.dec)};
}
function localDate(date,tz){return new Date(date.getTime()+tz*3600000).toISOString().slice(0,10);}
function localMinutes(date,tz){const d=new Date(date.getTime()+tz*3600000);return d.getUTCHours()*60+d.getUTCMinutes()+d.getUTCSeconds()/60;}
function fromLocal(date,minutes,tz){return new Date(Date.parse(date+'T00:00:00Z')+(minutes-tz*60)*60000);}
function timeText(m){m=mod(Math.round(m),1440);return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');}
const api={D,mod,clamp,jd,gmst,sun,horizontal,precess,star,visibility,solarDay,localDate,localMinutes,fromLocal,timeText};
root.Astro=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
