(async function(){
  const ids = ['p15','p16','p17','p18','p19','p20','p21','p22','p23','p24'];
  const target = document.getElementById('content');
  try {
    const html = await Promise.all(ids.map(id => fetch('pages/'+id+'.html').then(r => { if(!r.ok) throw new Error(id); return r.text(); })));
    target.innerHTML = html.join('\n');
  } catch (e) {
    target.innerHTML = '<p class="note">ページの読み込みに失敗しました。再読み込みしてください。</p>';
    return;
  }

  const blanks = Array.from(document.querySelectorAll('.b'));
  const countEl = document.getElementById('count');
  const total = blanks.length;

  blanks.forEach(b=>{
    b.setAttribute('role','button');
    b.setAttribute('tabindex','0');
    b.setAttribute('aria-pressed','false');
    b.setAttribute('aria-label','空欄'+(b.querySelector('i')?.textContent||'')+'：タップで答えを表示');
  });

  function update(){
    const n = document.querySelectorAll('.b.on').length;
    countEl.textContent = n + ' / ' + total;
  }
  function toggle(b, force){
    const on = (force===undefined) ? !b.classList.contains('on') : force;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', String(on));
  }

  document.addEventListener('click', e=>{
    const b = e.target.closest('.b');
    if(b){ toggle(b); update(); }
  });
  document.addEventListener('keydown', e=>{
    if((e.key==='Enter'||e.key===' ') && e.target.classList && e.target.classList.contains('b')){
      e.preventDefault(); toggle(e.target); update();
    }
  });

  document.getElementById('showAll').addEventListener('click', ()=>{
    blanks.forEach(b=>toggle(b,true)); update();
  });
  document.getElementById('hideAll').addEventListener('click', ()=>{
    blanks.forEach(b=>toggle(b,false)); update();
  });

  document.querySelectorAll('.sec-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const sec = btn.closest('section');
      const bs = sec.querySelectorAll('.b');
      const anyOn = sec.querySelector('.b.on');
      bs.forEach(b=>toggle(b, !anyOn));
      btn.textContent = anyOn ? 'このページを表示' : 'このページを隠す';
      update();
    });
  });

  update();
})();
