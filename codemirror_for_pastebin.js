/**
 * CodeMirror for Pastebin
 *
 * Fichier appellé par un bookmarklet permettant d'avoir une vraie zone d'édition
 * de paste sur Pastebin.com à l'aide de CodeMirror. En attendant une extension Chrome.
 *
 * Plus d'infos : http://blog.epoc.fr/2013/09/01/codemirror-for-pastebin/
 */

// -------------------------------------------------------------------------- //
// Fonctions

/**
 * Retourne le fichier d'une URL
 *
 * @param string path L'URL à parser
 * @return string
 */
function filename(path) {
  var path = path.substring(path.lastIndexOf("/")+ 1);
  return (path.match(/[^.]+(\.[^?#]+)?/) || [])[0];
}

/**
 * Charge un fichier Javascript ou CSS dynamiquement
 *
 * @param string type Peut être 'js' ou 'css'
 * @parma string url URL du fichier à charger
 * @param function callback Fonction anonyme appellée lorsque le chargement du fichier est terminé
 * @return void
 */
function loadFile(type, url, callback) {
  var head = document.getElementsByTagName('head')[0];

  switch (type) {
    case 'js':
      var file = document.createElement('script');
      file.setAttribute('type', 'text/javascript');
      file.setAttribute('src', url);
    break;
    case 'css':
      var file = document.createElement('link');
      file.setAttribute('type', 'text/css');
      file.setAttribute('rel', 'stylesheet');
      file.setAttribute('href', url);
    break;
  }

  file.onreadystatechange = callback;
  file.onload = callback;

  head.appendChild(file);
}

// -------------------------------------------------------------------------- //
// Définition de quelques constantes

// URL du répertoire principal qui contient les fichiers de CodeMirror for Pastebin
var codemirror_root = 'http://www.epoc.fr/codemirror_for_pastebin/';

// Les identifiants des languages de pastebin qui sont supportés par CodeMirror
var supported_languages = {
  153 : 'clojure',
  84 : 'cobol',
  200 : 'coffeescript',
  16 : 'css',
  17 : 'd',
  19 : 'diff',
  57 : 'erlang',
  162 : 'go',
  59 : 'groovy',
  60 : 'haskell',
  221 : 'haxe',
  25 : 'htmlmixed',
  196 : 'htmlmixed',
  28 : 'javascript',
  30 : 'lua',
  110 : 'ocaml',
  36 : 'ocaml',
  39 : 'pascal',
  40 : 'perl',
  180 : 'perl',
  41 : 'php',
  113 : 'php',
  120 : 'properties',
  42 : 'python',
  188 : 'r',
  187 : 'rpm',
  45 : 'ruby',
  46 : 'scheme',
  69 : 'smalltalk',
  47 : 'smartymixed',
  48 : 'sql',
  70 : 'tcl',
  51: 'vb',
  132 : 'verilog',
  53 : 'xml',
  205 : 'yaml',
  72 : 'z80'
};

// -------------------------------------------------------------------------- //

// On vérifie si on est bien sur pastebin.com et sur les bonnes pages
if (document.location.hostname != 'pastebin.com' || (window.location.pathname != '/' && window.location.pathname != '' && filename(window.location.pathname) != 'edit.php')) {
  alert('Vous ne pouvez activer ce bookmarklet que sur pastebin.com, sur les pages de création et d\'edition d\'un paste.');
} else {
  // On vérifie que le language sélectionné est supporté par CodeMirror
  var paste_format_id_select = document.getElementsByName('paste_format')[0];
  var paste_format_id = paste_format_id_select.options[paste_format_id_select.selectedIndex].value;

  if (!supported_languages.hasOwnProperty(paste_format_id)) {
    alert('Désolé, CoreMirror ne supporte par le language que vous avez sélectionné.');
  } else {
    // ---------------------------------------------------------------------- //
    // Le vrai code qui nous intéresse (oui, juste quelques lignes)

    var codemirror_for_pastebin = function() {
      var cm = CodeMirror.fromTextArea(
        document.getElementById('paste_code'),
        {
          lineNumbers: true,
          mode: supported_languages[paste_format_id],
          matchBrackets: true,
          tabSize: 2,
          styleActiveLine: true
        }
      );

      cm.setSize('100%', 800);
    };

    // ---------------------------------------------------------------------- //
    // Chargement des fichiers nécéssaires à CodeMirror de façon synchrone

    loadFile('js', codemirror_root+'codemirror.js', function() {
      loadFile('js', codemirror_root+'mode/'+supported_languages[paste_format_id]+'/'+supported_languages[paste_format_id]+'.js', function() {
        loadFile('css', codemirror_root+'codemirror.css', codemirror_for_pastebin);
      });
    });
  }
}