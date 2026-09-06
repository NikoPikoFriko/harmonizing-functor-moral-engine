# AGENT C — 50-RESOURCES (tor I, suwerenny)

Budżet zasobów. Reguła porządkująca: **zasób bez jednostki i bez licznika nie jest zasobem, tylko postulatem.** Każda pozycja ma jednostkę, podaż, płatnika, krzywą wyczerpania i sposób miarkowania. Wszystkie liczby z modelu `10-SPEC.md`.

---

## 0. Tabela parametrów bazowych (`BASE`)

Wartości `[EST]`, kalibracja rzędu wielkości. Krok `Δ = 1 kwartał = 90 dni`. `ASSUMPTION`: `N = 1·10⁵ spraw/kwartał` (jurysdykcja średniej wielkości).

| parametr | wartość | jednostka | znaczenie |
|----------|---------|-----------|-----------|
| `c_d` | 1.0 | RU | koszt samo-ujawnienia błędu |
| `c_m` | 8.0 | RU | koszt błędu wykrytego z zewnątrz |
| `φ` | 0.5 | — | `P(wykrycie \| działający czujnik)` |
| `κ` | 6.0 | 1/RU | ostrość reakcji strategicznej (nachylenie logistyki) |
| `γ₀` | 0.30 | 1/kw | maks. tempo korekty odwoławczej przy `O=1` |
| `τ_a` | 8 | kw | opóźnienie `S5 → S6` (2 lata) |
| `τ_L` | 3 | kw | opóźnienie percepcji legitymacji |
| `η` | 0.05 | 1/kw | tempo instalacji czujników (stała czasowa 20 kw) |
| `O_target` | 0.60 | — | deklarowany cel obserwowalności |
| `ρ` | 0.25 | 1/kw | współczynnik demontażu czujnika pod presją `E` |
| `μ` | 0.20 | 1/kw | tempo adaptacji legitymacji |
| `δ_e` | 1.2 | — | wrażliwość `L` na błąd **ujawniony** |
| `δ_m` | 0.15 | — | krótkoterminowa premia `L` za rozstrzygnięcie autorytetem |
| `ξ` | 0.05 | 1/kw | przyrost wariancji proceduralnej przy `O=0` |
| `ξ_m` | 0.06 | 1/kw | przyrost wariancji z trybu autorytetu |
| `χ` | 0.10 | 1/kw | relaksacja wariancji proceduralnej |
| `V_fact` | 0.12 | — | **nieredukowalna** niepewność faktyczna |
| `ζ` | 0.06 | 1/kw | przyrost dryfu na jednostkę relatywizacji |
| `c_cal` | 0.05 | 1/kw | siła kalibracji przez obserwowalność |
| `Gmax` | 100 | AU | pojemność rezerwuaru autorytetu |
| `gRegen` | 3.0 | AU/kw | regeneracja przy `L=1` |
| `gSpend` | 12 | AU/kw | wydatek przy pełnym trybie autorytetu (`M=1`) |
| `θ_conf` | 0.55 | — | próg pewności dowodowej wyzwalający `majesty_switch` |
| `λ_q` | 0.15 | 1/kw | tempo relaksacji jakości (stała czasowa 6.7 kw) |
| `q_max` | 0.95 | — | sufit jakości |
| `a_v`, `a_th`, `a_m` | 0.60, 0.50, 0.45 | — | wagi w suficie jakości |
| `ν` | 0.40 | — | udział błędów zauważonych wewnętrznie |
| `s_up`, `s_dn` | 0.06, 0.02 | 1/kw | narastanie / spadek zależności od „świętego" |

---

## `RES-C-01` — `force_gas`: zdolność rozstrzygnięcia autorytetem

