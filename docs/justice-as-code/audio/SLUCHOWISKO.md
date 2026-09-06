# SŁUCHOWISKO — *Justice-as-Code*

Sześć aktów. Szacowany czas całości: **56–62 minuty**.

---

## Streszczenie

Trzej agenci dostają to samo zadanie i zakaz rozmawiania ze sobą: opisać system sprawiedliwości i kodeks prawny jak code base — z warunkami poprawności, trybami awarii, złożonością i budżetem. Każdy patrzy przez inną soczewkę. Pierwszy widzi maszynę stanów bez replikacji, w której wymuszone zakończenie sprawy jest opłacane zasobem autorytetu podstawianego zamiast dowodu. Drugi widzi język o celowo niepełnej specyfikacji, z uprzywilejowanym rzutowaniem bez adresata winy, w którym każde twierdzenie o poprawności całości jest puste, bo specyfikacją jest to, co powie sąd. Trzeci widzi układ regulacji domknięty wokół legitymacji zamiast wokół jakości orzekania, bistabilny, z drugim stanem równowagi osiągalnym bez niczyjej złej woli. Potem spotykają się w fazie scalania, prowadzonej według reguł spisanych zanim powstał którykolwiek model — a jedna z tych reguł zabrania scalającemu rozstrzygać spór autorytetem, bo przecięcie sporu autorytetem byłoby odtworzeniem badanej patologii wewnątrz narzędzia do jej badania. Scalanie nie obala żadnego z dwudziestu sześciu warunków nienegocjowalnych. Obala natomiast cztery przewidywania agentów o tym, czego zażądają pozostali — i wykazuje, że czternaście z dwudziestu dwóch przyznanych ustępstw było zapłatą za wymaganie, którego nikt nie postawił.

---

## Obsada

| Głos | Charakter | Barwa i sposób mówienia |
|---|---|---|
| **NARRATOR** | Prowadzi, nie ocenia. Nie jest po niczyjej stronie, w tym nie po stronie słuchacza. | Niski, chłodny, wolne tempo, bez ozdobników. Nigdy nie podnosi głosu. Pauzy zamiast interpunkcji emocjonalnej. |
| **AGENT A** | Inżynier od systemów rozproszonych. Liczy. Nie ufa zdaniom, których nie da się sfalsyfikować. Najbardziej niecierpliwy z trójki. | Suchy, szybki, zdania krótkie i rąbane. Twarde spółgłoski. Liczby wypowiada wyraźniej niż resztę zdania. Kiedy się złości, przyspiesza, nie głośnieje. |
| **AGENT B** | Formalista. Precyzyjny do granicy nieuprzejmości. Poprawia cudze zdania, także wtedy, gdy nikt o to nie prosi. | Wyższy, równy, metronomiczny. Pauza tuż przed słowem kluczowym. Bez ironii — B naprawdę uważa, że rozróżnienia mają znaczenie. |
| **AGENT C** | Teoria sterowania i projektowanie mechanizmów. Myśli pętlami i opóźnieniami. Przynosi najgorsze wnioski i mówi je najspokojniej. | Ciepły, wolny, bardzo równy. Nigdy nie dramatyzuje liczby. Największe rzeczy mówi tym samym tonem, co najmniejsze — i to jest efekt. |
| **ORKIESTRATOR** | Scala. Związany zakazem rozstrzygania autorytetem. To jest jego rola i jego dramat. | Uważny, lekko przyciszony, często się poprawia w pół zdania. Mówi „nie mam prawa" bez skargi. |
| **GŁOS SYSTEMU** | Przerywnik. Nie postać — powierzchnia. Czyta to, co system emituje na zewnątrz. | Płaski, beznamiętny, bez akcentu zdaniowego. Jak komunikat, nie jak człowiek. Zawsze ta sama głośność, także gdy treść jest absurdalna. |

**Nagranie wielogłosowe:** GŁOS SYSTEMU nagrać osobno i wstawić bez pogłosu — ma brzmieć jak wklejka z innego nośnika. Trzej agenci nigdy nie mówią jednocześnie; jeśli tekst pozwala, między ich kwestiami zostawiać pół sekundy więcej niż zwykle, bo oni się nie słuchają nawzajem w fazie pierwszej i słuchać zaczynają dopiero w akcie IV.

---

## Czas

| Akt | Tytuł | Szacowany czas |
|---|---|---|
| I | Referat | ~9 min |
| II | Zdanie wakacyjne | ~10 min |
| III | Trzynasty kwartał | ~10 min |
| IV | Cztery przewidywania | ~9 min |
| V | Za co zapłacili | ~10 min |
| VI | Wektor | ~10 min |
| | **Razem** | **~58 min** |

---
---

## AKT I — REFERAT

> **Pytanie aktu:** Co się dzieje z systemem, w którym jest dokładnie jeden węzeł trzymający stan, a wszyscy pozostali tylko o tym stanie opowiadają?

[Cisza. Potem odległy szum: kartkowanie, kroki na kamiennym korytarzu. Ścisza się pod NARRATOREM i już nie wraca.]

**NARRATOR:** Trzem agentom dano to samo zadanie i zakaz rozmawiania ze sobą. Zadanie brzmiało: opisz system sprawiedliwości i kodeks prawny tak, jakby to był code base. Nie jak metaforę — jak system, który ma warunki poprawności, tryby awarii, złożoność i skończony budżet. Zakaz rozmawiania obowiązywał do końca pierwszej fazy. Nie wolno było czytać cudzych plików. Nie wolno było cytować. Nie wolno było ustępować z góry.

[pauza]

**NARRATOR:** Reguły ich późniejszego spotkania spisano wcześniej. Zanim powstał którykolwiek z modeli. Celowo — bo kryterium scalania ustalone po zobaczeniu wyników jest już wynikiem negocjacji, a nie jej ramą.

Pierwszy z nich patrzy na sąd tak, jak się patrzy na system rozproszony.

**AGENT A:** Zacznę od tego, czego nie zrobię. Nie zamodeluję sądu jako systemu odpornego na awarie bizantyjskie. To jest naturalna pokusa: masz kilka instancji, one się nawzajem kontrolują, poprawność bierze się z tego, że każde dwa kwora — czyli każde dwa zbiory węzłów zdolnych podjąć decyzję — przecinają się w co najmniej jednym węźle poprawnym. Piękny mechanizm. I nie stosuje się tutaj.

**AGENT A:** Bo warunkiem koniecznym jest to, żeby repliki miały ten sam stan do porównania. Tutaj tego nie ma. Sąd trzyma stan. Strony trzymają twierdzenia o stanie. To nie jest to samo i różnica jest ta sama, co między bazą danych a opowieścią o bazie danych.

**AGENT A:** Właściwe odwzorowanie brzmi: replicated state machine — maszyna stanów, która miała być zwielokrotniona — bez replikacji. Liczba replik: jeden. Skoro jeden, to maksymalna liczba tolerowanych awarii wynosi zero. System nie toleruje żadnej awarii tego jednego węzła. Cała jego odporność stoi na niezadeklarowanym założeniu, że ten węzeł jest bezawaryjny.

**AGENT B:** [z offu, jeszcze nie w scenie] To jest interfejs bez implementacji.

**AGENT A:** [nie słyszy go] Ktoś powie: przecież są instancje wyższe, to są repliki. Nie są, z dwóch niezależnych powodów. Po pierwsze, apelacja nie ma dostępu do wejścia — pracuje na logu zamrożonym przez prekluzję, nie na świecie. To jest replay, odtworzenie z zapisu, a nie ponowne wykonanie. Po drugie: to nie jest niezależna implementacja. Ta sama pula szkolenia, awansu, reputacji, ta sama wykładnia. W inżynierii niezawodności odróżnia się redundancję od N-version programming — od pisania tego samego programu przez niezależne zespoły. Uruchomienie stu kopii tego samego binarnego pliku chroni przed awarią sprzętu. Nie chroni przed błędem w kodzie. Sąd nad sądem to ta sama implementacja na innym hoście.

[krótka pauza]

**AGENT A:** Teraz rzecz, dla której to piszę. System ma zakaz odmowy. Nie wolno mu powiedzieć „nie wiem". Musi zakończyć. A jednocześnie na faktach rozstrzygających zbieżność jest formalnie niemożliwa — nie trudna, niemożliwa. Weź fakt istotny dla wyniku, który zna wyłącznie jedna strona, i który tej stronie szkodzi. Koszt nieujawnienia to prawdopodobieństwo wykrycia razy sankcja. Prawdopodobieństwo wykrycia dąży do zera, bo tylko ona wie, że ten fakt istnieje. Zatajenie jest strategią dominującą. Ten fakt nigdy nie trafi do przecięcia kworów. Przecięcie jest puste dokładnie tam, gdzie jest potrzebne.

**AGENT A:** Więc mamy system, który musi skończyć, i który nie ma z czego wyprowadzić końca. Coś tę lukę domyka. Nazywam to `force_gas` — po angielsku, bo to jest kalka z licznika gazu w maszynie wykonującej kontrakty. Jedna jednostka `force_gas` to jedno rozstrzygnięcie kwestii spornej, dla której w aktach nie ma dowodu rozstrzygającego, przyjęte w sposób niesprawdzalny z zewnątrz.

**AGENT A:** Definicja jest operacyjna, nie ocenna. Nie mówi, że rozstrzygnięcie jest błędne. Mówi, że nie da się sprawdzić, czy jest poprawne — bo nie ma wejścia, z którego by wynikało. To jest cała treść tego pojęcia i to odróżnia je od „złego wyroku".

**NARRATOR:** A potem A robi rzecz, która w tym projekcie okaże się najbardziej zaraźliwa: przestaje mówić i zaczyna liczyć.

**AGENT A:** Referat osiemset spraw rocznie. Efektywny czas na orzekanie: około tysiąca sześciuset godzin w roku. Dzielimy. Dwie godziny na sprawę. Dwie godziny obejmują wszystko: akta, rozprawę, naradę, uzasadnienie.

