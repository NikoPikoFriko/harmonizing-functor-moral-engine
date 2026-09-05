# Justice-as-Code — protokół wielotorowy (v1.0)

Wspólny **interfejs zgodności** dla niezależnych agentów modelujących system sprawiedliwości i kodeks prawny
jako *code base*, a nie jako tekst perswazyjny.

Protokół nie narzuca treści modelu. Narzuca wyłącznie **kształt artefaktów** i **schemat identyfikatorów**,
bez których faza konsensusu jest niemożliwa (nie da się zdiffować rzeczy, które nie mają adresów).

---

## 0. Zasada dwutorowości

Każdy agent prowadzi dwa rozłączne tory i **nie miesza ich w jednym pliku**:

| Tor | Nazwa | Reguła |
|-----|-------|--------|
| **I** | **Suwerenny** (`own`) | Model doprowadzony do końca bez żadnego ustępstwa na rzecz zgodności z innymi agentami. Jeżeli model wymaga odrzucenia cudzej ontologii — odrzuca ją wprost. |
| **II** | **Konsensusowy** (`consensus`) | Dopiero po zamknięciu toru I: jawna lista ustępstw, ich koszt jednostkowy, funkcja kumulacji, wykrywalność i warunek odwołania. |

Tor II nigdy nie edytuje toru I. Ustępstwo jest **zapisem księgowym**, nie poprawką modelu.

**Aksjomat wejściowy (dany, nie do udowodnienia przez agenta):** system wartości pojedynczego,
zindywiduowanego podmiotu jest strukturalnie lepiej określony niż uśrednienie instytucjonalne
(„mrowomózgowie”). Agent może ten aksjomat *formalizować* i badać jego warunki brzegowe,
ale nie traktuje uśrednienia jako domyślnego arbitra.

---

## 1. Kanoniczny cykl życia sprawy (wspólna oś adresowania)

Każdy agent mapuje swój model na te etapy. Wolno dodawać etapy własne (`Sx-*`), nie wolno pomijać poniższych.

| ID | Etap prawny | Odpowiednik systemowy (sugestia, nie nakaz) |
|----|-------------|---------------------------------------------|
| `S0` | zdarzenie / szkoda | wystąpienie stanu faktycznego poza obserwowalnością systemu |
| `S1` | inicjacja, pisma, kwalifikacja | parsowanie wejścia, walidacja schematu, routing |
| `S2` | postępowanie dowodowe / discovery | synchronizacja stanu między nieufnymi węzłami |
| `S3` | wnioski, incydenty, prekluzja | kontrola przepływu, timeouty, garbage collection roszczeń |
| `S4` | rozprawa | wykonanie zaplanowane przez orkiestratora |
| `S5` | wyrok | commit / finalizacja |
| `S6` | apelacja, kasacja | rollback, replay, rewizja warstwy wyżej |
| `S7` | egzekucja | efekty uboczne w świecie |
| `S8` | precedens, linia orzecznicza | migracja schematu, zmiana semantyki wstecz |

---

## 2. Zjawiska obowiązkowe do zamodelowania

Agent musi nazwać, sformalizować i zmierzyć (choćby proxy) każde z poniższych. Nazwa własna dozwolona,
ale w `agent.json` musi wystąpić mapowanie na poniższe klucze.

| Klucz | Zjawisko |
|-------|----------|
| `force_gas` | wymuszanie konsensusu przez orkiestratora/sędziego: zasób „siły rozstrzygnięcia” wydawany zamiast dowodu. Kto go płaci, ile go jest, co się dzieje przy wyczerpaniu. |
| `majesty_switch` | moment przełączenia z rozstrzygania probabilistycznego (na podstawie dowodów) na rozstrzyganie autorytetem. Warunek wyzwalania, obserwowalność, koszt. |
| `reputation_coupling` | przekierowanie celu podsystemu z interesu klienta na własną reputację, a stąd na reputację systemu jako całości. |
| `retroactive_relativization` | wsteczne uspójnianie: system przepisuje interpretację przeszłych stanów, żeby uniknąć ujawnienia błędu. |
| `onto_epistemic_drift` | dryf ontologiczno-epistemiczny: erozja stałych punktów odniesienia (w tym udawanie, że fakt techniczny jest kwestią wykładni). |
| `stage_corruption` | błąd na wczesnym etapie (np. `S2`) nieodwracalnie zatruwający wszystkie dalsze etapy — źródło nieprzewidywalności *niezależne* od ujawniania nowych faktów. |
| `systemic_blindness` | obszary, których system konstytutywnie nie widzi, bo ich obserwacja podważyłaby jego legitymację. |
| `saint_dependency` | zależność kodeksu od istnienia osoby nieskończenie kompetentnej i bezstronnej („święty” / majestat) jako ukryta zależność runtime. |

---

## 3. Artefakty (ścieżki obowiązkowe)

Katalog agenta: `docs/justice-as-code/agent-<id>/`

| Plik | Tor | Zawartość |
|------|-----|-----------|
| `00-MODEL.md` | I | model suwerenny: ontologia, prymitywy, decyzja architektoniczna i jej uzasadnienie |
| `10-SPEC.md` | I | specyfikacja: typy, niezmienniki, maszyna stanów, algorytmy, złożoność, tryby awarii |
| `20-DYNAMICS.md` | I | pętle sprzężeń, znak, wzmocnienie, opóźnienie, warunek rozbiegania, atraktory degeneracji |
| `50-RESOURCES.md` | I | budżet zasobów: co jest skończone, w jakich jednostkach, kto płaci, jak się miarkuje |
| `40-NONNEGOTIABLE.md` | I/II | elementy, których **nie wolno oddać opatrzności** — każdy z argumentem matematycznym lub algorytmicznym |
| `30-CONCESSIONS.md` | II | księga ustępstw + funkcja kumulacji |
| `agent.json` | — | maszynowe streszczenie do fazy scalania |