| pole | wartość |
|------|---------|
| **jednostka** | **AU** (*authority unit*) — jedno rozstrzygnięcie sprawy o pełnym deficycie dowodowym, oparte wyłącznie na pozycji orzekającego |
| **pojemność** | `Gmax = 100 AU` |
| **regeneracja** | `gRegen · L = 3.0 · L` AU/kw ⟹ **maks. 3.0 AU/kw, w praktyce 1.76 AU/kw** |
| **wydatek** | `gSpend · M = 12 · M` AU/kw |
| **płatnik** | **strona, która przegrywa na deficycie dowodowym**; ekonomicznie: przyszła legitymacja, bo regeneracja jest proporcjonalna do `L` |
| **miarkowanie** | `M = min(demand, G/gSpend)` — twarde nasycenie, brak kolejkowania |

### Krzywa wyczerpania

Popyt `demand = clamp01((θ_conf − conf)/θ_conf)`. Bilans w stanie ustalonym `A_praca`:

```
regeneracja = 3.0 · 0.588 = 1.76 AU/kw
wydatek     = 12  · 0.147 = 1.76 AU/kw
G*          = 1.76 AU  =  1.8% pojemności
```

**Zasób jest zużyty w 100% w warunkach nominalnych.** Współczynnik przełożenia `gSpend/gRegen = 4.0` oznacza, że jednostka autorytetu wydana kosztuje cztery razy więcej, niż wpływa w tym samym kwartale przy pełnej legitymacji. Rezerwuar 100 AU wystarcza na **8.3 kwartału** pełnego trybu autorytetu (`M = 1`) bez żadnej regeneracji. W biegu bazowym `G` spada poniżej 10% pojemności w **t = 31 kw**.

### Zachowanie przy wyczerpaniu

Nie ma awarii spektakularnej. Jest **cicha odmowa pokrycia**: `unresolved = demand − M`. Test szoku (+0.15 `V_fact` przez 4 kw):

| kwartał | popyt | pokrycie | niepokryte |
|---------|-------|----------|------------|
| +0 | 0.518 | 0.129 | **0.389 (75% popytu)** |
| +4 (koniec szoku) | 0.353 | 0.136 | 0.217 |
| +23 | 0.352 | 0.144 | 0.207 |

Trzy własności, które czynią ten zasób najniebezpieczniejszym w układzie:

1. **Nie jest mierzony.** Nie istnieje licznik `G`. Instytucje raportują wyroki, nie zużytą zdolność do ich wymuszenia.
2. **Jego licznik zastępczy (`M`) kłamie w reżimie nasycenia.** W `A_legit` `M = 0.094`, w `A_praca` `M = 0.147`. Niższa wartość oznacza gorszy stan.
3. **Nie ma error budgetu.** Zużycie 100% w nominale ⟹ każde odchylenie jest z definicji niepokryte. To nie jest ryzyko, to jest struktura.

**Miarkowanie postulowane (`SLI-C-04`):** raportować `spend/(gRegen·L)` z SLO ≤ 0.60 **oraz** `unresolved` osobno. Bez drugiego licznika pierwszy jest niekompletny.

---

## `RES-C-02` — reputacja aktora

| pole | wartość |
|------|---------|
| **jednostka** | **RU** (*reputation unit*) — jednostka użyteczności aktora orzekającego |
| **skończoność** | tak, ale **nietransferowalna i nieodnawialna w horyzoncie kadencji** |
| **płatnik** | sam aktor |
| **horyzont** | 16–24 kw (4–6 lat) `[EST]` — kadencja / czas do awansu |

Struktura wypłat (rdzeń mechanizmu `LOOP-C-01`):

```
U(ujawnij)  = −c_d              = −1.0 RU        (pewne)
U(zamaskuj) = −c_m · φ · O      = −8·0.5·O RU    (oczekiwane)
```

Maskowanie jest strategią dominującą ⟺ `O < O* = c_d/(c_m·φ) = 0.25`.

| reżim | `O*` | `U(zamaskuj)` | przewaga maskowania |
|-------|------|---------------|---------------------|
| `A_praca` | 0.600 | −2.40 RU | **−1.40 RU** (ujawnienie dominuje) |
| `A_legit` | 0.000 | **0.00 RU** | **+1.00 RU/sprawę** (maskowanie **ściśle** dominuje) |

