# 00-MODEL — Agent A · tor I (suwerenny)

**Soczewka:** systemy rozproszone, protokoły konsensusu, synchronizacja stanu.

**Teza (jedno zdanie):**
Postępowanie sądowe nie jest protokołem konsensusu, tylko **replicated state machine bez replikacji**:
istnieje dokładnie jedna replika utrzymująca stan (sąd), pozostałe węzły dostarczają wejść, których nie
da się zweryfikować krzyżowo, a wymóg terminacji przy braku zbieżności jest domykany wydatkiem
`force_gas` — mierzalnego zasobu autorytetu podstawianego w miejsce dowodu.

---

## 1. Decyzja architektoniczna i jej uzasadnienie

### 1.1 Odrzucenie modelu BFT

Naturalną pokusą jest modelowanie sądu jako Byzantine Fault Tolerant SMR z progiem `n ≥ 3f+1`.
**Odrzucam to mapowanie jako fałszywe** i jest to pierwsza nietrywialna decyzja modelu.

W BFT bezpieczeństwo bierze się z **redundancji stanu**: `n` replik trzyma *ten sam* stan, a poprawność
wynika z tego, że każde dwa kwora przecinają się w co najmniej jednym poprawnym węźle. Warunkiem koniecznym
jest, by repliki **miały ten sam stan do porównania**.

W postępowaniu tego warunku nie ma:

| Wymóg BFT | Status w postępowaniu |
|-----------|----------------------|
| wspólny genesis state | brak — każdy węzeł ma prywatny, nieporównywalny `FactState` |
| repliki trzymają ten sam stan | brak — sąd trzyma stan, strony trzymają twierdzenia o stanie |
| wiadomości self-verifying (podpis + dowód inkluzji) | brak — dowód nie weryfikuje się sam, jego przyjęcie to **decyzja lidera** |
| quorum intersection niepuste | narusza się dokładnie na faktach rozstrzygających (THM-A-02) |
| view-change dostępny replikom | brak — wyłączenie lidera kontroluje pula, do której lider należy |

Właściwym mapowaniem jest zatem **primary-backup z liczbą backupów równą zero i primary o modelu awarii
rational-byzantine**. Konsekwencja jest twarda: `n = 1`, więc `f_max = ⌊(n−1)/3⌋ = 0`.
**System nie toleruje żadnej awarii lidera.** Cała jego odporność opiera się nie na redundancji, lecz na
niezadeklarowanym założeniu, że lider jest bezawaryjny — czyli na `saint_dependency`.

### 1.2 Dlaczego apelacja nie przywraca redundancji

Kontrargument brzmi: instancje wyższe *są* replikami. Nie są, z dwóch niezależnych powodów:

1. **Nie mają dostępu do wejścia.** Apelacja operuje na logu zamrożonym przez prekluzję, nie na świecie.
   To jest replay, nie ponowne wykonanie (THM-A-01, sekcja 3.1).
2. **Nie są niezależną implementacją.** To ta sama „implementacja" (ta sama pula szkolenia, awansu,
   reputacji, ta sama wykładnia). W inżynierii niezawodności odpowiada temu odróżnienie
   redundancji od **N-version programming**: uruchomienie 100 kopii tego samego binarnego artefaktu
   chroni przed awarią sprzętu, nie przed błędem deterministycznym w kodzie. Sąd nad sądem
   to ta sama implementacja na innym hoście (THM-A-07, sekcja 3.7).

### 1.3 Model awarii

Przyjmuję **rational-byzantine**, nie crash-stop i nie losowy byzantine:
węzeł odchyla się od protokołu wtedy i tylko wtedy, gdy odchylenie jest opłacalne, a wykrycie mało prawdopodobne.
Różnica ma konsekwencje formalne: przy awarii losowej rozkład odchyleń jest niezależny od struktury
wypłat i redundancja pomaga; przy awarii racjonalnej odchylenia **koncentrują się dokładnie tam, gdzie
brak instrumentacji** — czyli w miejscach zdefiniowanych przez `systemic_blindness`.

`ASSUMPTION A1`: każdy węzeł jest racjonalny względem swojej funkcji celu `Objective`.
`ASSUMPTION A2`: funkcja celu nie jest stała w czasie (to jest treść `reputation_coupling`).

---

## 2. Prymitywy ontologiczne

