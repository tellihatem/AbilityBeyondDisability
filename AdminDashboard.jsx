import { useState, useEffect } from "react";
import { LayoutDashboard, Users, Calendar, Image, Star, Check, X, Plus, Trash2, Edit2 } from "lucide-react";

// ── Palette ──────────────────────────────────────────────────────────────────
const R = '#6c2407', AMB = '#904d13', GOLD = '#d4af37';
const PEACH = '#ffb59c', BLUSH = '#fceae5', CREAM = '#fff8f6';
const DARK = '#231a17', BROWN = '#55433d', BDR = '#dbc1b9';
const SIDE = '#1c1410';

// ── Lookups ──────────────────────────────────────────────────────────────────
const GRADS = [
  'linear-gradient(143deg,#8b3a1c,#fea767)',
  'linear-gradient(37deg,#9a4526,#f1dfda)',
  'linear-gradient(180deg,#005a72,#8b3a1c)',
  'linear-gradient(-37deg,#d4af37,#fea767)',
  'linear-gradient(135deg,#382e2b,#904d13)',
  'linear-gradient(45deg,#004153,#d4af37)',
];
const GNAMES = ['برتقالي دافئ','وردي','أزرق بني','ذهبي','بني غامق','أزرق ذهبي'];
const MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const ETYPES = ['ورشة عمل','معرض محلي','مسابقة','حدث وطني','مهرجان'];
const TCOL = {'ورشة عمل':AMB,'معرض محلي':'#004153','مسابقة':GOLD,'حدث وطني':R,'مهرجان':'#2d6a4f'};
const AVPRE = [
  ['#8b3a1c','#ffb59d'],['#005a72','#8ecfeb'],['#ffdad6','#93000a'],
  ['#fea767','#773b00'],['#6c2407','#ffb59c'],['#382e2b','#dbc1b9'],
];

// ── Seed data ─────────────────────────────────────────────────────────────────
const INIT_REQ = [
  {id:1,name:'فاطمة بن عمر',wilaya:'سطيف',craft:'رسم زيتي',bio:'أرسم منذ الطفولة وأحلم بمشاركة إبداعاتي مع العالم وأؤمن بأن الفن لا حدود له.',date:'2026-05-01',status:'pending'},
  {id:2,name:'يوسف خلاف',wilaya:'عنابة',craft:'نحت على الخشب',bio:'حرفي متخصص في النحت التقليدي الجزائري، أعمل على إحياء التراث المحلي.',date:'2026-05-03',status:'pending'},
  {id:3,name:'نسرين هاشمي',wilaya:'تلمسان',craft:'تطريز تقليدي',bio:'أتقنت فن التطريز الأندلسي منذ صغري على يد جدتي، وأحرص على توريثه.',date:'2026-05-05',status:'pending'},
  {id:4,name:'عمر بوعلام',wilaya:'بسكرة',craft:'خزف فني',bio:'متحمس للحرف اليدوية والفخار الصحراوي وأرغب في تعليم هذه الحرفة للأجيال القادمة.',date:'2026-05-07',status:'approved'},
  {id:5,name:'سمية كردي',wilaya:'بجاية',craft:'كاليغرافي',bio:'الخط العربي هو لغتي الأولى وشغفي الأكبر، درست في مدرسة الخط بالجزائر العاصمة.',date:'2026-05-08',status:'rejected'},
];
const INIT_EVT = [
  {id:1,title:'أساسيات الخزف الفني',type:'ورشة عمل',venue:'مركز الفنون، تيبازة',day:'24',month:'أكتوبر',featured:false},
  {id:2,title:'ألوان الصحراء',type:'معرض محلي',venue:'دار الثقافة، غرداية',day:'05',month:'نوفمبر',featured:false},
  {id:3,title:'جائزة الإبداع الذهبي',type:'مسابقة',venue:'أونلاين',day:'12',month:'ديسمبر',featured:false},
  {id:4,title:'اليوم الوطني للحرف',type:'حدث وطني',venue:'قصر المعارض، الصنوبر البحري',day:'15',month:'نوفمبر',featured:true},
];
const INIT_GAL = [
  {id:1,title:'اللوحة الحالمة',artist:'كريم بن علي',grad:0},
  {id:2,title:'جرة فخارية',artist:'سارة محمدي',grad:1},
  {id:3,title:'تطريز جزائري',artist:'ليلى عبدون',grad:2},
  {id:4,title:'منحوتة',artist:'ياسين حمادي',grad:3},
];
const INIT_TAL = {name:'أحمد',wilaya:'قسنطينة',craft:'الخط العربي',initials:'أ.م',avatarBg:'#8b3a1c',avatarTxt:'#ffb59d',bio:'موهبة استثنائية في الخط العربي الكلاسيكي والمعاصر، يجمع بين الأصالة والإبداع.'};

// ── Shared primitives ─────────────────────────────────────────────────────────