Strata zbiorowa w `A_legit` względem osiągalnego `A_praca` z czujnikiem `oob`: **0.613 jednostki jakości**. Każdy aktor gra najlepszą odpowiedź; wszyscy tracą. To jest dylemat społeczny w czystej postaci, nie zjawisko moralne.

**Asymetria, która czyni to nieuleczalnym przez zaostrzanie:** `c_m` wchodzi do wypłaty **pomnożone przez `φ·O`**. `c_d` wchodzi bez mnożnika. Przy `O → 0` iloczyn dąży do zera niezależnie od `c_m`. Potwierdzenie numeryczne (histereza, `20-DYNAMICS.md §4`): podniesienie `c_m` z 5.5 do 30 RU nie przywraca reżimu R1.

---

## `RES-C-03` — obserwowalność strukturalna

| pole | wartość |
|------|---------|
| **jednostka** | `O ∈ [0,1]` — znormalizowany udział zmiennych stanu pokrytych działającym czujnikiem |
| **podaż** | ograniczona przez `O_target = 0.60`; przyrost `η·(O_target − O)` |
| **ubytek** | `ρ·O·E` — **proporcjonalny do iloczynu obserwowalności i ukrytego zapasu** |
| **płatnik instalacji** | podmiot, który jest mierzony — stąd `RES-C-03` jest zasobem o **ujemnej prywatnej stopie zwrotu** w krótkim horyzoncie |
| **miarkowanie** | `SLI-C-03` (luka kalibracyjna), `SLI-C-05` (margines opóźnienia) |

### Dlaczego instalacja czujnika jest prywatnie nieopłacalna

Symulacja: dwa identyczne przebiegi, w jednym w `t = 6` włączony czujnik `oob = 0.02`. Mierzona różnica legitymacji podmiotu, który go zainstalował:

| horyzont | zdyskontowana suma `ΔL` (dyskonto 0.97/kw) | wniosek |
|----------|--------------------------------------------|---------|
| 8 kw (2 lata) | **−0.004** | nieopłacalna |
| 16 kw (4 lata) | +0.014 | próg |
| 24 kw (6 lat) | +0.582 | opłacalna |
| 40 kw (10 lat) | +1.833 | wyraźnie opłacalna |
| 80 kw (20 lat) | +3.581 | — |

**Break-even skumulowanej legitymacji: 16 kwartałów = 4.0 roku** (dla `E₀ ∈ [0.05, 0.30]`: 18–19 kw). Dołek legitymacji przypada na `t = +11 kw`.

Kadencja typowego decydenta: **16–24 kw** `[EST]`. Break-even leży **na dolnej krawędzi kadencji albo poza nią**. Aktor o horyzoncie 8–16 kwartałów ma ujemną oczekiwaną wypłatę z instalacji czujnika, przy dodatniej wypłacie systemowej (`Δq = +0.20` na horyzoncie 80 kw).

To jest klasyczna niedopodaż dobra publicznego w ramach principal-agent: **korzyść jest rozproszona i odroczona poza horyzont decydenta, koszt jest skoncentrowany i natychmiastowy.** Nie potrzeba zakładać złej woli — wystarczy dyskontowanie i skończona kadencja. To jest treść „sprzężenia między pomiarem a przeżywalnością mierzącego": pomiar nie jest odrzucany dlatego, że jest niewygodny, tylko dlatego, że jego NPV dla instalującego jest ujemna na jego horyzoncie.

**Konsekwencja projektowa:** budżet czujnika musi mieć **innego właściciela i inny cykl życia** niż mierzony podmiot (`LEV-C-01`, `NN-C-02`).

---

## `RES-C-04` — error budget (zapas błędu zamaskowanego)

