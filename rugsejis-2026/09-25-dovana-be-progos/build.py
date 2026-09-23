from pathlib import Path
from html import escape
from urllib.parse import urlencode
import json

R=Path(__file__).parent
B='#3C3228'; C='#F1EBDD'; T='#A58059'; M='#70675D'
SANS='Arial,Helvetica,sans-serif'; SERIF="Georgia,'Times New Roman',serif"
BASE='https://www.bakli.lt/lt/'
GIFTS=BASE+'dovanu-idejos'
PUBLIC='https://raw.githubusercontent.com/elaiskai/bakli/main/rugsejis-2026/09-25-dovana-be-progos/assets/'
OBS=json.loads((R/'research/products-observed.json').read_text())
SUBJECT='Tiesiog pagalvojau apie Tave.'
PREHEADER='Šešios dovanų idėjos ir keli žodžiai, kurie paverčia jas asmeniškomis.'
P=[
 dict(key='hooks',name='Hooks',kind='RAKTŲ PAKABUKAS',desc='Trumpai žinutei, kuri lydės kaskart paėmus raktus.',price='21,95',file='hooks-7.jpg',obs=1),
 dict(key='moment',name='Moment',kind='PAKABUKAS SU GRAVIŪRA',desc='Po odiniu atvartu – žodžiai, skirti tik vienam žmogui.',price='21,95',file='moment-5.jpg',obs=2),
 dict(key='tanner',name='Tanner su vardu',kind='KORTELIŲ DĖKLAS',desc='Kompaktiškas odinis dėklas su pasirinktu vardu ar inicialais.',price='29,95',file='tanner.jpg',obs=4),
 dict(key='karter',name='Karter su Vyčiu',kind='ODINIS DIRŽAS · 40 MM',desc='Kasdienis aksesuaras su išgraviruotu Vyčiu ant sagties.',price='59,00',file='karter.jpg',obs=5),
 dict(key='tanner-moment',name='Kortelių dėklas + Moment',kind='DOVANŲ RINKINYS',desc='Svarbiausios kortelės ir brangi nuotrauka – visada šalia.',price='45,90',file='tanner-moment.jpg',obs=0),
 dict(key='connor-moment',name='Connor + Moment',kind='DOVANŲ RINKINYS',desc='Odinė piniginė ir pakabukas su Jūsų pasirinkta nuotrauka.',price='55,90',file='connor-moment.jpg',obs=6),
]
for p in P:p['url']=OBS[p['obs']]['url']

def link(u,k):
 return escape(u+('?' if '?' not in u else '&')+urlencode(dict(utm_source='omnisend',utm_medium='email',utm_campaign='20260925_dovana_be_progos',utm_content=k)),quote=True)
def table(x,css='',attr=''):
 return f'<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" {attr} style="width:100%;border-collapse:collapse;table-layout:fixed;mso-table-lspace:0pt;mso-table-rspace:0pt;{css}">{x}</table>'
def td(x,css='',attr=''):return f'<td {attr} style="{css}">{x}</td>'
def row(x,css='',attr=''):return '<tr>'+td(x,css,attr)+'</tr>'
def gap(n):return f'<div style="height:{n}px;line-height:{n}px;font-size:1px">&#160;</div>'
def txt(s,size=15,line=24,color=M,css=''):return f'<p style="margin:0;font-family:{SANS};font-size:{size}px;line-height:{line}px;color:{color};{css}">{s}</p>'
def eye(s,color=T):return txt(s,10,16,color,'font-weight:bold;letter-spacing:1.8px;')
def h(s,size=32,color=B):return f'<h2 style="margin:0;font-family:{SERIF};font-size:{size}px;line-height:{size+7}px;font-weight:normal;color:{color};">{s}</h2>'
def image(file,alt,w,local,url=None):
 from PIL import Image
 iw,ih=Image.open(R/'assets'/file).size
 src='assets/'+file if local else PUBLIC+file
 im=f'<img src="{escape(src,quote=True)}" width="{w}" height="{round(w*ih/iw)}" alt="{escape(alt,quote=True)}" style="display:block;width:100%;max-width:{w}px;height:auto;border:0;margin:0 auto;" />'
 return f'<a href="{link(url,"image_"+file)}" target="_blank" style="color:{B};text-decoration:none">{im}</a>' if url else im