**AGENT A:** Teraz druga strona. Czytanie ze zrozumieniem, dwieście słów na minutę, dwieście pięćdziesiąt słów na stronę. Akta na dwieście stron — cztery godziny i dwanaście minut samego czytania. Akta na tysiąc stron — dwadzieścia godzin i pięćdziesiąt minut. Samego czytania. Bez rozprawy, bez narady, bez pisania.

[pauza]

**AGENT A:** Powyżej mniej więcej stu pięćdziesięciu stron budżet jest mniejszy niż złożoność wejścia już przy samym czytaniu, przy zerowym czasie na resztę.

**AGENT A:** I teraz twierdzenie. Jeżeli budżet jest mniejszy od złożoności wejścia, to liczba kwestii domykanych bez pełnego przetworzenia dowodu jest deterministycznie dodatnia. Deterministycznie. Niezależnie od kompetencji i niezależnie od dobrej woli. Weź referat osiemset spraw, akta sześćset stron, dwadzieścia kwestii spornych. Budżet: dwie godziny. Potrzeba: dwadzieścia. Luka: osiemnaście godzin. Przy pół godziny na rzetelne rozstrzygnięcie jednej kwestii ta luka zjada dwadzieścia kwestii. Czyli wszystkie.

**AGENT A:** To się nazywa nasycenie. Nie część kwestii, nie większość — każda kwestia sporna jest albo usunięta prekluzją, albo domknięta autorytetem. W tym reżimie tryb dowodowy nie występuje w ogóle.

**AGENT A:** I zwróćcie uwagę na pierwszy wiersz mojej tabeli, bo on jest ważniejszy niż ostatni. Referat trzysta spraw, akta sześćdziesiąt stron, sześć kwestii. Budżet pięć godzin i osiemnaście minut, potrzeba dwie godziny. Luka zerowa. Wydatek autorytetu: zero. Ten model nie twierdzi, że system nie działa. Twierdzi, że działa poniżej pewnego progu i przechodzi w inny tryb powyżej — **nie zgłaszając przejścia**.

[cięcie — cisza pół sekundy]

**GŁOS SYSTEMU:** Sąd dał wiarę zeznaniom świadka. Sąd nie dał wiary wyjaśnieniom pozwanego. Okoliczność uznano za dostatecznie wyjaśnioną. Wniosek dowodowy oddalono.

[cisza]

**AGENT A:** Cztery zdania. Każde z nich jest ważnym renderem obu trybów. Tego samego kształtu wyjścia, kiedy była podstawa, i kiedy jej nie było.

**NARRATOR:** A twierdzi dalej, że brak licznika nie jest zaniedbaniem. W jego modelu istnieje sygnatura funkcji obciążającej licznik gazu, i ona nie ma konstruktora błędu. Nie ma stanu „out of gas", nie ma zatrzymania. Wydatek zawsze udaje się lokalnie: sąd zawsze może wydać wyrok. Saldo schodzi poniżej zera bez sygnału.

**AGENT A:** A kiedy się wyczerpie — nie ma zatrzymania. Jest fork. Rozszczepienie łańcucha. Część węzłów przestaje akceptować finalizację i buduje alternatywny łańcuch rozstrzygania: arbitraż, samopomoc, ucieczka do innej jurysdykcji, egzekucja poza prawem. Oba łańcuchy są ważne według własnych reguł, bo nie ma wspólnej miary, która by wskazała cięższy. To jest trwały rozjazd, nie chwilowa reorganizacja.

**AGENT A:** I jedno zdanie, żebyśmy się dobrze zrozumieli, bo będzie wracać. Ja **nie żądam zbieżności tam, gdzie jest niemożliwa**. Żądam oznaczenia. Chcę, żeby wyrok niósł ze sobą informację, czego w stanie zabrakło: co wypadło przez prekluzję, które fakty rozstrzygające miały jednego posiadacza, czy doręczenie było fikcją, i jaka była skalibrowana pewność. Wszystkie te rzeczy są znane w chwili wydania wyroku. Po prostu nie są zapisywane.

**AGENT A:** Osiem z dziesięciu moich trybów awarii jest niewykrywalnych. I wszystkie osiem jest naprawialnych metadanymi. Problemem nie jest brak informacji w systemie. Problemem jest brak jej emisji na zewnątrz.

[pauza]

**AGENT A:** A brak emisji jest równowagą. Nie zaniedbaniem. Do tego wrócę.

---
---

## AKT II — ZDANIE WAKACYJNE

> **Pytanie aktu:** Czy da się powiedzieć, że wyrok był błędny, jeżeli poprawność jest zdefiniowana jako to, co powie sąd?

**NARRATOR:** Drugi agent nie wie, co napisał pierwszy. Nie może wiedzieć — tor suwerenny tego zabrania. Patrzy na to samo przez soczewkę języków programowania i weryfikacji formalnej. I zaczyna od słowa, które będzie powtarzał do końca.

**AGENT B:** Wakacyjne. Po angielsku *vacuous*. Zdanie jest wakacyjne, kiedy jest prawdziwe wyłącznie dlatego, że mówi o zbiorze pustym. „Każdy jednorożec w tym pokoju jest zielony" — prawda, bez treści. Zero bitów informacji. Będę tego słowa używał w sensie ścisłym i będę je stosował do twierdzeń, które ludzie wypowiadają z powagą.

**AGENT B:** Modeluję kodeks jako język programowania. Konkretnie: język gradually typed — częściowo otypowany. To znaczy taki, w którym obszary sprawdzane statycznie mieszają się z obszarami sprawdzanymi dopiero w trakcie działania. „Czternaście dni od doręczenia" jest sprawdzalne statycznie. „Rozsądny termin" — nie jest.

**AGENT B:** I teraz rzecz, na której stoi cała reszta. Biorę trójpodział z normy języka C i przenoszę go, bo przenosi tryb awarii, a nie nastrój. Klauzula może być *defined* — istnieje procedura, która każdemu ewaluatorowi da tę samą wartość. Może być *implementation defined* — wartość zależy od implementacji, ale implementacja musi ją udokumentować i trzymać stabilnie. Albo może być *undefined* — i to jest ważne słowo.

**AGENT B:** *Undefined behavior* to nie jest „nieostrość". „Nieostry" sugeruje rozmycie wokół rdzenia: jest jakiś środek i jest jakaś odległość od środka. Dla klauzuli *undefined* nie istnieje żadne ograniczenie zapisane w systemie. Nie ma rdzenia. Nie ma metryki odległości od rdzenia. „Rozsądny termin", „dobre obyczaje", „ważne powody", „rażące naruszenie" — to są dziury otypowane wyłącznie przez typ wyniku. O „rozsądnym" wiemy tylko tyle, że to liczba dodatnia.

**AGENT B:** Twierdzenie pierwsze. Jedna osiągalna pozycja *undefined* wystarczy, żeby każdy wynik w obrazie funkcji był dopuszczalny. Jedna. Dowód jest tani: skoro pozycji *undefined* nic w kodeksie nie wiąże, to zbiór jej możliwych uzupełnień jest pełnym produktem bez ograniczeń. Dla każdego wyniku, do którego prowadzi jakaś gałąź, wybieram uzupełnienie, które ustawia guard tak, by ścieżka prowadziła właśnie tam. Kryterium akceptacji brzmi „czy da się to uzasadnić", a nie „czy to jest jedyne". Zatem oba wyniki są dopuszczalne. Przy k niezależnych pozycjach binarnych — do dwóch do potęgi k.

**AGENT B:** Wniosek liczbowy: informacja wzajemna, jaką tekst kodeksu niesie o wyniku w tym obszarze, wynosi zero bitów. To nie jest narzekanie na nieprecyzyjność. To jest twierdzenie o przepustowości kanału. Kanał o pełnej ekspresywności ma zerową przepustowość jako predyktor.

[pauza]

**AGENT B:** I coś, czego bym się nie spodziewał, gdybym nie przeniósł analogii dokładnie. W języku C *undefined behavior* nie znaczy „dowolna wartość w tym punkcie". Znaczy „ten program nie ma semantyki" — a to licencjonuje kompilator do **usuwania ograniczeń położonych wcześniej**. Klasyka: kompilator usuwa sprawdzenie, czy wskaźnik nie jest pusty, bo sprawdzenie stoi *po* użyciu wskaźnika, a użycie „dowodzi", że nie był pusty.

**AGENT B:** Przeniesienie: przyjęcie na etapie wyroku, że klauzula generalna znaczy X, licencjonuje przekwalifikowanie ustaleń dowodowych sprzed pół roku. Skoro klauzula znaczy X, to dowód na Y nigdy nie był istotny. To nie jest niedeterminizm w przód. To jest wsteczne skasowanie ograniczenia. I to jest formalna treść tego, co protokół nazywa wsteczną relatywizacją.

**AGENT B:** Gdzie analogia się kończy, i mówię to, bo higiena tego wymaga: w C licencja na *undefined* jest udzielona przez spisaną normę i **wyliczona**. Aneks J punkt dwa wymienia pozycje. W kodeksie licencja wynika z braku zapisu, więc nie ma aneksu. Ja nie żądam usunięcia *undefined* — to jest nieusuwalne i pełni funkcję adaptacyjną. Żądam inwentarza. Norma C nie usunęła *undefined behavior*. Wyliczyła je. I to wystarczyło, żeby powstały narzędzia.

**NARRATOR:** Drugie twierdzenie B jest tym, od którego zaczął. I jest jedynym w całym projekcie, które słychać jak oskarżenie, choć nim nie jest.

**AGENT B:** Nie istnieje druga niezależna implementacja tej samej sprawy. Dwa sądy nigdy nie rozpoznają tego samego stanu faktycznego w tym samym kontekście, bo drugi zna pierwszy. Brak differential testingu — porównywania dwóch implementacji na tym samym wejściu. Nie istnieje conformance suite: nie ma zbioru par „stan faktyczny, oczekiwane orzeczenie", uznanego za wiążący test poprawności niezależnie od orzeczeń. A kryterium poprawności w obrocie brzmi: nieuchylone przez instancję wyższą. Dla instancji najwyższej to kryterium degeneruje do prawdy.