| ID | Nazwa | Typ | Uwaga |
|----|-------|-----|-------|
| `PRIM-A-01` | `NodeDescriptor` | aktor | strona, pełnomocnik, sąd, biegły, świadek, organ egzekucyjny. Nosi `reputationPool` — źródło skorelowanej awarii — oraz `mayWithhold`, proceduralne prawo zatajenia stanu. |
| `PRIM-A-02` | `FactState` | stan | prywatny, nierepliowany fragment stanu świata. **Nie jest współdzielony**; do protokołu wchodzą wyłącznie *twierdzenia* o nim. |
| `PRIM-A-03` | `Fact` | dane | pojedynczy fakt z listą `custodians` (posiadaczy) i znakiem interesu każdego z nich. Nośnik `decisive` i `selfVerifying`. |
| `PRIM-A-04` | `Entry` / `CaseLog` | log | akta sprawy jako łańcuch haszy. Append-only **w intencji**; system dopuszcza operacje przepisujące znaczenie przy stałych bajtach (`retroactive_relativization`). |
| `PRIM-A-05` | `Judge` (orkiestrator) | lider | lider bez wyborów i bez view-change dostępnego replikom. Kadencja = czas trwania sprawy. |
| `PRIM-A-06` | `ForceGas` (`FG`) | zasób | jednostka siły rozstrzygnięcia wydawana zamiast dowodu. Definicja operacyjna w `50-RESOURCES.md`. |
| `PRIM-A-07` | `Lease` | czas | termin procesowy jako lease: prawo do działania wygasające z czasem ściany zegara, nie z czasem logicznym. |
| `PRIM-A-08` | `Precedent` | migracja | zmiana `SchemaVersion` wraz z flagą `declarativeBackdate`. |
| `PRIM-A-09` | `VersionVector` | zegar | wektor wersji znaczeń terminów normatywnych. **W obecnym systemie nie istnieje** — to jest `onto_epistemic_drift`. |
| `PRIM-A-10` | `Completeness` | metadane | deklaracja tego, czego w stanie zabrakło przy finalizacji: zbiór porzucony przez prekluzję, fakty single-custody, flaga fikcji doręczenia, skalibrowana pewność. **W obecnym systemie nie jest emitowana.** |
| `PRIM-A-11` | `GasMeter` | licznik | saldo i wydatek `FG`. Wariant faktyczny nie ma pre-execution check. |

Rozdzielenie `PRIM-A-02` i `PRIM-A-03` jest kluczowe: to jedyne miejsce, w którym da się precyzyjnie
powiedzieć, co robi discovery. Discovery **nie synchronizuje `FactState`** (to nie jest fizycznie możliwe),
tylko buduje `CaseLog` z twierdzeń. Różnica między `CaseLog` a rzeczywistym `FactState` jest wielkością,
której system nigdy nie mierzy, bo jej pomiar wymagałby dostępu do `FactState` — czyli do rzeczy,
której brak jest przyczyną istnienia postępowania.

---

## 3. Twierdzenia toru I

Poniżej dziewięć twierdzeń ze szkicami dowodów. Formalizacja typów i predykatów — `10-SPEC.md`.

### 3.1 THM-A-01 — apelacja nie może naprawić `stage_corruption`

**Teza.** Niech `L` będzie logiem po zamknięciu S2 (zamrożonym przez prekluzję), a wynik
`V = f_k ∘ … ∘ f_j (L)`. Apelacja wykonuje `V' = f'_k ∘ … ∘ f'_j (L)` na **tym samym** `L`.
Jeżeli `L ≠ L*` (log rozbieżny ze stanem świata), to żaden replay nie odtwarza `L*`.

**Szkic dowodu.** Rollback w systemie stanowym wymaga snapshotu stanu sprzed punktu przywrócenia.
System utrzymuje dokładnie jeden snapshot: sam `L`. Odwzorowanie `świat → L`, realizowane w S1–S2,
jest (i) nieodwracalne (brak logu operacji, które je wytworzyły — nie protokołuje się tego, czego nie zgłoszono),
(ii) nieinstrumentowane (brak metryki rozbieżności). Zatem maksymalna głębokość rollbacku `d_max`
jest ograniczona z dołu przez granicę prekluzji, a defekt leży **poniżej** tej granicy.
Formalnie w typach: sygnatura `AppealReplay = (log, policy, delta) => Verdict` **nie przyjmuje świata**;
brak parametru jest dowodem. W maszynie stanów odpowiada temu brak krawędzi `S6 → S2`. ∎

