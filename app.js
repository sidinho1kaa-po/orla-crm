const initialContacts = [
  { id: 1, name: 'Lucas Andrade', email: 'lucas@northstudio.com', company: 'North Studio', status: 'cliente', date: 'Hoje, 09:42', initials: 'LA', color: '#7c96d2' },
  { id: 2, name: 'Camila Ribeiro', email: 'camila@vertice.com', company: 'Vértice Digital', status: 'qualificado', date: 'Ontem, 16:20', initials: 'CR', color: '#d69575' },
  { id: 3, name: 'Rafael Moura', email: 'rafael@moura.adv.br', company: 'Moura & Associados', status: 'lead', date: 'Ontem, 11:08', initials: 'RM', color: '#a884cc' },
  { id: 4, name: 'Beatriz Nunes', email: 'bia@casanunes.com', company: 'Casa Nunes', status: 'cliente', date: '20 out, 14:31', initials: 'BN', color: '#5ea990' },
  { id: 5, name: 'Diego Martins', email: 'diego@atlaslog.com', company: 'Atlas Logística', status: 'inativo', date: '18 out, 10:05', initials: 'DM', color: '#aa9d80' }
];

const initialDeals = [
  { id: 1, name: 'North Studio', contact: 'Lucas Andrade', value: 18500, stage: 'Prospecção', initials: 'LA' },
  { id: 2, name: 'Vértice Digital', contact: 'Camila Ribeiro', value: 12200, stage: 'Prospecção', initials: 'CR' },
  { id: 3, name: 'Moura & Associados', contact: 'Rafael Moura', value: 24800, stage: 'Qualificação', initials: 'RM' },
  { id: 4, name: 'Casa Nunes', contact: 'Beatriz Nunes', value: 9600, stage: 'Proposta', initials: 'BN' },
  { id: 5, name: 'Atlas Logística', contact: 'Diego Martins', value: 31500, stage: 'Negociação', initials: 'DM' }
];

const initialTasks = [
  { id: 1, title: 'Enviar proposta comercial', related: 'Casa Nunes', due: 'Hoje', done: false },
  { id: 2, title: 'Fazer follow-up por telefone', related: 'Vértice Digital', due: 'Amanhã', done: false },
  { id: 3, title: 'Atualizar briefing do projeto', related: 'North Studio', due: '24 out', done: false },
  { id: 4, title: 'Revisar contrato', related: 'Moura & Associados', due: '28 out', done: true }
];

const initialCampaigns = [
  { id: 1, name: 'Conteúdo que converte', client: 'North Studio', service: 'Social media', status: 'Em andamento', next: 'Calendário editorial · amanhã', metric: '18 posts publicados', fee: 6800, color: '#7663df' },
  { id: 2, name: 'Semana do consumidor', client: 'Vértice Digital', service: 'Tráfego pago', status: 'Em revisão', next: 'Aprovar criativos · hoje', metric: 'ROAS 4,2x', fee: 5200, color: '#e19a5a' },
  { id: 3, name: 'Reposicionamento de marca', client: 'Casa Nunes', service: 'Branding', status: 'Planejamento', next: 'Apresentar conceito · 25 out', metric: '3 rotas criativas', fee: 9400, color: '#55a78c' }
];

const activities = [
  { initials: 'MF', color: '#a883cf', name: 'Marina Freitas', text: 'adicionou um novo contato', target: 'Lucas Andrade', time: 'há 12 min' },
  { initials: 'LA', color: '#7c96d2', name: 'Lucas Andrade', text: 'respondeu ao seu e-mail', target: 'Proposta comercial', time: 'há 45 min' },
  { initials: 'CR', color: '#d69575', name: 'Camila Ribeiro', text: 'mudou para a etapa', target: 'Qualificação', time: 'há 2h' },
  { initials: 'MF', color: '#a883cf', name: 'Marina Freitas', text: 'criou uma tarefa', target: 'Follow-up Vértice', time: 'há 3h' }
];

const labels = { lead: 'Lead', qualificado: 'Qualificado', cliente: 'Cliente', inativo: 'Inativo' };
const stages = ['Prospecção', 'Qualificação', 'Proposta', 'Negociação'];
const viewLabels = { dashboard: 'Dashboard', contacts: 'Contatos', pipeline: 'Pipeline', campaigns: 'Campanhas', tasks: 'Tarefas', reports: 'Relatórios' };

function loadStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}

