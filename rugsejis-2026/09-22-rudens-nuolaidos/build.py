from pathlib import Path
from decimal import Decimal, ROUND_DOWN
from html import escape
import json
from urllib.parse import urlsplit
R=Path(__file__).parent
SANS='Arial,Helvetica,sans-serif'; SERIF="Georgia,'Times New Roman',serif"
B='#3C3228'; C='#F1EBDD'; T='#A58059'; M='#70675D'; I='#211D18'
BASE='https://www.bakli.lt/lt/'; SALE=BASE+'specialus-pasiulymai'
existing=json.loads((R/'research/products.json').read_text())
observed=json.loads((R/'research/expanded-products-observed.json').read_text())
urls=existing['images'].copy()
hero=json.loads((R/'hero-config.json').read_text())
overrides=json.loads((R/'asset-overrides.json').read_text())
public_assets=json.loads((R/'public-assets.json').read_text())
urls[hero['filename']]=hero['public_url'] or 'assets/'+hero['filename']
keys=['marco','brandon','harrison','blue-leash','hexa','watermelon','collar','balm','mini-set','paw-wax']
obs=dict(zip(keys,observed))
for k,v in obs.items():urls[k+'.jpg']=v['images'][0]['src']
urls['mini-3.jpg']='https://www.bakli.lt/resized/a361e50bff2636e01a94836602f45412-1000x1000-max/antkaklio-rinkinys-unims-apvalus-mini-3.jpg'
urls['mini-4.jpg']='https://www.bakli.lt/resized/a8b06cf3afbfd2115ceb90dc708a6365-1000x1000-max/antkaklio-rinkinys-unims-apvalus-mini-4.jpg'

def product(key,name,variant,desc,price,was,group,file=None,url=None):
 return dict(key=key,name=name,variant=variant,desc=desc,price=price,was=was,group=group,file=file or key+'.jpg',url=url or obs[key]['url'])
P=[
product('brandon','Brandon','ODINIS DIRŽAS · 96 CM','40 mm pločio. Tinka 87–105 cm liemens apimčiai.','47.20','59.00','belts'),
product('harrison','Harrison','ODINIS DIRŽAS · 99 CM','40 mm pločio. Tinka 90–108 cm liemens apimčiai.','63.20','79.00','belts'),
product('elliot-2','Elliot-2','ODINĖ PINIGINĖ','Kompaktiška, su kortelių išstūmimo mechanizmu.','39.00','64.95','wallets',url=SALE+'/odine-pinigine-elliot-2'),
product('aron','Aron Crazy Horse','ODINĖ PINIGINĖ','Klasikinis modelis su 6 vietomis kortelėms.','39.00','59.00','wallets',url=SALE+'/odine-pinigine-aron-2-crazy-horse'),
product('evan-2','Evan 2','ODINĖ PINIGINĖ','Banknotams, monetoms ir 4 kortelėms.','39.00','65.00','wallets',url=SALE+'/odine-pinigine-evan-2'),
product('marco','Marco Crazy Horse','TAMSIAI RUDA · GELTONI SIŪLAI','Išskirtinis apsiuvimas ir RFID kortelių dėklas.','41.30','59.00','wallets'),
product('mini-set','„Apvalus“ MINI','ANTKAKLIO IR PAKABUKO RINKINYS','Odinis antkaklis ir graviruojamas pakabukas.','26.15','31.90','pets',file='mini-3.jpg'),
product('collar','Classy Daring','RUDAS ANTKAKLIS · M','Biotanas. 36–46 cm kaklo apimčiai.','13.17','21.95','pets'),
product('hexa','Classy Hexa','ŽALIAS PAVADĖLIS · 3 M','Raštuotas biotanas ir auksinės spalvos detalės.','21.95','32.95','pets'),
product('watermelon','Classy Watermelon','PAVADĖLIS · 1,5 M','Lengvas raštuotas pavadėlis kasdienai.','14.95','19.95','pets'),
product('balm','Odos priežiūros balzamas','250 ML','Lygios odos piniginėms, diržams ir kitiems gaminiams.','9.99','16.99','care'),
product('paw-wax','Pėdučių vaškas','50 ML','Šunų ir kačių pėdučių priežiūrai.','9.95','12.95','care')]
D={p['key']:p for p in P}
def money(n):return f'{Decimal(n):.2f}'.replace('.',',')+' €'
def saving(p):return money(Decimal(p['was'])-Decimal(p['price']))
def discount(p):return int(((1-Decimal(p['price'])/Decimal(p['was']))*100).quantize(Decimal('1'),rounding=ROUND_DOWN))
def href(url,tag):return escape(url+('?' if '?' not in url else '&')+'utm_source=omnisend&utm_medium=email&utm_campaign=20260922_rudens_nuolaidos&utm_content='+tag,quote=True)
def table(x,w='100%',css='',attr=''):
 return f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="{w}" {attr} style="table-layout:fixed;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;{css}">{x}</table>'