def button(s,u,k,light=False):
 bg=C if light else B;fg=B if light else '#FFFFFF'
 return table(row(f'<a href="{link(u,k)}" target="_blank" style="display:block;padding:15px 8px;font-family:{SANS};font-size:13px;line-height:20px;font-weight:bold;text-align:center;text-decoration:none;color:{fg};">{s}</a>',f'background-color:{bg};border-radius:4px;',f'bgcolor="{bg}"'))
def section(n,title,copy):
 return row(eye(n)+gap(12)+h(title)+gap(12)+txt(copy),'padding:38px 26px 26px;background-color:#FFFFFF;')
def grid(ps,local):
 rows=''
 for layer in ['image','kind','name','desc','price','button']:
  cells=[]
  for i,p in enumerate(ps):
   if layer=='image':x=image(p['file'],p['name']+' – '+p['kind'],284,local,p['url']);pad='0'
   elif layer=='kind':x=eye(p['kind'],M);pad='19px 0 8px'
   elif layer=='name':x=h(p['name'],23);pad='0 0 12px'
   elif layer=='desc':x=txt(p['desc'],13,21);pad='0 0 18px'
   elif layer=='price':x=txt(p['price']+' €',24,30,B,'font-weight:bold;white-space:nowrap;');pad='0 0 17px'
   else:x=button('Atrasti →',p['url'],p['key']+'_cta');pad='0'
   cells.append(td(f'<div style="padding:{pad}">{x}</div>','width:50%;vertical-align:top;padding:'+('0 10px 0 0' if i==0 else '0 0 0 10px')+';','width="50%" valign="top"'))
  rows+='<tr>'+''.join(cells)+'</tr>'
 return row(table(rows),'padding:0 26px 36px;background-color:#FFFFFF;')