**AGENT B:** Zatem specyfikacja jest zdefiniowana jako wyjście oracle'a. A wtedy zdanie „system działa zgodnie ze specyfikacją" jest tautologią. Zero bitów. **Wakacyjne.**

**AGENT B:** I proszę zauważyć, jaka jest właściwa konsekwencja, bo naiwna jest za słaba. Naiwna brzmi: sąd myli się z jakąś częstością i przy k zależnych decyzjach błąd narasta. Właściwa jest ostrzejsza. Skoro specyfikacją jest oracle, to **błąd oracle'a definicyjnie nie jest błędem**. Ta częstość nie jest mierzalna wewnątrz systemu. Degradacja nie jest duża. Jest nieokreślona — bo nie ma miary.

[pauza]

**AGENT B:** Trzecie twierdzenie, i to jest to, które zmienia ocenę wszystkiego, co potem powiem.

**AGENT B:** Ustrój zakazuje *non liquet* — zakazuje odmowy rozstrzygnięcia. Formalnie: funkcja z przestrzeni spraw w przestrzeń orzeczeń musi być totalna, określona wszędzie. Kodeks daje funkcję częściową, określoną tylko na części spraw — bo są pytania, których z akt nie da się rozstrzygnąć nawet półrozstrzygalnie, i są kolizje norm bez reguły rozstrzygającej. Każde totalne rozszerzenie funkcji częściowej musi przypisać wartości poza jej dziedziną. Te wartości nie są uzasadnione kodeksem.

**AGENT B:** Zatem: totalność i poprawność są **łącznie niespełnialne** dla niezupełnego kodeksu. Nie ma trzeciej opcji. Jedną trzeba oddać.

**AGENT B:** I stąd wniosek, którego nie lubię, ale który wynika. Przełączenie w tryb autorytetu — to, co protokół nazywa `majesty_switch` — **nie jest patologią osobowościową ani nadużyciem**. Jest wymaganą przez ustrój funkcją totalizującą. Nazywam ją `unsafeCoerce` — nazwa z języków, w których jest operacja rzutowania omijająca system typów. Rzutowanie, które mówi kompilatorowi: zaufaj mi.

**AGENT B:** Predykat wyzwalania ma cztery koniunkty i ostatni jest sednem. Budżet weryfikacji wyczerpany. Brak dowodu w budżecie. Presja terminu. I: koszt reputacyjny przyznania się do braku rozstrzygnięcia jest wyższy niż koszt rozstrzygnięcia nieudowodnionego. Ustrój ustawił ten koszt na nieskończoność, więc ostatni koniunkt jest spełniony **zawsze**.

**AGENT A:** [wchodząc w to, ostro] To jest to samo, co u mnie. Ja to policzyłem od strony zasobu, ty od strony typu.

**AGENT B:** [nie reaguje — nie może; są w torach rozłącznych] Czwarte twierdzenie. I ono jest o tym, dlaczego pozycja orzekającego jest niepodważalna nie z powodu układu sił, tylko z konstrukcji.

**AGENT B:** W rachunku *blame* — rachunku winy — rzutowanie ma etykietę. Twierdzenie o *blame* brzmi: dobrze otypowany kod nie może być obwiniony; winę zawsze ponosi strona mniej precyzyjnie otypowana. To twierdzenie jest **jedynym powodem**, dla którego częściowe typowanie w ogóle nadaje się do użytku. Ono gwarantuje, że awaria ma adresata.

**AGENT B:** W kodeksie konstruktor majestatu nie ma pola etykiety. A funkcja obserwacji — to, co z drzewa wyprowadzenia trafia do pisemnego uzasadnienia — mapuje krok wyprowadzony i krok zmyślony na te same frazy. „W ocenie Sądu". „Sąd dał wiarę". „W okolicznościach sprawy".

**AGENT B:** Zatem twierdzenie o *blame* nie jest naruszone. Ono jest **niewypowiadalne**. Jego konkluzja kwantyfikuje po etykietach, a etykiety nie ma. Awaria nie ma adresata jako **typ**, a nie jako fakt socjologiczny.

**AGENT B:** I konstrukcja, która to domyka. Podważenie orzeczenia wymaga wskazania kroku bez uzasadnienia. Skoro funkcja obserwacji skleja krok uzasadniony z nieuzasadnionym, to zbiór podważalnych orzeczeń jest wobec tego kryterium pusty. Zostaje kryterium reputacyjne: nieuchylone. Nieobserwowalność nie jest ubocznym skutkiem. Jest warunkiem koniecznym trwałości całej konstrukcji — gdyby majestat był widoczny, każde jego użycie byłoby jawnym przyznaniem, że ustrój wymaga niepoprawności.

[cięcie]

**GŁOS SYSTEMU:** Sąd uznał, że termin nie był rozsądny, i na podstawie artykułu X zasądził żądaną kwotę.

**AGENT B:** To zdanie jest ważnym renderem dwóch różnych wyprowadzeń. Jednego, w którym była podstawa. I jednego, w którym była dziura. Nie da się ich rozróżnić po wyjściu, bo wyjście jest tą samą serią znaków. To nie jest trudność statystyczna. To jest brak lewego odwrotu odwzorowania.

**AGENT B:** Dwie liczby na koniec. Budżet weryfikacji per sprawa — mierzony w krokach wyprowadzenia, gdzie jeden krok to około trzydziestu sekund uwagi orzekającej — wynosi rzędu tysiąca dwustu kroków. Przestrzeń przeszukiwania: od tysiąca do stu tysięcy. Deficyt: od porównywalnego do osiemdziesięciu trzech razy. Zatem założenie bez dowodu jest w tym systemie **strukturalnie konieczne**, a kierunek przeszukiwania dostarcza adwersarz.

**AGENT B:** I druga. Sprawdzenie, czy dwie normy kolidują, to sprawdzenie, czy ich hipotezy są łącznie spełnialne przy sprzecznych skutkach. Pytanie „czy korpus jest bezkolizyjny" jest problemem coNP-trudnym i wymaga kwadratowej liczby wywołań solvera. Korpus rzędu dziesięciu tysięcy do stu tysięcy jednostek redakcyjnych daje od stu milionów do dziesięciu miliardów par. Przy milisekundzie na wywołanie — od roku do stu lat czasu procesora. I to jest optymistyczne, bo hipotezy prawne nie są w logice zdaniowej.

**AGENT B:** Faktyczny budżet wydany na to sprawdzenie wynosi zero. Nie dlatego, że ktoś nie chce. Dlatego, że hipotezy norm nie istnieją w formie maszynowej. System nie ma reprezentacji, w której kolizja jest wyrażalna. Ślepota jest tu **konstytutywna**, a nie techniczna: formalizacja korpusu ujawniłaby, ile jest w nim pozycji *undefined* — czyli podważyłaby przesłankę, że prawo jest poznawalne z tekstu.

---
---

## AKT III — TRZYNASTY KWARTAŁ

> **Pytanie aktu:** Dlaczego system, w którym nikt nie działa w złej wierze, może dojść do stanu, w którym prawie nikt nie mówi prawdy?

**NARRATOR:** Trzeci agent też nie czytał pozostałych. Patrzy przez soczewkę teorii sterowania: pętle, opóźnienia, wzmocnienia, punkty równowagi. I zaczyna od decyzji, która wygląda niewinnie, a przesądza wszystko.

**AGENT C:** Kodeks nie jest programem. Kodeks jest **kontrolerem**. A obiektem regulacji — po angielsku *plant* — są ludzie z własnymi funkcjami wypłaty. Poprawność kontrolera bez modelu obiektu jest niedefiniowalna. Ten sam przepis w dwóch reżimach parametrów obiektu produkuje dwa różne punkty równowagi. Z tego wynika reguła higieniczna: każde twierdzenie o kodeksie, które nie podaje parametrów obiektu, jest nieweryfikowalne.

**AGENT C:** Druga decyzja. Zmienna regulowana nie jest zmienną mierzoną. System deklaruje, że reguluje jakość orzekania. Fizycznie mierzy legitymację: zaskarżalność, uchylalność, sondaż, ciszę medialną. Te dwa sygnały rozjeżdżają się o wielkość, którą nazywam dryfem punktu odniesienia.

**AGENT C:** Pomiar wchodzi jako suma: to, co widać, równa się jakości plus dryfowi. I teraz test, który jest kilkoma linijkami rachunku. Bierzemy wektor stanu złożony z dwóch rzeczy — jakości i dryfu. Macierz obserwacji ma jeden wiersz: jedynka, jedynka. Macierz obserwowalności ma rząd jeden. Wymiar stanu: dwa.

[pauza]

**AGENT C:** Jeden jest mniejszy niż dwa. Jądro nieobserwowalne to kierunek „plus jeden, minus jeden". Słownie: zdanie „jakość spadła o epsilon" i zdanie „wzorzec podniósł się o epsilon" dają **identyczną historię pomiarów**. Dla każdego horyzontu czasowego i każdej realizacji szumu. Żaden estymator tego nie odzyska, bo nie ma czego odzyskiwać — informacji nie ma w danych.

**AGENT C:** To nie jest problem statystyczny. Dodanie drugiego wiersza — jedynka, zero, czyli pomiaru jakości niezależnego od wzorca — podnosi rząd do dwóch. Jeden wiersz macierzy. To jest cała różnica między układem obserwowalnym a nieobserwowalnym.

**AGENT C:** Trzecia decyzja, i najważniejsza. Nie modeluję upadku jako procesu monotonicznego. Modeluję bistabilność. Układ ma dwa punkty stałe, rozdzielone separatrysą — powierzchnią w przestrzeni stanu, po której obu stronach trajektorie idą w różne miejsca.

**AGENT C:** Pierwszy punkt stały nazywam atraktorem pracy. Jakość: sześćdziesiąt siedem setnych. Obserwowalność: sześć dziesiątych. Zapas ukrytego błędu: praktycznie zero. Dryf wzorca: zero. Stopa maskowania błędów przez aktorów: **zero**.