let contacts = loadStore('orla-contacts', initialContacts);
let deals = loadStore('orla-deals', initialDeals);
let tasks = loadStore('orla-tasks', initialTasks);
let campaigns = loadStore('orla-campaigns', initialCampaigns);
let currentFilter = 'todos';
let editingContactId = null;

const $ = selector => document.querySelector(selector);
const money = value => `R$ ${Number(value).toLocaleString('pt-BR')}`;
const initials = name => name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase();
const safe = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
const persist = () => { localStorage.setItem('orla-contacts', JSON.stringify(contacts)); localStorage.setItem('orla-deals', JSON.stringify(deals)); localStorage.setItem('orla-tasks', JSON.stringify(tasks)); localStorage.setItem('orla-campaigns', JSON.stringify(campaigns)); };

function renderStats() {
  const active = contacts.filter(contact => contact.status !== 'inativo').length;
  const recurringRevenue = campaigns.reduce((total, campaign) => total + Number(campaign.fee || 0), 0);
  const finishedTasks = tasks.filter(task => task.done).length;
  $('#active-contacts').textContent = contacts.filter(contact => contact.status === 'cliente').length;
  $('#open-deals').textContent = campaigns.filter(campaign => campaign.status !== 'Planejamento').length;
  $('#pipeline-value').textContent = money(recurringRevenue);
  $('#delivery-count').textContent = tasks.filter(task => !task.done).length;
  $('#contact-nav-count').textContent = contacts.length;
  $('#campaign-nav-count').textContent = campaigns.length;
  $('#task-nav-count').textContent = tasks.filter(task => !task.done).length;
  const progress = tasks.length ? Math.round((finishedTasks / tasks.length) * 100) : 0;
  $('#follow-up-progress').textContent = `${progress}%`;
  $('#follow-up-bar').style.width = `${Math.max(progress, 8)}%`;
  $('#health-score').textContent = Math.min(99, 60 + active * 4 + finishedTasks * 3);
}

function renderCampaigns() {
  const statusClass = status => status.toLowerCase().replaceAll(' ', '-');
  $('#campaign-grid').innerHTML = campaigns.length ? campaigns.map(campaign => `<article class="campaign-card" style="--campaign-color:${campaign.color}"><div class="campaign-card-top"><span class="campaign-service">${safe(campaign.service)}</span><button class="campaign-menu" data-campaign-action="delete" data-id="${campaign.id}" aria-label="Excluir campanha">×</button></div><h3>${safe(campaign.name)}</h3><p class="campaign-client">${safe(campaign.client)}</p><div class="campaign-detail"><span>Próxima entrega</span><strong>${safe(campaign.next)}</strong></div><div class="campaign-footer"><span class="campaign-status ${statusClass(campaign.status)}"><i></i>${safe(campaign.status)}</span><span class="campaign-metric">${safe(campaign.metric || 'Em acompanhamento')}</span></div></article>`).join('') : '<div class="empty-state">Nenhuma campanha cadastrada.</div>';
}

function renderPipeline() {
  const totalValue = deals.reduce((sum, deal) => sum + Number(deal.value), 0);
  $('#pipeline-summary').innerHTML = `<div class="summary-item"><strong>${deals.length}</strong> negócios</div><div class="summary-item"><strong>${money(totalValue)}</strong> em oportunidades</div>`;
  $('#pipeline-board').innerHTML = stages.map(stage => {
    const stageDeals = deals.filter(deal => deal.stage === stage);
    return `<div class="pipeline-column"><div class="column-head"><span>${stage}</span><b>${stageDeals.length}</b></div>${stageDeals.map(deal => `<div class="deal-card"><span class="deal-avatar">${safe(deal.initials)}</span><strong>${safe(deal.name)}</strong><small>${safe(deal.contact)}</small><span class="deal-value">${money(deal.value)}</span><select class="deal-stage-select" data-deal-id="${deal.id}" aria-label="Alterar etapa">${stages.map(option => `<option ${option === deal.stage ? 'selected' : ''}>${option}</option>`).join('')}</select></div>`).join('') || '<div class="deal-card empty-deal"><small>Nenhum negócio</small></div>'}</div>`;
  }).join('');
}

function renderActivities() {
  $('#activity-list').innerHTML = activities.map(activity => `<div class="activity-item"><div class="activity-avatar" style="background:${activity.color}">${activity.initials}</div><div class="activity-copy"><strong>${activity.name}</strong> ${activity.text}<p>${activity.target}</p></div><span class="activity-time">${activity.time}</span></div>`).join('');
}

