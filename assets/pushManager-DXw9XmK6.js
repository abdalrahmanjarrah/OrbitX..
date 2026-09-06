import{c as a,aC as o}from"./index-Ckv2syxF.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],f=a("loader-circle",r);async function i(){var n;try{const{data:e}=await o.getSession();return((n=e.session)==null?void 0:n.access_token)||""}catch{return""}}async function c(n,e){try{const t=await i(),s={"Content-Type":"application/json"};return t&&(s.Authorization=`Bearer ${t}`),(await fetch(n,{method:"POST",headers:s,body:JSON.stringify(e)})).ok}catch{return!1}}function h(){return"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&!1}async function p(n){return!1}async function l(n,e,t,s){return n?c("/api/push/send",{uid:n,title:e,body:t||"",url:s}):!1}export{f as L,p as e,h as i,l as s};
