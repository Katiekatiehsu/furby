// Calendar + tabs interactions
(() => {
  const scroller = document.getElementById('scroller');
  const label = document.getElementById('label');
  const btnPrev = document.getElementById('prev');
  const btnNext = document.getElementById('next');

  let current = new Date(2025, 6, 1); // start July 2025
  const enWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const fmtLabel = (d) => `${d.getFullYear()}年${d.getMonth()+1}月`;
  const daysInMonth = (y,m) => new Date(y, m+1, 0).getDate();

  function render(monthDate, activeDay = 13){
    const y = monthDate.getFullYear();
    const m = monthDate.getMonth();
    const total = daysInMonth(y, m);

    label.textContent = fmtLabel(monthDate);
    scroller.innerHTML = '';

    for(let d=1; d<=total; d++){
      const dateObj = new Date(y, m, d);
      const card = document.createElement('button');
      card.className = 'day btn';
      card.type = 'button';
      card.dataset.day = String(d);
      card.innerHTML = `
        <div class="date">${d}</div>
        <div class="wd"> ${enWeek[dateObj.getDay()]} </div>
        <div class="dot"></div>
      `;
      card.addEventListener('click', () => selectDay(d, {scroll:true}));
      scroller.appendChild(card);
    }
    selectDay(activeDay, {scroll:true});
  }

  function selectDay(day, {scroll=false}={}){
    scroller.querySelectorAll('.day').forEach(el => {
      el.classList.toggle('active', Number(el.dataset.day)===Number(day));
    });
    const active = scroller.querySelector(`.day[data-day="${day}"]`);
    if(active && scroll) active.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
  }

  function getActiveDay(){
    const el = scroller.querySelector('.day.active');
    return el ? Number(el.dataset.day) : 1;
  }

  function moveActiveBy(delta){
    const y = current.getFullYear();
    const m = current.getMonth();
    const d = getActiveDay();
    const target = new Date(y, m, d + delta);
    if(target.getMonth() !== m || target.getFullYear() !== y){
      current = new Date(target.getFullYear(), target.getMonth(), 1);
      render(current, target.getDate());
    } else {
      selectDay(target.getDate(), {scroll:true});
      label.textContent = fmtLabel(current);
    }
  }

  btnPrev.addEventListener('click', () => moveActiveBy(-7));
  btnNext.addEventListener('click', () => moveActiveBy(7));

  // Tabs
  document.querySelectorAll('.tabs .nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tabs .nav-link').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.getElementById('tab-rec').classList.toggle('d-none', tab !== 'rec');
      document.getElementById('tab-remind').classList.toggle('d-none', tab !== 'remind');
      document.getElementById('tab-diary').classList.toggle('d-none', tab !== 'diary');
    });
  });

  render(current, 13);
})();
