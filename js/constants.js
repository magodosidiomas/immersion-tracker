/* ════════════════════════════════════════════════════════════
   CONSTANTS
   Dados estáticos que nunca mudam: listas, labels, cores.
════════════════════════════════════════════════════════════ */

const ALL_LANGUAGES = [
  {id:'en',flag:'🇺🇸',name:'Inglês'},{id:'es',flag:'🇪🇸',name:'Espanhol'},
  {id:'fr',flag:'🇫🇷',name:'Francês'},{id:'de',flag:'🇩🇪',name:'Alemão'},
  {id:'it',flag:'🇮🇹',name:'Italiano'},{id:'pt',flag:'🇧🇷',name:'Português'},
  {id:'ja',flag:'🇯🇵',name:'Japonês'},{id:'zh',flag:'🇨🇳',name:'Mandarim'},
  {id:'ko',flag:'🇰🇷',name:'Coreano'},{id:'ru',flag:'🇷🇺',name:'Russo'},
  {id:'ar',flag:'🇸🇦',name:'Árabe'},{id:'nl',flag:'🇳🇱',name:'Holandês'},
  {id:'pl',flag:'🇵🇱',name:'Polonês'},{id:'sv',flag:'🇸🇪',name:'Sueco'},
  {id:'no',flag:'🇳🇴',name:'Norueguês'},{id:'da',flag:'🇩🇰',name:'Dinamarquês'},
  {id:'fi',flag:'🇫🇮',name:'Finlandês'},{id:'tr',flag:'🇹🇷',name:'Turco'},
  {id:'hi',flag:'🇮🇳',name:'Hindi'},{id:'vi',flag:'🇻🇳',name:'Vietnamita'},
  {id:'th',flag:'🇹🇭',name:'Tailandês'},{id:'id',flag:'🇮🇩',name:'Indonésio'},
  {id:'cs',flag:'🇨🇿',name:'Tcheco'},{id:'el',flag:'🇬🇷',name:'Grego'},
  {id:'he',flag:'🇮🇱',name:'Hebraico'},
];

const TYPE_META = {
  youtube: {label:'YouTube', icon:'play_circle', cls:'type-badge--youtube'},
  serie:   {label:'Série',   icon:'tv',          cls:'type-badge--serie'},
  podcast: {label:'Podcast', icon:'mic',         cls:'type-badge--podcast'},
  livro:   {label:'Livro',   icon:'book',        cls:'type-badge--livro'},
  website: {label:'Website', icon:'language',    cls:'type-badge--website'},
  outro:   {label:'Outro',   icon:'category',    cls:'type-badge--outro'},
};

const CAT_LABELS = {imersao:'Imersão', interativa:'Imersão interativa', estudo:'Estudo', producao:'Produção'};

const SUB_LABELS = {
  'escuta-leitura':'Simultâneo', escuta:'Escuta', leitura:'Leitura',
  vocabulario:'Vocabulário', gramatica:'Gramática',
  fala:'Fala', escrita:'Escrita', conversacao:'Conversação',
};

const DASH_COLORS = {
  imersao:          '#7F77DD',
  interativa:       '#5DCAA5',
  'escuta-leitura': '#7F77DD',
  escuta:           '#AFA9EC',
  leitura:          '#CECBF6',
  estudo:           '#F59E42',
  producao:         '#E07B9A',
  vocabulario:      '#FBBF6A',
  gramatica:        '#FDE68A',
  fala:             '#F472B6',
  escrita:          '#F9A8D4',
  conversacao:      '#FBCFE8',
  youtube:  '#FCA5A5',
  serie:    '#FDE68A',
  podcast:  '#99F6E4',
  livro:    '#FDE68A',
  website:  '#BAE6FD',
  outro:    '#A09CB8',
};

const DASH_LABELS = {
  imersao:          'Imersão',
  interativa:       'Imersão interativa',
  'escuta-leitura': 'Simultâneo',
  escuta:           'Escuta',
  leitura:          'Leitura',
  estudo:           'Estudo',
  producao:         'Produção',
  vocabulario:      'Vocabulário',
  gramatica:        'Gramática',
  fala:             'Fala',
  escrita:          'Escrita',
  conversacao:      'Conversação',
  youtube:  'YouTube',
  serie:    'Série',
  podcast:  'Podcast',
  livro:    'Livro',
  website:  'Website',
  outro:    'Outro',
};

const DOW_LABELS = ['D','S','T','Q','Q','S','S'];

const SSF_SUBS = {
  estudo:   [{value:'vocabulario', label:'Vocabulário'}, {value:'gramatica', label:'Gramática'}],
  producao: [{value:'fala', label:'Fala'}, {value:'escrita', label:'Escrita'}, {value:'conversacao', label:'Conversação'}],
};