def td(x,css='',attr=''):return f'<td {attr} style="box-sizing:border-box;{css}">{x}</td>'
def tr(x,css='',attr=''):return '<tr>'+td(x,css,attr)+'</tr>'
def text(x,size=16,line=25,color=I,css=''):return f'<p style="margin:0;font-family:{SANS};font-size:{size}px;line-height:{line}px;color:{color};{css}">{x}</p>'
def eyebrow(x,color=T):return text(x,11,17,color,'letter-spacing:1.8px;font-weight:bold;')
def title(x,size=32,color=B):return f'<h2 style="margin:0;font-family:{SERIF};font-size:{size}px;line-height:{size+6}px;font-weight:normal;color:{color}">{x}</h2>'
def image(file,alt,w,local,url=None):
 selected=overrides.get(file)
 asset_file=selected['file'] if selected else file
 src='assets/'+asset_file if local else public_assets[asset_file]
 s=f'<img src="{escape(src)}" width="{w}" alt="{escape(alt)}" style="display:block;width:100%;max-width:{w}px;height:auto;border:0;margin:0 auto" />'
 return f'<a href="{href(url,"image_"+file.split(".")[0])}" target="_blank" style="text-decoration:none">{s}</a>' if url else s

def cta(label,url,tag,dark=True,wide=250,small=False):
 bg=B if dark else C;fg='#FFFFFF' if dark else B; f=13 if small else 15; pad='13px 8px' if small else '16px 16px'
 return table(tr(f'<a href="{href(url,tag)}" target="_blank" style="display:block;padding:{pad};font-family:{SANS};font-size:{f}px;line-height:20px;font-weight:bold;letter-spacing:.2px;text-align:center;color:{fg};background-color:{bg};text-decoration:none;border-radius:3px">{label}</a>',f'background-color:{bg};border-radius:3px;text-align:center;','align="center"'),str(wide),f'width:100%;max-width:{wide}px;margin:0 auto;','align="center"')

def grid(group,local):
 ps=[p for p in P if p['group']==group]; out=''
 for i in range(0,len(ps),2):
  pair=ps[i:i+2]; rows=''
  layers=[
   ('badge','0 0 0'),('image','0'),('variant','17px 0 7px'),
   ('name','0 0 11px'),('desc','0 0 18px'),('old','0 0 3px'),
   ('price','0'),('saving','3px 0 17px'),('button','0')]
  for layer,pad in layers:
   cells=[]
   for j,p in enumerate(pair):
    if layer=='badge':content=text(f'−{discount(p)} %',12,18,B,'font-weight:bold;letter-spacing:.5px;padding:9px 12px;background-color:'+C+';')
    elif layer=='image':content=image(p['file'],p['name']+' – '+p['variant'],286,local,p['url'])
    elif layer=='variant':content=text(p['variant'],10,15,M,'font-weight:bold;letter-spacing:.5px;')
    elif layer=='name':content=f'<h3 style="margin:0;font-family:{SERIF};font-size:21px;line-height:26px;font-weight:normal;color:{B}">{p["name"]}</h3>'
    elif layer=='desc':content=text(p['desc'],13,20,M)
    elif layer=='old':content=text(f'<span style="text-decoration:line-through">{money(p["was"])}</span>',13,18,M)
    elif layer=='price':content=text(money(p['price']),26,32,B,'font-weight:bold;white-space:nowrap;')
    elif layer=='saving':content=text('Sutaupote '+saving(p),11,17,M)
    else:content=cta('Peržiūrėti →',p['url'],p['key']+'_cta',wide=286,small=True)
    # Shared table rows keep paired titles, descriptions, prices and CTAs aligned.
    content='<div style="padding:'+pad+'">'+content+'</div>'
    cells.append(td(content,'width:50%;padding:'+('0 10px 0 0' if j==0 else '0 0 0 10px')+';vertical-align:top;','width="50%" valign="top"'))
   rows+='<tr>'+''.join(cells)+'</tr>'
  out+=tr(table(rows,css='width:100%;table-layout:fixed;'),'padding:0 24px 35px;')
 return out

def section(number,label,heading,copy,bg='#FFFFFF'):
 inside=eyebrow(number+' / '+label)+f'<div style="height:12px;line-height:12px;font-size:1px">&nbsp;</div>'+title(heading)+f'<div style="height:12px;line-height:12px;font-size:1px">&nbsp;</div>'+text(copy,15,24,M)
 return tr(inside,f'padding:38px 26px 29px;background-color:{bg};text-align:left;')

