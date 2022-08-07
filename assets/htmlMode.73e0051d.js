var mt=Object.defineProperty;var _t=(A,b,S)=>b in A?mt(A,b,{enumerable:!0,configurable:!0,writable:!0,value:S}):A[b]=S;var E=(A,b,S)=>(_t(A,typeof b!="symbol"?b+"":b,S),S);import{m as wt,__tla as kt}from"./index.3457fbea.js";let ge,Je,Ye,Ze,$,q,Q,G,J,Y,Z,et,ee,te,ne,C,re,tt,nt,_,R,bt=Promise.all([(()=>{try{return kt}catch{}})()]).then(async()=>{var A=Object.defineProperty,b=Object.getOwnPropertyDescriptor,S=Object.getOwnPropertyNames,rt=Object.prototype.hasOwnProperty,le=(t,r,o,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let e of S(r))!rt.call(t,e)&&e!==o&&A(t,e,{get:()=>r[e],enumerable:!(n=b(r,e))||n.enumerable});return t},it=(t,r,o)=>(le(t,r,"default"),o&&le(o,r,"default")),c={};it(c,wt);let fe,he;fe=2*60*1e3,ne=class{constructor(t){E(this,"_defaults");E(this,"_idleCheckInterval");E(this,"_lastUsedTime");E(this,"_configChangeListener");E(this,"_worker");E(this,"_client");this._defaults=t,this._worker=null,this._client=null,this._idleCheckInterval=window.setInterval(()=>this._checkIfIdle(),30*1e3),this._lastUsedTime=0,this._configChangeListener=this._defaults.onDidChange(()=>this._stopWorker())}_stopWorker(){this._worker&&(this._worker.dispose(),this._worker=null),this._client=null}dispose(){clearInterval(this._idleCheckInterval),this._configChangeListener.dispose(),this._stopWorker()}_checkIfIdle(){!this._worker||Date.now()-this._lastUsedTime>fe&&this._stopWorker()}_getClient(){return this._lastUsedTime=Date.now(),this._client||(this._worker=c.editor.createWebWorker({moduleId:"vs/language/html/htmlWorker",createData:{languageSettings:this._defaults.options,languageId:this._defaults.languageId},label:this._defaults.languageId}),this._client=this._worker.getProxy()),this._client}getLanguageServiceWorker(...t){let r;return this._getClient().then(o=>{r=o}).then(o=>{if(this._worker)return this._worker.withSyncedResources(t)}).then(o=>r)}},function(t){t.MIN_VALUE=-2147483648,t.MAX_VALUE=2147483647}(he||(he={}));var W;(function(t){t.MIN_VALUE=0,t.MAX_VALUE=2147483647})(W||(W={}));var k;(function(t){function r(n,e){return n===Number.MAX_VALUE&&(n=W.MAX_VALUE),e===Number.MAX_VALUE&&(e=W.MAX_VALUE),{line:n,character:e}}t.create=r;function o(n){var e=n;return s.objectLiteral(e)&&s.uinteger(e.line)&&s.uinteger(e.character)}t.is=o})(k||(k={}));var v;(function(t){function r(n,e,i,a){if(s.uinteger(n)&&s.uinteger(e)&&s.uinteger(i)&&s.uinteger(a))return{start:k.create(n,e),end:k.create(i,a)};if(k.is(n)&&k.is(e))return{start:n,end:e};throw new Error("Range#create called with invalid arguments["+n+", "+e+", "+i+", "+a+"]")}t.create=r;function o(n){var e=n;return s.objectLiteral(e)&&k.is(e.start)&&k.is(e.end)}t.is=o})(v||(v={}));var ie;(function(t){function r(n,e){return{uri:n,range:e}}t.create=r;function o(n){var e=n;return s.defined(e)&&v.is(e.range)&&(s.string(e.uri)||s.undefined(e.uri))}t.is=o})(ie||(ie={}));var pe;(function(t){function r(n,e,i,a){return{targetUri:n,targetRange:e,targetSelectionRange:i,originSelectionRange:a}}t.create=r;function o(n){var e=n;return s.defined(e)&&v.is(e.targetRange)&&s.string(e.targetUri)&&(v.is(e.targetSelectionRange)||s.undefined(e.targetSelectionRange))&&(v.is(e.originSelectionRange)||s.undefined(e.originSelectionRange))}t.is=o})(pe||(pe={}));var oe;(function(t){function r(n,e,i,a){return{red:n,green:e,blue:i,alpha:a}}t.create=r;function o(n){var e=n;return s.numberRange(e.red,0,1)&&s.numberRange(e.green,0,1)&&s.numberRange(e.blue,0,1)&&s.numberRange(e.alpha,0,1)}t.is=o})(oe||(oe={}));var ve;(function(t){function r(n,e){return{range:n,color:e}}t.create=r;function o(n){var e=n;return v.is(e.range)&&oe.is(e.color)}t.is=o})(ve||(ve={}));var me;(function(t){function r(n,e,i){return{label:n,textEdit:e,additionalTextEdits:i}}t.create=r;function o(n){var e=n;return s.string(e.label)&&(s.undefined(e.textEdit)||x.is(e))&&(s.undefined(e.additionalTextEdits)||s.typedArray(e.additionalTextEdits,x.is))}t.is=o})(me||(me={}));var M;(function(t){t.Comment="comment",t.Imports="imports",t.Region="region"})(M||(M={}));var _e;(function(t){function r(n,e,i,a,u){var g={startLine:n,endLine:e};return s.defined(i)&&(g.startCharacter=i),s.defined(a)&&(g.endCharacter=a),s.defined(u)&&(g.kind=u),g}t.create=r;function o(n){var e=n;return s.uinteger(e.startLine)&&s.uinteger(e.startLine)&&(s.undefined(e.startCharacter)||s.uinteger(e.startCharacter))&&(s.undefined(e.endCharacter)||s.uinteger(e.endCharacter))&&(s.undefined(e.kind)||s.string(e.kind))}t.is=o})(_e||(_e={}));var ae;(function(t){function r(n,e){return{location:n,message:e}}t.create=r;function o(n){var e=n;return s.defined(e)&&ie.is(e.location)&&s.string(e.message)}t.is=o})(ae||(ae={}));var T;(function(t){t.Error=1,t.Warning=2,t.Information=3,t.Hint=4})(T||(T={}));var we;(function(t){t.Unnecessary=1,t.Deprecated=2})(we||(we={}));var ke;(function(t){function r(o){var n=o;return n!=null&&s.string(n.href)}t.is=r})(ke||(ke={}));var V;(function(t){function r(n,e,i,a,u,g){var d={range:n,message:e};return s.defined(i)&&(d.severity=i),s.defined(a)&&(d.code=a),s.defined(u)&&(d.source=u),s.defined(g)&&(d.relatedInformation=g),d}t.create=r;function o(n){var e,i=n;return s.defined(i)&&v.is(i.range)&&s.string(i.message)&&(s.number(i.severity)||s.undefined(i.severity))&&(s.integer(i.code)||s.string(i.code)||s.undefined(i.code))&&(s.undefined(i.codeDescription)||s.string((e=i.codeDescription)===null||e===void 0?void 0:e.href))&&(s.string(i.source)||s.undefined(i.source))&&(s.undefined(i.relatedInformation)||s.typedArray(i.relatedInformation,ae.is))}t.is=o})(V||(V={}));var L;(function(t){function r(n,e){for(var i=[],a=2;a<arguments.length;a++)i[a-2]=arguments[a];var u={title:n,command:e};return s.defined(i)&&i.length>0&&(u.arguments=i),u}t.create=r;function o(n){var e=n;return s.defined(e)&&s.string(e.title)&&s.string(e.command)}t.is=o})(L||(L={}));var x;(function(t){function r(i,a){return{range:i,newText:a}}t.replace=r;function o(i,a){return{range:{start:i,end:i},newText:a}}t.insert=o;function n(i){return{range:i,newText:""}}t.del=n;function e(i){var a=i;return s.objectLiteral(a)&&s.string(a.newText)&&v.is(a.range)}t.is=e})(x||(x={}));var P;(function(t){function r(n,e,i){var a={label:n};return e!==void 0&&(a.needsConfirmation=e),i!==void 0&&(a.description=i),a}t.create=r;function o(n){var e=n;return e!==void 0&&s.objectLiteral(e)&&s.string(e.label)&&(s.boolean(e.needsConfirmation)||e.needsConfirmation===void 0)&&(s.string(e.description)||e.description===void 0)}t.is=o})(P||(P={}));var m;(function(t){function r(o){var n=o;return typeof n=="string"}t.is=r})(m||(m={}));var I;(function(t){function r(i,a,u){return{range:i,newText:a,annotationId:u}}t.replace=r;function o(i,a,u){return{range:{start:i,end:i},newText:a,annotationId:u}}t.insert=o;function n(i,a){return{range:i,newText:"",annotationId:a}}t.del=n;function e(i){var a=i;return x.is(a)&&(P.is(a.annotationId)||m.is(a.annotationId))}t.is=e})(I||(I={}));var H;(function(t){function r(n,e){return{textDocument:n,edits:e}}t.create=r;function o(n){var e=n;return s.defined(e)&&z.is(e.textDocument)&&Array.isArray(e.edits)}t.is=o})(H||(H={}));var F;(function(t){function r(n,e,i){var a={kind:"create",uri:n};return e!==void 0&&(e.overwrite!==void 0||e.ignoreIfExists!==void 0)&&(a.options=e),i!==void 0&&(a.annotationId=i),a}t.create=r;function o(n){var e=n;return e&&e.kind==="create"&&s.string(e.uri)&&(e.options===void 0||(e.options.overwrite===void 0||s.boolean(e.options.overwrite))&&(e.options.ignoreIfExists===void 0||s.boolean(e.options.ignoreIfExists)))&&(e.annotationId===void 0||m.is(e.annotationId))}t.is=o})(F||(F={}));var j;(function(t){function r(n,e,i,a){var u={kind:"rename",oldUri:n,newUri:e};return i!==void 0&&(i.overwrite!==void 0||i.ignoreIfExists!==void 0)&&(u.options=i),a!==void 0&&(u.annotationId=a),u}t.create=r;function o(n){var e=n;return e&&e.kind==="rename"&&s.string(e.oldUri)&&s.string(e.newUri)&&(e.options===void 0||(e.options.overwrite===void 0||s.boolean(e.options.overwrite))&&(e.options.ignoreIfExists===void 0||s.boolean(e.options.ignoreIfExists)))&&(e.annotationId===void 0||m.is(e.annotationId))}t.is=o})(j||(j={}));var O;(function(t){function r(n,e,i){var a={kind:"delete",uri:n};return e!==void 0&&(e.recursive!==void 0||e.ignoreIfNotExists!==void 0)&&(a.options=e),i!==void 0&&(a.annotationId=i),a}t.create=r;function o(n){var e=n;return e&&e.kind==="delete"&&s.string(e.uri)&&(e.options===void 0||(e.options.recursive===void 0||s.boolean(e.options.recursive))&&(e.options.ignoreIfNotExists===void 0||s.boolean(e.options.ignoreIfNotExists)))&&(e.annotationId===void 0||m.is(e.annotationId))}t.is=o})(O||(O={}));var se;(function(t){function r(o){var n=o;return n&&(n.changes!==void 0||n.documentChanges!==void 0)&&(n.documentChanges===void 0||n.documentChanges.every(function(e){return s.string(e.kind)?F.is(e)||j.is(e)||O.is(e):H.is(e)}))}t.is=r})(se||(se={}));var K=function(){function t(r,o){this.edits=r,this.changeAnnotations=o}return t.prototype.insert=function(r,o,n){var e,i;if(n===void 0?e=x.insert(r,o):m.is(n)?(i=n,e=I.insert(r,o,n)):(this.assertChangeAnnotations(this.changeAnnotations),i=this.changeAnnotations.manage(n),e=I.insert(r,o,i)),this.edits.push(e),i!==void 0)return i},t.prototype.replace=function(r,o,n){var e,i;if(n===void 0?e=x.replace(r,o):m.is(n)?(i=n,e=I.replace(r,o,n)):(this.assertChangeAnnotations(this.changeAnnotations),i=this.changeAnnotations.manage(n),e=I.replace(r,o,i)),this.edits.push(e),i!==void 0)return i},t.prototype.delete=function(r,o){var n,e;if(o===void 0?n=x.del(r):m.is(o)?(e=o,n=I.del(r,o)):(this.assertChangeAnnotations(this.changeAnnotations),e=this.changeAnnotations.manage(o),n=I.del(r,e)),this.edits.push(n),e!==void 0)return e},t.prototype.add=function(r){this.edits.push(r)},t.prototype.all=function(){return this.edits},t.prototype.clear=function(){this.edits.splice(0,this.edits.length)},t.prototype.assertChangeAnnotations=function(r){if(r===void 0)throw new Error("Text edit change is not configured to manage change annotations.")},t}(),be=function(){function t(r){this._annotations=r===void 0?Object.create(null):r,this._counter=0,this._size=0}return t.prototype.all=function(){return this._annotations},Object.defineProperty(t.prototype,"size",{get:function(){return this._size},enumerable:!1,configurable:!0}),t.prototype.manage=function(r,o){var n;if(m.is(r)?n=r:(n=this.nextId(),o=r),this._annotations[n]!==void 0)throw new Error("Id "+n+" is already in use.");if(o===void 0)throw new Error("No annotation provided for id "+n);return this._annotations[n]=o,this._size++,n},t.prototype.nextId=function(){return this._counter++,this._counter.toString()},t}();(function(){function t(r){var o=this;this._textEditChanges=Object.create(null),r!==void 0?(this._workspaceEdit=r,r.documentChanges?(this._changeAnnotations=new be(r.changeAnnotations),r.changeAnnotations=this._changeAnnotations.all(),r.documentChanges.forEach(function(n){if(H.is(n)){var e=new K(n.edits,o._changeAnnotations);o._textEditChanges[n.textDocument.uri]=e}})):r.changes&&Object.keys(r.changes).forEach(function(n){var e=new K(r.changes[n]);o._textEditChanges[n]=e})):this._workspaceEdit={}}return Object.defineProperty(t.prototype,"edit",{get:function(){return this.initDocumentChanges(),this._changeAnnotations!==void 0&&(this._changeAnnotations.size===0?this._workspaceEdit.changeAnnotations=void 0:this._workspaceEdit.changeAnnotations=this._changeAnnotations.all()),this._workspaceEdit},enumerable:!1,configurable:!0}),t.prototype.getTextEditChange=function(r){if(z.is(r)){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var o={uri:r.uri,version:r.version},n=this._textEditChanges[o.uri];if(!n){var e=[],i={textDocument:o,edits:e};this._workspaceEdit.documentChanges.push(i),n=new K(e,this._changeAnnotations),this._textEditChanges[o.uri]=n}return n}else{if(this.initChanges(),this._workspaceEdit.changes===void 0)throw new Error("Workspace edit is not configured for normal text edit changes.");var n=this._textEditChanges[r];if(!n){var e=[];this._workspaceEdit.changes[r]=e,n=new K(e),this._textEditChanges[r]=n}return n}},t.prototype.initDocumentChanges=function(){this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0&&(this._changeAnnotations=new be,this._workspaceEdit.documentChanges=[],this._workspaceEdit.changeAnnotations=this._changeAnnotations.all())},t.prototype.initChanges=function(){this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0&&(this._workspaceEdit.changes=Object.create(null))},t.prototype.createFile=function(r,o,n){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var e;P.is(o)||m.is(o)?e=o:n=o;var i,a;if(e===void 0?i=F.create(r,n):(a=m.is(e)?e:this._changeAnnotations.manage(e),i=F.create(r,n,a)),this._workspaceEdit.documentChanges.push(i),a!==void 0)return a},t.prototype.renameFile=function(r,o,n,e){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var i;P.is(n)||m.is(n)?i=n:e=n;var a,u;if(i===void 0?a=j.create(r,o,e):(u=m.is(i)?i:this._changeAnnotations.manage(i),a=j.create(r,o,e,u)),this._workspaceEdit.documentChanges.push(a),u!==void 0)return u},t.prototype.deleteFile=function(r,o,n){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var e;P.is(o)||m.is(o)?e=o:n=o;var i,a;if(e===void 0?i=O.create(r,n):(a=m.is(e)?e:this._changeAnnotations.manage(e),i=O.create(r,n,a)),this._workspaceEdit.documentChanges.push(i),a!==void 0)return a},t})();var ye;(function(t){function r(n){return{uri:n}}t.create=r;function o(n){var e=n;return s.defined(e)&&s.string(e.uri)}t.is=o})(ye||(ye={}));var Ee;(function(t){function r(n,e){return{uri:n,version:e}}t.create=r;function o(n){var e=n;return s.defined(e)&&s.string(e.uri)&&s.integer(e.version)}t.is=o})(Ee||(Ee={}));var z;(function(t){function r(n,e){return{uri:n,version:e}}t.create=r;function o(n){var e=n;return s.defined(e)&&s.string(e.uri)&&(e.version===null||s.integer(e.version))}t.is=o})(z||(z={}));var Ce;(function(t){function r(n,e,i,a){return{uri:n,languageId:e,version:i,text:a}}t.create=r;function o(n){var e=n;return s.defined(e)&&s.string(e.uri)&&s.string(e.languageId)&&s.integer(e.version)&&s.string(e.text)}t.is=o})(Ce||(Ce={}));var N;(function(t){t.PlainText="plaintext",t.Markdown="markdown"})(N||(N={})),function(t){function r(o){var n=o;return n===t.PlainText||n===t.Markdown}t.is=r}(N||(N={}));var ue;(function(t){function r(o){var n=o;return s.objectLiteral(o)&&N.is(n.kind)&&s.string(n.value)}t.is=r})(ue||(ue={}));var f;(function(t){t.Text=1,t.Method=2,t.Function=3,t.Constructor=4,t.Field=5,t.Variable=6,t.Class=7,t.Interface=8,t.Module=9,t.Property=10,t.Unit=11,t.Value=12,t.Enum=13,t.Keyword=14,t.Snippet=15,t.Color=16,t.File=17,t.Reference=18,t.Folder=19,t.EnumMember=20,t.Constant=21,t.Struct=22,t.Event=23,t.Operator=24,t.TypeParameter=25})(f||(f={}));var ce;(function(t){t.PlainText=1,t.Snippet=2})(ce||(ce={}));var xe;(function(t){t.Deprecated=1})(xe||(xe={}));var Ie;(function(t){function r(n,e,i){return{newText:n,insert:e,replace:i}}t.create=r;function o(n){var e=n;return e&&s.string(e.newText)&&v.is(e.insert)&&v.is(e.replace)}t.is=o})(Ie||(Ie={}));var Ae;(function(t){t.asIs=1,t.adjustIndentation=2})(Ae||(Ae={}));var Se;(function(t){function r(o){return{label:o}}t.create=r})(Se||(Se={}));var Re;(function(t){function r(o,n){return{items:o||[],isIncomplete:!!n}}t.create=r})(Re||(Re={}));var X;(function(t){function r(n){return n.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}t.fromPlainText=r;function o(n){var e=n;return s.string(e)||s.objectLiteral(e)&&s.string(e.language)&&s.string(e.value)}t.is=o})(X||(X={}));var Te;(function(t){function r(o){var n=o;return!!n&&s.objectLiteral(n)&&(ue.is(n.contents)||X.is(n.contents)||s.typedArray(n.contents,X.is))&&(o.range===void 0||v.is(o.range))}t.is=r})(Te||(Te={}));var Pe;(function(t){function r(o,n){return n?{label:o,documentation:n}:{label:o}}t.create=r})(Pe||(Pe={}));var De;(function(t){function r(o,n){for(var e=[],i=2;i<arguments.length;i++)e[i-2]=arguments[i];var a={label:o};return s.defined(n)&&(a.documentation=n),s.defined(e)?a.parameters=e:a.parameters=[],a}t.create=r})(De||(De={}));var U;(function(t){t.Text=1,t.Read=2,t.Write=3})(U||(U={}));var Me;(function(t){function r(o,n){var e={range:o};return s.number(n)&&(e.kind=n),e}t.create=r})(Me||(Me={}));var h;(function(t){t.File=1,t.Module=2,t.Namespace=3,t.Package=4,t.Class=5,t.Method=6,t.Property=7,t.Field=8,t.Constructor=9,t.Enum=10,t.Interface=11,t.Function=12,t.Variable=13,t.Constant=14,t.String=15,t.Number=16,t.Boolean=17,t.Array=18,t.Object=19,t.Key=20,t.Null=21,t.EnumMember=22,t.Struct=23,t.Event=24,t.Operator=25,t.TypeParameter=26})(h||(h={}));var Le;(function(t){t.Deprecated=1})(Le||(Le={}));var Fe;(function(t){function r(o,n,e,i,a){var u={name:o,kind:n,location:{uri:i,range:e}};return a&&(u.containerName=a),u}t.create=r})(Fe||(Fe={}));var je;(function(t){function r(n,e,i,a,u,g){var d={name:n,detail:e,kind:i,range:a,selectionRange:u};return g!==void 0&&(d.children=g),d}t.create=r;function o(n){var e=n;return e&&s.string(e.name)&&s.number(e.kind)&&v.is(e.range)&&v.is(e.selectionRange)&&(e.detail===void 0||s.string(e.detail))&&(e.deprecated===void 0||s.boolean(e.deprecated))&&(e.children===void 0||Array.isArray(e.children))&&(e.tags===void 0||Array.isArray(e.tags))}t.is=o})(je||(je={}));var Oe;(function(t){t.Empty="",t.QuickFix="quickfix",t.Refactor="refactor",t.RefactorExtract="refactor.extract",t.RefactorInline="refactor.inline",t.RefactorRewrite="refactor.rewrite",t.Source="source",t.SourceOrganizeImports="source.organizeImports",t.SourceFixAll="source.fixAll"})(Oe||(Oe={}));var Ne;(function(t){function r(n,e){var i={diagnostics:n};return e!=null&&(i.only=e),i}t.create=r;function o(n){var e=n;return s.defined(e)&&s.typedArray(e.diagnostics,V.is)&&(e.only===void 0||s.typedArray(e.only,s.string))}t.is=o})(Ne||(Ne={}));var Ue;(function(t){function r(n,e,i){var a={title:n},u=!0;return typeof e=="string"?(u=!1,a.kind=e):L.is(e)?a.command=e:a.edit=e,u&&i!==void 0&&(a.kind=i),a}t.create=r;function o(n){var e=n;return e&&s.string(e.title)&&(e.diagnostics===void 0||s.typedArray(e.diagnostics,V.is))&&(e.kind===void 0||s.string(e.kind))&&(e.edit!==void 0||e.command!==void 0)&&(e.command===void 0||L.is(e.command))&&(e.isPreferred===void 0||s.boolean(e.isPreferred))&&(e.edit===void 0||se.is(e.edit))}t.is=o})(Ue||(Ue={}));var We;(function(t){function r(n,e){var i={range:n};return s.defined(e)&&(i.data=e),i}t.create=r;function o(n){var e=n;return s.defined(e)&&v.is(e.range)&&(s.undefined(e.command)||L.is(e.command))}t.is=o})(We||(We={}));var Ve;(function(t){function r(n,e){return{tabSize:n,insertSpaces:e}}t.create=r;function o(n){var e=n;return s.defined(e)&&s.uinteger(e.tabSize)&&s.boolean(e.insertSpaces)}t.is=o})(Ve||(Ve={}));var He;(function(t){function r(n,e,i){return{range:n,target:e,data:i}}t.create=r;function o(n){var e=n;return s.defined(e)&&v.is(e.range)&&(s.undefined(e.target)||s.string(e.target))}t.is=o})(He||(He={}));var Ke;(function(t){function r(n,e){return{range:n,parent:e}}t.create=r;function o(n){var e=n;return e!==void 0&&v.is(e.range)&&(e.parent===void 0||t.is(e.parent))}t.is=o})(Ke||(Ke={}));var ze;(function(t){function r(i,a,u,g){return new ot(i,a,u,g)}t.create=r;function o(i){var a=i;return!!(s.defined(a)&&s.string(a.uri)&&(s.undefined(a.languageId)||s.string(a.languageId))&&s.uinteger(a.lineCount)&&s.func(a.getText)&&s.func(a.positionAt)&&s.func(a.offsetAt))}t.is=o;function n(i,a){for(var u=i.getText(),g=e(a,function(D,B){var Ge=D.range.start.line-B.range.start.line;return Ge===0?D.range.start.character-B.range.start.character:Ge}),d=u.length,p=g.length-1;p>=0;p--){var w=g[p],y=i.offsetAt(w.range.start),l=i.offsetAt(w.range.end);if(l<=d)u=u.substring(0,y)+w.newText+u.substring(l,u.length);else throw new Error("Overlapping edit");d=y}return u}t.applyEdits=n;function e(i,a){if(i.length<=1)return i;var u=i.length/2|0,g=i.slice(0,u),d=i.slice(u);e(g,a),e(d,a);for(var p=0,w=0,y=0;p<g.length&&w<d.length;){var l=a(g[p],d[w]);l<=0?i[y++]=g[p++]:i[y++]=d[w++]}for(;p<g.length;)i[y++]=g[p++];for(;w<d.length;)i[y++]=d[w++];return i}})(ze||(ze={}));var ot=function(){function t(r,o,n,e){this._uri=r,this._languageId=o,this._version=n,this._content=e,this._lineOffsets=void 0}return Object.defineProperty(t.prototype,"uri",{get:function(){return this._uri},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"languageId",{get:function(){return this._languageId},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"version",{get:function(){return this._version},enumerable:!1,configurable:!0}),t.prototype.getText=function(r){if(r){var o=this.offsetAt(r.start),n=this.offsetAt(r.end);return this._content.substring(o,n)}return this._content},t.prototype.update=function(r,o){this._content=r.text,this._version=o,this._lineOffsets=void 0},t.prototype.getLineOffsets=function(){if(this._lineOffsets===void 0){for(var r=[],o=this._content,n=!0,e=0;e<o.length;e++){n&&(r.push(e),n=!1);var i=o.charAt(e);n=i==="\r"||i===`
`,i==="\r"&&e+1<o.length&&o.charAt(e+1)===`
`&&e++}n&&o.length>0&&r.push(o.length),this._lineOffsets=r}return this._lineOffsets},t.prototype.positionAt=function(r){r=Math.max(Math.min(r,this._content.length),0);var o=this.getLineOffsets(),n=0,e=o.length;if(e===0)return k.create(0,r);for(;n<e;){var i=Math.floor((n+e)/2);o[i]>r?e=i:n=i+1}var a=n-1;return k.create(a,r-o[a])},t.prototype.offsetAt=function(r){var o=this.getLineOffsets();if(r.line>=o.length)return this._content.length;if(r.line<0)return 0;var n=o[r.line],e=r.line+1<o.length?o[r.line+1]:this._content.length;return Math.max(Math.min(n+r.character,e),n)},Object.defineProperty(t.prototype,"lineCount",{get:function(){return this.getLineOffsets().length},enumerable:!1,configurable:!0}),t}(),s;(function(t){var r=Object.prototype.toString;function o(l){return typeof l<"u"}t.defined=o;function n(l){return typeof l>"u"}t.undefined=n;function e(l){return l===!0||l===!1}t.boolean=e;function i(l){return r.call(l)==="[object String]"}t.string=i;function a(l){return r.call(l)==="[object Number]"}t.number=a;function u(l,D,B){return r.call(l)==="[object Number]"&&D<=l&&l<=B}t.numberRange=u;function g(l){return r.call(l)==="[object Number]"&&-2147483648<=l&&l<=2147483647}t.integer=g;function d(l){return r.call(l)==="[object Number]"&&0<=l&&l<=2147483647}t.uinteger=d;function p(l){return r.call(l)==="[object Function]"}t.func=p;function w(l){return l!==null&&typeof l=="object"}t.objectLiteral=w;function y(l,D){return Array.isArray(l)&&l.every(D)}t.typedArray=y})(s||(s={})),Ye=class{constructor(t,r,o){E(this,"_disposables",[]);E(this,"_listener",Object.create(null));this._languageId=t,this._worker=r;const n=i=>{let a=i.getLanguageId();if(a!==this._languageId)return;let u;this._listener[i.uri.toString()]=i.onDidChangeContent(()=>{window.clearTimeout(u),u=window.setTimeout(()=>this._doValidate(i.uri,a),500)}),this._doValidate(i.uri,a)},e=i=>{c.editor.setModelMarkers(i,this._languageId,[]);let a=i.uri.toString(),u=this._listener[a];u&&(u.dispose(),delete this._listener[a])};this._disposables.push(c.editor.onDidCreateModel(n)),this._disposables.push(c.editor.onWillDisposeModel(e)),this._disposables.push(c.editor.onDidChangeModelLanguage(i=>{e(i.model),n(i.model)})),this._disposables.push(o(i=>{c.editor.getModels().forEach(a=>{a.getLanguageId()===this._languageId&&(e(a),n(a))})})),this._disposables.push({dispose:()=>{c.editor.getModels().forEach(e);for(let i in this._listener)this._listener[i].dispose()}}),c.editor.getModels().forEach(n)}dispose(){this._disposables.forEach(t=>t&&t.dispose()),this._disposables.length=0}_doValidate(t,r){this._worker(t).then(o=>o.doValidation(t.toString())).then(o=>{const n=o.map(i=>st(t,i));let e=c.editor.getModel(t);e&&e.getLanguageId()===r&&c.editor.setModelMarkers(e,r,n)}).then(void 0,o=>{console.error(o)})}};function at(t){switch(t){case T.Error:return c.MarkerSeverity.Error;case T.Warning:return c.MarkerSeverity.Warning;case T.Information:return c.MarkerSeverity.Info;case T.Hint:return c.MarkerSeverity.Hint;default:return c.MarkerSeverity.Info}}function st(t,r){let o=typeof r.code=="number"?String(r.code):r.code;return{severity:at(r.severity),startLineNumber:r.range.start.line+1,startColumn:r.range.start.character+1,endLineNumber:r.range.end.line+1,endColumn:r.range.end.character+1,message:r.message,code:o,source:r.source}}ge=class{constructor(t,r){this._worker=t,this._triggerCharacters=r}get triggerCharacters(){return this._triggerCharacters}provideCompletionItems(t,r,o,n){const e=t.uri;return this._worker(e).then(i=>i.doComplete(e.toString(),C(r))).then(i=>{if(!i)return;const a=t.getWordUntilPosition(r),u=new c.Range(r.lineNumber,a.startColumn,r.lineNumber,a.endColumn),g=i.items.map(d=>{const p={label:d.label,insertText:d.insertText||d.label,sortText:d.sortText,filterText:d.filterText,documentation:d.documentation,detail:d.detail,command:dt(d.command),range:u,kind:ct(d.kind)};return d.textEdit&&(ut(d.textEdit)?p.range={insert:_(d.textEdit.insert),replace:_(d.textEdit.replace)}:p.range=_(d.textEdit.range),p.insertText=d.textEdit.newText),d.additionalTextEdits&&(p.additionalTextEdits=d.additionalTextEdits.map(R)),d.insertTextFormat===ce.Snippet&&(p.insertTextRules=c.languages.CompletionItemInsertTextRule.InsertAsSnippet),p});return{isIncomplete:i.isIncomplete,suggestions:g}})}},C=function(r){if(r)return{character:r.column-1,line:r.lineNumber-1}},re=function(r){if(r)return{start:{line:r.startLineNumber-1,character:r.startColumn-1},end:{line:r.endLineNumber-1,character:r.endColumn-1}}},_=function(r){if(r)return new c.Range(r.start.line+1,r.start.character+1,r.end.line+1,r.end.character+1)};function ut(t){return typeof t.insert<"u"&&typeof t.replace<"u"}function ct(t){const r=c.languages.CompletionItemKind;switch(t){case f.Text:return r.Text;case f.Method:return r.Method;case f.Function:return r.Function;case f.Constructor:return r.Constructor;case f.Field:return r.Field;case f.Variable:return r.Variable;case f.Class:return r.Class;case f.Interface:return r.Interface;case f.Module:return r.Module;case f.Property:return r.Property;case f.Unit:return r.Unit;case f.Value:return r.Value;case f.Enum:return r.Enum;case f.Keyword:return r.Keyword;case f.Snippet:return r.Snippet;case f.Color:return r.Color;case f.File:return r.File;case f.Reference:return r.Reference}return r.Property}R=function(r){if(r)return{range:_(r.range),text:r.newText}};function dt(t){return t&&t.command==="editor.action.triggerSuggest"?{id:t.command,title:t.title,arguments:t.arguments}:void 0}Z=class{constructor(t){this._worker=t}provideHover(t,r,o){let n=t.uri;return this._worker(n).then(e=>e.doHover(n.toString(),C(r))).then(e=>{if(e)return{range:_(e.range),contents:lt(e.contents)}})}};function gt(t){return t&&typeof t=="object"&&typeof t.kind=="string"}function Xe(t){return typeof t=="string"?{value:t}:gt(t)?t.kind==="plaintext"?{value:t.value.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}:{value:t.value}:{value:"```"+t.language+`
`+t.value+"\n```\n"}}function lt(t){if(t)return Array.isArray(t)?t.map(Xe):[Xe(t)]}q=class{constructor(t){this._worker=t}provideDocumentHighlights(t,r,o){const n=t.uri;return this._worker(n).then(e=>e.findDocumentHighlights(n.toString(),C(r))).then(e=>{if(e)return e.map(i=>({range:_(i.range),kind:ft(i.kind)}))})}};function ft(t){switch(t){case U.Read:return c.languages.DocumentHighlightKind.Read;case U.Write:return c.languages.DocumentHighlightKind.Write;case U.Text:return c.languages.DocumentHighlightKind.Text}return c.languages.DocumentHighlightKind.Text}Je=class{constructor(t){this._worker=t}provideDefinition(t,r,o){const n=t.uri;return this._worker(n).then(e=>e.findDefinition(n.toString(),C(r))).then(e=>{if(e)return[Be(e)]})}};function Be(t){return{uri:c.Uri.parse(t.uri),range:_(t.range)}}et=class{constructor(t){this._worker=t}provideReferences(t,r,o,n){const e=t.uri;return this._worker(e).then(i=>i.findReferences(e.toString(),C(r))).then(i=>{if(i)return i.map(Be)})}},ee=class{constructor(t){this._worker=t}provideRenameEdits(t,r,o,n){const e=t.uri;return this._worker(e).then(i=>i.doRename(e.toString(),C(r),o)).then(i=>ht(i))}};function ht(t){if(!t||!t.changes)return;let r=[];for(let o in t.changes){const n=c.Uri.parse(o);for(let e of t.changes[o])r.push({resource:n,versionId:void 0,textEdit:{range:_(e.range),text:e.newText}})}return{edits:r}}J=class{constructor(t){this._worker=t}provideDocumentSymbols(t,r){const o=t.uri;return this._worker(o).then(n=>n.findDocumentSymbols(o.toString())).then(n=>{if(n)return n.map(e=>({name:e.name,detail:"",containerName:e.containerName,kind:pt(e.kind),range:_(e.location.range),selectionRange:_(e.location.range),tags:[]}))})}};function pt(t){let r=c.languages.SymbolKind;switch(t){case h.File:return r.Array;case h.Module:return r.Module;case h.Namespace:return r.Namespace;case h.Package:return r.Package;case h.Class:return r.Class;case h.Method:return r.Method;case h.Property:return r.Property;case h.Field:return r.Field;case h.Constructor:return r.Constructor;case h.Enum:return r.Enum;case h.Interface:return r.Interface;case h.Function:return r.Function;case h.Variable:return r.Variable;case h.Constant:return r.Constant;case h.String:return r.String;case h.Number:return r.Number;case h.Boolean:return r.Boolean;case h.Array:return r.Array}return r.Function}Q=class{constructor(t){this._worker=t}provideLinks(t,r){const o=t.uri;return this._worker(o).then(n=>n.findDocumentLinks(o.toString())).then(n=>{if(n)return{links:n.map(e=>({range:_(e.range),url:e.target}))}})}},$=class{constructor(t){this._worker=t}provideDocumentFormattingEdits(t,r,o){const n=t.uri;return this._worker(n).then(e=>e.format(n.toString(),null,$e(r)).then(i=>{if(!(!i||i.length===0))return i.map(R)}))}},G=class{constructor(t){this._worker=t}provideDocumentRangeFormattingEdits(t,r,o,n){const e=t.uri;return this._worker(e).then(i=>i.format(e.toString(),re(r),$e(o)).then(a=>{if(!(!a||a.length===0))return a.map(R)}))}};function $e(t){return{tabSize:t.tabSize,insertSpaces:t.insertSpaces}}Ze=class{constructor(t){this._worker=t}provideDocumentColors(t,r){const o=t.uri;return this._worker(o).then(n=>n.findDocumentColors(o.toString())).then(n=>{if(n)return n.map(e=>({color:e.color,range:_(e.range)}))})}provideColorPresentations(t,r,o){const n=t.uri;return this._worker(n).then(e=>e.getColorPresentations(n.toString(),r.color,re(r.range))).then(e=>{if(e)return e.map(i=>{let a={label:i.label};return i.textEdit&&(a.textEdit=R(i.textEdit)),i.additionalTextEdits&&(a.additionalTextEdits=i.additionalTextEdits.map(R)),a})})}},Y=class{constructor(t){this._worker=t}provideFoldingRanges(t,r,o){const n=t.uri;return this._worker(n).then(e=>e.getFoldingRanges(n.toString(),r)).then(e=>{if(e)return e.map(i=>{const a={start:i.startLine+1,end:i.endLine+1};return typeof i.kind<"u"&&(a.kind=vt(i.kind)),a})})}};function vt(t){switch(t){case M.Comment:return c.languages.FoldingRangeKind.Comment;case M.Imports:return c.languages.FoldingRangeKind.Imports;case M.Region:return c.languages.FoldingRangeKind.Region}}let de;te=class{constructor(t){this._worker=t}provideSelectionRanges(t,r,o){const n=t.uri;return this._worker(n).then(e=>e.getSelectionRanges(n.toString(),r.map(C))).then(e=>{if(e)return e.map(i=>{const a=[];for(;i;)a.push({range:_(i.range)}),i=i.parent;return a})})}},de=class extends ge{constructor(t){super(t,[".",":","<",'"',"=","/"])}},nt=function(r){const o=new ne(r),n=(...i)=>o.getLanguageServiceWorker(...i);let e=r.languageId;c.languages.registerCompletionItemProvider(e,new de(n)),c.languages.registerHoverProvider(e,new Z(n)),c.languages.registerDocumentHighlightProvider(e,new q(n)),c.languages.registerLinkProvider(e,new Q(n)),c.languages.registerFoldingRangeProvider(e,new Y(n)),c.languages.registerDocumentSymbolProvider(e,new J(n)),c.languages.registerSelectionRangeProvider(e,new te(n)),c.languages.registerRenameProvider(e,new ee(n)),e==="html"&&(c.languages.registerDocumentFormattingEditProvider(e,new $(n)),c.languages.registerDocumentRangeFormattingEditProvider(e,new G(n)))},tt=function(r){const o=[],n=[],e=new ne(r);o.push(e);const i=(...u)=>e.getLanguageServiceWorker(...u);function a(){const{languageId:u,modeConfiguration:g}=r;Qe(n),g.completionItems&&n.push(c.languages.registerCompletionItemProvider(u,new de(i))),g.hovers&&n.push(c.languages.registerHoverProvider(u,new Z(i))),g.documentHighlights&&n.push(c.languages.registerDocumentHighlightProvider(u,new q(i))),g.links&&n.push(c.languages.registerLinkProvider(u,new Q(i))),g.documentSymbols&&n.push(c.languages.registerDocumentSymbolProvider(u,new J(i))),g.rename&&n.push(c.languages.registerRenameProvider(u,new ee(i))),g.foldingRanges&&n.push(c.languages.registerFoldingRangeProvider(u,new Y(i))),g.selectionRanges&&n.push(c.languages.registerSelectionRangeProvider(u,new te(i))),g.documentFormattingEdits&&n.push(c.languages.registerDocumentFormattingEditProvider(u,new $(i))),g.documentRangeFormattingEdits&&n.push(c.languages.registerDocumentRangeFormattingEditProvider(u,new G(i)))}return a(),o.push(qe(n)),qe(o)};function qe(t){return{dispose:()=>Qe(t)}}function Qe(t){for(;t.length;)t.pop().dispose()}});export{ge as CompletionAdapter,Je as DefinitionAdapter,Ye as DiagnosticsAdapter,Ze as DocumentColorAdapter,$ as DocumentFormattingEditProvider,q as DocumentHighlightAdapter,Q as DocumentLinkAdapter,G as DocumentRangeFormattingEditProvider,J as DocumentSymbolAdapter,Y as FoldingRangeAdapter,Z as HoverAdapter,et as ReferenceAdapter,ee as RenameAdapter,te as SelectionRangeAdapter,ne as WorkerManager,bt as __tla,C as fromPosition,re as fromRange,tt as setupMode,nt as setupMode1,_ as toRange,R as toTextEdit};