**Wniosek.** Apelacja naprawia wyłącznie błąd **funkcji przejścia** (`f ≠ f'`, czyli naruszenie prawa
materialnego lub procesowego), nigdy błąd **wejścia**. To jest ostre rozgraniczenie klasy naprawialnej
od nienaprawialnej i wynika ono z sygnatury, nie z jakości sędziów.

**Oszacowanie udziału.** Niech `p_corrupt` = prawdopodobieństwo defektu wejścia w S1∪S2, `r_novum` =
odsetek defektów odzyskiwalnych przez wąskie wyjątki od prekluzji. Udział nieprzewidywalności wyniku
pochodzący ze `stage_corruption`, a **nie** z ujawniania nowych faktów, wynosi `≥ p_corrupt·(1 − r_novum)`:

| `p_corrupt` [EST] | `r_novum` [EST] | udział nieusuwalny |
|---|---|---|
| 0.15 | 0.05 | ≥ 14.2 % |
| 0.25 | 0.05 | ≥ 23.8 % |
| 0.35 | 0.05 | ≥ 33.2 % |

`ASSUMPTION A3`: `p_corrupt ∈ [0.15, 0.35]` — rząd wielkości szacowany, nie mierzony; system nie emituje
danych pozwalających go zmierzyć, co samo w sobie jest instancją `systemic_blindness`.

---

### 3.2 THM-A-02 — quorum intersection jest puste dokładnie na faktach rozstrzygających

**Teza.** W S2 przecięcie kworów informacyjnych stron nie zawiera żadnego faktu rozstrzygającego
o pojedynczym posiadaczu.

**Szkic dowodu.** Niech `Q_P`, `Q_D` będą zbiorami faktów ujawnionych przez strony.
Założenia: (a) każda strona ma prawo nieujawnienia tego, czego przeciwnik nie potrafi nazwać
(nie da się żądać dokumentu, o którego istnieniu się nie wie); (b) koszt sformułowania żądania jest dodatni;
(c) strony są racjonalne (`A1`).
Weź fakt `x` rozstrzygający, o `custodyClass(x) = "single"`, którego jedynym posiadaczem jest `D`,
i dla którego `interest_D(x) = −1`. Ujawnienie `x` obniża wypłatę `D`; koszt nieujawnienia to
`P(wykrycie)·sankcja`. Przy `P(wykrycie) → 0` (bo tylko `D` wie o istnieniu `x`) nieujawnienie jest
strategią dominującą. Zatem `x ∉ Q_D`, więc `x ∉ Q_P ∩ Q_D`.
Zbiór faktów neutralnych lub obustronnie korzystnych trafia do przecięcia — ale z definicji nie zmienia wyniku. ∎

**Wniosek (warunek zbieżności).** Discovery zbiega do `L*` **wtedy i tylko wtedy**, gdy dla każdego faktu
rozstrzygającego istnieje `custodyClass = "dual"` — dwóch niezależnych posiadaczy o przeciwnych znakach
interesu. Klasa spraw, w których warunek jest strukturalnie niespełniony:

- fakty wewnętrzne organizacji (decyzja bez logu, ustalenie ustne, dokument nieewidencjonowany),
- komunikacja jednostronna (brak drugiego egzemplarza),
- stany psychiczne (zamiar, wiedza, dobra wiara) — `custodyClass = "single"` z definicji,
- fakty, których nośnik jest kontrolowany przez pozwanego (logi systemowe, dokumentacja medyczna,
  wewnętrzna korespondencja).

W tych klasach **zbieżność jest formalnie niemożliwa**, a nie tylko trudna. System nie odróżnia ich od
klas zbieżnych i nie emituje tego rozróżnienia w wyroku — stąd `NN-A-07`.

---

### 3.3 THM-A-03 — FLP i cena terminacji

**Teza.** System kupuje terminację, płacąc weryfikowalnością; `force_gas` jest ceną tej transakcji.