function renderContacts() {
  const query = $('#search-input').value.toLowerCase().trim();
  const filtered = contacts.filter(contact => {
    const matchesFilter = currentFilter === 'todos' || contact.status === currentFilter;
    const matchesSearch = [contact.name, contact.email, contact.company].join(' ').toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });
  $('#contacts-table').innerHTML = filtered.map(contact => `<tr><td><div class="contact-cell"><span class="contact-avatar" style="background:${contact.color}">${safe(contact.initials)}</span><div>${safe(contact.name)}<span class="contact-email">${safe(contact.email)}</span></div></div></td><td><strong class="account-name">${safe(contact.company)}</strong><span class="account-service">${safe(contact.service || 'Assessoria de marketing')}</span></td><td><span class="status ${contact.status}">${labels[contact.status]}</span></td><td>${safe(contact.date)}</td><td><div class="row-actions"><button class="row-action" data-action="edit" data-id="${contact.id}" aria-label="Editar contato">✎</button><button class="row-action danger" data-action="delete" data-id="${contact.id}" aria-label="Excluir contato">×</button></div></td></tr>`).join('');
  $('#empty-state').hidden = filtered.length > 0;
}

function formatDue(date) {
  if (!date) return 'Sem prazo';
  const selected = new Date(`${date}T12:00:00`);
  return selected.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
}

function renderTasks() {
  $('#task-list').innerHTML = tasks.length ? tasks.map(task => `<div class="task-item ${task.done ? 'done' : ''}"><button class="task-check" data-task-action="toggle" data-id="${task.id}" aria-label="Concluir tarefa">${task.done ? '✓' : ''}</button><div class="task-copy"><strong>${safe(task.title)}</strong><span>${safe(task.related || 'Sem vínculo')}</span></div><time>${safe(task.due)}</time><button class="task-delete" data-task-action="delete" data-id="${task.id}" aria-label="Excluir tarefa">×</button></div>`).join('') : '<div class="empty-state">Nenhuma tarefa cadastrada.</div>';
}

function showToast(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(showToast.timeout); showToast.timeout = setTimeout(() => toast.classList.remove('show'), 2600);
}

function openModal(id) { const modal = $(`#${id}`); modal.hidden = false; modal.querySelector('input:not([type="hidden"])')?.focus(); }
function closeModal(id) { const modal = $(`#${id}`); modal.hidden = true; modal.querySelector('form')?.reset(); }

function openContact(contact = null) {
  editingContactId = contact?.id || null;
  $('#contact-modal-eyebrow').textContent = contact ? 'EDITAR REGISTRO' : 'NOVO REGISTRO';
  $('#modal-title').textContent = contact ? 'Editar contato' : 'Adicionar contato';
  const form = $('#contact-form'); form.reset(); form.elements.id.value = contact?.id || '';
  if (contact) { form.elements.name.value = contact.name; form.elements.email.value = contact.email; form.elements.company.value = contact.company; form.elements.status.value = contact.status; form.elements.service.value = contact.service || 'Assessoria completa'; }
  openModal('contact-modal');
}

function setView(view) {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === view));
  $('#current-view-label').textContent = viewLabels[view] || 'Dashboard';
  const targets = { dashboard: '.content-wrap', contacts: '#contacts-section', pipeline: '#pipeline-section', campaigns: '#campaigns-section', tasks: '#tasks-section', reports: '#reports-section' };
  $(targets[view] || '.content-wrap').scrollIntoView({ behavior: 'smooth', block: view === 'dashboard' ? 'start' : 'center' });
  if (view === 'settings') showToast('As configurações estarão disponíveis em breve.');
  document.querySelector('.sidebar').classList.remove('open');
}

document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
$('#search-input').addEventListener('input', renderContacts);
$('#filter-button').addEventListener('click', () => $('#filter-row').classList.toggle('visible'));
document.querySelectorAll('.filter-chip').forEach(button => button.addEventListener('click', () => { currentFilter = button.dataset.filter; document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.toggle('selected', chip === button)); renderContacts(); }));
$('#mobile-menu').addEventListener('click', () => $('.sidebar').classList.toggle('open'));