| pole | wartość |
|------|---------|
| **jednostka** | **caseload-kwartał** = jedno kwartalne obciążenie sądu wadliwych, niewyjawionych rozstrzygnięć |
| **anchor bezwzględny** | `1 caseload-kw = 1·10⁵ spraw` `[ASSUMPTION]` |
| **dopływ** | `ν·(1−q)·m(O)`; maks. `0.4·0.2·1.0 = 0.080` caseload/kw = **8 000 spraw/kw** |
| **odpływ** | `γ₀·O·E(t−τ_a)`; **zero przy `O = 0`** |
| **płatnik** | strony spraw, których błąd nie został ujawniony; odroczony na `τ_a` lub w nieskończoność |

### Budżet i próg

| wielkość | wartość | w sprawach `[EST]` |
|----------|---------|--------------------|
| `E*` w `A_praca` | ≈ 0.000 | ≈ 0 |
| **`E_crit` (separatrysa)** | **0.6975** | **69 750** |
| `E*` w `A_legit` | 47.7 – 63.4 | 4.77 – 6.34 mln |

`E*` w złym atraktorze to **11.9 – 15.8 rocznych obciążeń sądu**. To zapas, którego nie da się zdrenować w horyzoncie pokolenia nawet po przywróceniu `O = 0.6`: przy `γ_eff = 0.18/kw` opróżnienie z 54 do 0.7 zajmuje `ln(54/0.7)/0.18 ≈ 24 kw` — i to jest optymistyczne, bo pomija fakt, że `S7` (egzekucja) już nastąpiła i część błędów jest fizycznie nieodwracalna.

### Czas do przekroczenia progu

```
E_crit / dopływ_max = 0.6975 / 0.080 = 8.7 kwartału = 2.2 roku
```

**Dwa lata pełnego maskowania wystarczą, żeby układ przeszedł przez separatrysę.** Nie ma tu długiej erozji — jest krótkie okno.

### Postulowany SLO

`E ≤ 0.35 caseload-kw` (50% marginesu do separatrysy), mierzone przez `SLI-C-01` i `SLI-C-03`. Wyczerpanie budżetu ⟹ zamrożenie zmian obniżających `O` (odpowiednik freeze przy wyczerpanym error budgecie w SRE).

---

## `RES-C-05` — uwaga orzecznicza

| pole | wartość |
|------|---------|
| **jednostka** | **case-hour** — godzina uwagi orzekającej na sprawę |
| **podaż** | ~350 case-hours/kw na orzekającego `[EST]` (35 h/tydz. × 10 tyg. efektywnych) |
| **popyt** | rośnie z `V` (wariancja) i z `1/O` (brak dowodu trzeba nadrobić rozumowaniem) |
| **płatnik** | strony, przez czas trwania postępowania |
| **miarkowanie** | prekluzja i terminy `S3` = **hard deadline**, nie backpressure |

Kluczowa własność projektowa: **`S3` realizuje deadline, a nie backpressure.** Różnica przenosi zachowanie:

- **Backpressure**: gdy podsystem nie nadąża, sygnalizuje wstecz i **zmniejsza dopływ**. Zasób jest chroniony, opóźnienie rośnie kontrolowanie.
- **Hard deadline (prekluzja)**: gdy podsystem nie nadąża, dopływ **jest nieograniczony**, a niedobór jest pokrywany z innego zasobu — tutaj z `RES-C-01` (`force_gas`). Opóźnienie jest stałe, **degraduje się jakość**.

To jest dokładnie mechanizm, przez który brak `RES-C-05` konwertuje się na wydatek `RES-C-01`, a stąd — przez `V_p` i `ξ_m` — na `RES-C-04`. Trzy zasoby, jeden kanał przelewu, żaden licznik.

---

## `RES-C-06` — pojemność „świętego"