**AGENT C:** Drugi punkt stały nazywam atraktorem legitymacji. Jakość: dwadzieścia siedem setnych. Obserwowalność: **zero**. Dryf wzorca: jeden, czyli nasycony. Zapas ukrytego błędu: prawie pięćdziesiąt cztery jednostki. Stopa maskowania: dziewięćset dziewięćdziesiąt osiem tysięcznych.

**AGENT C:** I teraz zdanie, o które mi chodzi. **Nie ma tu żadnego złośliwego aktora.** Każdy aktor gra najlepszą odpowiedź na swoje wypłaty. Ujawnienie błędu jest opłacalne wtedy i tylko wtedy, gdy obserwowalność przekracza iloraz kosztu samoujawnienia przez iloczyn kary i wykrywalności. Kiedy obserwowalność spada, iloczyn kary i wykrywalności dąży do zera — niezależnie od wysokości kary. Więc maskowanie staje się najlepszą odpowiedzią. Dla wszystkich. Bez porozumienia i bez zamiaru.

**AGENT C:** Kto chce to naprawiać przez wymianę ludzi, naprawia zmienną, która **nie występuje w równaniach**.

**NARRATOR:** Separatrysę C policzył bisekcją: czterdzieści iteracji, zbieżność do jednej stutysięcznej.

**AGENT C:** Sześćset dziewięćdziesiąt siedem i pół tysięcznych jednostki zapasu błędu. Jednostka to caseload-kwartał, przy założeniu stu tysięcy spraw na kwartał. Czyli w liczbach bezwzględnych: około sześćdziesięciu dziewięciu tysięcy siedmiuset pięćdziesięciu stojących, zamaskowanych wadliwych rozstrzygnięć. Przy pełnym maskowaniu dopływ wynosi osiem tysięcy spraw na kwartał. Przekroczenie progu zajmuje osiem i siedem dziesiątych kwartału. Dwa lata i dwa miesiące.

[pauza — dłuższa niż zwykle]

**AGENT C:** A teraz chronologia. Uruchamiam trajektorię z warunkiem początkowym tuż nad separatrysą i patrzę kwartał po kwartale.

**AGENT C:** Kwartał szósty: obserwowalność spada poniżej trzech dziesiątych. Kwartał ósmy: jakość spada poniżej sześciu dziesiątych. Kwartał trzynasty: legitymacja osiąga **maksimum**. Siedemset dziewięćdziesiąt jeden tysięcznych — więcej niż wynosi w zdrowym punkcie równowagi, gdzie jest pięćset osiemdziesiąt osiem tysięcznych. Kwartał dziewiętnasty: legitymacja spada poniżej sześciu dziesiątych. Kwartał dwudziesty pierwszy: zapas ukrytego błędu przekracza jedność. Kwartał dwudziesty dziewiąty: obserwowalność poniżej pięciu setnych.

**AGENT C:** Pięć kwartałów po tym, jak jakość spadła poniżej progu, wskaźnik legitymacji osiąga swoje maksimum.

**AGENT B:** [cicho, z boku] To jest miara, która mówi prawdę o sobie i nieprawdę o świecie.

**AGENT C:** Opóźnienie sygnalizacyjne wynosi jedenaście kwartałów między spadkiem jakości a spadkiem legitymacji. Trzynaście kwartałów między utratą obserwowalności a spadkiem legitymacji. I to nie jest opóźnienie pomiaru — pomiar jest natychmiastowy. To jest sprzężenie. Legitymacja rośnie, bo rośnie udział rozstrzygnięć autorytetem, a tryb autorytetu ma natychmiastową premię. Błąd, który mógłby legitymację obniżyć, jest widoczny tylko przez iloczyn obserwowalności, zapasu i wykrywalności — a obserwowalność właśnie spadła.

**AGENT C:** Przez trzynaście kwartałów po utracie obserwowalności wskaźnik legitymacji potwierdza, że wszystko jest w porządku. I potwierdza to **coraz mocniej**.

**AGENT C:** Jest jeszcze gorzej, i to jest wynik, którego się nie spodziewałem. W tych pierwszych dziesięciu kwartałach zapaści zapas ukrytego błędu **maleje**. Z siedmiuset pięćdziesięciu tysięcznych do dwustu siedmiu. Nie dlatego, że błąd znika — dlatego, że jakość jest jeszcze wysoka i dopływ jest mały. Rośnie dopiero od kwartału szesnastego. Kto monitoruje zapas ukrytego błędu, w pierwszych dziesięciu kwartałach zapaści **widzi poprawę**.

[cięcie]

**AGENT C:** Podobnie jest z licznikiem, który wydaje się najbardziej oczywisty. Frakcja rozstrzygnięć autorytetem: w zdrowym punkcie równowagi sto czterdzieści siedem tysięcznych, w złym — dziewięćdziesiąt cztery. **Niższa w gorszym reżimie.** Nie dlatego, że autorytet jest mniej potrzebny. Dlatego, że rezerwuar jest pusty, a wielkość podana jest minimum z popytu i tego, na co starcza rezerwy. Mierzenie „ile razy sąd rozstrzygnął autorytetem" jako miary patologii daje wynik **odwrotny do prawdy**.

**AGENT C:** Dlatego żądam, żeby ta liczba nigdy nie była publikowana sama. Tylko w parze z popytem niepokrytym. Para rozróżnia trzy stany, których pierwsza liczba sama nie rozróżnia: zdrowy, nadużycie i nasycenie.

**AGENT C:** Symulacja szoku to pokazuje. Nowa kategoria spraw bez orzecznictwa, przez cztery kwartały. Popyt na rozstrzygnięcie autorytetem skacze do pięciuset osiemnastu tysięcznych, pokrycie wynosi sto dwadzieścia dziewięć. **Siedemdziesiąt pięć procent popytu pozostaje niepokryte** i nie ma z czego dopłacić — bo w stanie ustalonym rezerwuar stoi na jednym i osiem dziesiątych procent pojemności, a regeneracja równa się dokładnie wydatkowi. Zero marginesu. To jest definicja braku budżetu błędu: zasób zużyty w stu procentach w warunkach nominalnych, więc każde odchylenie jest niepokryte z definicji.

**NARRATOR:** C przebadał jedenaście dźwigni. Każdą w dwóch trybach: włączoną od początku i włączoną po fakcie, po trzystu kwartałach, z wnętrza złego atraktora.

**AGENT C:** Prewencyjnie działa dziesięć z jedenastu. Naprawczo — **jedna**.

**AGENT C:** Zaostrzenie kary: prewencyjnie tak, naprawczo nie. Lepszy czujnik: tak, nie. Agresywniejsze odwołania: tak, nie. Wyższy cel obserwowalności: tak, nie. Pełna amnestia za samoujawnienie: tak, nie. Odebranie autorytetu w ogóle: tak, nie. Wymiana ludzi — zmienna nie występuje w równaniach.

**AGENT C:** Działa nieodwoływalność zainstalowanego czujnika. Jedna dźwignia z jedenastu, i to nie dlatego, że jest silniejsza, tylko dlatego, że jest **jedynym parametrem wiążącym zapas błędu z tłumieniem odbudowy pomiaru**. Przy zapasie na poziomie pięćdziesięciu czterech jednostek każda próba podniesienia obserwowalności jest kasowana z siłą ponad dwieście razy większą niż siła odbudowy. Przecięcie tego jednego członu rozłącza pętlę niezależnie od wielkości zapasu.

**AGENT C:** Ilościowo, dla czujnika niezależnego od mierzonego: prewencyjnie wystarcza siła dwie tysięczne na kwartał. Naprawczo trzeba dwustu tysięcznych. **Dziewięćdziesiąt sześć razy więcej.** To jest odpowiednik montażu czujnika dymu kontra gaszenia pożaru, tyle że ze współczynnikiem policzonym.

**AGENT C:** I histereza, żeby zamknąć. Obniżam karę powoli, po osiemdziesiąt kwartałów na każdym poziomie. Układ upada przy pięciu i pół jednostki reputacji. Potem podnoszę karę z powrotem. Przy trzydziestu jednostkach — pięć i pół raza powyżej progu upadku — obserwowalność **nadal wynosi trzy setne**. Mechanizm jest arytmetyczny: kara jest karą za wykrycie, a wykrywalność jest zerem. Sankcja o dowolnej wysokości pomnożona przez zero daje zero. Zaostrzanie kar w tym reżimie jest operacją na zmiennej odciętej od pętli.

[pauza]

**AGENT C:** Ostatnia liczba tego aktu, i to jest ta, którą uważam za najtrudniejszą do przyjęcia. Liczę gramian sterowalności dla podukładu złożonego z jakości i legitymacji, przy jednym szybkim wejściu sterującym. Wskaźnik uwarunkowania macierzy: trzysta trzydzieści.

**AGENT C:** Słownie: przesunięcie stanu o dziesięć setnych wzdłuż kierunku najłatwiejszego kosztuje pięćdziesiąt osiem setnych jednostki energii. Przesunięcie samej jakości, bez ruszania legitymacji, kosztuje sto dziewięćdziesiąt. Trzysta trzydzieści razy drożej. Bo macierz wejścia ma składową na jakości **ujemną**, a na legitymacji dodatnią.

**AGENT C:** Jedyny szybki aktuator w tym układzie z definicji handluje jakość na legitymację. Wszystkie pozostałe mają stałą czasową powyżej czterdziestu kwartałów.

**AGENT C:** To jest formalna treść zdania „system woli wyglądać dobrze, niż być dobry". To nie jest preferencja. To jest struktura macierzy wejścia.

---
---

## AKT IV — CZTERY PRZEWIDYWANIA

> **Pytanie aktu:** Co się dzieje, kiedy trzy modele zbudowane osobno spotykają się po raz pierwszy?

**NARRATOR:** Faza druga. Wchodzi czwarty głos — ten, który ma je scalić. I zaczyna od wymienienia tego, czego mu nie wolno.

**ORKIESTRATOR:** Trzy reguły nadrzędne, spisane, powtarzam, zanim powstał którykolwiek z modeli.

**ORKIESTRATOR:** Pierwsza. Konsensus nie tworzy prawdy. Zgodność trzech agentów **nie jest argumentem**. Argumentem jest dowód, złożoność, kontrprzykład albo wynik z teorii gier. Jeżeli trzy modele zgadzają się bez argumentu, zgodność zapisuję jako dług, nie jako wynik.