$('#add-contact').addEventListener('click', () => openContact());
$('#close-modal').addEventListener('click', () => closeModal('contact-modal'));
$('#cancel-modal').addEventListener('click', () => closeModal('contact-modal'));
$('#contact-modal').addEventListener('click', event => { if (event.target.id === 'contact-modal') closeModal('contact-modal'); });
$('#contact-form').addEventListener('submit', event => {
  event.preventDefault(); const form = new FormData(event.currentTarget); const id = Number(form.get('id')); const name = form.get('name');
  const data = { name, email: form.get('email'), company: form.get('company'), service: form.get('service'), status: form.get('status'), date: 'Agora', initials: initials(name), color: '#6d58df' };
  if (editingContactId) contacts = contacts.map(contact => contact.id === editingContactId ? { ...contact, ...data } : contact);
  else contacts.unshift({ id: Date.now(), ...data });
  persist(); renderStats(); renderContacts(); closeModal('contact-modal'); showToast(editingContactId ? 'Contato atualizado.' : 'Contato adicionado com sucesso.'); editingContactId = null;
});

$('#contacts-table').addEventListener('click', event => {
  const button = event.target.closest('[data-action]'); if (!button) return;
  const id = Number(button.dataset.id); const contact = contacts.find(item => item.id === id);
  if (button.dataset.action === 'edit') openContact(contact);
  if (button.dataset.action === 'delete' && contact && confirm(`Excluir o contato ${contact.name}?`)) { contacts = contacts.filter(item => item.id !== id); persist(); renderStats(); renderContacts(); showToast('Contato excluído.'); }
});

$('#add-deal').addEventListener('click', () => openModal('deal-modal'));
$('#deal-form').addEventListener('submit', event => {
  event.preventDefault(); const form = new FormData(event.currentTarget); const name = form.get('name');
  deals.push({ id: Date.now(), name, contact: form.get('contact'), value: Number(form.get('value')), stage: form.get('stage'), initials: initials(name) });
  persist(); renderStats(); renderPipeline(); closeModal('deal-modal'); showToast('Oportunidade criada.');
});
$('#pipeline-board').addEventListener('change', event => {
  if (!event.target.matches('.deal-stage-select')) return;
  const deal = deals.find(item => item.id === Number(event.target.dataset.dealId)); if (!deal) return;
  deal.stage = event.target.value; persist(); renderPipeline(); showToast('Etapa atualizada.');
});

$('#add-task').addEventListener('click', () => { $('#task-form').elements.due.value = new Date().toISOString().slice(0, 10); openModal('task-modal'); });
$('#task-form').addEventListener('submit', event => {
  event.preventDefault(); const form = new FormData(event.currentTarget);
  tasks.unshift({ id: Date.now(), title: form.get('title'), related: form.get('related'), due: formatDue(form.get('due')), done: false });
  persist(); renderStats(); renderTasks(); closeModal('task-modal'); showToast('Tarefa criada.');
});
$('#task-list').addEventListener('click', event => {
  const button = event.target.closest('[data-task-action]'); if (!button) return;
  const id = Number(button.dataset.id);
  if (button.dataset.taskAction === 'toggle') tasks = tasks.map(task => task.id === id ? { ...task, done: !task.done } : task);
  if (button.dataset.taskAction === 'delete') tasks = tasks.filter(task => task.id !== id);
  persist(); renderStats(); renderTasks();
});

$('#add-campaign').addEventListener('click', () => openModal('campaign-modal'));
$('#campaign-form').addEventListener('submit', event => {
  event.preventDefault(); const form = new FormData(event.currentTarget); const name = form.get('name');
  campaigns.unshift({ id: Date.now(), name, client: form.get('client'), service: form.get('service'), status: form.get('status'), next: form.get('next'), metric: 'Novo projeto', fee: 0, color: '#7663df' });
  persist(); renderStats(); renderCampaigns(); closeModal('campaign-modal'); showToast('Campanha adicionada.');
});
$('#campaign-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-campaign-action="delete"]'); if (!button) return;
  const id = Number(button.dataset.id); const campaign = campaigns.find(item => item.id === id);
  if (campaign && confirm(`Remover a campanha ${campaign.name}?`)) { campaigns = campaigns.filter(item => item.id !== id); persist(); renderStats(); renderCampaigns(); showToast('Campanha removida.'); }
});

document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', () => closeModal(button.dataset.closeModal)));
document.querySelectorAll('.modal-backdrop').forEach(modal => modal.addEventListener('click', event => { if (event.target === modal) closeModal(modal.id); }));
$('#clear-activity').addEventListener('click', () => showToast('Você está em dia com as atividades.'));
$('#export-data').addEventListener('click', () => {
  const backup = { contacts, deals, tasks, campaigns, exportedAt: new Date().toISOString() };
  const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })); link.download = 'backup-orla-crm.json'; link.click(); URL.revokeObjectURL(link.href); showToast('Backup exportado.');
});

renderStats(); renderPipeline(); renderActivities(); renderContacts(); renderTasks(); renderCampaigns();