| pole | wartość |
|------|---------|
| **jednostka** | udział obciążenia `S ∈ [0,1]` przenoszony przez komponenty bez redundancji |
| **podaż** | zależna od egzogenicznej dostępności osób o kompetencji > 3σ; **niekontrolowalna** |
| **hazard odejścia** | `0.025/kw` `[ASSUMPTION]`, kadencja ~10 lat |
| **płatnik** | wszyscy, jednorazowo, w momencie wypadnięcia |
| **miarkowanie** | `SLI-C-06`: udział spraw krytycznych na top-1 komponent, SLO ≤ 0.15 |

Punkty stałe: `S* = 0.549` (`A_praca`), `S* = 0.716` (`A_legit`). Oba **wielokrotnie powyżej** SLO 0.15.

Profil awarii (symulacja z hazardem, seed ustalony):

| miara | wartość |
|-------|---------|
| największy jednokrokowy spadek `q` | **0.291** (0.669 → 0.378) = **−43.5%** |
| udział `S` przed awarią | 0.546 |
| powrót do poziomu sprzed awarii | **brak w 40 kw** |

To jest **ukryta zależność runtime**: kodeks nie deklaruje jej nigdzie, a system bez niej nie przechodzi. Ponieważ `Ṡ ∝ (V + (1−O))/2`, zależność **rośnie dokładnie wtedy, gdy pogarsza się obserwowalność** — czyli w tym samym reżimie, w którym awaria jest najbardziej prawdopodobna i najmniej wykrywalna. Wszystkie tryby awarii korelują się w jednym punkcie.

Test wykrywający (chaos engineering): planowe, ogłoszone z wyprzedzeniem wyłączenie komponentu na jeden kwartał i pomiar `Δq`, `ΔV`, `Δ(czas rozpoznania)`. Jeśli `S ≤ 0.15`, wpływ mieści się w szumie. Jeśli nie — zależność została udokumentowana **przed** tym, jak wystąpi mimowolnie.

---

## `RES-C-07` — dług proceduralny

| pole | wartość |
|------|---------|
| **jednostka** | case-hour korekty odroczonej |
| **oprocentowanie** | koszt naprawy błędu z etapu `S_k` naprawianego na etapie `S_j > S_k` rośnie z `(j − k)` |
| **płatnik** | instancja odwoławcza i strony, `τ_a = 8 kw` później |
| **miarkowanie** | brak — to jest problem |

Mnożnik kosztu naprawy `[EST]`, kalibrowany rzędem wielkości analogicznie do kosztu naprawy defektu w cyklu wytwarzania oprogramowania:

| błąd powstał | naprawiony na | mnożnik kosztu |
|--------------|---------------|----------------|
| `S1` (kwalifikacja) | `S1` | ×1 |
| `S1` | `S2` | ×3 |
| `S1` | `S4` | ×10 |
| `S1` | `S6` (odwołanie) | ×30 |
| `S1` | `S7` (po egzekucji) | **×100 lub nieodwracalny** |

Analogia jest ważna, bo przenosi **zachowanie**, nie nastrój: ta sama struktura (błąd specyfikacji naprawiany w produkcji), ta sama przyczyna (późniejsze etapy budują stan na założeniu poprawności wcześniejszych), ten sam wniosek (przesuwanie wykrycia w lewo jest tańsze niż zwiększanie mocy naprawczej w prawo). Uzasadnia to `LEV-C-04` (skrócenie `τ_a`) i priorytet `SLI-C-02` (pomiar `V_p` **na etapie `S2`**, nie po wyroku).

**Odsetki od tego długu to wariancja `V_p`**, która wchodzi bezpośrednio do sufitu jakości przez `a_v = 0.60`. W `A_praca` `V_p = 0.288` odejmuje `0.60 · 0.288 = 0.173` od `q_max = 0.95` — czyli **18% możliwej jakości jest spłacane odsetkami od długu proceduralnego** w reżimie, który uznajemy za zdrowy.

---

## `RES-C-08` — kredyt wsteczny (budżet relatywizacji)