**Szkic dowodu.** FLP: w systemie asynchronicznym nie istnieje deterministyczny protokół zapewniający
jednocześnie *agreement*, *validity* i *termination* w obecności choćby jednej awarii typu crash.
Kanał postępowania jest asynchroniczny: nie ma górnej granicy na doręczenie, opinię biegłego,
dostępność świadka, chorobę sędziego. Awaria co najmniej crash jest pewna.
Terminacja jest **wymuszona zewnętrznie** (zakaz odmowy wymiaru sprawiedliwości) — nie podlega porzuceniu.
Validity (wyrok musi być jedną z dopuszczalnych wartości) też nie.
Zatem porzucone musi zostać **agreement**. I dokładnie to obserwujemy: strony nie muszą się zgodzić;
zgoda jest zastąpiona **decyzją narzuconą**.

Z Chandra–Toueg wiadomo, że konsensus w asynchronii staje się rozwiązywalny przy dodaniu failure
detectora `Ω` (eventual leader). System implementuje `Ω` — ale nie jako detektor awarii, tylko jako
**decision oracle**: komponent zwracający wartość, gdy protokół jej nie wyznacza. Różnica jest zasadnicza:
poprawność `Ω` w BFT jest weryfikowalna post-hoc (albo lider był stabilny, albo nie), poprawność
decision oracle nie jest weryfikowalna nigdy, bo nie istnieje niezależne źródło wartości oczekiwanej. ∎

**Wniosek.** „Wyrok" nie jest commitem konsensusu. Jest **terminacją bez agreement**, opłaconą z zasobu
legitymacji. To definiuje `force_gas` nie jako patologię, lecz jako **konieczny składnik protokołu**
o tej strukturze wymagań. Krytyka nie może więc brzmieć „nie wydawajcie FG"; musi brzmieć
„mierzcie FG i księgujcie go" — stąd `NN-A-08`.

---

### 3.4 THM-A-04 — `force_gas`: brak pre-execution check implikuje niewykrywalną niewypłacalność

**Teza.** System nie może wykryć własnej niewypłacalności przed forkiem, ponieważ wydatek `FG` nie jest
poprzedzony sprawdzeniem salda.

**Szkic dowodu.** Porównaj dwie sygnatury (pełne typy w `10-SPEC.md`):

- `chargeChecked(m, amount): {ok:true, meter} | {ok:false, overdraft}` — wariant poprawny,
- `chargeUnchecked(m, amount): GasMeter` — wariant faktyczny; typ zwracany **nie ma konstruktora błędu**.

W wariancie faktycznym wydatek zawsze udaje się lokalnie: sąd zawsze może wydać wyrok, niezależnie od
stanu puli legitymacji `L`. Saldo schodzi poniżej zera bez sygnału. Ponieważ jedyny odbiornik sygnału
znajduje się poza systemem (dobrowolna wykonalność w S7, poziom zaskarżalności, ucieczka do arbitrażu),
detekcja jest (i) post-hoc, (ii) opóźniona o czas rzędu lat, (iii) nieprzypisywalna do konkretnego wydatku.
Trzy własności razem dają pętlę sterowania z opóźnieniem większym niż stała czasowa zaburzenia —
czyli układ niestabilny (`LOOP-A-01`). ∎

**Zachowanie przy wyczerpaniu.** Nie następuje zatrzymanie protokołu (`out of gas` nie istnieje jako stan).
Następuje **chain split**: część węzłów przestaje akceptować finalizację i buduje alternatywny łańcuch
rozstrzygania — arbitraż, samopomoc, korupcja jako alternatywny mempool, egzekucja pozaprawna,
emigracja jurysdykcyjna, forum shopping. Oba łańcuchy są ważne według własnych reguł; nie ma reguły
wyboru cięższego łańcucha, bo nie ma wspólnej miary pracy. To jest **trwały fork**, nie reorg.

---

### 3.5 THM-A-05 — `majesty_switch` jest nieobserwowalny i to nie jest zaniedbanie

**Definicja.** `majesty_switch` = przełączenie reguły decyzyjnej z
`D_prob(L) = argmax_v P(v | L)` na `D_auth(L) = v` wybrane przez lidera, gdzie posterior nie determinuje `v`.

**Predykat wyzwalający (formalny, lokalnie sprawdzalny):**

```
switch(t) = [ H(V | L_t) > θ_H ] ∧ ( [ lease_remaining(t) < τ ] ∨ [ cost_to_converge(t) > budget(t) ] )
```

