const _0x404b98=_0x9be0;(function(_0x59a961,_0x35b711){const _0x5a7cee=_0x9be0,_0x412afd=_0x59a961();while(!![]){try{const _0x8a6ef8=-parseInt(_0x5a7cee(0x1a4))/0x1+-parseInt(_0x5a7cee(0x19c))/0x2+-parseInt(_0x5a7cee(0x1a0))/0x3+-parseInt(_0x5a7cee(0x1a2))/0x4*(parseInt(_0x5a7cee(0x19a))/0x5)+parseInt(_0x5a7cee(0x1a8))/0x6*(parseInt(_0x5a7cee(0x1a6))/0x7)+-parseInt(_0x5a7cee(0x1a5))/0x8*(-parseInt(_0x5a7cee(0x197))/0x9)+parseInt(_0x5a7cee(0x1a3))/0xa;if(_0x8a6ef8===_0x35b711)break;else _0x412afd['push'](_0x412afd['shift']());}catch(_0x530814){_0x412afd['push'](_0x412afd['shift']());}}}(_0x3e43,0x50cb3));const axios=require(_0x404b98(0x195)),cheerio=require(_0x404b98(0x196));function _0x9be0(_0x465535,_0x13a6e9){const _0x3e4351=_0x3e43();return _0x9be0=function(_0x9be021,_0x4eb15a){_0x9be021=_0x9be021-0x194;let _0x1defa7=_0x3e4351[_0x9be021];return _0x1defa7;},_0x9be0(_0x465535,_0x13a6e9);}function _0x3e43(){const _0x2c8df7=['&post_type=anime','1131324cVBXaO','5660980nyuLlO','182623GKEkkx','5142392CSkLzn','527632ZBzAGX','attr','36YlnVJz','href','.lozad','Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/108.0.0.0\x20Safari/537.36','.anime-meta','each','axios','cheerio','9xvoJgk','replace','load','10tpbwja','Error:','509508BoAZmD','title','message','find','981549koeCeB'];_0x3e43=function(){return _0x2c8df7;};return _0x3e43();}async function scrapeNekopoi(_0x3380cc){const _0x187018=_0x404b98,_0x424d4c='https://nekopoi.guru/?s=',_0x946d2c=encodeURIComponent(_0x3380cc[_0x187018(0x198)](/[^\w\s]/g,'')),_0x14e506=''+_0x424d4c+_0x946d2c+_0x187018(0x1a1);try{const _0x1f5063=await axios['get'](_0x14e506,{'timeout':0x1388,'headers':{'User-Agent':_0x187018(0x1ab)}}),_0x49ab1d=cheerio[_0x187018(0x199)](_0x1f5063['data']),_0x57926c=[];return _0x49ab1d(_0x187018(0x1ac))[_0x187018(0x194)]((_0x4d7acb,_0xf97345)=>{const _0x2c8561=_0x187018,_0x35400a=_0x49ab1d(_0xf97345),_0x45bfaf=_0x35400a[_0x2c8561(0x1a7)](_0x2c8561(0x1a9)),_0x1a411a=_0x35400a[_0x2c8561(0x1a7)](_0x2c8561(0x19d)),_0x2e085a=_0x35400a[_0x2c8561(0x19f)](_0x2c8561(0x1aa))['attr']('data-src');_0x57926c['push']({'link':_0x45bfaf,'title':_0x1a411a,'imageUrl':_0x2e085a});}),_0x57926c;}catch(_0x5e209e){console['error'](_0x187018(0x19b),_0x5e209e[_0x187018(0x19e)]);throw _0x5e209e;}}module['exports']=scrapeNekopoi;