def require_public_images():
 pending=[]
 for label,entry in [('hero',hero),*overrides.items(),*[(name,{'public_url':url}) for name,url in public_assets.items()]]:
  value=entry.get('public_url') or ''
  parsed=urlsplit(value)
  if parsed.scheme!='https' or not parsed.netloc:
   pending.append(label)
 if pending:
  raise ValueError('Email export requires public HTTPS image URLs in hero-config.json / asset-overrides.json: '+', '.join(pending))

def render(local=False):
 if not local:require_public_images()
 s=[]
 header='<tr>'+td(image('bakli-logo.jpg','Bakli',122,local,BASE),'width:50%;padding:23px 26px;','width="50%"')+td(text('LEATHER CRAFTS',10,16,M,'letter-spacing:1.5px;')+text('RUDENS ATRANKA',10,16,B,'letter-spacing:1.5px;font-weight:bold;'),'padding:23px 26px;text-align:right;','align="right"')+'</tr>'
 s.append(tr(table(header,css='width:100%;background-color:#FFFFFF;')))
 s.append(tr(image(hero['filename'],'Jums. Dovanoms. Augintiniams. Rudens nuolaidos. Mažesnės kainos. Daugiau gerų atradimų. Atrasti visus pasiūlymus.',640,local,SALE),'padding:0;background-color:'+C+';'))
 nav='<tr>'+''.join(td(f'<a href="{href(BASE+path,"nav_"+str(i))}" style="font-family:{SANS};font-size:11px;line-height:17px;color:{B};text-decoration:none;font-weight:bold">{label}</a>','padding:18px 3px;width:33.333%;text-align:center;','width="33.333%" align="center"') for i,(label,path) in enumerate([('DIRŽAI','dirzai'),('PINIGINĖS','pinigines-deklai'),('AUGINTINIAMS','aksesuarai-augintiniams')]))+'</tr>'
 s.append(tr(table(nav,css='width:100%;'),f'padding:0 20px;background-color:{C};border-bottom:1px solid #D6C9B6;'))
 s.append(section('01','DIRŽAI','Detalė, kuri užbaigia įvaizdį.','Natūrali oda, tvirtos sagtys ir 20 % nuolaida atrinktiems dydžiams.'))
 s.append(grid('belts',local))
 note=table('<tr>'+td(eyebrow('MAŽA DETALĖ. DAUG PRASMĖS.')+title('Dovana su Jūsų žodžiais.',27)+text('Diržo vidinėje pusėje galima išgraviruoti asmeninę žinutę. Pasirinkimus rasite produkto puslapyje.',14,23,M),'padding:26px 24px;background-color:'+C+';')+'</tr>')
 s.append(tr(note,'padding:0 24px 2px;'))
 s.append(section('02','PINIGINĖS','Kasdien su Jumis.','Nuo kompaktiškos piniginės iki talpesnės klasikos. Išsirinkite modelį pagal savo įpročius.'))
 s.append(grid('wallets',local))
 feature=table('<tr>'+td(image('mini-4.jpg','Tikri Bakli graviruotų pakabukų pavyzdžiai',300,local,D['mini-set']['url']),'width:50%;background-color:#FFFFFF;vertical-align:middle;','width="50%" valign="middle"')+td(eyebrow('JŲ VARDAS. JŪSŲ RŪPESTIS.','#D6B995')+f'<div style="height:13px;line-height:13px;font-size:1px">&nbsp;</div>'+title('Mažasis<br>šeimos narys.',26,'#FFFFFF')+f'<div style="height:12px;line-height:12px;font-size:1px">&nbsp;</div>'+text('Ir jam verta rasti ką nors gero.',14,22,C),'width:50%;padding:20px 15px;background-color:'+B+';vertical-align:middle;','width="50%" valign="middle"')+'</tr>',css='width:100%;table-layout:fixed;')
 s.append(tr(feature,'padding:8px 0 0;'))
 s.append(section('03','AUGINTINIAMS','Daugiau smagių pasivaikščiojimų.','Antkakliai, pavadėliai ir rinkinys su graviruojamu pakabuku. Patogios detalės kasdieniams išėjimams į lauką.'))
 s.append(grid('pets',local))
 s.append(section('04','PRIEŽIŪRA','Dar truputis rūpesčio.','Dvi nedidelės kasdienės priemonės: odiniams aksesuarams ir augintinio pėdutėms.',C))
 s.append(tr(text('ABI PRIEMONĖS DABAR IKI 10 €',12,19,B,'letter-spacing:1px;font-weight:bold;'),'padding:0 26px 22px;background-color:'+C+';'))
 s.append(grid('care',local))
 ending=eyebrow('ATRASKITE SAVO FAVORITĄ','#D6B995')+f'<div style="height:14px;line-height:14px;font-size:1px">&nbsp;</div>'+title('Geri daiktai.<br>Dar geresnės kainos.',35,'#FFFFFF')+f'<div style="height:17px;line-height:17px;font-size:1px">&nbsp;</div>'+text('Sau, dovanai ar keturkojui draugui.<br>Visi pasiūlymai laukia vienoje vietoje.',15,24,C)+f'<div style="height:25px;line-height:25px;font-size:1px">&nbsp;</div>'+cta('Peržiūrėti visas nuolaidas',SALE,'final',False,280)
 s.append(tr(ending,f'padding:37px 22px 39px;background-color:{B};text-align:center;','align="center"'))
 conditions='Nurodytos kainos taikomos konkretiems laiške pateiktiems gaminiams ir jų variantams. Aktualias kainas, dydžius ir prieinamumą rasite produktų puslapiuose.'
 s.append(tr(text(conditions,11,18,M),'padding:21px 26px;background-color:'+C+';text-align:center;','align="center"'))
 footer=image('bakli-logo.jpg','Bakli',105,local,BASE)+'<div style="height:18px;line-height:18px;font-size:1px">&nbsp;</div>'
 footer+=text('<a href="https://www.instagram.com/thebakli/" style="color:'+B+';text-decoration:underline">Instagram</a> &nbsp;&nbsp; <a href="https://www.facebook.com/BakliLT/" style="color:'+B+';text-decoration:underline">Facebook</a> &nbsp;&nbsp; <a href="https://www.bakli.lt/lt/" style="color:'+B+';text-decoration:underline">bakli.lt</a>',12,20,B)
 footer+=text('<a href="mailto:info@bakli.lt" style="color:'+M+';text-decoration:none">info@bakli.lt</a> &nbsp; · &nbsp; <a href="tel:+37068182002" style="color:'+M+';text-decoration:none">+370 681 820 02</a>',12,20,M,'padding-top:10px;')
 s.append(tr(footer,'padding:29px 18px 30px;background-color:#FFFFFF;text-align:center;','align="center"'))
 inner=table('\n'.join(s),css='width:100%;max-width:640px;margin:0 auto;background-color:#FFFFFF;',attr='align="center"')
 return table(tr('<!--[if mso]><table role="presentation" width="640" align="center" cellpadding="0" cellspacing="0"><tr><td><![endif]-->'+inner+'<!--[if mso]></td></tr></table><![endif]-->','padding:0;','align="center"'),css='width:100%;background-color:#F6F3EE;')

