(function(){"use strict";self.onmessage=({data:c})=>{try{const t=d(c);self.postMessage({output:t})}catch(t){self.postMessage({error:t instanceof Error?t.message:"Testing failed or timed out"})}};const a=8;function d({input:c,output:t,tests:l}){if(l.length===0)return[];const s=new RegExp(t,"gu"),n=new RegExp(t,"yu"),o=[];for(const e of l)s.lastIndex=0,n.lastIndex=0,"match"in e?x(c,n,e.match,o):"matchAll"in e?b(c,s,e.matchAll,o):y(c,e.reject.asSubstring?s:n,e.reject,o);return o}function x(c,t,{literal:l,range:s,captures:n},o){const e=t.exec(l);e!=null&&e[0].length===l.length?f(c,e,n,o):o.push({severity:a,...i(c,s),message:`Expression does not exactly match the string '${l}`,title:"No exact match",help:e!=null?`Expression matches a substring '${e[0]}', but not the entire string`:void 0,code:"test"})}function b(c,t,{literal:l,matches:s,range:n},o){const e=[];let r,h=0;for(;(r=t.exec(l))!=null;)e.push(r),t.lastIndex===h&&t.lastIndex++,h=t.lastIndex;if(s.length===0&&e.length>0)return;const u=Math.min(s.length,e.length);for(let g=0;g<u;g++){const p=e[g],m=s[g];p[0]===m.literal?f(c,p,m.captures,o):o.push({severity:a,...i(c,m.range),message:`Match #${g} is '${p[0]}', but expected '${m.literal}`,title:"Incorrect match",code:"test"})}e.length!==s.length&&o.push({severity:a,...i(c,n),message:`There are ${e.length} matches, but ${s.length} matches were expected`,title:"Wrong number of matches",code:"test"})}function y(c,t,{literal:l,range:s,asSubstring:n},o){const e=t.exec(l);e==null||!n&&e[0].length!==l.length||o.push({severity:a,...i(c,s),message:n?`Expression matches the substring '${l}', but was not supposed to match`:"Expression matches exactly, but was not supposed to match",title:"Unexpected match",code:"test"})}function f(c,t,l,s){l.forEach(({ident:n,identRange:o,literal:e,range:r})=>{var u;const h=typeof n=="number"?t[n]:(u=t.groups)==null?void 0:u[n];h===void 0?s.push({severity:a,...i(c,o),message:`Match does not have capturing group '${n}'`,title:"Missing capturing group",code:"test"}):h!==e&&s.push({severity:a,...i(c,r),message:`Capturing group '${n}' matched the text '${h}', but was expected to match '${e}'`,title:"Wrong capturing group content",code:"test"})})}function i(c,[t,l]){const s=c.slice(0,t).split(`
`),n=c.slice(t,l).split(`
`),o=s[s.length-1]??"",e=n[n.length-1]??"",r=o.length+1,h=n.length>1?e.length+1:e.length+r;return{startColumn:r,startLineNumber:s.length,endColumn:h,endLineNumber:s.length+n.length-1}}})();
//# sourceMappingURL=pomskyTestWorker-86e4469a.js.map