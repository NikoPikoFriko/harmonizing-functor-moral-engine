# audio/ — materiały dźwiękowe Justice-as-Code

Dwa niezależne artefakty zbudowane na tym samym materiale źródłowym (`../PROTOCOL.md`,
`../CONSENSUS-PHASE.md`, `../agent-a/`, `../agent-b/`, `../agent-c/`, `../consensus/`).
Nic tutaj nie modyfikuje warstwy suwerennej ani konsensusowej — to są odczyty, nie źródła.

| Plik | Co to jest | Rozmiar |
|---|---|---|
| [`SLUCHOWISKO.md`](SLUCHOWISKO.md) | scenariusz słuchowiska, sześć aktów, sześć głosów | ~58 min mówienia |
| [`NOTEBOOKLM-SOURCE.md`](NOTEBOOKLM-SOURCE.md) | gęste źródło prozą do wygenerowania podcastu | ~5000 słów |

Wszystkie liczby w obu plikach pochodzą z artefaktów projektu. Tam, gdzie źródło podaje przedział
albo oszacowanie, tekst mówiony podaje przedział albo oszacowanie — precyzja bywa obniżona, pewność nigdy
podniesiona.

---

## Słuchowisko

Sześć aktów po osiem–dziesięć minut, łącznie 56–62 minuty. Każdy akt otwiera jedno pytanie i na nie
odpowiada. Akty I–III to trzy modele suwerenne, każdy w swojej soczewce i bez kontaktu z pozostałymi.
Akty IV–VI to faza scalania: zderzenie przewidywań, audyt ustępstw, rachunek końcowy.

**Obsada:** NARRATOR, AGENT A (systemy rozproszone), AGENT B (systemy typów), AGENT C (teoria sterowania),
ORKIESTRATOR (scalający), GŁOS SYSTEMU (przerywnik). Opisy barw głosu — na początku scenariusza.

### Nagranie wielogłosowe

- **Sześć osób, nie jedna.** Trzej agenci mówią równolegle w aktach I–III, ale nigdy do siebie; ta obcość
  jest efektem, nie usterką. Zaczynają się słyszeć dopiero w akcie IV i wtedy warto zmienić sposób podawania
  kwestii — krócej, z reakcją na poprzednika.
- **GŁOS SYSTEMU nagrać osobno, bez pogłosu.** Ma brzmieć jak wklejka z innego nośnika, zawsze na tej samej
  głośności, także gdy treść jest absurdalna. Nigdy nie interpretować.
- **Didaskalia w nawiasach kwadratowych są instrukcją realizacyjną, nie tekstem.** Jest ich mało i każde
  niesie informację: pauza, cięcie, zmiana tempa. Pauzy w akcie V i VI są dłuższe niż komfortowe i takie
  mają zostać.
- **Liczby czytać wolniej niż resztę zdania.** Są zapisane słownie właśnie po to, żeby nie było kuszące
  przelecieć po nich wzrokiem. Agent A ma je wypowiadać wyraźniej od reszty, Agent C — dokładnie tak samo
  jak resztę.
- **Nie dogrywać muzyki pod dialog.** Jedyne tło wskazane w tekście to szum korytarza otwierający akt I
  i wracający na końcu aktu VI.
- Podział na sesje: akty I–III można nagrać osobno, po jednym aktorze na sesję. Akty IV–VI wymagają
  co najmniej ORKIESTRATORA i jednego agenta w tym samym pomieszczeniu albo dokładnego odsłuchu.

---

## Pakiet pod NotebookLM

`NOTEBOOKLM-SOURCE.md` to proza ciągła bez tabel, bloków kodu i identyfikatorów wewnętrznych — wszystko
rozwinięte w słowa, bo generator czyta to na głos. Nie jest to scenariusz i nie należy go tak traktować:
ma dostarczyć dwojgu syntetycznym rozmówcom tez, liczb i miejsc, w których coś wyszło odwrotnie,
niż zakładano.

1. Nowy notatnik → **Add source** → wgraj `NOTEBOOKLM-SOURCE.md` (albo wklej treść jako tekst).
2. Nie dodawaj równolegle plików z `../consensus/` ani `../agent-*/`. Są pełne tabel i identyfikatorów,
   które generator czyta dosłownie; pakiet powstał właśnie po to, żeby tego uniknąć.
3. **Audio Overview** → *Customize*. Bez podpowiedzi rozmowa pójdzie w stronę „ciekawostek o prawie".
   Warto wskazać oś: metoda (tory suwerenne, reguły spisane przed modelami), trzy tezy, cztery obalone
   przewidywania, czternaście ustępstw bez adresata, dryf jako wektor, koszt scalenia bez predykatu
   odwołania.
4. Jeżeli chcesz jednego wątku zamiast przeglądu, zawęź polecenie do jednego z nich — najlepiej działa
   „dlaczego zbieżność dwóch agentów policzono jako jeden argument" albo „dlaczego legitymacja rośnie,
   kiedy jakość już spadła".

Oczekiwana długość przeglądu audio: kilkanaście minut. To jest streszczenie projektu, nie jego wykład —
pełny materiał jest w scenariuszu, a dowody w `../consensus/`.

---

*Harmonizing Functor Collective · Justice-as-Code*