def render(local=False):
 s=[]
 header=table('<tr>'+td(image('bakli-logo.jpg','Bakli',112,local,BASE),'padding:22px 26px;width:50%;','width="50%"')+td(eye('LEATHER CRAFTS',M)+eye('DOVANA BE PROGOS',B),'padding:22px 26px;text-align:right;width:50%;','width="50%"')+'</tr>')
 s.append(row(header,'background-color:#FFFFFF;'))
 s.append(row(image('hero-dovana-v1.png','Dovana be progos. Tiesiog pagalvojau apie Tave. Mažas gestas. Jūsų žodžiai. Atrasti dovanas.',640,local,GIFTS),'padding:0;font-size:0;line-height:0;background-color:'+C+';border-top:2px solid '+B+';border-bottom:2px solid '+B+';',f'bgcolor="{C}"'))
 s.append(row(txt('Kartais pakanka vienos minties: „Tai jam.“ Arba: „Jai patiktų.“',18,28,B)+gap(14)+txt('Gimtadienio laukti nereikia. Išrinkite mažą dovaną ir pridėkite žodžius, kuriuos norisi pasakyti. Štai šešios idėjos pradžiai.'),'padding:30px 32px 33px;background-color:'+C+';'))
 s.append(section('01 / MAŽAS GESTAS','Keli žodžiai. Daug šilumos.','Pakabukas prie raktų gali kasdien priminti, kas jį padovanojo. Pasirinkite formą ir savo žinutę.'))
 s.append(grid(P[:2],local))
 quote=eye('KĄ NORĖTUMĖTE PASAKYTI?','#D6B995')+gap(14)+h('Pradėkite nuo vieno sakinio.',30,'#FFFFFF')+gap(24)
 for small,big in [('ARTIMAM ŽMOGUI','„Gera, kad esi.“'),('TAM, SU KURIU GRĮŽTATE NAMO','„Namai – ten, kur Tu.“'),('SAU, NAUJAI PRADŽIAI','„Drąsiau. Tu gali.“')]:
  quote+=eye(small,'#D6B995')+gap(5)+h(big,24,C)+gap(21)
 quote+=txt('Žinučių idėjos įkvėpimui. Pasirinkto gaminio puslapyje rasite graviravimo laukelius ir simbolių limitus.',12,19,'#D9D0C3')
 s.append(row(quote,'padding:34px 32px 28px;background-color:'+B+';',f'bgcolor="{B}"'))
 s.append(section('02 / KASDIEN ŠALIA','Kai dovana tampa įpročiu.','Praktiškas daiktas, kurį malonu turėti su savimi: vardu pažymėtas kortelių dėklas arba odinis diržas su Vyčiu.'))
 s.append(grid(P[2:4],local))
 s.append(row(eye('JŪSŲ PASIRINKIMAS')+gap(9)+h('Vardas, data ar bendra akimirka?',29)+gap(13)+txt('Pakabukui – trumpa žinutė. Dėklui – vardas ar inicialai. „Moment“ pakabukui rinkinyje – nuotrauka, į kurią norisi žiūrėti dar kartą.'),'padding:29px 32px;background-color:'+C+';',f'bgcolor="{C}"'))
 s.append(section('03 / DVI DETALĖS, VIENA DOVANA','Praktiška. Ir labai asmeniška.','Kasdienis aksesuaras ir pakabukas su brangia nuotrauka – pora, kuri pasako daugiau.'))
 s.append(grid(P[4:],local))
 steps=table(''.join(row(eye(n,B)+gap(4)+txt(v,14,22),f'padding:15px 0;border-bottom:1px solid #D9CFBF;') for n,v in [('01 · IŠSIRINKITE','Atraskite gaminį, kuris tiktų tam žmogui.'),('02 · PRIDĖKITE SAVO MINTĮ','Įrašykite tekstą arba pridėkite nuotrauką, jei gaminys tai leidžia.'),('03 · PATIKRINKITE DETALES','Peržiūrėkite rašybą, pasirinktą spalvą ir dydį.')]))
 s.append(row(eye('NUO IDĖJOS IKI DOVANOS')+gap(11)+h('Svarbiausia – Jūsų mintis.',29)+gap(9)+steps,'padding:29px 32px 32px;background-color:'+C+';',f'bgcolor="{C}"'))
 s.append(row(eye('ŽMOGUS SVARBIAU UŽ PROGĄ','#D6B995')+gap(14)+h('Apie ką pagalvojote<br>skaitydami šį laišką?',34,'#FFFFFF')+gap(16)+txt('Galbūt tai ir yra geriausia priežastis pradžiuginti.',15,24,C)+gap(25)+button('Išrinkti dovaną',GIFTS,'closing',True),'padding:37px 32px 39px;background-color:'+B+';',f'bgcolor="{B}"'))
 s.append(row(txt('Nuotraukose pateikti personalizavimo pavyzdžiai. Galutinė kaina priklauso nuo pasirinkto gaminio ir jo variantų. Aktualias kainas, pasirinkimus bei gamybos ir pristatymo terminus rasite produktų puslapiuose.',11,18,M),'padding:23px 26px;background-color:'+C+';'))
 footer=image('bakli-logo.jpg','Bakli',100,local,BASE)+gap(18)+txt(f'<a href="{link(BASE,"footer")}" style="color:{B};text-decoration:none">bakli.lt</a> &nbsp;·&nbsp; <a href="mailto:info@bakli.lt" style="color:{B};text-decoration:none">info@bakli.lt</a>',12,20,B,'text-align:center;')+gap(10)+txt('<a href="https://www.instagram.com/thebakli/" style="color:#70675D">Instagram</a> &nbsp;·&nbsp; <a href="https://www.facebook.com/BakliLT/" style="color:#70675D">Facebook</a>',11,18,M,'text-align:center;')
 s.append(row(footer,'padding:27px 26px 30px;background-color:#FFFFFF;'))
 inner=table(''.join(s),'max-width:640px;margin:0 auto;background-color:#FFFFFF;','align="center"')
 pre=f'<div style="display:none;font-size:1px;color:#F1EBDD;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all">{PREHEADER}</div>'
 body=pre+table(row('<!--[if mso]><table role="presentation" width="640" align="center" cellpadding="0" cellspacing="0"><tr><td><![endif]-->'+inner+'<!--[if mso]></td></tr></table><![endif]-->','padding:0;','align="center"'),'background-color:#EDE7DD;')
 html='<!doctype html><html lang="lt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Bakli · Dovana be progos</title></head><body style="margin:0;padding:0;background-color:#EDE7DD;-webkit-text-size-adjust:100%;">'+body+'</body></html>'
 return html,body

for local,name in [(True,'preview-local.html'),(False,'newsletter.html')]:
 html,body=render(local);(R/name).write_text(html)
 if not local:(R/'OMNISEND-IKELTI.html').write_text(body)
(R/'research/products.json').write_text(json.dumps({'verified':'2026-09-23','campaign_date':'2026-09-25','products':P},ensure_ascii=False,indent=2))
print('Built 6-product campaign. HTML bytes:',(R/'newsletter.html').stat().st_size)
