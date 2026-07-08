# Áudio do site (opcional)

O motor de som do site é **100% sintetizado** (Web Audio, sem arquivos) por padrão
— assim a CSP `default-src 'self'` fica intacta e não há dependência de terceiros.

Se você quiser tocar **arquivos de áudio próprios** (que você **possui ou
licencia**) no lugar da síntese, é só:

1. Colocar os arquivos (`.mp3`, `.ogg`, `.wav`, `.webm`) **nesta pasta**
   (`public/audio/`). Eles são servidos same-origin (`/portfolio/audio/…`), então
   a CSP continua `'self'` — nenhuma exceção de segurança é necessária.
2. Mapear cada arquivo a um "cue" no [`manifest.json`](./manifest.json):

   ```json
   {
     "achievement": "mission-passed.mp3",
     "pickup": "coin.mp3",
     "save": "save.mp3"
   }
   ```

3. Pronto. Ao tocar aquele cue, o motor usa o arquivo; se o arquivo faltar ou o
   cue não estiver no manifest, ele cai automaticamente no som sintetizado.

## Cues disponíveis

| cue | quando toca |
| --- | --- |
| `achievement` | conquista desbloqueada ("missão cumprida") |
| `mission` | b1t vai aprontar (início de travessura) |
| `theme` / `cheat` | b1t troca o tema |
| `save` | ligar o som |
| `pickup` | carimbo de certificado |
| `secret` | comando especial / segredo |
| `error` | comando inexistente no terminal |
| `firework` | conquista mestre (100 cliques) |
| `boop` `boop2` `hop` `scan` `worried` `happy` `wave` `click` | vozinha/reações do b1t |

## Importante (licença)

Só adicione áudio que você **tem o direito de usar**. Efeitos de jogos comerciais
(ex.: GTA: San Andreas) são protegidos por direitos autorais dos respectivos
detentores — não os inclua a menos que você realmente possua a licença. A
responsabilidade pelo conteúdo desta pasta é de quem publica o site.