gdzie `H` to entropia rozkładu na dopuszczalnych rozstrzygnięciach w bitach.
Słownie: **timeout-driven leader commit**. W poprawnym protokole (Raft, PBFT) lider, który nie zebrał
potwierdzeń przed upływem lease, **nie commituje** — traci lease i następuje view-change. Tutaj commituje.
To jest jedyna, ale całkowicie wystarczająca różnica.

**Twierdzenie o nieobserwowalności.** Nie istnieje detektor `d: PublicOutput → {prob, auth}` o dokładności
istotnie lepszej niż baza, ponieważ oba tryby produkują wyjście o identycznym kształcie:
uzasadnienie ma tę samą gramatykę niezależnie od tego, czy powstało z posterior, czy z autorytetu.
W typach: `PublicJustification.calibratedSupport: number | null`, a w systemie faktycznym wartość jest
zawsze `null` — predykat `switchEmitsSameShape` jest spełniony dla każdej pary wyjść.

**Twierdzenie o konieczności ślepoty (game-theoretic).** Brak emisji skalibrowanej pewności nie jest
zaniedbaniem — jest **strategią dominującą systemu**.
Dowód przez sprzeczność: przypuśćmy, że uzasadnienie emituje `p = 0.55`. Egzekucja w S7 jest binarna
i pełna (nie egzekwuje się 55 % nakazu). Jawna rozbieżność między pewnością `0.55` a mocą egzekucji `1.0`
jest publicznie widoczna przy **każdym** rozstrzygnięciu granicznym i obniża pulę legitymacji szybciej,
niż obniża ją nieujawnianie (którego koszt ponoszony jest tylko przy wykrytych pomyłkach).
Zatem `U_system(nieujawnianie) > U_system(ujawnianie)` przy dowolnym rozkładzie `p` skoncentrowanym
poniżej 1. Nieujawnianie jest równowagą. ∎

**To jest najważniejszy wynik strukturalny modelu:** `systemic_blindness` nie jest błędem implementacji
nałożonym na dobry protokół. Jest **wymuszony przez `force_gas`**. Nie da się usunąć ślepoty, nie ruszając
sposobu, w jaki system domyka FLP. To także wyjaśnia, dlaczego postulaty „więcej transparentności"
nie są przyjmowane: są sprzeczne z warunkiem działania mechanizmu, a nie z czyimś interesem osobistym.

---

### 3.6 THM-A-06 — deklaratywna teoria precedensu jest niespójnym protokołem