function SBadge({status}) {
  const map = {
    pending:  [GOLD+'22',  '#92400e', 'قيد المراجعة'],
    approved: ['#dcfce7', '#166534', 'مقبول'],
    rejected: ['#fee2e2', '#991b1b', 'مرفوض'],
  };
  const [bg,col,lbl] = map[status] || map.pending;
  return <span style={{padding:'3px 12px',borderRadius:20,fontSize:12,fontWeight:700,background:bg,color:col,whiteSpace:'nowrap'}}>{lbl}</span>;
}

function TPill({type}) {
  const c = TCOL[type] || AMB;
  return <span style={{padding:'2px 10px',borderRadius:20,fontSize:12,fontWeight:700,background:c+'1a',color:c,border:`1px solid ${c}44`}}>{type}</span>;
}

function Toast({msg}) {
  return msg ? (
    <div style={{position:'fixed',bottom:28,left:'50%',transform:'translateX(-50%)',background:DARK,color:'#fff',padding:'11px 28px',borderRadius:50,fontSize:14,fontWeight:600,zIndex:9999,boxShadow:'0 8px 32px rgba(0,0,0,.28)',whiteSpace:'nowrap',pointerEvents:'none'}}>
      ✓ {msg}
    </div>
  ) : null;
}

function Modal({title, onClose, children}) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{position:'fixed',inset:0,background:'rgba(26,20,16,.58)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:8888,padding:24}}>
      <div style={{background:'#fff',borderRadius:20,padding:32,width:500,maxHeight:'88vh',overflowY:'auto',direction:'rtl',boxShadow:'0 32px 80px rgba(0,0,0,.25)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,paddingBottom:16,borderBottom:`1px solid rgba(219,193,185,.4)`}}>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:BROWN,padding:4,display:'flex',alignItems:'center',borderRadius:8}}><X size={20}/></button>
          <h3 style={{margin:0,fontSize:19,fontWeight:700,color:DARK}}>{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
}

const Fld = ({label,children}) => (
  <div style={{marginBottom:16}}>
    {label && <label style={{fontSize:13,fontWeight:600,color:BROWN,marginBottom:6,display:'block'}}>{label}</label>}
    {children}
  </div>
);

const Inp = (props) => (
  <input {...props} style={{width:'100%',padding:'10px 14px',borderRadius:10,border:`1.5px solid ${BDR}`,background:'#fff',fontSize:15,color:DARK,fontFamily:'Tajawal,sans-serif',outline:'none',textAlign:'right',boxSizing:'border-box',...props.style}}/>
);

const Sel = ({children,...props}) => (
  <select {...props} style={{width:'100%',padding:'10px 14px',borderRadius:10,border:`1.5px solid ${BDR}`,background:'#fff',fontSize:15,color:DARK,fontFamily:'Tajawal,sans-serif',outline:'none',textAlign:'right',boxSizing:'border-box',...props.style}}>
    {children}
  </select>
);

function Btn({children, variant='primary', style:s={}, ...rest}) {
  const vs = {
    primary:  {background:R,    color:'#fff', border:'none'},
    outline:  {background:'transparent', color:AMB, border:`2px solid ${AMB}`},
    ghost:    {background:'transparent', color:BROWN, border:`1px solid ${BDR}`},
    danger:   {background:'#fee2e2', color:'#991b1b', border:'none'},
    success:  {background:'#dcfce7', color:'#166534', border:'none'},
  };
  return (
    <button {...rest}
      style={{padding:'8px 18px',borderRadius:50,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'Tajawal,sans-serif',display:'inline-flex',alignItems:'center',gap:6,transition:'opacity .14s',lineHeight:1.4,...vs[variant],...s}}
      onMouseOver={e=>e.currentTarget.style.opacity='.82'}
      onMouseOut={e=>e.currentTarget.style.opacity='1'}>
      {children}
    </button>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

const NAV = [
  {id:'overview', Icon:LayoutDashboard, lbl:'لوحة التحكم'},
  {id:'requests', Icon:Users,           lbl:'طلبات الانضمام'},
  {id:'events',   Icon:Calendar,        lbl:'الفعاليات'},
  {id:'gallery',  Icon:Image,           lbl:'معرض الإبداعات'},
  {id:'talent',   Icon:Star,            lbl:'موهبة الأسبوع'},
];

function Sidebar({tab, setTab, pending}) {
  return (
    <aside style={{width:220,background:SIDE,display:'flex',flexDirection:'column',flexShrink:0,height:'100vh',position:'sticky',top:0}}>
      <div style={{padding:'22px 18px 18px',borderBottom:'1px solid rgba(255,255,255,.07)',textAlign:'right'}}>
        <div style={{fontSize:15,fontWeight:700,color:'#fff',lineHeight:1.4}}>رغم إعاقتي أبدع</div>
        <div style={{fontSize:11,color:'rgba(219,193,185,.38)',marginTop:3}}>لوحة الإدارة</div>
      </div>
      <nav style={{flex:1,padding:'8px 8px',overflowY:'auto'}}>
        {NAV.map(({id,Icon,lbl}) => {
          const active = tab === id;
          return (
            <div key={id} onClick={() => setTab(id)}
              style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 12px',borderRadius:10,marginBottom:3,cursor:'pointer',background:active ? R : 'transparent',color:active ? '#fff' : 'rgba(219,193,185,.65)',fontSize:14,fontWeight:active ? 700 : 400,transition:'background .12s'}}
              onMouseOver={e => { if(!active) e.currentTarget.style.background='rgba(255,255,255,.07)'; }}
              onMouseOut={e  => { if(!active) e.currentTarget.style.background='transparent'; }}>
              {/* Left: badge */}
              {id==='requests' && pending > 0
                ? <span style={{background:'#ef4444',color:'#fff',fontSize:11,fontWeight:700,padding:'1px 7px',borderRadius:20,lineHeight:1.6}}>{pending}</span>
                : <span/>}
              {/* Right: label + icon */}
              <span style={{display:'flex',alignItems:'center',gap:8}}>
                <span>{lbl}</span>
                <Icon size={15} style={{flexShrink:0}}/>
              </span>
            </div>
          );
        })}
      </nav>
      <div style={{padding:'12px 18px',borderTop:'1px solid rgba(255,255,255,.07)',fontSize:11,color:'rgba(219,193,185,.28)',textAlign:'right'}}>v1.0 · 2026</div>
    </aside>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────

function Overview({requests, events, gallery, talent, setTab}) {
  const pend = requests.filter(r => r.status==='pending').length;
  const appv = requests.filter(r => r.status==='approved').length;
  const STATS = [
    {n:pend,  lbl:'طلبات معلقة',    color:GOLD,     tab:'requests'},
    {n:appv,  lbl:'مواهب مقبولة',   color:'#166534', tab:'requests'},
    {n:events.length, lbl:'فعالية مسجلة', color:R,  tab:'events'},
    {n:gallery.length,lbl:'عمل فني',       color:'#004153',tab:'gallery'},
  ];

  return (
    <div>
      <h1 style={{fontSize:26,fontWeight:800,color:DARK,marginBottom:3}}>لوحة التحكم</h1>
      <p style={{fontSize:14,color:BROWN,marginBottom:26}}>مرحباً بك في لوحة إدارة المنصة</p>

      {/* Stat cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:22}}>
        {STATS.map((s,i) => (
          <div key={i} onClick={() => setTab(s.tab)}
            style={{background:'#fff',borderRadius:14,padding:'18px 20px',boxShadow:'0 2px 10px rgba(26,20,16,.06)',border:'1px solid rgba(219,193,185,.35)',cursor:'pointer',transition:'box-shadow .14s'}}
            onMouseOver={e => e.currentTarget.style.boxShadow='0 6px 22px rgba(26,20,16,.12)'}
            onMouseOut={e  => e.currentTarget.style.boxShadow='0 2px 10px rgba(26,20,16,.06)'}>
            <div style={{fontSize:38,fontWeight:800,color:s.color,lineHeight:1}}>{s.n}</div>
            <div style={{fontSize:13,color:BROWN,marginTop:8}}>{s.lbl}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        {/* Recent requests */}
        <div style={{background:'#fff',borderRadius:14,padding:20,boxShadow:'0 2px 10px rgba(26,20,16,.06)',border:'1px solid rgba(219,193,185,.35)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,paddingBottom:12,borderBottom:`1px solid rgba(219,193,185,.35)`}}>
            <Btn variant="outline" onClick={() => setTab('requests')} style={{fontSize:12,padding:'5px 14px'}}>إدارة الطلبات</Btn>
            <span style={{fontSize:15,fontWeight:700,color:DARK}}>آخر الطلبات</span>
          </div>
          {requests.slice(0,4).map(r => (
            <div key={r.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(219,193,185,.12)'}}>
              <SBadge status={r.status}/>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:13,fontWeight:600,color:DARK}}>{r.name}</div>
                <div style={{fontSize:11,color:BROWN}}>{r.wilaya} · {r.craft}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Events preview */}
        <div style={{background:'#fff',borderRadius:14,padding:20,boxShadow:'0 2px 10px rgba(26,20,16,.06)',border:'1px solid rgba(219,193,185,.35)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,paddingBottom:12,borderBottom:`1px solid rgba(219,193,185,.35)`}}>
            <Btn variant="outline" onClick={() => setTab('events')} style={{fontSize:12,padding:'5px 14px'}}>إدارة الفعاليات</Btn>
            <span style={{fontSize:15,fontWeight:700,color:DARK}}>الفعاليات القادمة</span>
          </div>
          {events.slice(0,4).map(e => (
            <div key={e.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(219,193,185,.12)'}}>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <span style={{background:BLUSH,color:R,fontSize:11,fontWeight:700,padding:'2px 10px',borderRadius:20}}>{e.day} {e.month}</span>
                {e.featured && <Star size={12} fill={GOLD} color={GOLD}/>}
              </div>
              <div style={{fontSize:13,fontWeight:600,color:DARK,textAlign:'right'}}>{e.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Talent of week strip */}
      <div style={{background:R,borderRadius:14,padding:'16px 22px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Btn style={{borderColor:'rgba(255,255,255,.3)',color:'#fff',border:'1px solid rgba(255,255,255,.3)',background:'transparent',fontSize:13,padding:'6px 16px'}} onClick={() => setTab('talent')}>
          تعديل
        </Btn>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:11,color:PEACH,marginBottom:2}}>موهبة الأسبوع الحالية</div>
            <div style={{fontSize:17,fontWeight:700,color:'#fff'}}>{talent.name} · {talent.craft} · {talent.wilaya}</div>
          </div>
          <div style={{width:42,height:42,borderRadius:'50%',background:talent.avatarBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:talent.avatarTxt,flexShrink:0,border:'2px solid rgba(255,255,255,.2)'}}>{talent.initials}</div>
        </div>
      </div>
    </div>
  );
}

// ── Join Requests ─────────────────────────────────────────────────────────────

function Requests({requests, setRequests, toast}) {
  const [filter, setFilter] = useState('all');
  const [detail, setDetail] = useState(null);

  const counts = {
    all: requests.length,
    pending:  requests.filter(r => r.status==='pending').length,
    approved: requests.filter(r => r.status==='approved').length,
    rejected: requests.filter(r => r.status==='rejected').length,
  };
  const filtered = filter==='all' ? requests : requests.filter(r => r.status===filter);

  const act = (id, status) => {
    setRequests(p => p.map(r => r.id===id ? {...r, status} : r));
    toast(status==='approved' ? 'تم قبول الطلب بنجاح' : 'تم رفض الطلب');
    setDetail(null);
  };

  const TABS = [
    {v:'all',     l:'الكل'},
    {v:'pending', l:'معلق'},
    {v:'approved',l:'مقبول'},
    {v:'rejected',l:'مرفوض'},
  ];

  return (
    <div>
      <h1 style={{fontSize:26,fontWeight:800,color:DARK,marginBottom:3}}>طلبات الانضمام</h1>
      <p style={{fontSize:14,color:BROWN,marginBottom:22}}>راجع وأدِر طلبات المواهب الجديدة للانضمام إلى المنصة</p>

      {/* Filter tabs */}
      <div style={{display:'flex',gap:4,marginBottom:18,background:'#fff',borderRadius:12,padding:4,border:`1px solid rgba(219,193,185,.35)`,width:'fit-content'}}>
        {TABS.map(t => (
          <button key={t.v} onClick={() => setFilter(t.v)}
            style={{padding:'6px 15px',borderRadius:8,border:'none',background:filter===t.v ? R : 'transparent',color:filter===t.v ? '#fff' : BROWN,fontSize:13,fontWeight:filter===t.v ? 700 : 400,cursor:'pointer',fontFamily:'Tajawal,sans-serif',display:'flex',alignItems:'center',gap:6,transition:'all .12s'}}>
            {t.l}
            <span style={{fontSize:11,background:filter===t.v ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.06)',padding:'1px 7px',borderRadius:10}}>{counts[t.v]}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{background:'#fff',borderRadius:16,overflow:'hidden',boxShadow:'0 2px 10px rgba(26,20,16,.06)',border:'1px solid rgba(219,193,185,.35)'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'rgba(252,234,229,.45)'}}>
              {['الاسم','الولاية','التخصص','تاريخ التقديم','الحالة','الإجراءات'].map(h => (
                <th key={h} style={{textAlign:'right',padding:'12px 16px',fontSize:13,fontWeight:600,color:BROWN,borderBottom:`1px solid rgba(219,193,185,.4)`}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}
                style={{borderBottom:'1px solid rgba(219,193,185,.14)',transition:'background .1s'}}
                onMouseOver={e => e.currentTarget.style.background='rgba(252,234,229,.12)'}
                onMouseOut={e  => e.currentTarget.style.background='transparent'}>
                <td style={{padding:'12px 16px',fontSize:14,fontWeight:600,color:DARK}}>{r.name}</td>
                <td style={{padding:'12px 16px',fontSize:14,color:BROWN}}>{r.wilaya}</td>
                <td style={{padding:'12px 16px',fontSize:14,color:BROWN}}>{r.craft}</td>
                <td style={{padding:'12px 16px',fontSize:13,color:BROWN}}>{r.date}</td>
                <td style={{padding:'12px 16px'}}><SBadge status={r.status}/></td>
                <td style={{padding:'12px 16px'}}>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {r.status==='pending' && <>
                      <button onClick={() => act(r.id,'approved')}
                        style={{padding:'4px 12px',borderRadius:20,border:'none',background:'#dcfce7',color:'#166534',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Tajawal,sans-serif',display:'flex',alignItems:'center',gap:3}}>
                        <Check size={12}/>قبول
                      </button>
                      <button onClick={() => act(r.id,'rejected')}
                        style={{padding:'4px 12px',borderRadius:20,border:'none',background:'#fee2e2',color:'#991b1b',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Tajawal,sans-serif',display:'flex',alignItems:'center',gap:3}}>
                        <X size={12}/>رفض
                      </button>
                    </>}
                    <button onClick={() => setDetail(r)}
                      style={{padding:'4px 12px',borderRadius:20,border:`1px solid ${BDR}`,background:'transparent',color:BROWN,fontSize:12,cursor:'pointer',fontFamily:'Tajawal,sans-serif'}}>
                      تفاصيل
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{textAlign:'center',padding:52,color:BROWN,fontSize:15}}>لا توجد طلبات في هذه الفئة</div>
        )}
      </div>

      {/* Detail modal */}
      {detail && (
        <Modal title="تفاصيل طلب الانضمام" onClose={() => setDetail(null)}>
          <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20,paddingBottom:18,borderBottom:`1px solid rgba(219,193,185,.4)`}}>
            <div style={{width:50,height:50,borderRadius:'50%',background:BLUSH,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,color:R,flexShrink:0}}>{detail.name[0]}</div>
            <div style={{flex:1,textAlign:'right'}}>
              <div style={{fontSize:18,fontWeight:700,color:DARK}}>{detail.name}</div>
              <div style={{fontSize:13,color:BROWN,marginTop:3}}>{detail.wilaya} · {detail.craft}</div>
            </div>
            <SBadge status={detail.status}/>
          </div>
          <div style={{background:CREAM,borderRadius:12,padding:16,marginBottom:16,fontSize:15,color:BROWN,lineHeight:1.75,textAlign:'right'}}>{detail.bio}</div>
          <div style={{fontSize:13,color:BROWN,textAlign:'right',marginBottom:20}}>📅 تاريخ التقديم: {detail.date}</div>
          {detail.status === 'pending' && (
            <div style={{display:'flex',gap:10}}>
              <Btn variant="danger" onClick={() => act(detail.id,'rejected')} style={{flex:1,justifyContent:'center'}}><X size={14}/>رفض الطلب</Btn>
              <Btn variant="success" onClick={() => act(detail.id,'approved')} style={{flex:1,justifyContent:'center'}}><Check size={14}/>قبول الطلب</Btn>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ── Events ────────────────────────────────────────────────────────────────────

function Events({events, setEvents, toast}) {
  const EMPTY = {title:'', type:'ورشة عمل', venue:'', day:'', month:'يناير', featured:false};
  const [modal, setModal] = useState(false);
  const [form,  setForm]  = useState(EMPTY);
  const [editId,setEditId]= useState(null);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = e  => { setForm({...e}); setEditId(e.id); setModal(true); };

  const save = () => {
    if (!form.title.trim() || !form.venue.trim() || !form.day) return;
    const day = String(form.day).padStart(2,'0');
    if (editId) {
      setEvents(p => p.map(e => e.id===editId ? {...form, day, id:editId} : e));
      toast('تم تحديث الفعالية بنجاح');
    } else {
      setEvents(p => [...p, {...form, day, id:Date.now()}]);
      toast('تم إضافة الفعالية بنجاح');
    }
    setModal(false);
  };

  const del = id => { setEvents(p => p.filter(e => e.id!==id)); toast('تم حذف الفعالية'); };
  const toggleFeatured = id => setEvents(p => p.map(e => e.id===id ? {...e, featured:!e.featured} : e));

  return (
    <div>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24}}>
        <Btn onClick={openAdd}><Plus size={15}/>إضافة فعالية</Btn>
        <div style={{textAlign:'right'}}>
          <h1 style={{fontSize:26,fontWeight:800,color:DARK,marginBottom:2}}>الفعاليات</h1>
          <p style={{fontSize:14,color:BROWN}}>أضف وأدِر الفعاليات القادمة — نجمة تعني فعالية مميزة</p>
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {events.map(e => (
          <div key={e.id}
            style={{background:'#fff',borderRadius:14,padding:'14px 18px',boxShadow:'0 2px 10px rgba(26,20,16,.06)',border:`1px solid ${e.featured ? GOLD+'77' : 'rgba(219,193,185,.35)'}`,display:'flex',alignItems:'center',gap:14}}>
            {/* Date box */}
            <div style={{background:BLUSH,borderRadius:10,width:58,height:58,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <div style={{fontSize:20,fontWeight:800,color:R,lineHeight:1}}>{e.day}</div>
              <div style={{fontSize:11,color:BROWN,marginTop:2}}>{e.month}</div>
            </div>
            {/* Info */}
            <div style={{flex:1,textAlign:'right'}}>
              <div style={{display:'flex',alignItems:'center',gap:6,justifyContent:'flex-end',marginBottom:5}}>
                {e.featured && <span style={{background:GOLD+'22',color:GOLD,border:`1px solid ${GOLD}44`,padding:'1px 8px',borderRadius:20,fontSize:11,fontWeight:700}}>★ مميز</span>}
                <TPill type={e.type}/>
              </div>
              <div style={{fontSize:15,fontWeight:700,color:DARK}}>{e.title}</div>
              <div style={{fontSize:12,color:BROWN,marginTop:3}}>📍 {e.venue}</div>
            </div>
            {/* Actions */}
            <div style={{display:'flex',gap:7,alignItems:'center',flexShrink:0}}>
              <button title={e.featured ? 'إلغاء التمييز' : 'تمييز كحدث وطني'}
                onClick={() => toggleFeatured(e.id)}
                style={{width:32,height:32,borderRadius:8,border:`1px solid ${e.featured ? GOLD : BDR}`,background:e.featured ? GOLD+'22' : 'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:e.featured ? GOLD : BROWN}}>
                <Star size={15} fill={e.featured ? GOLD : 'none'}/>
              </button>
              <button onClick={() => openEdit(e)}
                style={{display:'flex',alignItems:'center',gap:4,padding:'5px 13px',borderRadius:20,border:`1px solid ${BDR}`,background:'transparent',color:BROWN,fontSize:12,cursor:'pointer',fontFamily:'Tajawal,sans-serif'}}>
                <Edit2 size={12}/>تعديل
              </button>
              <button onClick={() => del(e.id)}
                style={{width:32,height:32,borderRadius:8,border:'none',background:'#fee2e2',color:'#991b1b',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Trash2 size={14}/>
              </button>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div style={{textAlign:'center',padding:60,color:BROWN,fontSize:15,background:'#fff',borderRadius:14,border:'1px solid rgba(219,193,185,.35)'}}>
            لا توجد فعاليات — أضف فعالية جديدة
          </div>
        )}
      </div>

      {modal && (
        <Modal title={editId ? 'تعديل الفعالية' : 'إضافة فعالية جديدة'} onClose={() => setModal(false)}>
          <Fld label="عنوان الفعالية *">
            <Inp value={form.title} onChange={e => setForm(p => ({...p, title:e.target.value}))} placeholder="أدخل عنوان الفعالية"/>
          </Fld>
          <Fld label="نوع الفعالية">
            <Sel value={form.type} onChange={e => setForm(p => ({...p, type:e.target.value}))}>
              {ETYPES.map(t => <option key={t}>{t}</option>)}
            </Sel>
          </Fld>
          <Fld label="المكان *">
            <Inp value={form.venue} onChange={e => setForm(p => ({...p, venue:e.target.value}))} placeholder="اسم المكان أو أونلاين"/>
          </Fld>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <Fld label="الشهر">
              <Sel value={form.month} onChange={e => setForm(p => ({...p, month:e.target.value}))}>
                {MONTHS.map(m => <option key={m}>{m}</option>)}
              </Sel>
            </Fld>
            <Fld label="اليوم *">
              <Inp type="number" min="1" max="31" value={form.day} onChange={e => setForm(p => ({...p, day:e.target.value}))} placeholder="24"/>
            </Fld>
          </div>
          <Fld>
            <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',justifyContent:'flex-end'}}>
              <span style={{fontSize:14,color:DARK}}>تمييز كحدث وطني بارز ⭐</span>
              <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({...p, featured:e.target.checked}))} style={{width:17,height:17,accentColor:R}}/>
            </label>
          </Fld>
          <div style={{display:'flex',gap:10,marginTop:4}}>
            <Btn variant="ghost" onClick={() => setModal(false)}>إلغاء</Btn>
            <Btn onClick={save} style={{flex:1,justifyContent:'center'}}>{editId ? 'حفظ التعديلات' : 'إضافة الفعالية'}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Gallery ───────────────────────────────────────────────────────────────────

function Gallery({gallery, setGallery, toast}) {
  const [modal, setModal] = useState(false);
  const [form,  setForm]  = useState({title:'', artist:'', grad:0});

  const openAdd = () => { setForm({title:'', artist:'', grad:0}); setModal(true); };

  const add = () => {
    if (!form.title.trim() || !form.artist.trim()) return;
    setGallery(p => [...p, {...form, id:Date.now()}]);
    toast('تم إضافة العمل الفني إلى المعرض');
    setModal(false);
  };

  const del = id => { setGallery(p => p.filter(g => g.id!==id)); toast('تم حذف العمل الفني'); };

  return (
    <div>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24}}>
        <Btn onClick={openAdd}><Plus size={15}/>إضافة عمل فني</Btn>
        <div style={{textAlign:'right'}}>
          <h1 style={{fontSize:26,fontWeight:800,color:DARK,marginBottom:2}}>معرض الإبداعات</h1>
          <p style={{fontSize:14,color:BROWN}}>أدِر الأعمال الفنية المعروضة في الصفحة الرئيسية</p>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
        {gallery.map(g => (
          <div key={g.id} style={{borderRadius:16,overflow:'hidden',boxShadow:'0 4px 16px rgba(26,20,16,.08)',border:'1px solid rgba(219,193,185,.35)',background:'#fff'}}>
            <div style={{height:130,background:GRADS[g.grad]}}/>
            <div style={{padding:'13px 15px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
              <button onClick={() => del(g.id)}
                style={{width:30,height:30,borderRadius:8,border:'none',background:'#fee2e2',color:'#991b1b',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Trash2 size={14}/>
              </button>
              <div style={{textAlign:'right',flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:DARK,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{g.title}</div>
                <div style={{fontSize:12,color:BROWN,marginTop:2}}>{g.artist}</div>
              </div>
            </div>
          </div>
        ))}
        {/* Add placeholder cell */}
        <div onClick={openAdd}
          style={{borderRadius:16,border:`2px dashed ${BDR}`,minHeight:185,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',color:BROWN,gap:8,transition:'border-color .15s'}}
          onMouseOver={e => e.currentTarget.style.borderColor = R}
          onMouseOut={e  => e.currentTarget.style.borderColor = BDR}>
          <Plus size={26} style={{opacity:.4}}/>
          <span style={{fontSize:13}}>إضافة عمل جديد</span>
        </div>
      </div>

      {modal && (
        <Modal title="إضافة عمل فني جديد" onClose={() => setModal(false)}>
          <Fld label="عنوان العمل *">
            <Inp value={form.title} onChange={e => setForm(p => ({...p, title:e.target.value}))} placeholder="اسم العمل الفني"/>
          </Fld>
          <Fld label="اسم الفنان *">
            <Inp value={form.artist} onChange={e => setForm(p => ({...p, artist:e.target.value}))} placeholder="اسم صاحب العمل"/>
          </Fld>
          <Fld label="لون خلفية العمل">
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
              {GRADS.map((g,i) => (
                <div key={i} onClick={() => setForm(p => ({...p, grad:i}))}
                  style={{height:58,borderRadius:10,background:g,cursor:'pointer',border:`3px solid ${form.grad===i ? R : 'transparent'}`,transition:'border .12s',position:'relative',overflow:'hidden'}}>
                  {form.grad===i && (
                    <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,.2)'}}>
                      <Check size={18} color="#fff"/>
                    </div>
                  )}
                  <div style={{position:'absolute',bottom:4,right:6,fontSize:10,color:'rgba(255,255,255,.85)',fontWeight:700}}>{GNAMES[i]}</div>
                </div>
              ))}
            </div>
          </Fld>
          <div style={{display:'flex',gap:10,marginTop:4}}>
            <Btn variant="ghost" onClick={() => setModal(false)}>إلغاء</Btn>
            <Btn onClick={add} style={{flex:1,justifyContent:'center'}}>إضافة إلى المعرض</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Talent of the Week ────────────────────────────────────────────────────────

function TalentOfWeek({talent, setTalent, toast}) {
  const [form, setForm] = useState({...talent});

  const save = () => {
    if (!form.name.trim() || !form.craft.trim()) return;
    setTalent({...form});
    toast('تم تحديث موهبة الأسبوع بنجاح');
  };

  const f = (k) => (e) => setForm(p => ({...p, [k]:e.target.value}));

  return (
    <div>
      <h1 style={{fontSize:26,fontWeight:800,color:DARK,marginBottom:3,textAlign:'right'}}>موهبة الأسبوع</h1>
      <p style={{fontSize:14,color:BROWN,marginBottom:26,textAlign:'right'}}>تحديث بطاقة الموهبة المميزة المعروضة في الصفحة الرئيسية</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:24,alignItems:'start'}}>
        {/* Form */}
        <div style={{background:'#fff',borderRadius:16,padding:28,boxShadow:'0 2px 10px rgba(26,20,16,.06)',border:'1px solid rgba(219,193,185,.35)'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <Fld label="الاسم *">
              <Inp value={form.name} onChange={f('name')} placeholder="اسم الموهبة"/>
            </Fld>
            <Fld label="الأحرف الأولى (تظهر في الصورة)">
              <Inp value={form.initials} onChange={f('initials')} placeholder="أ.م" maxLength={4}/>
            </Fld>
            <Fld label="الولاية">
              <Inp value={form.wilaya} onChange={f('wilaya')} placeholder="اسم الولاية"/>
            </Fld>
            <Fld label="التخصص / الحرفة *">
              <Inp value={form.craft} onChange={f('craft')} placeholder="مثال: الخط العربي"/>
            </Fld>
          </div>
          <Fld label="نبذة قصيرة عن الموهبة">
            <textarea value={form.bio} onChange={f('bio')} rows={3}
              style={{width:'100%',padding:'10px 14px',borderRadius:10,border:`1.5px solid ${BDR}`,background:'#fff',fontSize:14,color:DARK,fontFamily:'Tajawal,sans-serif',outline:'none',textAlign:'right',resize:'vertical',lineHeight:1.75,boxSizing:'border-box'}}/>
          </Fld>
          <Fld label="لون البطاقة">
            <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8}}>
              {AVPRE.map(([bg,txt],i) => (
                <div key={i} onClick={() => setForm(p => ({...p, avatarBg:bg, avatarTxt:txt}))}
                  style={{height:38,borderRadius:8,background:bg,cursor:'pointer',border:`3px solid ${form.avatarBg===bg ? GOLD : 'transparent'}`,transition:'border .12s',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {form.avatarBg===bg && <Check size={13} color={txt}/>}
                </div>
              ))}
            </div>
          </Fld>
          <Btn onClick={save} style={{width:'100%',justifyContent:'center',marginTop:8,padding:'11px 18px',fontSize:15}}>
            حفظ التغييرات
          </Btn>
        </div>

        {/* Live preview */}
        <div>
          <div style={{fontSize:12,fontWeight:600,color:BROWN,textAlign:'center',marginBottom:16,letterSpacing:.5,textTransform:'uppercase'}}>معاينة البطاقة</div>
          <div style={{background:'#fff',borderRadius:20,boxShadow:'0 16px 48px rgba(26,20,16,.12)',padding:'32px 22px 26px',textAlign:'center',position:'relative',border:`1px solid rgba(219,193,185,.4)`}}>
            {/* Badge */}
            <div style={{position:'absolute',top:-17,left:'50%',transform:'translateX(-50%)',background:GOLD,color:'#fff',fontSize:13,fontWeight:700,padding:'4px 18px',borderRadius:50,display:'flex',alignItems:'center',gap:6,whiteSpace:'nowrap',boxShadow:`0 2px 10px ${GOLD}55`}}>
              <Star size={12} fill="#fff" style={{flexShrink:0}}/>
              موهبة الأسبوع
            </div>
            {/* Avatar */}
            <div style={{width:110,height:110,borderRadius:'50%',border:'4px solid #f1dfda',padding:4,margin:'10px auto 14px',background:form.avatarBg,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontSize:24,fontWeight:700,color:form.avatarTxt}}>{form.initials||'—'}</span>
            </div>
            <div style={{fontSize:22,fontWeight:700,color:DARK,marginBottom:6}}>{form.name||'الاسم'}</div>
            <div style={{fontSize:14,color:BROWN,marginBottom:14,display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
              <span>📍</span>{form.wilaya||'الولاية'}
            </div>
            <div style={{background:BLUSH,border:`1px solid ${BDR}`,color:AMB,fontSize:15,fontWeight:700,padding:'8px 22px',borderRadius:50,display:'inline-block',marginBottom:form.bio ? 14 : 0}}>
              {form.craft||'التخصص'}
            </div>
            {form.bio && (
              <div style={{fontSize:13,color:BROWN,lineHeight:1.75,padding:'12px 4px 0',borderTop:`1px solid rgba(219,193,185,.35)`,marginTop:4}}>
                {form.bio}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [tab,      setTab]      = useState('overview');
  const [requests, setRequests] = useState(INIT_REQ);
  const [events,   setEvents]   = useState(INIT_EVT);
  const [gallery,  setGallery]  = useState(INIT_GAL);
  const [talent,   setTalent]   = useState(INIT_TAL);
  const [toastMsg, setToastMsg] = useState('');
  const [ready,    setReady]    = useState(false);

  // Inject font + load persisted data
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap';
    link.rel  = 'stylesheet';
    document.head.appendChild(link);
    loadAll();
  }, []);

  // Auto-save whenever data changes (after initial load)
  useEffect(() => { if (ready) saveAll(); }, [requests, events, gallery, talent]);

  async function loadAll() {
    try {
      const [r,e,g,t] = await Promise.all([
        window.storage.get('adm-requests').catch(() => null),
        window.storage.get('adm-events').catch(()   => null),
        window.storage.get('adm-gallery').catch(()   => null),
        window.storage.get('adm-talent').catch(()   => null),
      ]);
      if (r) setRequests(JSON.parse(r.value));
      if (e) setEvents(JSON.parse(e.value));
      if (g) setGallery(JSON.parse(g.value));
      if (t) setTalent(JSON.parse(t.value));
    } catch (err) { console.error('Load error', err); }
    setReady(true);
  }

  async function saveAll() {
    try {
      await Promise.all([
        window.storage.set('adm-requests', JSON.stringify(requests)),
        window.storage.set('adm-events',   JSON.stringify(events)),
        window.storage.set('adm-gallery',  JSON.stringify(gallery)),
        window.storage.set('adm-talent',   JSON.stringify(talent)),
      ]);
    } catch (err) { console.error('Save error', err); }
  }

  function toast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2600);
  }

  const pending = requests.filter(r => r.status === 'pending').length;
  const shared  = { toast };

  return (
    <div style={{display:'flex', height:'100vh', fontFamily:'Tajawal,sans-serif', direction:'rtl', background:CREAM, overflow:'hidden'}}>
      <Sidebar tab={tab} setTab={setTab} pending={pending}/>
      <main style={{flex:1, overflowY:'auto', padding:'32px 36px', minWidth:0}}>
        {tab==='overview' && <Overview requests={requests} events={events} gallery={gallery} talent={talent} setTab={setTab}/>}
        {tab==='requests' && <Requests requests={requests} setRequests={setRequests} {...shared}/>}
        {tab==='events'   && <Events   events={events}     setEvents={setEvents}     {...shared}/>}
        {tab==='gallery'  && <Gallery  gallery={gallery}   setGallery={setGallery}   {...shared}/>}
        {tab==='talent'   && <TalentOfWeek talent={talent} setTalent={setTalent}     {...shared}/>}
      </main>
      <Toast msg={toastMsg}/>
    </div>
  );
}