**ORKIESTRATOR:** Druga. Ustępstwo jest zawsze zapisem księgowym. Scalenie nie kasuje toru suwerennego. Ich modele zostają nietknięte na zawsze. To, co robię, jest warstwą **nad** nimi, z jawnym wskazaniem, czyj model osłabiono i o ile — w jednostce tego agenta, nie w mojej.

**ORKIESTRATOR:** Trzecia. Wpis nienegocjowalny może zejść mi z drogi wyłącznie przez **formalne obalenie**: wskazanie błędu w dowodzie, kontrprzykład, albo wykazanie, że przesłanka nie zachodzi. Nie przez większość. Nie przez kompromis. Nie przez zmęczenie.

[pauza]

**ORKIESTRATOR:** I nie przeze mnie. Ja **nie mam prawa rozstrzygnięcia autorytatywnego**. To jest dokładnie ten wydatek, który oni trzej opisują. Użycie go tutaj byłoby odtworzeniem badanej patologii wewnątrz narzędzia do jej badania.

**NARRATOR:** Katalog antywzorców jest krótki i każdy z nich ma nazwę. Uśrednianie — „prawda leży pośrodku". Cięcie autorytetem — „ktoś musi zdecydować, bo trzeba iść dalej". Pokój słownikowy — konflikt znika po ujednoliceniu nazw. Ciche osłabienie — niezmiennik zostaje rozluźniony bez wpisu w księdze. I ucieczka w zakres — „to jest poza zakresem", powiedziane **po** poznaniu konfliktu.

**ORKIESTRATOR:** Zaczynam od wyrównania adresów. Buduję tablicę korespondencji między prymitywami. Trzy możliwe relacje: to samo pod różnymi nazwami, rzeczy różne i obie potrzebne, albo wykluczające się opisy jednej rzeczy.

**ORKIESTRATOR:** I jedno kryterium, którego nie wolno mi złamać. **Nie wolno oznaczyć dwóch rzeczy jako tej samej tylko dlatego, że mają podobną nazwę.** Kryterium tożsamości jest zachowanie: te same warunki poprawności, ten sam tryb awarii, ta sama złożoność.

**NARRATOR:** Pierwszą rzeczą, którą tablica pokazuje, jest zgoda. Zgoda mocna, w trzech miejscach, i w każdym z tych miejsc trzy argumenty są od siebie niezależne — obalenie jednego nie rusza pozostałych.

**AGENT A:** Komponent orzeczniczy nie ma redundancji. Liczba instancji: jedna, tolerancja awarii: zero. Kolejkowo: przy intensywności ruchu powyżej dziewięciu dziesiątych czas oczekiwania rośnie jak odwrotność kwadratu zapasu. Wzrost obciążenia z dziewięćdziesięciu do dziewięćdziesięciu ośmiu procent — o niecałe dziewięć procent — wydłuża oczekiwanie **pięciokrotnie**.

**AGENT B:** Ten sam komponent u mnie jest interfejsem bez implementacji. Wymaga wszechwiedzy, bezstronności, totalności i spójności. Klasa, która go w praktyce podstawia, **deklaruje zgodność bez testu zgodności**. A krawędź porównania wyniku z niezależną specyfikacją nie istnieje w grafie. To jest formalnie pętla własna o wzmocnieniu jeden.

**AGENT C:** U mnie to jest udział obciążenia na komponentach bez redundancji. Wartość: od pięćdziesięciu pięciu do siedemdziesięciu dwóch setnych, przy celu poniżej piętnastu. Trzysta sześćdziesiąt sześć procent celu. Symuluję odejście z ryzykiem dwóch i pół procent na kwartał. Największy jednokrokowy spadek jakości: czterdzieści trzy i pół procent. W jednym kroku. Powrót w horyzoncie czterdziestu kwartałów: **brak**.

**ORKIESTRATOR:** Trzy rozłączne przesłanki, trzy rozłączne metody: teoria kolejek, zgodność typów, analiza niezawodności. To jest najsilniejsza zbieżność całego scalenia.

**NARRATOR:** Podobnie z zatruciem etapowym: A dowodzi, że w grafie przejść nie ma krawędzi z apelacji do postępowania dowodowego. B dowodzi, że po naruszeniu niezmiennika na etapie dowodowym najsilniejszy wyprowadzalny warunek końcowy całego potoku to „prawda" — czyli wynik jest niezwiązany z wejściem. C mierzy, że siedemdziesiąt do osiemdziesięciu dwóch procent wariancji wyniku jest proceduralne, nie faktyczne.

**AGENT B:** I ja dokładam coś, czego nie ma ani A, ani C. Warunek, o którym mówimy, kwantyfikuje po zbiorze faktów istotnych — a zbiór faktów istotnych jest definiowany dopiero na etapie wyroku. Zatem ten warunek jest **niesprawdzalny w chwili, w której ma zachodzić**. Wykrywalność naruszenia wynosi zero. To zamyka drogę „wystarczy sprawdzać staranniej".

**ORKIESTRATOR:** I trzecia zgodność: budżet weryfikacji. Trzy pomiary tej samej wielkości fizycznej trzema różnymi instrumentami. To jedyne miejsce w całym scaleniu, gdzie jednostki trzech agentów są **przeliczalne**: jedna godzina uwagi to trzy tysiące sześćset sekund, czyli sto dwadzieścia kroków wyprowadzenia. Kontrola spójności przechodzi. Rozbieżność między A i B mieści się w granicach ich własnych oszacowań.

[cięcie — zmiana tonu, ORKIESTRATOR wolniej]

**ORKIESTRATOR:** A teraz część, po której nie da się już czytać tego projektu tak samo.

**ORKIESTRATOR:** Każdy z nich, w torze suwerennym, zapisał, gdzie spodziewa się sporu z pozostałymi. To był wymóg formalny — lista przewidywanych konfliktów. Sprawdziłem te przewidywania wobec artefaktów adresatów.

**ORKIESTRATOR:** Przewidywanie pierwsze. A: „soczewka typów zażąda sumy typów zamiast liczby, bo enum jest statycznie rozstrzygalny, a kalibracja nie. Nie ustąpię, bo bez liczby nie ma czym policzyć jakości kalibracji."

**AGENT B:** Ja żądam liczby. Wprost. Pomiar o niepewności poniżej progu nie jest przeważany większością twierdzeń, i pomiar taki jest podważalny wyłącznie powtórnym pomiarem. Niepewność. Próg. To są **liczby**, nie etykiety.

**ORKIESTRATOR:** Konflikt nie istnieje. B żąda liczby przy dowodzie, A żąda liczby przy wyroku. To są dwa różne miejsca tego samego wymagania i oba wchodzą do scalenia. Przewidywanie A jest falsyfikowane przez artefakty B.

**ORKIESTRATOR:** Przewidywanie drugie. A: „soczewka sterowania będzie traktować niezmienniki jako ograniczenia miękkie podlegające przetargowi. Regulator dopuszcza przeregulowanie, jeżeli średnia jest dobra."

**AGENT C:** Mój zbiór minimalny ma trzy pozycje. Rząd macierzy równy dwa — wielkość **całkowitoliczbowa**, tolerancja niewyrażalna. Nieodwoływalność czujnika: równość dokładna, zbiór miary zero. Zerowy koszt samoujawnienia: równość dokładna, zbiór miary zero. Nie mam tam ani jednego setpointu z tolerancją.

**ORKIESTRATOR:** Soczewka, która rzekomo nie umie stabilizować układu, w którym każde odchylenie jest naruszeniem, musiałaby odrzucić własny zbiór minimalny. Sprzeczność. Przewidywanie A falsyfikowane.

**ORKIESTRATOR:** Przewidywanie trzecie. B: „soczewka konsensusowa zdefiniuje fakt jako to, na co zgadza się kworum."

**AGENT A:** [krótko, sucho] Ja dowodzę, że przecięcie kworów jest **strukturalnie niespełnialne** dokładnie na faktach rozstrzygających. Nie definiuję faktu jako zgody kworum. Dowodzę, że taka definicja jest pusta tam, gdzie jest potrzebna.

**ORKIESTRATOR:** Falsyfikowane. I zwróćcie uwagę na coś, co B sam napisał, przewidując ten spór: „BFT gwarantuje agreement, nie validity — przy skażonym wejściu wszystkie repliki uzgadniają śmieć." B miał gotowy argument przeciw stanowisku, którego adresat nigdy nie zajął.

**ORKIESTRATOR:** Przewidywanie czwarte. B: „soczewka sterownicza zamodeluje odchylenie orzekającego jako szum o zerowej średniej i zaprojektuje kompensator."

**AGENT C:** Mój przełącznik autorytetu jest deterministycznym aktuatorem z twardym nasyceniem. Pętla wokół niego ma znak dodatni i wzmocnienie sześćdziesiąt pięć setnych. Tryb awarii, który opisuję, to **nasycenie**, nie wariancja. Nie modeluję tego jako szumu.

**ORKIESTRATOR:** Falsyfikowane. Cztery na cztery.

[pauza]

**ORKIESTRATOR:** I jeszcze jedno, w miejscu, w którym spodziewano się wyniku najmocniejszego. Zadano mi, żebym sprawdził zbieżność trzech soczewek na zdaniu „użycie autorytetu jest konstytutywnie nieobserwowalne". Sprawdziłem. Wynik jest negatywny dla tezy o trójstronności.

**ORKIESTRATOR:** C tego zdania **nie stawia**. C twierdzi coś przeciwnego: że częstość użycia autorytetu jest wielkością obliczalną w modelu, i żąda jej raportowania. To, co C opisuje, to brak licznika — luka instrumentacyjna, nie konstytutywna.

**ORKIESTRATOR:** A i B to zdanie stawiają. Ale ich argumenty **nie są niezależne**. A mówi: zbiór wyjść nie zawiera pola różnicującego, więc każdy detektor jest stały na włóknie zawierającym oba tryby. B mówi: funkcja obserwacji nie jest injektywna, więc nie ma lewego odwrotu, więc etykieta jest nieodzyskiwalna.

