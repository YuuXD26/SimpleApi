function _0x1612(){const _0x245924=['get','15GANUfX','30508qwzOtB','449232boISFo','2046006cOdpeN','24055OkoGdT','resource_response','1613256koUIJr','images','data','axios','results','2453312qUfGss','473200BKhLwB','10wBIgPR','exports','orig','116tktDmx','csrftoken='];_0x1612=function(){return _0x245924;};return _0x1612();}function _0x1127(_0x5a5dcb,_0x328b57){const _0x161214=_0x1612();return _0x1127=function(_0x112714,_0x66b153){_0x112714=_0x112714-0x199;let _0x50cf92=_0x161214[_0x112714];return _0x50cf92;},_0x1127(_0x5a5dcb,_0x328b57);}const _0x29c244=_0x1127;(function(_0x3b1ceb,_0x5ee2cc){const _0xa56d73=_0x1127,_0x597df0=_0x3b1ceb();while(!![]){try{const _0x54f829=-parseInt(_0xa56d73(0x1aa))/0x1*(parseInt(_0xa56d73(0x1ab))/0x2)+parseInt(_0xa56d73(0x199))/0x3+parseInt(_0xa56d73(0x1a7))/0x4*(parseInt(_0xa56d73(0x19b))/0x5)+parseInt(_0xa56d73(0x19d))/0x6+-parseInt(_0xa56d73(0x1a3))/0x7+-parseInt(_0xa56d73(0x1a2))/0x8+parseInt(_0xa56d73(0x19a))/0x9*(parseInt(_0xa56d73(0x1a4))/0xa);if(_0x54f829===_0x5ee2cc)break;else _0x597df0['push'](_0x597df0['shift']());}catch(_0x15ae48){_0x597df0['push'](_0x597df0['shift']());}}}(_0x1612,0x2c87f));const axios=require(_0x29c244(0x1a0));async function getPinterestImages(_0x3cc47a,_0x4dd9f6){const _0x1b30d5=_0x29c244;try{const _0x243d5a=await axios[_0x1b30d5(0x1a9)]('https://www.pinterest.com/resource/BaseSearchResource/get/',{'params':{'data':JSON['stringify']({'options':{'query':_0x3cc47a,'page_size':0x14}})},'headers':{'cookie':_0x1b30d5(0x1a8)+_0x4dd9f6}}),_0x25926d=_0x243d5a[_0x1b30d5(0x19f)][_0x1b30d5(0x19c)]['data'][_0x1b30d5(0x1a1)],_0x26587f=_0x25926d['map'](_0x40928a=>_0x40928a[_0x1b30d5(0x19e)][_0x1b30d5(0x1a6)]['url']);return _0x26587f;}catch(_0x5620e2){throw new Error('Terjadi\x20kesalahan\x20saat\x20mengambil\x20data\x20dari\x20Pinterest');}}module[_0x29c244(0x1a5)]={'getPinterestImages':getPinterestImages};