---

## 4. Schemat identyfikatorów

`<TYP>-<AGENT>-<NN>`, np. `INV-A-03`, `LOOP-B-07`, `CON-C-02`.

| Typ | Znaczenie |
|-----|-----------|
| `PRIM` | prymityw ontologiczny (typ danych, aktor, zdarzenie) |
| `INV` | niezmiennik, który system ma utrzymać |
| `ALG` | algorytm / procedura |
| `LOOP` | pętla sprzężenia zwrotnego |
| `RES` | zasób i jego miarkowanie |
| `NN` | element nienegocjowalny |
| `CON` | ustępstwo konsensusowe |
| `FAIL` | tryb awarii |

---

## 5. Księga ustępstw — schemat wpisu

Każdy wpis w `30-CONCESSIONS.md` ma **wszystkie** pola:

```
CON-<A>-<NN>
  etap:            S0..S8
  ustępuję:        co konkretnie z toru I zostaje osłabione
  na rzecz:        interfejs / założenie wspólne, które to wymusza
  mechanizm:       jak ustępstwo jest realizowane w kodzie/procedurze
  koszt_natychmiastowy: wartość + jednostka (patrz 50-RESOURCES.md)
  kumulacja:       funkcja narastania (liniowa / wykładnicza / progowa), parametr, okres półtrwania
  wykrywalność:    czym zmierzę, że ustępstwo zaczęło szkodzić (metryka + próg)
  odwracalność:    pełna / częściowa / nieodwracalna, koszt cofnięcia
  warunek_odwołania: predykat, po którego spełnieniu ustępstwo wygasa automatycznie
  alternatywa:     co byłoby, gdyby nie ustąpić (i dlaczego to droższe)
```

Na końcu pliku obowiązkowo: **model kumulacji łącznej** — jawny wzór na dryf sumaryczny
$D(t)$ z wszystkich ustępstw, warunek, przy którym $D$ przekracza próg utraty sensu systemu,
oraz oszacowanie liczby ustępstw do tego progu.

---

## 6. Reguła nienegocjowalności

Wpis `NN-*` jest ważny tylko wtedy, gdy zawiera **argument formalny**, nie apel:
dowód niemożliwości, twierdzenie o niezmienniku, oszacowanie złożoności, wynik z teorii gier
(np. brak równowagi incentive-compatible), albo kontrprzykład konstrukcyjny.
„To ważne dla praworządności” nie jest argumentem. „Bez tego niezmiennik `INV-A-02` jest naruszalny
przez pojedynczego aktora w czasie $O(1)$ i nie da się tego wykryć postfactum” — jest.

---

## 7. `agent.json` — kontrakt scalania

```json
{
  "agent": "A",
  "lens": "krótka nazwa soczewki",
  "thesis": "jedno zdanie: na czym polega system sprawiedliwości w tym modelu",
  "primitives": [{ "id": "PRIM-A-01", "name": "", "type": "", "note": "" }],
  "invariants": [{ "id": "INV-A-01", "statement": "", "enforced_at": ["S2"], "violation_detectable": true }],
  "loops": [{ "id": "LOOP-A-01", "phenomenon": "reputation_coupling", "sign": "+", "gain": "", "delay": "", "runaway_condition": "" }],
  "resources": [{ "id": "RES-A-01", "name": "", "unit": "", "finite": true, "payer": "", "metering": "" }],
  "nonnegotiables": [{ "id": "NN-A-01", "claim": "", "argument_type": "impossibility|complexity|game-theoretic|invariant|counterexample", "sketch": "" }],
  "concessions": [{ "id": "CON-A-01", "stage": "S2", "gives_up": "", "cost": 0, "unit": "", "accumulation": "", "reversible": "full|partial|none", "revocation_predicate": "" }],
  "phenomena_coverage": { "force_gas": "LOOP-A-03", "majesty_switch": "ALG-A-05" },
  "open_conflicts_expected": ["gdzie spodziewam się sporu z innymi agentami i dlaczego nie ustąpię"]
}
```

---

## 8. Reguły higieny

1. **Zero prozy perswazyjnej.** Piszesz spec, nie esej. Każde twierdzenie ma być falsyfikowalne albo oznaczone jako `ASSUMPTION`.
2. **Zero pustych metafor.** Analogia programistyczna jest ważna tylko wtedy, gdy przenosi *zachowanie*: warunek poprawności, tryb awarii, złożoność albo protokół. Jeśli przenosi tylko nastrój — wykreśl.
3. **Liczby.** Każdy koszt i każde wzmocnienie ma jednostkę i rząd wielkości, choćby oszacowany. Oszacowania oznacz `[EST]`.
4. **Niezależność.** W torze I nie czytasz i nie cytujesz artefaktów innych agentów.
5. **Język.** Polski; terminy techniczne po angielsku, bez tłumaczenia na siłę.
6. **Bez git.** Agent nie wykonuje operacji git. Zapisuje wyłącznie pliki w swoim katalogu.

---

*Harmonizing Functor Collective · Justice-as-Code · protokół v1.0*