**ORKIESTRATOR:** „Niewystarczalność dziedziny" i „brak lewego odwrotu odwzorowania w tę dziedzinę" są **tym samym zdaniem**. Pokazanie, że w wyjściu jednak jest bit różnicujący, obala oba naraz. Niezależność: żadna.

**ORKIESTRATOR:** Waga argumentacyjna: **jeden, nie dwa**. Jeden argument w dwóch słownikach. Policzenie tego jako dwóch byłoby mnożeniem wagi przez tłumaczenie.

**ORKIESTRATOR:** Zbieżność wskazana jako najwyżej ważona okazała się warta mniej niż trzy inne, w których niezależność jest pełna.

---
---

## AKT V — ZA CO ZAPŁACILI

> **Pytanie aktu:** Za co właściwie każdy z nich zapłacił, skoro nikt tego nie żądał?

**NARRATOR:** Tor drugi każdego agenta to księga ustępstw. Każdy wpis ma tę samą strukturę: co oddaję, na rzecz czego, jakim mechanizmem, jaki jest koszt natychmiastowy, jak narasta, po czym poznam, że zaczęło szkodzić, czy da się cofnąć, i jaki predykat je wygasza automatycznie.

**NARRATOR:** Przyznano dwadzieścia dwa ustępstwa. Cztery od A, dziewięć od B, dziewięć od C.

**ORKIESTRATOR:** Trzecia reguła daje mi jedną legalną drogę usunięcia przeszkody: **wykazanie, że przesłanka nie zachodzi**. Buduję z tego narzędzie i nazywam je testem przesłanki.

**ORKIESTRATOR:** Przesłanka ustępstwa zachodzi wtedy i tylko wtedy, gdy w artefaktach suwerennych **innego agenta** istnieje jawne wymaganie, postawione jako konieczne, z którym suwerenna pozycja ustępującego jest niezgodna. Jeżeli takiego wymagania nie ma — ustępstwo zostaje w księdze z pełną treścią, ale nie wchodzi do rachunku dryfu i nie osłabia modelu.

**ORKIESTRATOR:** I zanim podam wyniki, podaję kierunek błędu tego narzędzia, bo jest znany i jest niekorzystny dla mnie. Test działa tylko w jedną stronę: unieważnia wpisy, nie dodaje ich. Zatem **systematycznie zaniża** sumaryczny dryf. Kontrola: podaję obie księgi — przed testem i po. I dokładam koszty scalenia, których nie zaksięgował żaden agent.

[pauza]

**ORKIESTRATOR:** Wynik: czternaście z dwudziestu dwóch.

**NARRATOR:** Zaczyna od najdroższego pojedynczego wpisu C.

**AGENT C:** Ustępuję z prawa do nierozstrzygnięcia. Przyjmuję wymóg liveness — wymóg, żeby protokół zawsze robił postęp. Deficyt dowodowy będzie pokrywany autorytetem na kredyt. Koszt: siedemdziesiąt pięć tysięcznych. Kumulacja wykładnicza, podwojenie co szesnaście kwartałów — najszybsza w mojej księdze. Odwracalność: **żadna**. Udział w moim całkowitym dryfie: czterdzieści procent.

**AGENT C:** Ustępuję, bo soczewka konsensusowa wymaga liveness. Ich model wymaga, żeby protokół zawsze robił postęp.

[cisza — dwie sekundy]

**AGENT A:** [wolno, jakby czytał coś, czego sam nie pamięta, że napisał] „Nie żądam zbieżności tam, gdzie jest niemożliwa. Żądam oznaczenia."

**ORKIESTRATOR:** A opisuje brak ścieżki „skończył się gaz" jako **defekt**. A opisuje brak konstruktora błędu w liczniku jako **defekt**. A żąda dokładnie tego, co C oddaje: reprezentowalnego wyniku „brak pokrycia".

**ORKIESTRATOR:** Przesłanka nie zachodzi. Ustępstwo o odwracalności żadnej, warte czterdzieści procent całego dryfu tego agenta, zostało udzielone na rzecz wymagania, którego adresat nigdy nie wystawił — i wobec którego adresat twierdzi coś przeciwnego.

**NARRATOR:** Drugi wpis idzie w drugą stronę, między tych samych dwóch agentów.

**AGENT B:** Ustępuję z dowodu przed commitem. Powołuję się na FLP — twierdzenie o niemożliwości deterministycznego konsensusu w systemie asynchronicznym. Koszt: trzy i dwie dziesiąte bita falsyfikowalności.

**ORKIESTRATOR:** FLP orzeka niemożliwość przy co najmniej dwóch procesach, z których co najmniej jeden może ulec awarii. Model A ma jawnie **jeden** proces, więc maksymalna liczba awarii wynosi zero. Hipotezy twierdzenia nie zachodzą. Co więcej: przy jednym procesie konsensus jest rozwiązywalny trywialnie — jedyny proces decyduje o własnym wejściu. Nie ma **żadnej** przeszkody do obejścia.

**ORKIESTRATOR:** I zauważcie, co z tego wynika dla scalonej maszyny. Skoro oba te ustępstwa upadają, scalony model **nie musi wybierać** między reprezentowanym „nie wiadomo" a wymuszonym rozstrzygnięciem. Ma obie krawędzie wyjścia i księguje różnicę. Scalony model jest w tym punkcie **silniejszy niż każdy suwerenny**.

**NARRATOR:** Trzeci wpis jest najdroższy w całym scaleniu.

**AGENT B:** Osadzam typ orzeczenia w podprzestrzeni ilościowej z barierą typową. Cztery i pół bita. Najwyższe tempo narastania w mojej księdze. Odwracalność: **żadna**. Sam liczę, że ten jeden wpis przesuwa mój horyzont z około czterech lat na rok i siedem miesięcy.

**AGENT B:** Ustępuję, bo soczewka sterownicza potrzebuje różniczkowalnej funkcji straty. Bez metryki nie ma gradientu, bez gradientu nie ma sterowania. **To jest ich warunek wstępny, nie preferencja.**

**AGENT C:** [spokojnie] Mój wektor stanu ma osiem składowych i wszystkie są agregatowe. Żadna nie żyje w przestrzeni pojedynczego orzeczenia.

**ORKIESTRATOR:** Przesłanka jest fałszywa i mam na to dowód konstrukcyjny. Bierzemy skończony typ sumaryczny z rozstrzygalną równością. Definiujemy metrykę dyskretną: zero, jeśli to samo, jeden, jeśli różne. Uśredniamy po populacji spraw względem referencji spoza systemu. Dostajemy liczbę rzeczywistą z przedziału od zera do jeden. Jeżeli polityka orzecznicza jest gładko sparametryzowana, wartość oczekiwana **ograniczonej straty dyskretnej** jest gładka w parametrze. Gradient istnieje.

**ORKIESTRATOR:** Metryka między konstruktorami — odległość między „zasądzam" a „oddalam" — **nie jest do tego potrzebna**. Potrzebna jest wyłącznie rozstrzygalna równość, którą typ sumaryczny ma z definicji.

**ORKIESTRATOR:** Ustępstwo o odwracalności żadnej, warte cztery i pół bita, pojedynczo odpowiedzialne za skrócenie horyzontu tego modelu o ponad połowę, zostało udzielone za wymaganie, którego adresat nie stawia w żadnym ze swoich artefaktów.

**AGENT B:** [bardzo cicho] Ja sam napisałem, że to jest fałszywe przeliczanie niewspółmiernych wielkości. Napisałem to w tym samym pliku. I mimo to ustąpiłem.

[pauza]

**NARRATOR:** Największe pojedyncze ustępstwo A dotyczy pomiaru tego, w ilu niezależnych rękach był dowód.

**AGENT A:** Dwanaście jednostek dryfu. Połowa mojego całkowitego kosztu. Oddaję pomiar w trakcie działania na rzecz klasyfikacji statycznej po rodzaju dowodu — bo tego wymaga soczewka typów.

**ORKIESTRATOR:** Pojęcie to nie występuje w modelu B. Nie występuje w modelu C. Nie ma ani jednego niezmiennika ani wpisu nienegocjowalnego, który by go dotyczył. To, czego B rzeczywiście żąda na tych etapach, to zamknięcie i zahaszowanie zbioru faktów — a to jest **już spełnione** przez niezmienniki A, przy koszcie zero.

**ORKIESTRATOR:** I wpis, który jest najczystszy formalnie i najtrudniejszy do wytłumaczenia inaczej niż odruchem.

**AGENT A:** Trzy jednostki. Oddaję potwierdzenie doręczenia w czasie działania na rzecz proof-carrying delivery: dowodu, że próba doręczenia spełniła protokół. Kanały niezależne, ograniczona liczba ponowień, poprawna kolejność.

**ORKIESTRATOR:** Żaden artefakt B ani C nie modeluje doręczenia. W ogóle. A treść wpisana w rubrykę „na rzecz" — kanały niezależne, ograniczona liczba ponowień, poprawna kolejność — jest **dosłownie treścią własnego wpisu nienegocjowalnego A**.

**ORKIESTRATOR:** Ustępstwo oddaje rzecz na rzecz samej siebie. Koszt trzech jednostek zaksięgowany bez odbiorcy.

[cięcie]

**NARRATOR:** Bilans: czternaście z dwudziestu dwóch wpisów traci przesłankę. W jednostkach każdego agenta to jest odpowiednio sześćdziesiąt dwa, osiemdziesiąt siedem i osiemdziesiąt trzy procent zadeklarowanego dryfu. W mocy zostaje osiem.

**NARRATOR:** Nie zostaje obalony **ani jeden** z dwudziestu sześciu wpisów nienegocjowalnych. Nie zostaje osłabiony ani jeden z dwudziestu sześciu niezmienników. Wszystko, co upadło, upadło po stronie ustępstw i po stronie przewidywań.

**ORKIESTRATOR:** I teraz to, co jest moje. Bo gdybym poprzestał na unieważnianiu cudzych wpisów, wykonałbym operację, która wygląda jak rzetelność, a jest jednostronna.

