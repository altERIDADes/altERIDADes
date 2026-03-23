// altERIDAD — sistema de comentarios con Supabase
// Uso: incluir <div id="comentarios" data-articulo="nombre-articulo"></div>
// y <script src="../comentarios.js"></script> en cada artículo

(function () {
  const SUPABASE_URL = 'https://kgzuginskivvodgfnfce.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnenVnaW5za2l2dm9kZ2ZuZmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjUzNTEsImV4cCI6MjA4OTg0MTM1MX0.ansjohAIgVdOgTIU_3ebZu8if_jZm3mvGW3U2gyEfxQ';

  const container = document.getElementById('comentarios');
  if (!container) return;
  const ARTICULO = container.dataset.articulo;

  // ── ESTILOS ──────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #comentarios {
      margin-top: 4rem;
      border-top: 1px solid var(--verde-dark);
      padding-top: 2rem;
      max-width: 680px;
    }
    .com-titulo {
      font-family: var(--font-code);
      font-size: 10px;
      color: var(--verde-dim);
      letter-spacing: 0.2em;
      margin-bottom: 2rem;
    }
    .com-titulo span {
      color: var(--verde);
    }
    .com-form {
      margin-bottom: 2.5rem;
    }
    .com-form-header {
      font-family: var(--font-code);
      font-size: 10px;
      color: var(--verde-dim);
      letter-spacing: 0.15em;
      margin-bottom: 0.8rem;
    }
    .com-field {
      display: block;
      width: 100%;
      background: transparent;
      border: 1px solid var(--verde-dark);
      color: var(--text);
      font-family: var(--font-mono);
      font-size: 13px;
      padding: 0.6rem 0.8rem;
      margin-bottom: 0.6rem;
      outline: none;
      transition: border-color 0.15s;
      box-sizing: border-box;
    }
    .com-field:focus {
      border-color: var(--verde-dim);
    }
    .com-field::placeholder {
      color: var(--verde-dark);
      font-family: var(--font-code);
      font-size: 11px;
      letter-spacing: 0.1em;
    }
    textarea.com-field {
      resize: vertical;
      min-height: 90px;
      line-height: 1.7;
    }
    .com-submit {
      background: transparent;
      border: 1px solid var(--verde-dim);
      color: var(--verde-dim);
      font-family: var(--font-code);
      font-size: 11px;
      letter-spacing: 0.15em;
      padding: 0.5rem 1.2rem;
      cursor: pointer;
      transition: color 0.15s, border-color 0.15s, background 0.15s;
    }
    .com-submit:hover {
      color: var(--verde);
      border-color: var(--verde);
      background: rgba(0,255,65,0.04);
    }
    .com-submit:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .com-lista {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .com-item {
      padding: 1.2rem 0;
      border-bottom: 1px solid var(--verde-darker);
    }
    .com-item.com-respuesta {
      margin-left: 1.8rem;
      border-left: 1px solid var(--verde-darker);
      padding-left: 1.2rem;
      border-bottom: none;
      padding-bottom: 0;
    }
    .com-meta {
      font-family: var(--font-code);
      font-size: 10px;
      color: var(--verde-dim);
      letter-spacing: 0.12em;
      margin-bottom: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: baseline;
    }
    .com-autor {
      color: var(--verde-mid);
    }
    .com-texto {
      font-size: 13px;
      color: var(--text);
      line-height: 1.8;
      margin-bottom: 0.5rem;
    }
    .com-responder-btn {
      background: none;
      border: none;
      font-family: var(--font-code);
      font-size: 10px;
      color: var(--verde-dark);
      letter-spacing: 0.12em;
      cursor: pointer;
      padding: 0;
      transition: color 0.15s;
    }
    .com-responder-btn:hover {
      color: var(--verde-dim);
    }
    .com-reply-form {
      margin-top: 0.8rem;
      padding: 0.8rem;
      border: 1px solid var(--verde-darker);
      background: rgba(0,255,65,0.02);
    }
    .com-reply-header {
      font-family: var(--font-code);
      font-size: 10px;
      color: var(--verde-dim);
      letter-spacing: 0.12em;
      margin-bottom: 0.6rem;
      display: flex;
      justify-content: space-between;
    }
    .com-reply-cancel {
      background: none;
      border: none;
      font-family: var(--font-code);
      font-size: 10px;
      color: var(--verde-dark);
      letter-spacing: 0.1em;
      cursor: pointer;
      transition: color 0.15s;
    }
    .com-reply-cancel:hover { color: var(--verde-dim); }
    .com-vacio {
      font-family: var(--font-code);
      font-size: 11px;
      color: var(--verde-dark);
      letter-spacing: 0.12em;
    }
    .com-msg {
      font-family: var(--font-code);
      font-size: 10px;
      letter-spacing: 0.12em;
      margin-top: 0.5rem;
      min-height: 1.2em;
    }
    .com-msg.ok { color: var(--verde-dim); }
    .com-msg.err { color: #aa4444; }
  `;
  document.head.appendChild(style);

  // ── API ───────────────────────────────────────────────────────────────────
  async function apiGet() {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/comentarios?articulo=eq.${ARTICULO}&order=created_at.asc&select=*`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    return res.json();
  }

  async function apiPost(data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/comentarios`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(data)
    });
    return res.ok;
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  function formatFecha(iso) {
    const d = new Date(iso);
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${yy}.${mm}.${dd} // ${hh}:${mi}`;
  }

  function buildForm(parentId = null, onSuccess) {
    const wrap = document.createElement('div');
    wrap.className = parentId ? 'com-reply-form' : 'com-form';

    if (parentId) {
      const header = document.createElement('div');
      header.className = 'com-reply-header';
      header.innerHTML = `<span>// RESPONDER</span>`;
      const cancel = document.createElement('button');
      cancel.className = 'com-reply-cancel';
      cancel.textContent = '[cancelar]';
      cancel.onclick = () => wrap.remove();
      header.appendChild(cancel);
      wrap.appendChild(header);
    } else {
      const header = document.createElement('div');
      header.className = 'com-form-header';
      header.textContent = '// DEJAR UN COMENTARIO';
      wrap.appendChild(header);
    }

    const autorInput = document.createElement('input');
    autorInput.className = 'com-field';
    autorInput.type = 'text';
    autorInput.placeholder = 'NOMBRE (o alias)';
    autorInput.maxLength = 60;

    const textoInput = document.createElement('textarea');
    textoInput.className = 'com-field';
    textoInput.placeholder = 'escribe aquí...';
    textoInput.maxLength = 2000;

    const btn = document.createElement('button');
    btn.className = 'com-submit';
    btn.textContent = '>> ENVIAR';

    const msg = document.createElement('div');
    msg.className = 'com-msg';

    btn.onclick = async () => {
      const autor = autorInput.value.trim();
      const texto = textoInput.value.trim();
      if (!autor || !texto) { msg.className = 'com-msg err'; msg.textContent = '// campos vacíos'; return; }
      btn.disabled = true;
      msg.className = 'com-msg ok';
      msg.textContent = '// enviando...';
      const ok = await apiPost({ articulo: ARTICULO, autor, texto, parent_id: parentId || null });
      if (ok) {
        msg.textContent = '// comentario recibido';
        autorInput.value = '';
        textoInput.value = '';
        if (onSuccess) onSuccess();
        else await renderAll();
      } else {
        msg.className = 'com-msg err';
        msg.textContent = '// error al enviar, inténtalo de nuevo';
      }
      btn.disabled = false;
    };

    wrap.appendChild(autorInput);
    wrap.appendChild(textoInput);
    wrap.appendChild(btn);
    wrap.appendChild(msg);
    return wrap;
  }

  function buildComentario(c, respuestas, nivel) {
    const li = document.createElement('li');
    li.className = nivel > 0 ? 'com-item com-respuesta' : 'com-item';

    const meta = document.createElement('div');
    meta.className = 'com-meta';
    meta.innerHTML = `<span class="com-autor">${escapeHtml(c.autor)}</span><span>${formatFecha(c.created_at)}</span>`;

    const texto = document.createElement('p');
    texto.className = 'com-texto';
    texto.textContent = c.texto;

    const responderBtn = document.createElement('button');
    responderBtn.className = 'com-responder-btn';
    responderBtn.textContent = '// responder';

    li.appendChild(meta);
    li.appendChild(texto);
    li.appendChild(responderBtn);

    // respuestas anidadas
    const hijos = respuestas.filter(r => r.parent_id === c.id);
    if (hijos.length) {
      const subLista = document.createElement('ul');
      subLista.className = 'com-lista';
      hijos.forEach(h => subLista.appendChild(buildComentario(h, respuestas, nivel + 1)));
      li.appendChild(subLista);
    }

    responderBtn.onclick = () => {
      const existing = li.querySelector('.com-reply-form');
      if (existing) { existing.remove(); return; }
      const form = buildForm(c.id, async () => {
        form.remove();
        await renderAll();
      });
      li.appendChild(form);
    };

    return li;
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  async function renderAll() {
    container.innerHTML = '';

    const titulo = document.createElement('div');
    titulo.className = 'com-titulo';

    const lista_wrap = document.createElement('div');

    const todos = await apiGet();
    const raiz = todos.filter(c => !c.parent_id);

    titulo.innerHTML = `// COMENTARIOS <span>[${todos.length}]</span>`;
    container.appendChild(titulo);
    container.appendChild(buildForm(null, null));

    if (todos.length === 0) {
      const vacio = document.createElement('p');
      vacio.className = 'com-vacio';
      vacio.textContent = '// sin comentarios aún. sé el primero.';
      container.appendChild(vacio);
    } else {
      const ul = document.createElement('ul');
      ul.className = 'com-lista';
      raiz.forEach(c => ul.appendChild(buildComentario(c, todos, 0)));
      container.appendChild(ul);
    }
  }

  renderAll();
})();