**Teza.** Precedens jako mechanizm jest poprawny. **Deklaratywna teoria precedensu** („sąd odkrywa prawo,
nie tworzy") jest niepoprawnym protokołem migracji schematu.

**Szkic dowodu.** Blok logu ma parę `(bytes, meaning)`. Finalizacja gwarantuje niezmienność `bytes`
(sentencja prawomocna). Powaga rzeczy osądzonej gwarantuje niezmienność wyniku. S8 zmienia `meaning`
i deklaruje, że nowe `meaning` obowiązywało zawsze. Wtedy dwie sprawy o identycznych `bytes`
(identyczny stan faktyczny) mają różne prawomocne wyniki wyłącznie w funkcji **momentu commitu w czasie ściany zegara**.
Zatem `δ` nie jest funkcją stanu; jest funkcją stanu i wall-clock. System, którego funkcja przejścia zależy
od wall-clock, nie jest deterministycznie odtwarzalny, więc replay jest niemożliwy, więc audyt jest niemożliwy:
pytanie „czy ta sprawa byłaby dziś rozstrzygnięta tak samo?" nie ma zdefiniowanej odpowiedzi. ∎

W typach: `interpretationAt(at, precedents, base)` jest deterministyczna wtedy i tylko wtedy, gdy
`replayDeterministic(precedents) === true`, czyli gdy żaden precedens nie ma `declarativeBackdate`.
Przy `declarativeBackdate = true` wynik zależy nie od `at`, lecz od zbioru precedensów **znanych w chwili zapytania**.

**Poprawka protokolarna.** To jest rozwiązany problem inżynierski: **activation height**.
Zmiana semantyki niesie jawną wysokość aktywacji; bloki poniżej niej są interpretowane starą semantyką,
powyżej — nową. Koszt: jedno pole `SchemaVersion` w każdym wpisie. Zysk: replay staje się możliwy,
a wraz z nim testy regresji na historii orzeczniczej. Stąd `NN-A-05`.

---

### 3.7 THM-A-07 — `reputation_coupling` łamie próg bizantyjski, a redundancja tego nie naprawia

**Teza.** Skorelowany komponent w funkcjach celu węzłów wprowadza podłogę na prawdopodobieństwo
awarii łącznej, niezależną od liczby instancji kontrolnych.

**Szkic dowodu.** Niech `b_i ∈ {0,1}` oznacza odchylenie węzła `i`. Klasyczne założenie BFT:
`b_i` niezależne, więc `P(Σb_i > n/3)` maleje wykładniczo z `n`.
`reputation_coupling` zmienia funkcję celu w trakcie działania protokołu:
`U_i(t) = (1−α−β)·U_client + α·U_self,i + β·U_system`, gdzie `U_system` (reputacja systemu jako całości)
jest **wspólna dla całej puli**. Modeluj `b_i = 1[ξ_i + β·ξ_sys > θ]` ze wspólnym `ξ_sys`.
Wtedy `corr(b_i, b_j) = β²σ²_sys / (σ²_i + β²σ²_sys) = ρ > 0`, a prawdopodobieństwo, że **wszystkie**
`n` instancji zawiedzie, wynosi `P_joint(p, ρ, n) = ρ·p + (1−ρ)·pⁿ`, czyli jest ograniczone z dołu przez `ρ·p`
niezależnie od `n`. ∎

**Liczby.** `p = 0.10` (prawdopodobieństwo, że pojedyncza instancja przetworzy sprawę wadliwie) [EST]:

| ρ | n=1 | n=2 | n=3 | n=10 | podłoga `1−ρp` |
|---|-----|-----|-----|------|----------------|
| 0.0 | 0.900 | 0.990 | **0.999** | 1.000 | 1.000 |
| 0.3 | 0.900 | 0.963 | 0.969 | 0.970 | 0.970 |
| 0.7 | 0.900 | 0.927 | **0.930** | 0.930 | 0.930 |
| 0.9 | 0.900 | 0.909 | 0.910 | 0.910 | 0.910 |

Trzy instancje przy niezależności dają `0.999`. Przy `ρ = 0.7` [EST] dają `0.930`.
**Redundancja kupuje 3 punkty procentowe zamiast 9.9 — poprawa o rząd wielkości mniejsza od zakładanej,
i już druga instancja wyczerpuje 96 % dostępnego zysku.** Trzecia instancja jest niemal darmowym kosztem.

**Wniosek.** Odpowiedzią na skorelowaną awarię nie jest więcej instancji, tylko **heterogeniczność źródła celu**:
węzeł weryfikujący spoza puli reputacyjnej weryfikowanego. To jest dokładnie N-version programming
z niezależnymi zespołami. Stąd `NN-A-03` i `INV-A-10`.

---

### 3.8 THM-A-08 — doręczenie: dwóch generałów i fikcja jako „assume ACK"

**Teza.** Fikcja doręczenia jest implementacją `assume ACK`, poprawną przy niskim i **niezależnym**
`p_loss`, katastrofalną przy stracie skorelowanej.

**Szkic dowodu.** Doręczenie wymaga common knowledge: nadawca wie, że odbiorca wie, i odbiorca wie,
że nadawca wie. Przy zawodnym kanale common knowledge nie jest osiągalne w skończonej liczbie wiadomości
(problem dwóch generałów). Prawo rozwiązuje to aksjomatem: po `k` awizach uznaje się za doręczone.
To zamienia *knowledge* na *assumed knowledge* — dokładny odpowiednik protokołu transportowego, który
po `k` retransmisjach zakłada dostarczenie i zwalnia bufor nadawczy.
Taki protokół jest poprawny, gdy `p_loss` jest małe i niezależne od treści oraz od odbiorcy.
Tutaj `p_loss` jest **skorelowane z klasą pozwanego**: bezdomność, hospitalizacja, migracja zarobkowa,
błąd adresowy w rejestrze, brak stałego adresu — wszystkie korelują z byciem stroną słabszą.
Zatem strata nie jest ani mała, ani niezależna, a błąd koncentruje się w jednej klasie węzłów. ∎

**Wniosek.** Wyrok zaoczny oparty na fikcji doręczenia to klasa, w której `p(stage_corruption) ≈ 1`
warunkowo na tym, że fikcja była fałszywa — bo strona nie uczestniczyła w S2 w ogóle, więc
`Q_P = ∅` i przecięcie kworów jest puste trywialnie. Poprawka: bounded retry z **eskalacją na inny kanał**
(kanały niezależne mają nieskorelowane `p_loss`) plus obowiązkowa propagacja flagi `assumedDelivery`
do wyroku i do S7. Stąd `NN-A-09` i `INV-A-09`.

---

### 3.9 THM-A-09 — prekluzja jako GC bez reachability analysis

**Teza.** Prekluzja jest poprawnym mechanizmem zarządzania pamięcią o **niepoprawnym trybie awarii**:
zwraca cichy błędny wynik zamiast błędu.

**Szkic dowodu.** Tracing GC zbiera obiekty **nieosiągalne** — to zapewnia bezpieczeństwo:
zwolniony obiekt nie może być potrzebny. Prekluzja zbiera twierdzenia i wnioski **po czasie życia**,
niezależnie od osiągalności (istotności). To semantyka region/arena allocator: deterministyczna,
`O(1)` na zwolnienie, bez stop-the-world — czyli inżyniersko dobra decyzja przy ograniczonym budżecie
(patrz THM-A-11). Ale ma znany tryb awarii: **use-after-free**. Fakt zostaje zwolniony, potem okazuje się
potrzebny, a system nie ma sposobu, by go odzyskać. Kluczowe: reakcją nie jest `panic`, tylko
**undefined behavior** — system produkuje wyrok nieodróżnialny od wyroku wydanego na pełnym stanie. ∎

**Poprawka (tania).** Prekluzja powinna być `fail-loud`: finalizacja niesie zbiór `droppedByPreclusion`
i flagę niekompletności. Koszt implementacji: metadane, rząd 10⁻⁴ kosztu sprawy [EST].
Zysk: częściowo przywraca obserwowalność `majesty_switch`, bo pozwala odróżnić „rozstrzygnięto na pełnym
stanie" od „rozstrzygnięto na stanie okrojonym proceduralnie". Stąd `INV-A-04`.

---

### 3.10 THM-A-10 — kolejność jako zasób ekonomiczny (MEV)

**Teza.** Wokanda jest mempoolem; kto kontroluje kolejność, ekstrahuje wartość bez dotykania decyzji.

**Szkic dowodu.** Opóźnienie zmienia wynik przez kanały niezależne od meritum: przedawnienie roszczenia
akcesoryjnego, niewypłacalność dłużnika, śmierć lub niepamięć świadka, zmiana linii orzeczniczej w S8,
wygaśnięcie zabezpieczenia. Zatem istnieje funkcja `V_MEV = P(zmiana wyniku | opóźnienie Δ) × stawka`,
która jest rosnąca w `Δ` i dodatnia. Skoro jest dodatnia, jest przedmiotem strategii: **przewlekłość jako
usługa**. Nie trzeba kupować decyzji — wystarczy kupić kolejność (wnioski o wyłączenie, wnioski dowodowe
bez wartości informacyjnej, zmiana pełnomocnika przed terminem). ∎

**Obrona jest znana i tania.** W systemach rozproszonych: fair ordering, weryfikowalny timestamp wpływu,
encrypted mempool z threshold decryption. Odpowiednik proceduralny: losowy przydział **plus** commit
momentu wpływu i każdej zmiany kolejności do publicznego, append-only rejestru **poza kontrolą organu**.
Koszt: podpis i wpis, rząd 10⁻⁶ kosztu sprawy [EST]. Eliminuje całą klasę ataków na kolejność, bo czyni
ją falsyfikowalną. Stąd `NN-A-02` i `INV-A-05`.

---

### 3.11 THM-A-11 — `force_gas` jest wymuszony niedoborem zasobu, nie charakterem

**Teza.** Jeżeli budżet uwagi `B` jest mniejszy od złożoności wejścia `C` (w tych samych jednostkach czasu),
to liczba kwestii rozstrzyganych bez pełnego przetworzenia dowodu jest `≥ (C − B)/c_kwestia > 0`
**deterministycznie**, niezależnie od kompetencji i dobrej woli.

**Liczby [EST]** (`ASSUMPTION A4`: 1600 h efektywnych rocznie na orzekanie):

| referat | budżet na sprawę |
|---|---|
| 300 spraw/rok | 5.3 h |
| 500 spraw/rok | 3.2 h |
| 800 spraw/rok | 2.0 h |

Złożoność wejścia (250 słów/stronę, 200 słów/min czytania ze zrozumieniem):

| objętość akt | sam czas czytania |
|---|---|
| 50 str | 1.0 h |
| 200 str | 4.2 h |
| 1000 str | 20.8 h |
| 5000 str | 104.2 h |

Budżet obejmuje **całość**: akta, rozprawę, naradę, uzasadnienie. Dla akt powyżej ~150 stron
`B < C` już przy samym czytaniu, przy zerowym czasie na resztę. ∎

**Dwa wnioski, oba nietrywialne.**

1. `force_gas` nie jest patologią charakterologiczną. Jest **wymuszonym trybem degradacji** przy `B < C`.
   Postulat „sędziowie powinni się bardziej przykładać" jest formalnie pusty: nie zmienia `B` ani `C`.
2. **Prekluzja i `force_gas` są substytutami.** Oba są odpowiedziami na `B < C`: prekluzja zmniejsza `C`
   przez odrzucenie wejścia, `force_gas` domyka lukę przez zgadnięcie wyjścia. System, który zaostrza
   prekluzję, obniża wydatek FG i odwrotnie. To jest **jedyny znany mi w tym modelu tradeoff o dwóch
   jawnie sterowalnych nastawach** — i dlatego jest najważniejszym punktem projektowym całego systemu,
   a jednocześnie jedynym, którego żadna ze stron sporu publicznego nie formułuje jako tradeoffu.

---

## 4. Mapa zjawisk obowiązkowych

| Klucz protokołu | Konstrukt modelu | Miejsce |
|---|---|---|
| `force_gas` | `PRIM-A-06`, `RES-A-01`, `THM-A-04`, `THM-A-11`, `LOOP-A-01` | wszędzie; wydatek w S4/S5 |
| `majesty_switch` | `ALG-A-05`, `THM-A-05` | S4→S5 |
| `reputation_coupling` | `Objective`, `THM-A-07`, `LOOP-A-02` | S2–S6 |
| `retroactive_relativization` | `EntryKind.correction`, naruszenie `INV-A-01`, `THM-A-06` | S5, S6, S8 |
| `onto_epistemic_drift` | `VersionVector`, `mergeMeaning`, `LOOP-A-05` | S4, S8 |
| `stage_corruption` | `THM-A-01`, brak krawędzi `S6→S2` | S1, S2 → propagacja |
| `systemic_blindness` | `THM-A-05` (konieczność), `PublicJustification.calibratedSupport = null`, `LOOP-A-04` | S5 |
| `saint_dependency` | sekcja 1.1, `n = 1 ⇒ f_max = 0`, `THM-A-07`, `LOOP-A-07` | cały runtime |

---

## 5. Czego ten model **nie** twierdzi

Higiena: poniższe nie wynikają z toru I i nie są przeze mnie twierdzone.

1. Że system jest zły dlatego, że ludzie w nim są źli. Model jest strukturalny; `A1` zakłada racjonalność,
   nie złą wolę. Wszystkie tryby awarii występują przy węzłach maksymalnie sumiennych.
2. Że dałoby się zredukować `force_gas` do zera. THM-A-11 mówi coś przeciwnego: przy `B < C` `FG_min > 0`.
   Twierdzę wyłącznie, że jest **niemierzony**, a nie że jest zbędny.
3. Że automatyzacja rozwiązuje problem. Automat rozwiązuje `THM-A-11` (zwiększa `B`), ale nie rozwiązuje
   `THM-A-02` (custody), nie rozwiązuje `THM-A-03` (FLP obowiązuje tak samo) i **pogarsza** `THM-A-07`,
   bo jedna implementacja to `ρ → 1`.
4. Że którakolwiek konkretna jurysdykcja zachowuje się tak, jak model przewiduje. Model jest o klasie
   protokołów, nie o obserwacji empirycznej; wszystkie liczby są oznaczone `[EST]`.

---

*Agent A · tor I · Justice-as-Code v1.0*