def doc(body):return '<!doctype html><html lang="lt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bakli · Rudens nuolaidos</title><style>body{margin:0;padding:0}img{border:0}table{table-layout:fixed}td{box-sizing:border-box}</style></head><body style="margin:0;padding:0;background:#F6F3EE">'+body+'</body></html>'

# Build content-only import and identical browser previews.
(R/'OMNISEND-IKELTI.html').write_text(render(),encoding='utf8')
(R/'newsletter.html').write_text(doc(render()),encoding='utf8')
(R/'preview-local.html').write_text(doc(render(True)),encoding='utf8')
(R/'research/products.json').write_text(json.dumps({'verified':'2026-09-22','products':P,'images':urls,'count':len(P)},ensure_ascii=False,indent=2),encoding='utf8')
subject='Rudens nuolaidos: atradimai Jums ir Jūsų augintiniui'
preheader='Diržai, piniginės, rinkiniai ir priežiūros priemonės mažesnėmis kainomis.'
plain='TEMA: '+subject+'\nPREHEADER: '+preheader+'\n\nRUDENS NUOLAIDOS\nMažesnės kainos. Daugiau gerų atradimų.\n\n'
for group,name in [('belts','DIRŽAI'),('wallets','PINIGINĖS'),('pets','AUGINTINIAMS'),('care','PRIEŽIŪRA')]:
 plain+=name+'\n\n'
 for p in P:
  if p['group']==group:plain+=p['name']+' · '+p['variant']+'\n'+p['desc']+'\nBuvo '+money(p['was'])+'. Dabar '+money(p['price'])+'.\n'+p['url']+'\n\n'
plain+='VISOS NUOLAIDOS\n'+SALE+'\n\nKainos taikomos konkretiems gaminiams ir jų variantams. Aktualias kainas, dydžius bei prieinamumą rasite produktų puslapiuose.\n\nBakli · info@bakli.lt · +370 681 820 02\n'
(R/'newsletter.txt').write_text(plain,encoding='utf8')
print('Products:',len(P),'HTML bytes:',(R/'OMNISEND-IKELTI.html').stat().st_size)