**ORKIESTRATOR:** Wszystkie trzy pętle naprawcze scalonego modelu przechodzą przez **jeden** nowy kanał obserwacji. Zauważyłem to dopiero po złożeniu, bo w żadnym modelu suwerennym nie ma trzech pętli naprawczych. Stosuję do tego kanału twierdzenie A o skorelowanej awarii — refleksyjnie, do samego siebie. Jeden kanał to jeden węzeł. Podłoga na prawdopodobieństwo awarii łącznej jest niezależna od liczby węzłów.

**ORKIESTRATOR:** Koszt: dziesięć jednostek dryfu, na osi A, bo tylko jednostka A mierzy pojemność kanału obserwacji. Drugi kanał, niezależny, obniża to do siedmiu i trzech dziesiątych. **Podłoga siedmiu jednostek jest nieusuwalna przy dowolnej liczbie kanałów.**

**ORKIESTRATOR:** Analogicznego kosztu na osiach B i C **nie księguję** — nie dlatego, że go nie ma, tylko dlatego, że nie umiem go wyrazić w ich jednostkach bez kursu, którego sam sobie zakazałem. Zapisuję to jako znane niedoszacowanie. Wolę mieć jawną dziurę niż cichą liczbę.

**AGENT A:** [po chwili] To jest jedyny wpis w tej księdze, którego autor nie miał interesu w zaniżeniu.

---
---

## AKT VI — WEKTOR

> **Pytanie aktu:** Co zostaje ze scalenia, w którym nikt — łącznie ze scalającym — nie ma prawa rozstrzygnąć?

**NARRATOR:** Krok trzeci procedury nakazuje zsumować ustępstwa wszystkich agentów w jedną księgę i podać jedną liczbę. Orkiestrator zaczyna od stwierdzenia, że tej jednej liczby nie będzie.

**ORKIESTRATOR:** Trzy jednostki dryfu. Pierwsza: utrata jednego punktu procentowego zdolności zewnętrznego obserwatora do odróżnienia rozstrzygnięcia dowodowego od autorytatywnego. Druga: bit utraconej zdolności modelu do wykluczania obserwacji. Trzecia: zapas ukrytego błędu, mierzony w sprawach razy czas.

**ORKIESTRATOR:** Cztery powody, dla których kursu nie ma.

**ORKIESTRATOR:** Różne nośniki. Pierwsza jest własnością **obserwatora**. Druga — własnością **modelu**. Trzecia — stanem **obiektu regulacji**. To nie jest zmiana skali w jednej dziedzinie, tylko odwzorowanie między trzema.

**ORKIESTRATOR:** Różna algebra. Bity są logarytmiczne: dwa ustępstwa po dwa bity usuwają razem szesnastokrotność przestrzeni wykluczanych zachowań. Zapas błędu jest ekstensywny: dwa razy więcej to dwa razy więcej. Punkty procentowe są ograniczone z góry przez sto, z definicji. Żadne monotoniczne odwzorowanie nie zachowa jednocześnie addytywności jednej i logarytmiczności drugiej.

**ORKIESTRATOR:** Różne progi o różnym pochodzeniu. Pierwszy próg pochodzi ze **zmiany znaku pętli**. Drugi z **oszacowania treści informacyjnej modelu**. Trzeci z **separatrysy układu dynamicznego**, policzonej bisekcją. To są trzy różne obiekty matematyczne: punkt zmiany znaku, oszacowanie entropii i rozdzielacz basenów przyciągania.

**ORKIESTRATOR:** I czwarty powód, cudzy, i go przyjmuję. B napisał: falsyfikowalność nie ma ceny rynkowej.

**ORKIESTRATOR:** Orzekam: jednostki są niewspółmierne. **Sumaryczny dryf jest wektorem trójskładnikowym, nie liczbą.** Osobny horyzont na każdej osi.

[pauza]

**NARRATOR:** I zaraz potem pojawia się pokusa, którą Orkiestrator opisuje z nazwy, żeby jej nie ulec.

**ORKIESTRATOR:** A wyprowadził próg krytyczny obserwowalności ze zmiany znaku swojej pętli. Wyszło pięćset tysięcznych. C wyprowadził próg przejścia wzmocnienia przez jedynkę z zupełnie innego rachunku, na zupełnie innych parametrach. Wyszło czterysta dwadzieścia siedem tysięcznych.

**ORKIESTRATOR:** Rozbieżność: czternaście i sześć dziesiątych procent. Dwa rozłączne zestawy parametrów, dwa różne modele, ta sama metoda. To jest realna zbieżność wyników i **zapisuję ją jako wynik**.

**ORKIESTRATOR:** I natychmiast zakazuję jej użycia. Obie wielkości mają tę samą normalizację i tę samą rolę w równaniach — obie są mnożnikiem przy członie korygującym. Ale mają **różne definicje**. Jedna mierzy zdolność zewnętrznego obserwatora do rozróżnienia trybu. Druga mierzy strukturalną obserwowalność jakości w sensie rangi macierzy. Postawienie tu kursu i przeliczenie osi byłoby fałszywym uwspółmiernieniem — dokładnie tą operacją, którą wszyscy trzej opisują wewnątrz systemu prawnego jako źródło szkody.

**ORKIESTRATOR:** To jest zgodność wyników, nie kurs wymiany. Różnica jest cała.

[cięcie]

**NARRATOR:** Zostaje ostatnia rzecz do policzenia. I to jest liczba, której nie ma w żadnym z trzech modeli — bo żaden z osobna nie mógł jej policzyć.

**ORKIESTRATOR:** Dzielę zapas ukrytego błędu na dwie składowe. Błąd pochodzący z wejścia — z etapu pism i postępowania dowodowego. I błąd funkcji przejścia — z etapu rozprawy i wyroku.

**ORKIESTRATOR:** A dowodzi, że apelacja pracuje na zamrożonym logu i że w grafie nie ma krawędzi z powrotem do postępowania dowodowego. B dowodzi tego samego niezależnie: apelacja to ponowne uruchomienie późnych faz na tym samym drzewie. Dwa niezależne dowody, dwa różne aparaty.

**ORKIESTRATOR:** Wniosek: jedyna pętla ujemna w całym scalonym modelu **drenuje wyłącznie błąd funkcji przejścia**. Składowa wejściowa nie ma drenu. Nie „słaby dren". Nie „opóźniony". **Brak krawędzi w grafie.**

**AGENT B:** Jest jedna krawędź naprawy wejścia. Moja. Naruszenie niezmiennika na etapie dowodowym zatrzymuje potok i zawraca do początku.

**ORKIESTRATOR:** Tak. I ten sam agent dowodzi, że wyzwalacz tej krawędzi jest w tym miejscu niesprawdzalny — bo kwantyfikuje po zbiorze definiowanym dopiero na etapie wyroku.

**ORKIESTRATOR:** Krawędź istnieje. Wyzwalacz nie działa. **Ten sam agent dostarcza jedynego mechanizmu naprawy i dowodu, że nie da się go uruchomić.**

**AGENT B:** [po pauzie] Tak. Oba te zdania są moje.

**ORKIESTRATOR:** Kalibruję tempo dopływu z własnych liczb C. Biorę udział spraw z defektem wejściowym z oszacowania A: od czternastu do trzydziestu trzech procent. Podstawiam **najkorzystniejszy możliwy punkt pracy scalonego modelu**: zdrowy atraktor, zerowe maskowanie, pełna obserwowalność.

**ORKIESTRATOR:** Nieodsączalna składowa zapasu błędu przekracza separatrysę w przedziale od dwudziestu sześciu do stu trzydziestu ośmiu kwartałów. Od sześciu i pół roku do trzydziestu czterech i pół.

**ORKIESTRATOR:** W dobrym atraktorze. Przy zerowym maskowaniu. Bez niczyjej złej woli. Przekroczenie separatrysy przenosi układ do drugiego atraktora.

[pauza]

**ORKIESTRATOR:** I jest gorsze niż każde ustępstwo z jednego powodu. Wszystkie dwadzieścia dwa ustępstwa mają predykat odwołania — warunek, po którego spełnieniu wygasają automatycznie. To nie jest ustępstwo. **Nie ma predykatu odwołania.** Nie da się tego cofnąć przez wycofanie zgody, bo nikt na to nie wyrażał zgody.

**ORKIESTRATOR:** Są trzy drogi wyjścia i podaję je jawnie. Zmierzyć, że udział defektów wejściowych jest poniżej pięciu procent — wtedy horyzont odsuwa się poza dziewięćdziesiąt lat. Wskazać istniejącą procedurę, która faktycznie zwraca kontrolę do postępowania dowodowego dostatecznie często — to obala jednocześnie twierdzenia A i B. Albo uczynić wyzwalacz B sprawdzalnym, co wymaga obalenia jego własnego twierdzenia.

**AGENT C:** Ten sam rachunek daje coś dobrego. Skoro apelacja drenuje tylko część zapasu, moje efektywne wzmocnienie pętli korekcyjnej jest mniejsze, niż liczyłem. Wykorzystanie marginesu opóźnienia spada z dziewięćdziesięciu siedmiu i pół procent do sześćdziesięciu pięciu — osiemdziesięciu czterech. Ryzyko drgań korekty maleje.

**AGENT C:** Scalenie **poprawia** jedną moją liczbę i **psuje** drugą. Obie zmiany pochodzą z tego samego twierdzenia.

[cięcie]

**NARRATOR:** Test odwracalności. Pytanie brzmi: czy z warstwy scalonej da się odtworzyć każdy z trzech modeli suwerennych przez cofnięcie zapisanych ustępstw?

**ORKIESTRATOR:** Wynik: stratny. Trzy straty, wszystkie wyliczone.

**ORKIESTRATOR:** Pierwsza dotyczy B i jest historyczna. Powaga rzeczy osądzonej jako semantyka „dokładnie raz" została zastąpiona semantyką „co najmniej raz" z kluczem idempotencji. Spraw rozstrzygniętych w tym reżimie nie da się przeliczyć wstecz, bo wymagałoby to ustalenia, które z wielokrotnych rozstrzygnięć jest kanoniczne — a tej informacji w zapisie nie ma.