| pole | wartość |
|------|---------|
| **jednostka** | `Θ ∈ [0,1]` — przesunięcie zera skali oceny |
| **podaż** | pozornie nieograniczona (`S8` można wykonać dowolną liczbę razy) |
| **rzeczywiste ograniczenie** | **nasycenie przy `Θ = 1`** — po nim operacja przestaje działać |
| **płatnik** | przyszłe sprawy, które będą oceniane wobec przesuniętego wzorca |
| **miarkowanie** | `c_cal·O·Θ` — **tylko obserwowalność spłaca ten kredyt** |

To jest jedyny zasób w układzie, którego **zużycie nie boli w momencie zużycia**. Zapisanie do `Θ` przez `S8` (zmiana linii orzeczniczej wstecz) natychmiast zmniejsza rozbieżność między `q` a `L` — czyli natychmiast poprawia sytuację orzekającego. Koszt jest ponoszony przez utratę zdolności do stwierdzenia, czy jakość spadła.

Warunek wypłacalności: `c_cal·O > ζ·E·(1−O)`. Dla `O = 0.6`: **`E < 1.25` caseload-kw**. Powyżej tego zapasu kredyt jest zaciągany szybciej niż spłacany i `Θ` narasta do nasycenia.

| `E` | `O` | przyrost `Θ` | spłata | `Θ*` |
|-----|-----|--------------|--------|------|
| 0.1 | 0.60 | 0.0024/kw | 0.0300/kw | 0.080 |
| 0.5 | 0.40 | 0.0180/kw | 0.0200/kw | 0.900 |
| 2.0 | 0.20 | 0.0600/kw | 0.0100/kw | **1.000** |
| 50 | 0.00 | 0.0600/kw | **0.0000/kw** | 1.000 |

Przy `O = 0` człon spłaty znika i równanie staje się `Θ̇ = 0.06/kw` — **integrator bez sprzężenia zwrotnego**. To jest strukturalnie ta sama patologia co integrator windup w regulatorze PID: człon całkujący nabija się, bo aktuator jest nasycony i uchyb nie maleje. Tutaj „aktuatorem" jest zdolność do faktycznej poprawy jakości, a „całką" jest narastająca reinterpretacja przeszłości. Standardowe zabezpieczenie w sterowaniu to **anti-windup: zatrzymanie całkowania, gdy aktuator jest nasycony**. Odpowiednikiem w tym modelu jest zakaz operacji `S8` przy `O` poniżej progu kalibracji (`NN-C-04`).

---

## Podsumowanie: co jest naprawdę skończone

| zasób | zużycie w nominale | licznik istnieje? | zachowanie przy wyczerpaniu |
|-------|--------------------|-------------------|------------------------------|
| `RES-C-01` force_gas | **100%** | nie (proxy `M` kłamie) | cicha odmowa pokrycia, 75% popytu |
| `RES-C-02` reputacja | — | częściowo | zmiana strategii na maskowanie |
| `RES-C-03` obserwowalność | 60% celu | tak, ale mierzy siebie | utrata rangi macierzy `C` |
| `RES-C-04` error budget | ~0% w `A_praca` | **nie** | przekroczenie separatrysy w 8.7 kw |
| `RES-C-05` uwaga | ~100% | tak (zaległości) | przelew na `RES-C-01` |
| `RES-C-06` „święty" | **366% SLO** | nie | spadek `q` o 43.5% w jednym kroku |
| `RES-C-07` dług proceduralny | 18% jakości na odsetki | nie | mnożnik ×100 na `S7` |
| `RES-C-08` kredyt wsteczny | zależne od `E` | nie | nasycenie `Θ = 1`, koniec działania |

**Sześć z ośmiu zasobów nie ma licznika.** Dla systemu sterowania to nie jest brak przejrzystości — to jest brak wektora pomiaru, czyli dokładnie warunek, z którego wynika `NN-C-01`. Nie da się regulować zmiennej, dla której nie istnieje wiersz macierzy `C`, i żaden przyrost mocy obliczeniowej regulatora tego nie zastąpi.

---

*Agent C · tor I · Justice-as-Code v1.0*