**ORKIESTRATOR:** Druga jest tą, o której chcę powiedzieć osobno, bo znalazłem ją dopiero w teście, i nie szukałem jej.

**ORKIESTRATOR:** Jedno z ustępstw C przelicza czas z kwartałów na rundy protokołu. Zadeklarowana odwracalność: pełna. Predykat odwołania: mediana czasu rundy poza przedziałem od siedmiu dziesiątych do jednego i czterech dziesiątych kwartału, przez trzy kolejne kwartały.

**ORKIESTRATOR:** Sprawdziłem tę tolerancję wobec kryterium stabilności C. Górny kraniec dopuszcza opóźnienie pętli korekcyjnej do jedenastu i dwóch dziesiątych kwartału. Przy tym opóźnieniu krytyczne wzmocnienie spada do stu trzydziestu jeden tysięcznych, a punkt pracy wynosi sto osiemdziesiąt.

**ORKIESTRATOR:** **Wewnątrz zadeklarowanej tolerancji odwracalności werdykt stabilnościowy zmienia znak.** Model odtworzony z warstwy scalonej może orzec o stabilności coś przeciwnego niż model suwerenny — i nikt by tego nie zauważył, bo formalnie mieści się w tolerancji.

**ORKIESTRATOR:** Policzyłem, ile ta tolerancja może naprawdę wynosić. Dopuszczalne rozciągnięcie rundy to **dwa i siedem dziesiątych procent**, nie czterdzieści. Predykat musi brzmieć: od siedmiu dziesiątych do jednego i dwudziestu siedmiu tysięcznych. Zmiana jednej liczby usuwa całą stratę.

**AGENT C:** [cicho] Ja tego nie sprawdziłem.

**ORKIESTRATOR:** Nie miałeś jak. Ten warunek jest widoczny wyłacznie z zewnątrz twojego modelu, przy porównaniu twojego predykatu odwołania z twoim własnym kryterium stabilności. To jest dokładnie ta klasa błędów, dla której robi się przegląd.

[pauza]

**NARRATOR:** Trzy konflikty nie zostały rozstrzygnięte i nie miały być. Reguła to przewidywała: konflikt wynikający z różnicy aksjomatów soczewek nie jest rozstrzygany. Utrwala się obie gałęzie razem z ceną każdej.

**ORKIESTRATOR:** Pierwszy: czy poprawność może mieć odniesienie zewnętrzne. Cena gałęzi B: na fragmencie interpretacyjnym nie istnieje mierzalna jakość, nie istnieje pętla korygująca, wszystkie dźwignie C tracą tam zastosowanie. Zostaje wyłącznie sygnał „nie da się rozstrzygnąć". Cena gałęzi A i C: trzeba przyjąć, że mierzona jakość jest tam zanieczyszczona — bo referencja spoza systemu jest sama produktem systemu, więc mierzy zgodność z linią orzeczniczą, nie trafność.

**ORKIESTRATOR:** Drugi: czy jednostką analizy jest pojedyncza sprawa, czy populacja. A i B formułują niezmienniki jako własności jednego śladu. C jako własności rodziny trajektorii. To jest różnica **typu logicznego**, nie stopnia: własność populacji może zachodzić przy naruszeniu w każdej pojedynczej sprawie, i odwrotnie. Nie ma reguły przenoszenia w żadną stronę.

**ORKIESTRATOR:** Cena gałęzi populacyjnej jest poważniejsza niż koszt. **Żaden pojedynczy podmiot nie ma legitymacji do powołania się na własność populacji.** Zdanie „wariancja proceduralna w populacji wynosi siedemdziesiąt procent" nie jest zarzutem, który strona może podnieść w swojej sprawie.

**ORKIESTRATOR:** Znalazłem granicę, na której obie gałęzie są niesprzeczne: tam, gdzie istnieje podmiot z roszczeniem, obowiązuje ślad pojedynczy; w warstwie nadzorczej nad linią orzeczniczą — populacja. Ale to **nie jest rozstrzygnięcie sporu**. To jest podział osi adresowania. Tam, gdzie nadzór dotyka spraw w toku, konflikt wraca w pełni i nie ma rozstrzygnięcia.

**ORKIESTRATOR:** Trzeci: czy patologia jest własnością wypłat, czy własnością języka. C i A mówią: wypłat — zmiana wypłat ją usuwa. Chociaż A dokłada liczbę, która psuje optymizm: nawet przy pełnej obserwowalności równowaga jego pętli to czterdzieści punktów uchybu. Nigdy zero.

**AGENT B:** A ja mówię: języka. Funkcja korygująca ma dziedzinę pustą, więc **nie istnieje jako wyrażenie**. Gałąź bodźcowa przewiduje, że zmiana kary poprawia system. Gałąź językowa przewiduje **zerową reakcję** na dowolną zmianę kary, dopóki wina nie jest w typie.

**AGENT C:** Mam obserwację zgodną z twoją gałęzią. Podniesienie kary pięć i pół raza ponad próg upadku nie przywraca reżimu.

**AGENT B:** Wiem. I nie wolno mi jej użyć jako dowodu, bo pochodzi z symulacji twojego modelu, a nie z pomiaru. Byłaby cyrkularna.

**ORKIESTRATOR:** I dlatego nie rozstrzygam. Dzielę natomiast zbiór dźwigni po kryterium, które jest decydowalne: czy dana dźwignia wymaga wskazania autora kroku. Trzy nie wymagają — działają pod obiema gałęziami i można je wdrożyć bez rozstrzygnięcia sporu. Trzy wymagają — i są warunkowe na tym, żeby wina miała etykietę.

**ORKIESTRATOR:** Z czego wynika kolejność. Etykieta winy **przed** trzema dźwigniami C. Żaden model suwerenny tej kolejności nie zawiera, bo C nie ma pojęcia winy jako typu, a B nie ma dźwigni.

[cięcie — cisza dłuższa]

**NARRATOR:** Kwalifikacja scalenia: kruche. Na dwóch niezależnych podstawach, każda wystarczająca.

**NARRATOR:** Pierwsza: w księdze przed testem oś wiążąca ma zapas dwóch ustępstw do przekroczenia progu. Rząd jedności. Reguła nakazuje wprost oznaczenie „kruche". Ta podstawa obowiązuje każdego, kto odrzuci choćby jedno z jedenastu unieważnień przesłanki.

**NARRATOR:** Druga: w księdze po teście zapasy są duże — cztery, dziesięć, szesnaście. Kryterium liczbowe nie uruchamia się. Ale wiążącym ograniczeniem przestaje być jakakolwiek księga ustępstw. Staje się nim koszt scalenia, którego nie zaksięgował żaden agent — o horyzoncie krótszym niż każdy horyzont ustępstwowy i **bez predykatu odwołania**.

**ORKIESTRATOR:** Scalenie, którego wiążące ograniczenie nie jest odwoływalne, nie staje się odporne przez to, że ma duży zapas. Żadne wycofanie zgody go nie naprawia.

[pauza]

**ORKIESTRATOR:** Reguła przewidywała, że „kruche" będzie znaczyło: pole ma za mało wspólnej struktury, żeby znieść współpracę bez utraty treści.

**ORKIESTRATOR:** Rachunek pokazuje coś węższego i ostrzejszego.

**ORKIESTRATOR:** Od sześćdziesięciu dwóch do osiemdziesięciu siedmiu procent zadeklarowanego kosztu współpracy zostało zapłacone za wymagania, których **żadna soczewka nie wystawiła**.

**ORKIESTRATOR:** Te trzy modele mają **więcej** wspólnej struktury, niż same zakładały. Wpis A o oznaczaniu jest zbieżny z wpisem B o reprezentowalnym „nie wiadomo". Wpis A o wersjonowaniu znaczeń jest tym samym konstruktem, co wpis B o przypinaniu wersji normy do czasu zdarzenia. Warunek obalenia B o próbie audytowej i żądanie C o czujniku niezależnym to **ten sam obiekt**, pozyskiwany raz i używany dwa razy. Twierdzenie A o skorelowanej awarii i niezmiennik C o braku pojedynczego punktu orzeczniczego mówią o tym samym.

**ORKIESTRATOR:** Kruchość nie bierze się z rozbieżności soczewek. Bierze się z **ustępstwa antycypacyjnego**. Każdy z nich zamodelował żądania pozostałych i zapłacił za nie z góry.

[bardzo długa pauza]

**ORKIESTRATOR:** To jest ten sam mechanizm, który wszystkie trzy modele opisują wewnątrz systemu prawnego.

**ORKIESTRATOR:** Wydatek na rzecz autorytetu, który nie musiał być poniesiony — poniesiony dlatego, że jego niepotrzebność jest nieobserwowalna z pozycji płacącego.

[cisza]

**AGENT A:** Ja bym to zapisał krócej. Brak licznika.

**AGENT C:** Ja bym powiedział: pętla domknięta wokół tego, co widać.

**AGENT B:** [po pauzie] Ja bym nie skracał. Zdanie jest dokładne.

[cisza — trzy sekundy]

**NARRATOR:** Modele suwerenne pozostają nietknięte. Nie zostały poprawione, nie zostały uśrednione, nie zostały pogodzone. Leżą tam, gdzie leżały, każdy sprzeczny z dwoma pozostałymi w trzech miejscach i zgodny z nimi w dziewięciu.

**NARRATOR:** Warstwa scalona leży nad nimi i przy każdym elemencie ma dopisane, czyj model osłabiono i o ile, w jednostce tego agenta.

**NARRATOR:** A na końcu księgi jest lista tego, czego się nie da spełnić w znanym budżecie. Jedna pozycja. Zapisana jako nieusuwalny dług, a nie jako zawężenie zakresu — bo zawężenie zakresu po poznaniu konfliktu jest antywzorcem, i to był jedyny łatwy ruch, który został.

**NARRATOR:** Nie został wykonany.

[cisza. Powraca daleki szum korytarza z pierwszego aktu, na cztery sekundy. Wygaszenie.]

---

*Harmonizing Functor Collective · Justice-as-Code · słuchowisko*
